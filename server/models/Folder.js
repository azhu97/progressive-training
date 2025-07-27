class Folder {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Create a new folder
  async create(userId, name, color = "#3B82F6") {
    return await this.prisma.folder.create({
      data: {
        userId,
        name,
        color,
      },
      include: {
        workouts: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
      },
    });
  }

  // Get all folders for a user
  async findByUserId(userId) {
    return await this.prisma.folder.findMany({
      where: { userId },
      include: {
        workouts: {
          select: {
            id: true,
            name: true,
            date: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Get a specific folder by ID
  async findById(id, userId) {
    return await this.prisma.folder.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        workouts: {
          include: {
            exercises: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });
  }

  // Update a folder
  async update(id, userId, data) {
    return await this.prisma.folder.updateMany({
      where: {
        id: parseInt(id),
        userId,
      },
      data,
    });
  }

  // Delete a folder
  async delete(id, userId) {
    return await this.prisma.folder.deleteMany({
      where: {
        id: parseInt(id),
        userId,
      },
    });
  }

  // Check if folder exists
  async exists(id, userId) {
    const count = await this.prisma.folder.count({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    return count > 0;
  }
}

module.exports = Folder;
