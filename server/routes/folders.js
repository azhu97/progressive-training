const express = require("express");
const router = express.Router();

module.exports = function (folderController, authController) {
  // Apply authentication middleware to all folder routes
  router.use(authController.authenticateToken.bind(authController));

  // Get all folders
  router.get("/", (req, res) => folderController.getFolders(req, res));

  // Create a new folder
  router.post("/", (req, res) => folderController.createFolder(req, res));

  // Get a specific folder
  router.get("/:id", (req, res) => folderController.getFolder(req, res));

  // Update a folder
  router.put("/:id", (req, res) => folderController.updateFolder(req, res));

  // Delete a folder
  router.delete("/:id", (req, res) => folderController.deleteFolder(req, res));

  return router;
}; 