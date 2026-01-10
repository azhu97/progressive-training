const bcrypt = require("bcryptjs");

class User {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Create a new user
  async create(username, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }

  // Find user by username
  async findByUsername(username) {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  // Find user by ID
  async findById(id) {
    return await this.prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
  }

  // Check if user exists
  async exists() {
    const count = await this.prisma.user.count();
    return count > 0;
  }

  // Verify password
  verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

module.exports = User;
