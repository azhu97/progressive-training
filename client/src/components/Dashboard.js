import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Clock,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: '', notes: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workoutsRes, statsRes] = await Promise.all([
        axios.get('/api/workouts'),
        axios.get('/api/stats')
      ]);
      setWorkouts(workoutsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await axios.post('/api/workouts', newWorkout);
      setNewWorkout({ name: '', notes: '' });
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      console.error('Error creating workout:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      await axios.delete(`/api/workouts/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Workouts</p>
              <p className="text-2xl font-bold">{stats.total_workouts || 0}</p>
            </div>
            <Activity className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="stats-card-secondary rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Exercises</p>
              <p className="text-2xl font-bold">{stats.total_exercises || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="stats-card-success rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Reps</p>
              <p className="text-2xl font-bold">{stats.total_reps || 0}</p>
            </div>
            <Activity className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="stats-card-warning rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Last Workout</p>
              <p className="text-lg font-bold">
                {stats.last_workout ? format(new Date(stats.last_workout), 'MMM dd') : 'Never'}
              </p>
            </div>
            <Calendar className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Workouts</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Workout</span>
        </button>
      </div>

      {/* Workouts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="workout-card card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
              <div className="flex space-x-2">
                <Link
                  to={`/workout/${workout.id}`}
                  className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDeleteWorkout(workout.id)}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(workout.date), 'MMM dd, yyyy')}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>{workout.exercise_count || 0} exercises</span>
              </div>
              
              {workout.total_reps && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{workout.total_reps} total reps</span>
                </div>
              )}
            </div>
            
            {workout.notes && (
              <p className="mt-3 text-sm text-gray-500 border-t pt-3">
                {workout.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
          <p className="text-gray-500 mb-6">Start your fitness journey by creating your first workout!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Workout
          </button>
        </div>
      )}

      {/* Create Workout Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Workout</h2>
            
            <form onSubmit={handleCreateWorkout} className="space-y-4">
              <div>
                <label className="form-label">Workout Name</label>
                <input
                  type="text"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Upper Body, Leg Day"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                  className="form-input"
                  rows="3"
                  placeholder="Any notes about this workout..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 