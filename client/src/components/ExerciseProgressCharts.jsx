import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getWorkouts } from '../api';

function ExerciseProgressCharts({ refreshKey = 0 }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, [refreshKey]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getWorkouts();
      if (data.error) {
        setError(data.error);
        setWorkouts([]);
      } else if (Array.isArray(data)) {
        setWorkouts(data);
        // Cache exercise names for autocomplete
        const exerciseNames = [...new Set(data.map(w => w.exercise).filter(Boolean))];
        if (exerciseNames.length > 0) {
          const cachedExercises = JSON.parse(localStorage.getItem('cachedExercises') || '[]');
          const combined = [...new Set([...cachedExercises, ...exerciseNames])];
          localStorage.setItem('cachedExercises', JSON.stringify(combined));
        }
      } else {
        setError('Invalid data format received');
        setWorkouts([]);
      }
    } catch (err) {
      setError('Failed to load workouts: ' + err.message);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  // Group workouts by exercise name
  const workoutsByExercise = workouts.reduce((acc, workout) => {
    if (!workout || !workout.exercise) return acc;
    
    const exerciseName = workout.exercise.trim();
    if (!acc[exerciseName]) {
      acc[exerciseName] = [];
    }
    
    const workoutDate = workout.date ? new Date(workout.date) : new Date();
    
    acc[exerciseName].push({
      date: workoutDate.toLocaleDateString(),
      dateSort: workoutDate,
      weight: workout.weight || 0,
      reps: workout.reps || 0,
      sets: workout.sets || 0,
    });
    return acc;
  }, {});

  // Sort each exercise's workouts by date
  Object.keys(workoutsByExercise).forEach(exercise => {
    workoutsByExercise[exercise].sort((a, b) => a.dateSort - b.dateSort);
  });

  const exercises = Object.keys(workoutsByExercise);

  if (loading) {
    return (
      <div className="exercise-charts-container">
        <div className="loading-message">Loading exercise progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exercise-charts-container">
        <div className="message error">{error}</div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="exercise-charts-container">
        <div className="no-data-message">
          No exercise data available. Start logging workouts to see your progress!
        </div>
      </div>
    );
  }

  const exerciseToDisplay = selectedExercise || exercises[0];
  const chartData = workoutsByExercise[exerciseToDisplay] || [];

  return (
    <div className="exercise-charts-container">
      <div className="exercise-charts-header">
        <h2>Exercise Progress</h2>
        <div className="exercise-selector">
          <label htmlFor="exercise-select">Select Exercise: </label>
          <select
            id="exercise-select"
            value={exerciseToDisplay}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="exercise-select"
          >
            {exercises.map(exercise => (
              <option key={exercise} value={exercise}>
                {exercise} ({workoutsByExercise[exercise].length} entries)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="exercise-chart-section">
        <h3 className="exercise-chart-title">{exerciseToDisplay}</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis 
                yAxisId="left" 
                label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Reps & Sets', angle: 90, position: 'insideRight' }} 
              />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="weight" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Weight (lbs)"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="reps" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Reps"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="sets" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Sets"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-chart-data">No data available for this exercise.</div>
        )}
      </div>

      <div className="exercise-summary">
        <h3>All Exercises</h3>
        <div className="exercise-list">
          {exercises.map(exercise => (
            <div 
              key={exercise} 
              className={`exercise-item ${exercise === exerciseToDisplay ? 'active' : ''}`}
              onClick={() => setSelectedExercise(exercise)}
            >
              <span className="exercise-name">{exercise}</span>
              <span className="exercise-count">{workoutsByExercise[exercise].length} workouts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExerciseProgressCharts;
