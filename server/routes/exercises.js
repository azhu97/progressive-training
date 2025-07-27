const express = require("express");
const router = express.Router();

module.exports = function (exerciseController, authController) {
  // Apply authentication middleware to all exercise routes
  router.use(authController.authenticateToken.bind(authController));

  // Add exercise to workout
  router.post("/workouts/:id/exercises", (req, res) =>
    exerciseController.addExercise(req, res)
  );

  // Delete exercise
  router.delete("/:id", (req, res) =>
    exerciseController.deleteExercise(req, res)
  );

  // Update exercise
  router.put("/:id", (req, res) => exerciseController.updateExercise(req, res));

  return router;
};
