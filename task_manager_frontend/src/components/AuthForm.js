import React, { useState } from "react";

// PUBLIC_INTERFACE
function AuthForm({ mode, onAuth, loading, error }) {
  /** Login/Register form */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAuth({ email, password });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Sign In" : "Sign Up"}</h2>
      <label>
        Email
        <input
          required
          type="email"
          autoComplete="username"
          disabled={loading}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          required
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          disabled={loading}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      {error && <div className="auth-form__error">{error}</div>}
      <button className="btn btn--block" type="submit" disabled={loading}>
        {loading ? "Please wait…" : mode === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default AuthForm;
