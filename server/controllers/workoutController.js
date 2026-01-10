class WorkoutController {
  constructor(workoutModel, exerciseModel) {
    this.workoutModel = workoutModel;
    this.exerciseModel = exerciseModel;
  }

  // Get all workouts for a user
  async getWorkouts(req, res) {
    try {
      // Get user ID from either req.user.id (from authController) or req.userId (from middleware)
      const userId = req.user?.id || req.userId;
      
      const workouts = await this.workoutModel.findAllByUserId(userId);
      
      // Transform workouts to include exercise data in format expected by charts
      const workoutsWithExercises = [];
      for (const workout of workouts) {
        const exercises = await this.exerciseModel.findByWorkoutId(workout.id);
        for (const exercise of exercises) {
          workoutsWithExercises.push({
            id: exercise.id,
            exercise: exercise.name,
            weight: exercise.weight,
            reps: exercise.reps,
            sets: exercise.sets,
            date: workout.date
          });
        }
      }
      
      res.json(workoutsWithExercises);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ error: "Database error: " + error.message });
    }
  }

  // Create a new workout
  async createWorkout(req, res) {
    try {
      // Support both formats: new simplified format {exercise, weight, reps, sets} 
      // or old format {name, notes, folderId}
      const { exercise, weight, reps, sets, name, notes, folderId } = req.body;
      
      // Get user ID from either req.user.id (from authController) or req.userId (from middleware)
      const userId = req.user?.id || req.userId;

      // Simplified format: create workout with exercise data
      if (exercise && weight !== undefined && reps !== undefined && sets !== undefined) {
        // Create a workout with today's date as name, or use exercise name
        const workoutName = name || `Workout - ${new Date().toLocaleDateString()}`;
        
        // Create workout
        const workout = await this.workoutModel.create(userId, workoutName, notes, folderId);
        
        // Create exercise for this workout
        const exerciseData = await this.exerciseModel.create(workout.id, {
          name: exercise,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseFloat(weight) || null,
          rest_time: 60,
          notes: null
        });

        // Return the exercise data in format expected by frontend charts
        return res.json({
          id: workout.id,
          exercise: exerciseData.name,
          weight: exerciseData.weight,
          reps: exerciseData.reps,
          sets: exerciseData.sets,
          date: workout.date || new Date().toISOString()
        });
      }

      // Original format: create workout only
      if (!name) {
        return res.status(400).json({ error: "Workout name is required, or provide exercise, weight, reps, and sets" });
      }

      const workout = await this.workoutModel.create(userId, name, notes, folderId);
      res.json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ error: "Database error: " + error.message });
    }
  }

  // Get a specific workout with exercises
  async getWorkout(req, res) {
    try {
      const workoutId = req.params.id;
      const userId = req.user?.id || req.userId;
      
      const workout = await this.workoutModel.findByIdWithExercises(
        workoutId,
        userId
      );

      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }

      res.json(workout);
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ error: "Database error: " + error.message });
    }
  }

  // Delete a workout
  async deleteWorkout(req, res) {
    try {
      const workoutId = req.params.id;
      const userId = req.user?.id || req.userId;
      
      const result = await this.workoutModel.deleteById(workoutId, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }

      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ error: "Database error: " + error.message });
    }
  }

  // Move workout to a different folder
  async moveWorkout(req, res) {
    try {
      const { id } = req.params;
      const { folderId } = req.body;
      const userId = req.user?.id || req.userId;

      const result = await this.workoutModel.moveToFolder(id, userId, folderId);

      if (result.count === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }

      res.json({ message: "Workout moved successfully" });
    } catch (error) {
      console.error("Error moving workout:", error);
      res.status(500).json({ error: "Database error: " + error.message });
    }
  }

  // Get workout statistics
  async getStats(req, res) {
    try {
      const userId = req.user?.id || req.userId;
      const stats = await this.workoutModel.getStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Database error: " + error.message });
    }
  }

  // Save workout session with multiple exercises
  async saveWorkoutSession(req, res) {
    try {
      const { exercises, duration, startTime } = req.body;
      const userId = req.user?.id || req.userId;

      if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({ error: "At least one exercise is required" });
      }

      // Create workout with session info
      const workoutName = `Workout Session - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      const notes = duration ? `Duration: ${Math.floor(duration / 60)}m ${duration % 60}s` : null;
      
      const workout = await this.workoutModel.create(userId, workoutName, notes, null);

      // Create all exercises for this workout
      const createdExercises = [];
      for (const exercise of exercises) {
        try {
          const exerciseData = await this.exerciseModel.create(workout.id, {
            name: exercise.name,
            sets: parseInt(exercise.sets),
            reps: parseInt(exercise.reps),
            weight: parseFloat(exercise.weight) || null,
            rest_time: 60,
            notes: null
          });
          createdExercises.push({
            id: exerciseData.id,
            exercise: exerciseData.name,
            weight: exerciseData.weight,
            reps: exerciseData.reps,
            sets: exerciseData.sets,
            date: workout.date
          });
        } catch (exError) {
          console.error(`Error creating exercise ${exercise.name}:`, exError);
          // Continue with other exercises even if one fails
        }
      }

      // Cache exercise names for autocomplete
      const exerciseNames = exercises.map(ex => ex.name.trim()).filter(Boolean);
      // Note: Caching is handled on the frontend, but we could also cache here

      res.json({
        workoutId: workout.id,
        exercises: createdExercises,
        message: "Workout session saved successfully"
      });
    } catch (error) {
      console.error("Error saving workout session:", error);
      res.status(500).json({ error: "Database error: " + error.message });
    }
  }
}

module.exports = WorkoutController;
