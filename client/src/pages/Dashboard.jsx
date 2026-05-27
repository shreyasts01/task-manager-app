import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stage: "Todo",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/tasks", {
        headers: {
          authorization: token,
        },
      });

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE TASK
  const createTask = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post("/tasks", formData, {
        headers: {
          authorization: token,
        },
      });

      setFormData({
        title: "",
        description: "",
        stage: "Todo",
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${id}`, {
        headers: {
          authorization: token,
        },
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE TASK STAGE
  const updateTaskStage = async (id, stage) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/tasks/${id}`,
        { stage },
        {
          headers: {
            authorization: token,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // FILTER TASKS
  const todoTasks = tasks.filter(
    (task) => task.stage === "Todo"
  );

  const progressTasks = tasks.filter(
    (task) => task.stage === "In Progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.stage === "Done"
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Task Manager
          </h1>

          <p className="text-gray-600 mt-1">
            Welcome, {user?.name}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* CREATE TASK */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Create Task
        </h2>

        <form
          onSubmit={createTask}
          className="grid md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-3 transition"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* TASK COLUMNS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* TODO */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Todo
          </h2>

          <div className="space-y-4">
            {todoTasks.length === 0 && (
              <p className="text-gray-500">
                No tasks available
              </p>
            )}

            {todoTasks.map((task) => (
              <div
                key={task._id}
                className="border p-4 rounded-xl bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">
                    {task.title}
                  </h3>

                  <span className="bg-yellow-100 text-yellow-700 text-sm px-2 py-1 rounded-lg">
                    Todo
                  </span>
                </div>

                <p className="text-gray-600">
                  {task.description}
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() =>
                      updateTaskStage(
                        task._id,
                        "In Progress"
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Move
                  </button>

                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            In Progress
          </h2>

          <div className="space-y-4">
            {progressTasks.length === 0 && (
              <p className="text-gray-500">
                No tasks available
              </p>
            )}

            {progressTasks.map((task) => (
              <div
                key={task._id}
                className="border p-4 rounded-xl bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">
                    {task.title}
                  </h3>

                  <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-lg">
                    In Progress
                  </span>
                </div>

                <p className="text-gray-600">
                  {task.description}
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() =>
                      updateTaskStage(
                        task._id,
                        "Done"
                      )
                    }
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DONE */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Done
          </h2>

          <div className="space-y-4">
            {doneTasks.length === 0 && (
              <p className="text-gray-500">
                No tasks available
              </p>
            )}

            {doneTasks.map((task) => (
              <div
                key={task._id}
                className="border p-4 rounded-xl bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">
                    {task.title}
                  </h3>

                  <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-lg">
                    Done
                  </span>
                </div>

                <p className="text-gray-600">
                  {task.description}
                </p>

                <button
                  onClick={() =>
                    deleteTask(task._id)
                  }
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}