const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

class AuthController {
  constructor(userModel) {
    this.userModel = userModel;
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  // Register new user
  async register(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      // Check if user already exists
      const existingUser = await this.userModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Create new user
      const user = await this.userModel.create(username, password);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        this.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        token,
        user: { id: user.id, username: user.username },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      // Find user
      const user = await this.userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const validPassword = this.userModel.verifyPassword(
        password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        this.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: { id: user.id, username: user.username },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Verify JWT token middleware
  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    jwt.verify(token, this.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user;
      next();
    });
  }
}

module.exports = AuthController;
