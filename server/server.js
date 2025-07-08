const express = require("express");
const cors = require("cors");
const app = express();
const workoutRoutes = require("./routes/workoutRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/workouts", workoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
