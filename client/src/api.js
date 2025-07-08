// Simple API utility for backend requests
const API_BASE = 'http://localhost:5000/api'; // Updated to match backend route prefix

// Helper to get auth header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup({ username, email, password, goal }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, goal })
  });
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function addWorkout({ exercise, weight, reps, sets }) {
  const res = await fetch(`${API_BASE}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ exercise, weight, reps, sets })
  });
  return res.json();
}

export async function getWorkouts() {
  const res = await fetch(`${API_BASE}/workouts`, {
    headers: getAuthHeader()
  });
  return res.json();
}

export async function getRecommendation() {
  const res = await fetch(`${API_BASE}/workouts/recommendation`, {
    headers: getAuthHeader()
  });
  return res.json();
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
} 