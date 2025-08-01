import React, { useState, useEffect } from "react";
import { Folder, Plus, Edit, Trash2, X } from "lucide-react";

const FolderManager = ({
  onFolderSelect,
  selectedFolderId,
  folders = [],
  onFoldersUpdate,
  totalWorkouts = 0,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#EC4899", // Pink
    "#6B7280", // Gray
  ];

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newFolder = await response.json();
        if (onFoldersUpdate) {
          onFoldersUpdate();
        }
        setFormData({ name: "", color: "#3B82F6" });
        setShowCreateForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("Failed to create folder");
    }

    setLoading(false);
  };

  const handleEditFolder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/folders/${editingFolder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onFoldersUpdate) {
          onFoldersUpdate();
        }
        setFormData({ name: "", color: "#3B82F6" });
        setShowEditForm(false);
        setEditingFolder(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("Failed to update folder");
    }

    setLoading(false);
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (onFoldersUpdate) {
          onFoldersUpdate();
        }
        if (selectedFolderId === folderId) {
          onFolderSelect(null);
        }
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const openEditForm = (folder) => {
    setEditingFolder(folder);
    setFormData({ name: folder.name, color: folder.color });
    setShowEditForm(true);
  };

  const closeForms = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingFolder(null);
    setFormData({ name: "", color: "#3B82F6" });
    setError("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Folders</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Folder
        </button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Create New Folder</h3>
            <button
              onClick={closeForms}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter folder name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Folder"}
              </button>
              <button
                type="button"
                onClick={closeForms}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Folder Form */}
      {showEditForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Edit Folder</h3>
            <button
              onClick={closeForms}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleEditFolder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter folder name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Folder"}
              </button>
              <button
                type="button"
                onClick={closeForms}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Folders List */}
      <div className="space-y-2">
        <button
          onClick={() => onFolderSelect(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            selectedFolderId === null
              ? "bg-blue-100 text-blue-900 border-2 border-blue-300"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Folder className="h-5 w-5 text-gray-500" />
          <span className="font-medium">All Workouts</span>
          <span className="ml-auto text-sm text-gray-500">
            {totalWorkouts}
          </span>
        </button>

        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              selectedFolderId === folder.id
                ? "bg-blue-100 border-2 border-blue-300"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <button
              onClick={() => onFolderSelect(folder.id)}
              className="flex items-center gap-3 flex-1 text-left"
            >
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: folder.color }}
              />
              <span className="font-medium text-gray-900">{folder.name}</span>
              <span className="ml-auto text-sm text-gray-500">
                {folder.workouts.length}
              </span>
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => openEditForm(folder)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteFolder(folder.id)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderManager;
