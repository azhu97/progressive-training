import React, { useState, useEffect, useRef } from 'react';
import { saveWorkoutSession } from '../api';
import ExerciseAutocomplete from './ExerciseAutocomplete';

function WorkoutSession({ onSessionSaved, onCancel }) {
  const [sessionStarted, setSessionStarted] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({ 
    name: '', 
    weight: '', 
    reps: '', 
    sets: '' 
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const savedTimeRef = useRef(0); // Track accumulated time when tab was inactive

  // Start session timer
  useEffect(() => {
    if (!sessionStarted) {
      const now = new Date();
      setSessionStarted(now);
      startTimeRef.current = now.getTime();
    }

    // Timer update interval - updates every second
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current + savedTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);

    // Handle visibility change (tab background/foreground)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab went to background - save current elapsed time
        if (startTimeRef.current) {
          const pausedAt = Date.now();
          savedTimeRef.current += pausedAt - startTimeRef.current;
          startTimeRef.current = null;
        }
      } else {
        // Tab came to foreground - resume from saved time
        if (startTimeRef.current === null && sessionStarted) {
          startTimeRef.current = Date.now();
        }
      }
    };

    // Handle page unload to save time
    const handleBeforeUnload = () => {
      if (startTimeRef.current) {
        savedTimeRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionStarted]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.weight || !currentExercise.reps || !currentExercise.sets) {
      setError('Please fill in all exercise fields');
      return;
    }

    setExercises([...exercises, {
      id: Date.now(),
      name: currentExercise.name.trim(),
      weight: parseFloat(currentExercise.weight),
      reps: parseInt(currentExercise.reps),
      sets: parseInt(currentExercise.sets)
    }]);

    // Cache exercise name for autocomplete
    const cachedExercises = JSON.parse(localStorage.getItem('cachedExercises') || '[]');
    if (!cachedExercises.includes(currentExercise.name.trim())) {
      cachedExercises.push(currentExercise.name.trim());
      localStorage.setItem('cachedExercises', JSON.stringify(cachedExercises));
    }

    setCurrentExercise({ name: '', weight: '', reps: '', sets: '' });
    setError('');
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSave = async () => {
    if (exercises.length === 0) {
      setError('Please add at least one exercise before saving');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const result = await saveWorkoutSession({
        exercises,
        duration: elapsedTime,
        startTime: sessionStarted
      });

      if (result.error) {
        setError(result.error);
      } else {
        onSessionSaved();
      }
    } catch (err) {
      setError('Failed to save workout: ' + err.message);
      console.error('Save workout error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="workout-session-container">
      <div className="workout-session-header">
        <h2>Workout Session</h2>
        <div className="session-timer">
          <span className="timer-label">Time:</span>
          <span className="timer-value">{formatTime(elapsedTime)}</span>
        </div>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>

      <div className="current-exercise-form">
        <h3>Add Exercise</h3>
        <div className="exercise-form-grid">
          <div className="exercise-name-input">
            <ExerciseAutocomplete
              value={currentExercise.name}
              onChange={(name) => setCurrentExercise({ ...currentExercise, name })}
              placeholder="Exercise name"
            />
          </div>
          <input
            type="number"
            step="0.5"
            placeholder="Weight (lbs)"
            value={currentExercise.weight}
            onChange={e => setCurrentExercise({ ...currentExercise, weight: e.target.value })}
          />
          <input
            type="number"
            placeholder="Reps"
            value={currentExercise.reps}
            onChange={e => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
          />
          <input
            type="number"
            placeholder="Sets"
            value={currentExercise.sets}
            onChange={e => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
          />
          <button type="button" onClick={addExercise} className="add-exercise-btn">
            Add Exercise
          </button>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="exercises-list">
        <h3>Exercises ({exercises.length})</h3>
        {exercises.length === 0 ? (
          <p className="no-exercises">No exercises added yet. Add your first exercise above.</p>
        ) : (
          <div className="exercises-table">
            <div className="exercise-row header">
              <div>Exercise</div>
              <div>Weight</div>
              <div>Reps</div>
              <div>Sets</div>
              <div>Action</div>
            </div>
            {exercises.map(ex => (
              <div key={ex.id} className="exercise-row">
                <div>{ex.name}</div>
                <div>{ex.weight} lbs</div>
                <div>{ex.reps}</div>
                <div>{ex.sets}</div>
                <div>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeExercise(ex.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="save-workout-section">
        <button 
          onClick={handleSave} 
          disabled={exercises.length === 0 || saving}
          className="save-workout-btn"
        >
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>
    </div>
  );
}

export default WorkoutSession;
