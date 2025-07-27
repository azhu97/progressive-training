const express = require("express");
const cors = require("cors");
const path = require("path");

// Import Prisma service
const PrismaService = require("./config/prisma");

// Import models
const User = require("./models/User");
const Workout = require("./models/Workout");
const Exercise = require("./models/Exercise");

// Import controllers
const AuthController = require("./controllers/AuthController");
const WorkoutController = require("./controllers/WorkoutController");
const ExerciseController = require("./controllers/ExerciseController");

// Import routes
const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workouts");
const exerciseRoutes = require("./routes/exercises");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

// Initialize Prisma and start server
async function initializeServer() {
  try {
    // Initialize Prisma service
    const prismaService = new PrismaService();
    await prismaService.initialize();

    const prisma = prismaService.getClient();

    // Initialize models
    const userModel = new User(prisma);
    const workoutModel = new Workout(prisma);
    const exerciseModel = new Exercise(prisma);

    // Initialize controllers
    const authController = new AuthController(userModel);
    const workoutController = new WorkoutController(
      workoutModel,
      exerciseModel
    );
    const exerciseController = new ExerciseController(
      exerciseModel,
      workoutModel
    );

    // Setup routes
    app.use("/api", authRoutes(authController));
    app.use("/api/workouts", workoutRoutes(workoutController, authController));
    app.use("/api", exerciseRoutes(exerciseController, authController));

    // Serve React app for all other routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Default login: admin / admin123`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
      await prismaService.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

// Start the server
initializeServer();
