const Folder = require("../models/Folder");

class FolderController {
  constructor(folderModel) {
    this.folderModel = folderModel;
  }

  // Create a new folder
  async createFolder(req, res) {
    try {
      const { name, color } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Folder name is required" });
      }

      // Create folder
      const folder = await this.folderModel.create(userId, name.trim(), color);

      res.status(201).json(folder);
    } catch (error) {
      console.error("Create folder error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all folders for a user
  async getFolders(req, res) {
    try {
      const userId = req.user.id;
      const folders = await this.folderModel.findByUserId(userId);
      res.json(folders);
    } catch (error) {
      console.error("Get folders error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get a specific folder
  async getFolder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const folder = await this.folderModel.findById(id, userId);
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }

      res.json(folder);
    } catch (error) {
      console.error("Get folder error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update a folder
  async updateFolder(req, res) {
    try {
      const { id } = req.params;
      const { name, color } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Folder name is required" });
      }

      // Check if folder exists
      const exists = await this.folderModel.exists(id, userId);
      if (!exists) {
        return res.status(404).json({ error: "Folder not found" });
      }

      // Update folder
      await this.folderModel.update(id, userId, {
        name: name.trim(),
        color,
      });

      res.json({ message: "Folder updated successfully" });
    } catch (error) {
      console.error("Update folder error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete a folder
  async deleteFolder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if folder exists
      const exists = await this.folderModel.exists(id, userId);
      if (!exists) {
        return res.status(404).json({ error: "Folder not found" });
      }

      // Delete folder
      await this.folderModel.delete(id, userId);

      res.json({ message: "Folder deleted successfully" });
    } catch (error) {
      console.error("Delete folder error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = FolderController;
