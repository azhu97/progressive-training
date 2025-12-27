import React, { useState } from 'react'
import { signup, login, logout, addWorkout } from './api'
import WorkoutCharts from './components/WorkoutCharts'
import './App.css'

function Register({ onSwitch, onAuth }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', goal: '' })
  const [error, setError] = useState('')
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={async e => {
        e.preventDefault()
        setError('')
        const res = await signup(form)
        if (res.error) setError(res.error)
        else onAuth()
      }}>
        <input placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <input placeholder="Goal (e.g. strength)" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} />
        <button type="submit">Register</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <p>Already have an account? <button onClick={onSwitch}>Login</button></p>
    </div>
  )
}

function Login({ onSwitch, onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={async e => {
        e.preventDefault()
        setError('')
        const res = await login(form)
        if (res.error) setError(res.error)
        else onAuth()
      }}>
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <p>Don't have an account? <button onClick={onSwitch}>Register</button></p>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [workoutForm, setWorkoutForm] = useState({ exercise: '', weight: '', reps: '', sets: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!workoutForm.exercise || !workoutForm.weight || !workoutForm.reps || !workoutForm.sets) {
      setError('Please fill in all fields')
      return
    }

    try {
      const res = await addWorkout({
        exercise: workoutForm.exercise,
        weight: parseFloat(workoutForm.weight),
        reps: parseInt(workoutForm.reps),
        sets: parseInt(workoutForm.sets)
      })
      
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess('Workout logged successfully!')
        setWorkoutForm({ exercise: '', weight: '', reps: '', sets: '' })
        // Trigger chart refresh
        setRefreshKey(prev => prev + 1)
      }
    } catch (err) {
      setError('Failed to log workout')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <button onClick={onLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ marginBottom: '3rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ marginBottom: '1rem' }}>Log Workout</h3>
        <form onSubmit={handleWorkoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input
              placeholder="Exercise (e.g., Bench Press)"
              value={workoutForm.exercise}
              onChange={e => setWorkoutForm(f => ({ ...f, exercise: e.target.value }))}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              step="0.5"
              placeholder="Weight (lbs)"
              value={workoutForm.weight}
              onChange={e => setWorkoutForm(f => ({ ...f, weight: e.target.value }))}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              placeholder="Reps"
              value={workoutForm.reps}
              onChange={e => setWorkoutForm(f => ({ ...f, reps: e.target.value }))}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              placeholder="Sets"
              value={workoutForm.sets}
              onChange={e => setWorkoutForm(f => ({ ...f, sets: e.target.value }))}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
            Log Workout
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '1rem' }}>{success}</div>}
      </div>

      <WorkoutCharts refreshKey={refreshKey} />
    </div>
  )
}

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'))
  const [showLogin, setShowLogin] = useState(true)

  const handleAuth = () => setAuth(true)
  const handleLogout = () => { logout(); setAuth(false) }

  if (!auth) {
    return showLogin ? (
      <Login onSwitch={() => setShowLogin(false)} onAuth={handleAuth} />
    ) : (
      <Register onSwitch={() => setShowLogin(true)} onAuth={handleAuth} />
    )
  }
  return <Dashboard onLogout={handleLogout} />
}
