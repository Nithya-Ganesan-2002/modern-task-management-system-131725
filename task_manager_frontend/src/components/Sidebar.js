import React from "react";
import "./Sidebar.css";

// PUBLIC_INTERFACE
function Sidebar({ children }) {
  /** Minimal Sidebar navigation */
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {children}
      </nav>
    </aside>
  );
}

export default Sidebar;
