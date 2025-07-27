import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Activity,
  Clock,
  Scale,
  Repeat,
} from "lucide-react";
import { format } from "date-fns";
import ExerciseSearch from "./ExerciseSearch";

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: 3,
    reps: 10,
    weight: "",
    rest_time: 60,
    notes: "",
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      const response = await axios.get(`/api/workouts/${id}`);
      setWorkout(response.data);
    } catch (error) {
      console.error("Error fetching workout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    setAdding(true);

    try {
      await axios.post(`/api/workouts/${id}/exercises`, newExercise);
      setNewExercise({
        name: "",
        sets: 3,
        reps: 10,
        weight: "",
        rest_time: 60,
        notes: "",
      });
      setShowAddExercise(false);
      fetchWorkout();
    } catch (error) {
      console.error("Error adding exercise:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm("Are you sure you want to delete this exercise?"))
      return;

    try {
      await axios.delete(`/api/exercises/${exerciseId}`);
      fetchWorkout();
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Workout not found
        </h2>
        <Link to="/" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const totalVolume =
    workout.exercises?.reduce((total, exercise) => {
      return total + exercise.sets * exercise.reps * (exercise.weight || 0);
    }, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workout.name}</h1>
            <p className="text-gray-600">
              {format(new Date(workout.date), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddExercise(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Exercise</span>
        </button>
      </div>

      {/* Workout Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Exercises</p>
              <p className="text-xl font-bold">
                {workout.exercises?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Repeat className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Sets</p>
              <p className="text-xl font-bold">
                {workout.exercises?.reduce((total, ex) => total + ex.sets, 0) ||
                  0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Scale className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-xl font-bold">
                {totalVolume.toLocaleString()} lbs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {workout.notes && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-600">{workout.notes}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Exercises</h2>

        {workout.exercises?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No exercises yet
            </h3>
            <p className="text-gray-500 mb-4">
              Add your first exercise to start tracking your workout!
            </p>
            <button
              onClick={() => setShowAddExercise(true)}
              className="btn-primary"
            >
              Add First Exercise
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {workout.exercises?.map((exercise, index) => (
              <div key={exercise.id} className="exercise-item card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {index + 1}. {exercise.name}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Repeat className="h-4 w-4 text-blue-600" />
                        <span>{exercise.sets} sets</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        <span>{exercise.reps} reps</span>
                      </div>

                      {exercise.weight && (
                        <div className="flex items-center space-x-2">
                          <Scale className="h-4 w-4 text-purple-600" />
                          <span>{exercise.weight} lbs</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>{exercise.rest_time}s rest</span>
                      </div>
                    </div>

                    {exercise.notes && (
                      <p className="mt-3 text-sm text-gray-500 border-t pt-3">
                        {exercise.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Exercise</h2>

            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="form-label">Exercise Name</label>
                <ExerciseSearch
                  onSelect={(name) => setNewExercise({ ...newExercise, name })}
                  placeholder="Search for exercises..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Sets</label>
                  <input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) =>
                      setNewExercise({
                        ...newExercise,
                        sets: parseInt(e.target.value),
                      })
                    }
                    className="form-input"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Reps</label>
                  <input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) =>
                      setNewExercise({
                        ...newExercise,
                        reps: parseInt(e.target.value),
                      })
                    }
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Weight (lbs)</label>
                  <input
                    type="number"
                    value={newExercise.weight}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, weight: e.target.value })
                    }
                    className="form-input"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="form-label">Rest Time (seconds)</label>
                  <input
                    type="number"
                    value={newExercise.rest_time}
                    onChange={(e) =>
                      setNewExercise({
                        ...newExercise,
                        rest_time: parseInt(e.target.value),
                      })
                    }
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  value={newExercise.notes}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, notes: e.target.value })
                  }
                  className="form-input"
                  rows="3"
                  placeholder="Any notes about this exercise..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExercise(false)}
                  className="btn-secondary flex-1"
                  disabled={adding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add Exercise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
