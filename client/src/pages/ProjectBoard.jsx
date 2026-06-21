import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ProjectBoard() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("To Do");
    const [dueDate, setDueDate] = useState("");

    const getTasks = async () => {
        const res = await axios.get("https://projecthub-backend-new.onrender.com/api/tasks");
        const projectTasks = res.data.filter(
            (task) => task.project_id === Number(id)
        );
        setTasks(projectTasks);
    };

    useEffect(() => {
        getTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();

        await axios.post("https://projecthub-backend-new.onrender.com/api/tasks", {
            project_id: Number(id),
            title,
            description,
            assigned_to: 1,
            status,
            priority,
            due_date: dueDate,
        });

        setTitle("");
        setDescription("");
        setPriority("Medium");
        setStatus("To Do");
        setDueDate("");
        getTasks();
    };

    const updateStatus = async (taskId, newStatus) => {
        await axios.put(`https://projecthub-backend-new.onrender.com/api/tasks/${taskId}/status`, {
            status: newStatus,
        });

        getTasks();
    };

    const deleteTask = async (taskId) => {
        await axios.delete(`https://projecthub-backend-new.onrender.com/api/tasks/${taskId}`);
        getTasks();
    };

    const isOverdue = (task) => {
        if (!task.due_date || task.status === "Completed") return false;

        const today = new Date();
        const due = new Date(task.due_date);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        return due < today;
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "No due date";
        return new Date(dateValue).toLocaleDateString("en-IN");
    };

    const renderTasks = (statusValue) => {
        return tasks
            .filter((task) => task.status === statusValue)
            .map((task) => (
                <div
                    key={task.id}
                    className={`rounded-2xl p-5 shadow mb-4 border hover:shadow-lg transition ${isOverdue(task)
                            ? "bg-red-50 border-red-300"
                            : "bg-white border-slate-100"
                        }`}
                >
                    <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                    <p className="text-slate-500 mt-2">{task.description}</p>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                            {task.priority}
                        </span>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 text-sm font-semibold cursor-pointer hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>

                    <p
                        className={`mt-3 text-sm font-medium ${isOverdue(task) ? "text-red-600" : "text-slate-600"
                            }`}
                    >
                        Due Date: {formatDate(task.due_date)}
                        {isOverdue(task) && " (Overdue)"}
                    </p>

                    <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="w-full mt-4 border p-2 rounded-xl cursor-pointer bg-white"
                    >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                </div>
            ));
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button
                onClick={() => navigate("/dashboard")}
                className="mb-6 bg-white px-4 py-2 rounded-xl shadow text-slate-700 cursor-pointer hover:bg-slate-50"
            >
                ← Back to Dashboard
            </button>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">Project Board</h1>
                    <p className="text-slate-500 mt-2">
                        Manage tasks with To Do, In Progress and Completed columns.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleAddTask}
                className="bg-white rounded-2xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-6 gap-4"
            >
                <input
                    className="border p-3 rounded-xl"
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    className="border p-3 rounded-xl"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <select
                    className="border p-3 rounded-xl cursor-pointer"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>

                <select
                    className="border p-3 rounded-xl cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

                <input
                    className="border p-3 rounded-xl cursor-pointer"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />

                <button className="bg-indigo-600 text-white rounded-xl font-semibold cursor-pointer hover:bg-indigo-700">
                    + Add Task
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-200 rounded-2xl p-5 min-h-[400px]">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">To Do</h2>
                    {renderTasks("To Do")}
                </div>

                <div className="bg-blue-100 rounded-2xl p-5 min-h-[400px]">
                    <h2 className="text-xl font-bold text-blue-800 mb-4">In Progress</h2>
                    {renderTasks("In Progress")}
                </div>

                <div className="bg-green-100 rounded-2xl p-5 min-h-[400px]">
                    <h2 className="text-xl font-bold text-green-800 mb-4">Completed</h2>
                    {renderTasks("Completed")}
                </div>
            </div>
        </div>
    );
}

export default ProjectBoard;