const express = require("express");
const router = express.Router();

module.exports = function (workoutController, authController) {
  // Apply authentication middleware to all workout routes
  router.use(authController.authenticateToken.bind(authController));

  // Get all workouts for user
  router.get("/", (req, res) => workoutController.getWorkouts(req, res));

  // Create new workout
  router.post("/", (req, res) => workoutController.createWorkout(req, res));

  // Get workout statistics
  router.get("/stats", (req, res) => workoutController.getStats(req, res));

  // Get specific workout
  router.get("/:id", (req, res) => workoutController.getWorkout(req, res));

  // Delete workout
  router.delete("/:id", (req, res) =>
    workoutController.deleteWorkout(req, res)
  );

  // Move workout to folder
  router.put("/:id/move", (req, res) =>
    workoutController.moveWorkout(req, res)
  );

  // Save workout session with multiple exercises
  router.post("/session", (req, res) =>
    workoutController.saveWorkoutSession(req, res)
  );

  return router;
};
