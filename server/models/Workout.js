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
      },
      select: {
        id: true,
        name: true,
        notes: true,
        folderId: true,
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
    const stats = await this.prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT w.id) as total_workouts,
        COUNT(e.id) as total_exercises,
        SUM(e.sets * e.reps) as total_reps,
        MAX(w.date) as last_workout
      FROM workouts w 
      LEFT JOIN exercises e ON w.id = e.workout_id 
      WHERE w.user_id = ${parseInt(userId)}
    `;

    return stats[0];
  }
}

module.exports = Workout;
