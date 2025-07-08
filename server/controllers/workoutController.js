let workouts = []; // Temporary in-memory storage

const getWorkouts = (req, res) => {
  res.json(workouts);
};

const addWorkout = (req, res) => {
  const { exercise, weight, reps, sets, date } = req.body;
  const newWorkout = { id: Date.now(), exercise, weight, reps, sets, date };
  workouts.push(newWorkout);
  res.status(201).json(newWorkout);
};

module.exports = { getWorkouts, addWorkout };
