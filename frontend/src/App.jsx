import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [time, setTime] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const [view, setView] = useState("main");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:3000/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const fetchFilteredTasks = async () => {
    let url = `http://localhost:3000/api/tasks/filter?start=${startDate}`;
    if (endDate) url += `&end=${endDate}`;
    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  const fetchSortedTasks = async () => {
    const res = await fetch("http://localhost:3000/api/tasks/sorted");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (view === "main") {
      fetchTasks();
    } else if (view === "sorted") {
      fetchSortedTasks();
    }
  }, [view]);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, dueDate, time }),
    });
    setNewTitle("");
    setDueDate("");
    setTime("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await fetch(`http://localhost:3000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    view === "main" ? fetchTasks() : view === "sorted" ? fetchSortedTasks() : fetchFilteredTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/api/tasks/${id}`, { method: "DELETE" });
    view === "main" ? fetchTasks() : view === "sorted" ? fetchSortedTasks() : fetchFilteredTasks();
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDate(task.dueDate?.slice(0, 10) || "");
    setEditTime(task.time || "");
  };

  const saveEdit = async () => {
    await fetch(`http://localhost:3000/api/tasks/${editingTask}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, dueDate: editDate, time: editTime }),
    });
    setEditingTask(null);
    setEditTitle("");
    setEditDate("");
    setEditTime("");
    view === "main" ? fetchTasks() : view === "sorted" ? fetchSortedTasks() : fetchFilteredTasks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager</h1>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setView("main")}>Main View</button>
        <button onClick={() => setView("display")}>Display Tasks by Date</button>
        <button onClick={() => setView("sorted")}>Sorted Tasks</button>
      </div>

      {view === "main" && (
        <div>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New task title"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ marginLeft: 8 }}
          />

          <button onClick={addTask} style={{ marginLeft: 8 }}>Add Task</button>
        </div>
      )}

      {view === "display" && (
        <div style={{ marginBottom: 10 }}>
          <label>Start Date: </label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label style={{ marginLeft: 10 }}>End Date: </label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button onClick={fetchFilteredTasks} style={{ marginLeft: 10 }}>Fetch Tasks</button>
        </div>
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {editingTask === task._id ? (
              <span>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                <button onClick={saveEdit}>💾</button>
                <button onClick={() => setEditingTask(null)}>✖️</button>
              </span>
            ) : (
              <span>
                <span
                  onClick={() => toggleTask(task)}
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    cursor: "pointer",
                    marginRight: 10,
                  }}
                >
                  {task.title}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#bbb" }}>
                  {task.dueDate?.slice(0, 10)} {task.time}
                </span>
                <button onClick={() => deleteTask(task._id)} style={{ marginLeft: 10 }}>❌</button>
                <button onClick={() => startEdit(task)} style={{ marginLeft: 5 }}>✏️</button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;