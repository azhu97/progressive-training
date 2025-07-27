const { PrismaClient } = require("@prisma/client");

class PrismaService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  // Get Prisma client instance
  getClient() {
    return this.prisma;
  }

  // Initialize database (create tables if they don't exist)
  async initialize() {
    try {
      // Test the connection
      await this.prisma.$connect();
      console.log("Connected to database via Prisma");

      // Create default user if none exists
      await this.createDefaultUser();
    } catch (error) {
      console.error("Database initialization error:", error);
      throw error;
    }
  }

  // Create default user if none exists
  async createDefaultUser() {
    try {
      const userCount = await this.prisma.user.count();
      if (userCount === 0) {
        const bcrypt = require("bcryptjs");
        const hashedPassword = bcrypt.hashSync("admin123", 10);

        await this.prisma.user.create({
          data: {
            username: "admin",
            password: hashedPassword,
          },
        });
        console.log("Default user created: admin/admin123");
      }
    } catch (error) {
      console.error("Error creating default user:", error);
    }
  }

  // Close database connection
  async disconnect() {
    await this.prisma.$disconnect();
    console.log("Database connection closed");
  }
}

module.exports = PrismaService;
