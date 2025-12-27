import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getWorkouts } from '../api';

function WorkoutCharts({ refreshKey = 0 }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, [refreshKey]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      if (data.error) {
        setError(data.error);
      } else {
        setWorkouts(data);
      }
    } catch (err) {
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  // Group workouts by exercise
  const workoutsByExercise = workouts.reduce((acc, workout) => {
    const exercise = workout.exercise;
    if (!acc[exercise]) {
      acc[exercise] = [];
    }
    acc[exercise].push({
      date: new Date(workout.date).toLocaleDateString(),
      dateSort: new Date(workout.date),
      weight: workout.weight,
      reps: workout.reps,
      sets: workout.sets,
    });
    return acc;
  }, {});

  // Sort each exercise's workouts by date
  Object.keys(workoutsByExercise).forEach(exercise => {
    workoutsByExercise[exercise].sort((a, b) => a.dateSort - b.dateSort);
  });

  if (loading) {
    return <div>Loading charts...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  const exercises = Object.keys(workoutsByExercise);

  if (exercises.length === 0) {
    return <div>No workout data available. Start logging workouts to see your progress!</div>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Exercise Progress Charts</h2>
      {exercises.map(exercise => {
        const data = workoutsByExercise[exercise];
        return (
          <div key={exercise} style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>{exercise}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis yAxisId="left" label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Reps & Sets', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Weight (lbs)"
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="reps" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Reps"
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sets" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                  name="Sets"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

export default WorkoutCharts;

