const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  goal: { type: String }, // e.g., 'strength', 'endurance', 'hypertrophy', etc.
  latestRecommendation: {
    exercise: String,
    weight: Number,
    reps: Number,
    sets: Number,
    date: Date
  }
});

module.exports = mongoose.model("User", UserSchema);
