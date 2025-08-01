class Workout {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Create a new workout
  async create(userId, name, notes = null, folderId = null) {
    return await this.prisma.workout.create({
      data: {
        userId: parseInt(userId),
        name,
        notes,
        folderId: folderId ? parseInt(folderId) : null,
        date: new Date(), // Explicitly set the date
      },
      select: {
        id: true,
        name: true,
        notes: true,
        folderId: true,
        date: true,
      },
    });
  }

  // Get all workouts for a user with exercise counts
  async findAllByUserId(userId) {
    const workouts = await this.prisma.workout.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        exercises: true,
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Transform to match the expected format with exercise counts
    return workouts.map((workout) => ({
      ...workout,
      exercise_count: workout.exercises.length,
      total_reps: workout.exercises.reduce(
        (sum, exercise) => sum + exercise.sets * exercise.reps,
        0
      ),
    }));
  }

  // Get workout by ID with exercises
  async findByIdWithExercises(workoutId, userId) {
    return await this.prisma.workout.findFirst({
      where: {
        id: parseInt(workoutId),
        userId: parseInt(userId),
      },
      include: {
        exercises: {
          orderBy: {
            id: "asc",
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  // Delete workout
  async deleteById(workoutId, userId) {
    const result = await this.prisma.workout.deleteMany({
      where: {
        id: parseInt(workoutId),
        userId: parseInt(userId),
      },
    });
    return { changes: result.count };
  }

  // Move workout to a different folder
  async moveToFolder(workoutId, userId, folderId) {
    return await this.prisma.workout.updateMany({
      where: {
        id: parseInt(workoutId),
        userId: parseInt(userId),
      },
      data: {
        folderId: folderId ? parseInt(folderId) : null,
      },
    });
  }

  // Get workout statistics for a user
  async getStats(userId) {
    try {
      // Get total workouts
      const totalWorkouts = await this.prisma.workout.count({
        where: { userId: parseInt(userId) },
      });

      // Get total exercises and reps
      const exercises = await this.prisma.exercise.findMany({
        where: {
          workout: {
            userId: parseInt(userId),
          },
        },
        select: {
          sets: true,
          reps: true,
        },
      });

      const totalExercises = exercises.length;
      const totalReps = exercises.reduce(
        (sum, exercise) => sum + exercise.sets * exercise.reps,
        0
      );

      // Get last workout date
      const lastWorkout = await this.prisma.workout.findFirst({
        where: { userId: parseInt(userId) },
        orderBy: { date: "desc" },
        select: { date: true },
      });

      return {
        total_workouts: totalWorkouts,
        total_exercises: totalExercises,
        total_reps: totalReps,
        last_workout: lastWorkout?.date || null,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        total_workouts: 0,
        total_exercises: 0,
        total_reps: 0,
        last_workout: null,
      };
    }
  }
}

module.exports = Workout;
