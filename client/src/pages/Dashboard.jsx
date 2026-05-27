import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", stage: "Todo" });
  const [mounted, setMounted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTasks();
    setTimeout(() => setMounted(true), 50);
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/tasks", { headers: { authorization: token } });
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.post("/tasks", formData, { headers: { authorization: token } });
      setFormData({ title: "", description: "", stage: "Todo" });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/tasks/${id}`, { headers: { authorization: token } });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const updateTaskStage = async (id, stage) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/tasks/${id}`, { stage }, { headers: { authorization: token } });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const todoTasks = tasks.filter((t) => t.stage === "Todo");
  const progressTasks = tasks.filter((t) => t.stage === "In Progress");
  const doneTasks = tasks.filter((t) => t.stage === "Done");

  const columns = [
    {
      label: "Todo",
      tasks: todoTasks,
      accent: "#C9A84C",
      bg: "rgba(201,168,76,0.06)",
      border: "rgba(201,168,76,0.18)",
      dot: "#C9A84C",
      action: { label: "Move to Progress", next: "In Progress", color: "#4A7EFF" },
    },
    {
      label: "In Progress",
      tasks: progressTasks,
      accent: "#4A7EFF",
      bg: "rgba(74,126,255,0.06)",
      border: "rgba(74,126,255,0.18)",
      dot: "#4A7EFF",
      action: { label: "Mark Complete", next: "Done", color: "#3ECF8E" },
    },
    {
      label: "Done",
      tasks: doneTasks,
      accent: "#3ECF8E",
      bg: "rgba(62,207,142,0.06)",
      border: "rgba(62,207,142,0.18)",
      dot: "#3ECF8E",
      action: null,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --obsidian: #080A0E;
          --surface: #0E1117;
          --surface-2: #13161E;
          --surface-3: #1A1E2A;
          --gold: #C9A84C;
          --gold-dim: rgba(201,168,76,0.15);
          --gold-glow: rgba(201,168,76,0.35);
          --text-primary: #F0EBE0;
          --text-secondary: #8A8A9A;
          --text-muted: #555566;
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'DM Sans', sans-serif;
          --radius-sm: 10px;
          --radius-md: 16px;
          --radius-lg: 24px;
          --transition: 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboard-root {
          min-height: 100vh;
          background: var(--obsidian);
          font-family: var(--font-body);
          color: var(--text-primary);
          overflow-x: hidden;
          position: relative;
        }

        /* Ambient background orbs */
        .dashboard-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .dashboard-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -10%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(74,126,255,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .dashboard-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 32px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .dashboard-inner.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── HEADER ── */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(201,168,76,0.12);
        }

        .header-left {}

        .header-eyebrow {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
        }

        .header-title {
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 700;
          line-height: 1;
          color: var(--text-primary);
          letter-spacing: -1px;
        }

        .header-title span {
          background: linear-gradient(135deg, #F0D97A 0%, #C9A84C 50%, #A07830 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-sub {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 10px;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .stats-row {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 100px;
          background: var(--surface-2);
          border: 1px solid var(--surface-3);
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255,255,255,0.08);
          background: var(--surface-2);
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: var(--transition);
        }
        .logout-btn:hover {
          border-color: rgba(239,68,68,0.4);
          color: #EF4444;
          background: rgba(239,68,68,0.08);
        }

        /* ── CREATE FORM ── */
        .create-panel {
          background: var(--surface);
          border: 1px solid rgba(201,168,76,0.12);
          border-radius: var(--radius-lg);
          padding: 32px;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }

        .create-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.6;
        }

        .create-label {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .create-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(201,168,76,0.15);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr auto auto;
          gap: 12px;
          align-items: center;
        }

        @media (max-width: 900px) {
          .form-grid { grid-template-columns: 1fr; }
          .header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .header-title { font-size: 40px; }
        }

        .field-input, .field-select {
          background: var(--surface-2);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-sm);
          padding: 13px 16px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: var(--transition);
          width: 100%;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: var(--text-muted); }

        .field-input:focus, .field-select:focus {
          border-color: rgba(201,168,76,0.5);
          background: var(--surface-3);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
        }

        .field-select option { background: #1A1E2A; color: var(--text-primary); }

        .add-btn {
          padding: 13px 28px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, #D4AC50 0%, #A07830 100%);
          border: none;
          color: #080A0E;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(201,168,76,0.25);
        }

        .add-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
        }

        .add-btn:active { transform: translateY(0); }

        /* ── COLUMNS ── */
        .columns-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .columns-grid { grid-template-columns: 1fr; }
        }

        .column {
          background: var(--surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
        }

        .column-header {
          padding: 20px 22px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .column-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .column-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .column-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .column-count {
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          background: var(--surface-3);
          color: var(--text-secondary);
          letter-spacing: 0.3px;
        }

        .column-body {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 160px;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          gap: 8px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .empty-icon {
          width: 32px;
          height: 32px;
          opacity: 0.3;
        }

        /* ── TASK CARD ── */
        .task-card {
          background: var(--surface-2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--radius-md);
          padding: 18px;
          position: relative;
          transition: var(--transition);
          animation: cardIn 0.3s ease both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .task-card:hover {
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }

        .task-card-accent {
          position: absolute;
          left: 0; top: 16px; bottom: 16px;
          width: 2px;
          border-radius: 0 2px 2px 0;
        }

        .task-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 5px;
          padding-left: 12px;
          line-height: 1.3;
        }

        .task-desc {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 300;
          line-height: 1.5;
          padding-left: 12px;
          margin-bottom: 16px;
        }

        .task-actions {
          display: flex;
          gap: 8px;
          padding-left: 12px;
          flex-wrap: wrap;
        }

        .task-btn {
          padding: 7px 16px;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: var(--transition);
        }

        .task-btn.move {
          background: rgba(74,126,255,0.12);
          border-color: rgba(74,126,255,0.25);
          color: #7BA4FF;
        }
        .task-btn.move:hover {
          background: rgba(74,126,255,0.22);
          border-color: rgba(74,126,255,0.5);
          color: #A0BFFF;
        }

        .task-btn.complete {
          background: rgba(62,207,142,0.1);
          border-color: rgba(62,207,142,0.25);
          color: #5DDBA0;
        }
        .task-btn.complete:hover {
          background: rgba(62,207,142,0.2);
          border-color: rgba(62,207,142,0.5);
        }

        .task-btn.delete {
          background: transparent;
          border-color: rgba(239,68,68,0.2);
          color: var(--text-muted);
        }
        .task-btn.delete:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.4);
          color: #EF4444;
        }
      `}</style>

      <div className="dashboard-root">
        <div className={`dashboard-inner ${mounted ? "mounted" : ""}`}>

          {/* HEADER */}
          <div className="header">
            <div className="header-left">
              <p className="header-eyebrow">Workspace</p>
              <h1 className="header-title">Task <span>Manager</span></h1>
              <p className="header-sub">Welcome back, {user?.name} — here's your board.</p>
              <div className="stats-row">
                <div className="stat-pill">
                  <span className="stat-dot" style={{ background: "#C9A84C" }} />
                  {todoTasks.length} Todo
                </div>
                <div className="stat-pill">
                  <span className="stat-dot" style={{ background: "#4A7EFF" }} />
                  {progressTasks.length} In Progress
                </div>
                <div className="stat-pill">
                  <span className="stat-dot" style={{ background: "#3ECF8E" }} />
                  {doneTasks.length} Done
                </div>
              </div>
            </div>

            <button onClick={logout} className="logout-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>

          {/* CREATE TASK */}
          <div className="create-panel">
            <div className="create-label">New Task</div>
            <form onSubmit={createTask} className="form-grid">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                className="field-input"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                className="field-input"
              />
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="field-select"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <button type="submit" className="add-btn">Add Task</button>
            </form>
          </div>

          {/* COLUMNS */}
          <div className="columns-grid">
            {columns.map((col) => (
              <div className="column" key={col.label}>
                <div className="column-header">
                  <div className="column-title-row">
                    <span className="column-dot" style={{ background: col.accent, boxShadow: `0 0 8px ${col.accent}80` }} />
                    <span className="column-title" style={{ color: col.accent }}>{col.label}</span>
                  </div>
                  <span className="column-count">{col.tasks.length}</span>
                </div>

                <div className="column-body">
                  {col.tasks.length === 0 ? (
                    <div className="empty-state">
                      <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <path d="M9 12h6M12 9v6" opacity="0.5"/>
                      </svg>
                      No tasks yet
                    </div>
                  ) : (
                    col.tasks.map((task) => (
                      <div className="task-card" key={task._id}>
                        <div className="task-card-accent" style={{ background: col.accent }} />
                        <h3 className="task-title">{task.title}</h3>
                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}
                        <div className="task-actions">
                          {col.action && (
                            <button
                              onClick={() => updateTaskStage(task._id, col.action.next)}
                              className={`task-btn ${col.label === "Todo" ? "move" : "complete"}`}
                            >
                              {col.action.label}
                            </button>
                          )}
                          <button onClick={() => deleteTask(task._id)} className="task-btn delete">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
