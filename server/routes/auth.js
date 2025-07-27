const express = require("express");
const router = express.Router();

module.exports = function (authController) {
  // Login route
  router.post("/login", (req, res) => authController.login(req, res));

  return router;
};
