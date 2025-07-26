import React from "react";
import "./Header.css";

// PUBLIC_INTERFACE
function Header({ onLogout, user }) {
  /** Header and Navigation component */
  return (
    <header className="header">
      <div className="header__brand">Task Manager</div>
      <nav className="header__nav">
        {user ? (
          <>
            <span className="header__user">{user.email}</span>
            <button className="btn btn--small" onClick={onLogout}>Logout</button>
          </>
        ) : null}
      </nav>
    </header>
  );
}

export default Header;
