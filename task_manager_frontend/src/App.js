import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import TaskBoard from './components/TaskBoard';
import AuthForm from './components/AuthForm';

const API_BASE = process.env.REACT_APP_API_URL || ""; // e.g. set to proxy or .env config

// PUBLIC_INTERFACE
function App() {
  // Track theme & authentication state
  const [theme, setTheme] = useState('light');
  const [authToken, setAuthToken] = useState(localStorage.getItem("taskmgr_token") || "");
  const [user, setUser] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("taskmgr_user"));
      return u;
    } catch { return null; }
  });
  const [authMode, setAuthMode] = useState("login"); // or "register"
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Set theme on root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  // PUBLIC_INTERFACE
  function handleAuth({ email, password }) {
    setAuthLoading(true);
    setAuthError("");
    fetch(`${API_BASE}/auth/${authMode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail?.[0]?.msg || "Failed to authenticate.");
        }
        return res.json();
      })
      .then(data => {
        setAuthToken(data.access_token);
        setUser(data.user);
        localStorage.setItem("taskmgr_token", data.access_token);
        localStorage.setItem("taskmgr_user", JSON.stringify(data.user));
        setModalOpen(false);
      })
      .catch(e => setAuthError(e.message))
      .finally(() => setAuthLoading(false));
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    setAuthToken("");
    setUser(null);
    localStorage.removeItem("taskmgr_token");
    localStorage.removeItem("taskmgr_user");
    // Optionally, inform backend with /auth/logout
    fetch(`${API_BASE}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${authToken}` } });
  }

  // If not authenticated, show auth modal
  useEffect(() => {
    if (!authToken || !user) setModalOpen(true);
  }, [authToken, user, authMode]);

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      <div className="main-layout">
        <Sidebar>
          {/* Minimal navigation; add settings/profile in future */}
          <button
            className="btn btn--primary"
            style={{ marginBottom: "1.7rem" }}
            onClick={() => { setAuthMode(authToken ? "register" : "login"); setModalOpen(true) }}>
            {authToken ? "Switch User" : "Sign In"}
          </button>
          {/* Add more sidebar nav items if needed */}
        </Sidebar>
        <main className="main-content">
          {/* Main tasks area */}
          {authToken && user ? (
            <TaskBoard token={authToken} />
          ) : (
            <div style={{ textAlign: "center", marginTop: "8em" }}>
              <h2>Welcome to Task Manager</h2>
              <p style={{ color: "var(--secondary)" }}>Sign in or register to manage your tasks.</p>
            </div>
          )}
        </main>
      </div>
      {/* Theme toggle button in fixed position */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      {/* Modal for authentication */}
      <Modal
        title={authMode === "login" ? "Login" : "Register"}
        open={modalOpen}
        onClose={() => { if (authToken && user) setModalOpen(false); }}
      >
        <AuthForm
          mode={authMode}
          onAuth={handleAuth}
          loading={authLoading}
          error={authError}
        />
        <div style={{ marginTop: 12, textAlign: "center", fontSize: '0.96em' }}>
          {authMode === "login" ? (
            <>Don't have an account? <button className="btn btn--small" onClick={() => setAuthMode("register")} tabIndex={-1}>Register</button></>
          ) : (
            <>Already registered? <button className="btn btn--small" onClick={() => setAuthMode("login")} tabIndex={-1}>Login</button></>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default App;
