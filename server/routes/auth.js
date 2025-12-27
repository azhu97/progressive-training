const express = require("express");
const router = express.Router();

module.exports = function (authController) {
  // Register route
  router.post("/register", (req, res) => authController.register(req, res));

  // Login route
  router.post("/login", (req, res) => authController.login(req, res));

  return router;
};
