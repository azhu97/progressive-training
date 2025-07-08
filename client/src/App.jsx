import React, { useState } from 'react'
import { signup, login, logout } from './api'
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
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      {/* TODO: Add workout logging, history, and recommendation components here */}
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
