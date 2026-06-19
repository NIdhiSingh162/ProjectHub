import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProjects = async () => {
    const res = await axios.get("http://https://projecthub-540n.onrender.com/api/projects");
    setProjects(res.data);
  };

  const getTaskStats = async () => {
    const res = await axios.get("http://https://projecthub-540n.onrender.com/api/tasks");

    setTotalTasks(res.data.length);

    const completed = res.data.filter(
      (task) => task.status === "Completed"
    ).length;

    setCompletedTasks(completed);
    setPendingTasks(res.data.length - completed);
  };

  useEffect(() => {
    getProjects();
    getTaskStats();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    await axios.post("http://https://projecthub-540n.onrender.com/api/projects", {
      title,
      description,
      created_by: user.id,
    });

    setTitle("");
    setDescription("");
    setShowForm(false);
    getProjects();
  };

  const deleteProject = async (projectId) => {
    await axios.delete(`http://https://projecthub-540n.onrender.com/api/projects/${projectId}`);
    getProjects();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-950 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-10">
            Project<span className="text-indigo-400">Hub</span>
          </h1>

          <nav className="space-y-4">
            <button className="w-full text-left bg-indigo-600 px-4 py-3 rounded-xl cursor-pointer">
              Dashboard
            </button>

            <button
              onClick={() => window.scrollTo({ top: 520, behavior: "smooth" })}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              Projects
            </button>

            <button
              onClick={() => window.scrollTo({ top: 520, behavior: "smooth" })}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              Tasks
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-slate-300">{user?.email}</p>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              Dashboard 👋
            </h2>

            <p className="text-slate-500 mt-2">
              Welcome back,
              <span className="font-semibold text-indigo-600 ml-1">
                {user?.name}
              </span>
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl shadow hover:bg-indigo-700 cursor-pointer"
          >
            + Create New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-slate-500">Total Projects</p>
            <h3 className="text-3xl font-bold mt-3">{projects.length}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-slate-500">Total Tasks</p>
            <h3 className="text-3xl font-bold mt-3">{totalTasks}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-slate-500">Completed</p>
            <h3 className="text-3xl font-bold mt-3 text-green-600">
              {completedTasks}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-slate-500">Pending</p>
            <h3 className="text-3xl font-bold mt-3 text-orange-500">
              {pendingTasks}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <div className="flex justify-between mb-3">
            <h3 className="text-xl font-bold text-slate-900">
              Project Progress
            </h3>

            <span className="font-bold text-indigo-600">{progress}%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-4">
            <div
              className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="mt-3 text-slate-600">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateProject}
            className="bg-white p-6 rounded-2xl shadow mb-8 flex gap-4"
          >
            <input
              className="border p-3 rounded-xl flex-1"
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-xl flex-1"
              type="text"
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 rounded-xl cursor-pointer hover:bg-indigo-700"
            >
              Save
            </button>
          </form>
        )}

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search Projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="bg-white p-6 rounded-2xl shadow flex justify-between items-center hover:shadow-lg transition cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {project.title}
                </h3>

                <p className="text-slate-500 mt-1">{project.description}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/project/${project.id}`);
                  }}
                  className="border border-indigo-500 text-indigo-600 px-4 py-2 rounded-xl cursor-pointer hover:bg-indigo-50"
                >
                  View Board
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                  }}
                  className="border border-red-400 text-red-500 px-4 py-2 rounded-xl cursor-pointer hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;