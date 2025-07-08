require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const workoutRoutes = require("./routes/workoutRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Progressive Training API is running ✅"));

app.use("/api/workouts", workoutRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
