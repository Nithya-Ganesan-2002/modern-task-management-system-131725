import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import TaskForm from "./TaskForm";

// Helper to format ISO date
function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleString();
}

// PUBLIC_INTERFACE
function TaskBoard({ token }) {
  /** Main Task Board, fetches and manages tasks */
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Load tasks
  useEffect(() => {
    setLoading(true);
    fetch("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks || []);
        setLoading(false);
      });
  }, [token]);

  // Add/Edit form submit
  function handleUpsert(task) {
    setLoading(true);
    const isEdit = !!editTask;
    fetch(isEdit ? `/tasks/${editTask.id}` : "/tasks", {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    })
      .then(res => res.json())
      .then(data => {
        setModalOpen(false);
        setEditTask(null);
        // fetch tasks again
        fetch("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => {
            setTasks(data.tasks || []);
            setLoading(false);
          });
      });
  }

  // Delete
  function handleDelete(taskId) {
    if (!window.confirm("Delete this task?")) return;
    setLoading(true);
    fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setTasks(tasks => tasks.filter(t => t.id !== taskId));
      setLoading(false);
    });
  }

  // Status update
  function handleStatus(task, status) {
    setLoading(true);
    fetch(`/tasks/${task.id}/status?status=${encodeURIComponent(status)}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks =>
          tasks.map(t => (t.id === task.id ? updated : t))
        );
        setLoading(false);
      });
  }

  return (
    <div className="task-board">
      <div className="task-board__header">
        <h2>Tasks</h2>
        <button className="btn btn--primary" onClick={() => setModalOpen(true)}>+ Add Task</button>
      </div>
      {loading && <div className="task-board__loading">Loading…</div>}
      {!loading && tasks.length === 0 && <div className="task-board__empty">No tasks yet.</div>}
      <ul className="task-board__list">
        {tasks.map(task => (
          <li key={task.id} className={`task-board__item status--${task.status}`}>
            <div className="task-board__info">
              <div className="task-board__title">{task.title}</div>
              <div className="task-board__desc">{task.description}</div>
              <div className="task-board__meta">
                <span>
                  Status:{" "}
                  <select
                    value={task.status}
                    onChange={e => handleStatus(task, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </span>
                <span>{formatDate(task.created_at)}</span>
              </div>
            </div>
            <div className="task-board__actions">
              <button className="btn btn--small" onClick={() => { setEditTask(task); setModalOpen(true); }}>Edit</button>
              <button className="btn btn--danger btn--small" onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        title={editTask ? "Edit Task" : "Add Task"}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
      >
        <TaskForm
          initial={editTask}
          onSubmit={handleUpsert}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default TaskBoard;
