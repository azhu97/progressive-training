class ExerciseController {
  constructor(exerciseModel, workoutModel) {
    this.exerciseModel = exerciseModel;
    this.workoutModel = workoutModel;
  }

  // Add exercise to workout
  async addExercise(req, res) {
    try {
      const workoutId = req.params.id;
      const { name, sets, reps, weight, rest_time, notes } = req.body;

      // Validate input
      if (!name || !sets || !reps) {
        return res.status(400).json({
          error: "Exercise name, sets, and reps are required",
        });
      }

      // Verify workout belongs to user
      const workout = await this.workoutModel.findByIdWithExercises(
        workoutId,
        req.user.id
      );
      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }

      // Create exercise
      const exercise = await this.exerciseModel.create(workoutId, {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight || null,
        rest_time: parseInt(rest_time) || 60,
        notes: notes || null,
      });

      res.json(exercise);
    } catch (error) {
      console.error("Error adding exercise:", error);
      res.status(500).json({ error: "Database error" });
    }
  }

  // Delete exercise
  async deleteExercise(req, res) {
    try {
      const exerciseId = req.params.id;
      const result = await this.exerciseModel.deleteById(
        exerciseId,
        req.user.id
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Exercise not found" });
      }

      res.json({ message: "Exercise deleted successfully" });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      res.status(500).json({ error: "Database error" });
    }
  }

  // Update exercise
  async updateExercise(req, res) {
    try {
      const exerciseId = req.params.id;
      const { name, sets, reps, weight, rest_time, notes } = req.body;

      // Validate input
      if (!name || !sets || !reps) {
        return res.status(400).json({
          error: "Exercise name, sets, and reps are required",
        });
      }

      const result = await this.exerciseModel.updateById(
        exerciseId,
        {
          name,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: weight || null,
          rest_time: parseInt(rest_time) || 60,
          notes: notes || null,
        },
        req.user.id
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Exercise not found" });
      }

      res.json({ message: "Exercise updated successfully" });
    } catch (error) {
      console.error("Error updating exercise:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
}

module.exports = ExerciseController;
