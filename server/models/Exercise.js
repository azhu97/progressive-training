class Exercise {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Create a new exercise
  async create(workoutId, exerciseData) {
    const { name, sets, reps, weight, rest_time, notes } = exerciseData;
    return await this.prisma.exercise.create({
      data: {
        workoutId: parseInt(workoutId),
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : null,
        restTime: parseInt(rest_time) || 60,
        notes: notes || null,
      },
    });
  }

  // Get all exercises for a workout
  async findByWorkoutId(workoutId) {
    return await this.prisma.exercise.findMany({
      where: {
        workoutId: parseInt(workoutId),
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  // Delete exercise
  async deleteById(exerciseId, userId) {
    const result = await this.prisma.exercise.deleteMany({
      where: {
        id: parseInt(exerciseId),
        workout: {
          userId: parseInt(userId),
        },
      },
    });
    return { changes: result.count };
  }

  // Update exercise
  async updateById(exerciseId, exerciseData, userId) {
    const { name, sets, reps, weight, rest_time, notes } = exerciseData;

    const result = await this.prisma.exercise.updateMany({
      where: {
        id: parseInt(exerciseId),
        workout: {
          userId: parseInt(userId),
        },
      },
      data: {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : null,
        restTime: parseInt(rest_time) || 60,
        notes: notes || null,
      },
    });

    return { changes: result.count };
  }
}

module.exports = Exercise;
