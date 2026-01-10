import React, { useState } from 'react'
import { signup, login, logout } from './api'
import WorkoutSession from './components/WorkoutSession'
import ExerciseProgressCharts from './components/ExerciseProgressCharts'
import './App.css'

function Register({ onSwitch, onAuth }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', goal: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (!form.username || !form.password) {
        setError('Username and password are required')
        setLoading(false)
        return
      }
      
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters long')
        setLoading(false)
        return
      }
      
      const res = await signup(form)
      if (res.error) {
        setError(res.error)
        console.error("Registration error:", res)
      } else if (res.token) {
        // Success - token is saved in signup function, trigger auth
        onAuth()
      } else {
        setError("Registration failed. Please try again.")
        console.error("Unexpected registration response:", res)
      }
    } catch (err) {
      setError('Failed to register. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required disabled={loading} />
        <input placeholder="Email (optional)" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={loading} />
        <input placeholder="Password (min 6 characters)" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required disabled={loading} />
        <input placeholder="Goal (optional, e.g. strength)" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} disabled={loading} />
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {error && <div className="auth-error">{error}</div>}
      <p className="auth-switch">Already have an account? <button onClick={onSwitch} disabled={loading}>Login</button></p>
    </div>
  )
}

function Login({ onSwitch, onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await login(form)
      if (res.error) {
        setError(res.error)
        console.error("Login error:", res)
      } else if (res.token) {
        // Success - token is saved in login function, trigger auth
        onAuth()
      } else {
        setError("Login failed. Please try again.")
        console.error("Unexpected login response:", res)
      }
    } catch (err) {
      setError('Failed to login. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input placeholder="Username or Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required disabled={loading} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required disabled={loading} />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {error && <div className="auth-error">{error}</div>}
      <p className="auth-switch">Don't have an account? <button onClick={onSwitch} disabled={loading}>Register</button></p>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [activeView, setActiveView] = useState('home') // 'home', 'session', 'progress'
  const [sessionActive, setSessionActive] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleStartSession = () => {
    setSessionActive(true)
    setActiveView('session')
  }

  const handleSessionSaved = () => {
    setSessionActive(false)
    setActiveView('home')
    setRefreshKey(prev => prev + 1)
  }

  const handleSessionCancel = () => {
    if (window.confirm('Are you sure you want to cancel this workout session? All unsaved data will be lost.')) {
      setSessionActive(false)
      setActiveView('home')
    }
  }

  const renderView = () => {
    if (activeView === 'session' && sessionActive) {
      return (
        <WorkoutSession
          onSessionSaved={handleSessionSaved}
          onCancel={handleSessionCancel}
        />
      )
    }

    if (activeView === 'progress') {
      return (
        <ExerciseProgressCharts refreshKey={refreshKey} />
      )
    }

    // Home view
    return (
      <div className="dashboard-home">
        <div className="welcome-section">
          <h2>Welcome to Your Workout Tracker</h2>
          <p>Track your workouts, monitor progress, and achieve your fitness goals.</p>
        </div>

        <div className="action-cards">
          <div className="action-card" onClick={handleStartSession}>
            <div className="card-icon">🏋️</div>
            <h3>Start New Workout</h3>
            <p>Create a new workout session and track your exercises in real-time.</p>
            <button className="card-button">Start Session</button>
          </div>

          <div className="action-card" onClick={() => setActiveView('progress')}>
            <div className="card-icon">📊</div>
            <h3>View Progress</h3>
            <p>Analyze your workout progress with detailed charts for each exercise.</p>
            <button className="card-button">View Charts</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Workout Tracker</h2>
        <div className="header-actions">
          <nav className="main-nav">
            <button 
              className={`nav-button ${activeView === 'home' ? 'active' : ''}`}
              onClick={() => setActiveView('home')}
            >
              Home
            </button>
            {sessionActive && (
              <button 
                className={`nav-button ${activeView === 'session' ? 'active' : ''}`}
                onClick={() => setActiveView('session')}
              >
                Active Workout
              </button>
            )}
            <button 
              className={`nav-button ${activeView === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveView('progress')}
            >
              Progress Charts
            </button>
          </nav>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        {renderView()}
      </div>
    </div>
  )
}

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'))
  const [showLogin, setShowLogin] = useState(true)

  const handleAuth = () => setAuth(true)
  const handleLogout = () => { logout(); setAuth(false) }

  if (!auth) {
    return (
      <div className="auth-wrapper">
        {showLogin ? (
          <Login onSwitch={() => setShowLogin(false)} onAuth={handleAuth} />
        ) : (
          <Register onSwitch={() => setShowLogin(true)} onAuth={handleAuth} />
        )}
      </div>
    )
  }
  return <Dashboard onLogout={handleLogout} />
}
