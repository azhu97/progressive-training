class WorkoutController {
  constructor(workoutModel, exerciseModel) {
    this.workoutModel = workoutModel;
    this.exerciseModel = exerciseModel;
  }

  // Get all workouts for a user
  async getWorkouts(req, res) {
    try {
      const workouts = await this.workoutModel.findAllByUserId(req.user.id);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ error: "Database error" });
    }
  }

  // Create a new workout
  async createWorkout(req, res) {
    try {
      const { name, notes } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Workout name is required" });
      }

      const workout = await this.workoutModel.create(req.user.id, name, notes);
      res.json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ error: "Database error" });
    }
  }

  // Get a specific workout with exercises
  async getWorkout(req, res) {
    try {
      const workoutId = req.params.id;
      const workout = await this.workoutModel.findByIdWithExercises(
        workoutId,
        req.user.id
      );

      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }

      res.json(workout);
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ error: "Database error" });
    }
  }

  // Delete a workout
  async deleteWorkout(req, res) {
    try {
      const workoutId = req.params.id;
      const result = await this.workoutModel.deleteById(workoutId, req.user.id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }

      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ error: "Database error" });
    }
  }

  // Get workout statistics
  async getStats(req, res) {
    try {
      const stats = await this.workoutModel.getStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
}

module.exports = WorkoutController;
