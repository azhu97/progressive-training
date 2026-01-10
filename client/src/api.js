// Simple API utility for backend requests
// Using relative path so Vite proxy handles it, or absolute if proxy not available
const API_BASE = import.meta.env.DEV ? "/api" : "http://localhost:6000/api";

// Helper to get auth header
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup({ username, email, password, goal }) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
      return errorData;
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error("Signup fetch error:", error);
    return {
      error: `Network error: ${error.message}. Make sure the server is running on port 6000.`,
    };
  }
}

export async function login({ email, password }) {
  try {
    // Backend expects username, so use email as username
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
      return errorData;
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error("Login fetch error:", error);
    return {
      error: `Network error: ${error.message}. Make sure the server is running on port 6000.`,
    };
  }
}

export async function addWorkout({ exercise, weight, reps, sets }) {
  try {
    const res = await fetch(`${API_BASE}/workouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ exercise, weight, reps, sets }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
      return errorData;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Add workout fetch error:", error);
    return {
      error: `Network error: ${error.message}. Make sure the server is running.`,
    };
  }
}

export async function getWorkouts() {
  try {
    const res = await fetch(`${API_BASE}/workouts`, {
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
      return { error: errorData.error || "Failed to fetch workouts" };
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Get workouts fetch error:", error);
    return { error: `Network error: ${error.message}` };
  }
}

export async function getRecommendation() {
  const res = await fetch(`${API_BASE}/workouts/recommendation`, {
    headers: getAuthHeader(),
  });
  return res.json();
}

export async function saveWorkoutSession({ exercises, duration, startTime }) {
  try {
    const res = await fetch(`${API_BASE}/workouts/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ exercises, duration, startTime }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
      return errorData;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Save workout session error:", error);
    return {
      error: `Network error: ${error.message}. Make sure the server is running.`,
    };
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
