const Workout = require('../models/Workout');
const User = require('../models/User');

// Get all workouts for the authenticated user
const getWorkouts = async (req, res) => {
  try {
    const userId = req.user._id;
    const workouts = await Workout.find({ user: userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts.' });
  }
};

// Add a new workout for the authenticated user
const addWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { exercise, weight, reps, sets, date } = req.body;
    const newWorkout = new Workout({
      user: userId,
      exercise,
      weight,
      reps,
      sets,
      date: date || Date.now(),
    });
    await newWorkout.save();

    // Generate a simple next recommendation (placeholder logic)
    const nextRecommendation = {
      exercise,
      weight: weight + 2.5, // increment weight
      reps,
      sets,
      date: new Date()
    };
    await User.findByIdAndUpdate(userId, { latestRecommendation: nextRecommendation });

    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add workout.' });
  }
};

// Get the latest recommendation for the authenticated user
const getRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user || !user.latestRecommendation) {
      return res.status(404).json({ error: 'No recommendation found.' });
    }
    res.json(user.latestRecommendation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendation.' });
  }
};

module.exports = { getWorkouts, addWorkout, getRecommendation };
