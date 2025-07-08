const express = require("express");
const router = express.Router();
const { getWorkouts, addWorkout, getRecommendation } = require("../controllers/workoutController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, getWorkouts);
router.post("/", authMiddleware, addWorkout);
router.get("/recommendation", authMiddleware, getRecommendation);

module.exports = router;
