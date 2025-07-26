import React, { useState } from "react";

// PUBLIC_INTERFACE
function TaskForm({ initial = {}, onSubmit, loading }) {
  /** Form for creating/editing tasks */
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [status, setStatus] = useState(initial.status || "pending");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, description, status });
  }
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Title *
        <input
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Status
        <select
          value={status}
          disabled={loading}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

export default TaskForm;
