import { useEffect, useState } from "react";
import api from "../services/api";
import "../CSS/Home.css";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import ReminderModal from "./ReminderModal";
import { Trash2, Pencil, Plus, LogOut, CheckCircle, Circle, Bell, Calendar, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [reminderTask, setReminderTask] = useState(null);
    const [filter, setFilter] = useState("all"); // "all", "active", "completed"
    const [showNavDropdown, setShowNavDropdown] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    useEffect(() => {
        const access = localStorage.getItem("access_token");
        if (!access) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        api.get("home/tasks/")
            .then((res) => setTodos(res.data))
            .catch((err) => console.error(err));
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleAddTask = (newTask) => {
        setTodos([...todos, newTask]);
        setShowModal(false);
    };

    const handleToggleComplete = (id, currentStatus) => {
        api.patch(`tasks/${id}/`, { is_completed: !currentStatus })
            .then((res) => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === id ? { ...todo, is_completed: res.data.is_completed } : todo
                    )
                );
            })
            .catch((err) => console.error("Toggle failed:", err));
    };

    const handleDelete = (id) => {
        api.delete(`tasks/${id}/`)
            .then(() => {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
            })
            .catch((err) => console.error("delete failed: ", err));
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
    };

    const handleUpdateTask = (updatedTask) => {
        api.put(`home/tasks/${updatedTask.id}/`, updatedTask)
            .then((res) => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) => (todo.id === res.data.id ? res.data : todo))
                );
                setEditingTask(null);
            })
            .catch((err) => console.error("Update Failed", err));
    };

    const handleSetReminder = (reminderData) => {

        const payload = {
            task: reminderData.taskId,
            datetime: reminderData.datetime.toISOString(),
            type: reminderData.type,
        };

        const access = localStorage.getItem("access_token");
        api.post('home/reminders/', payload, {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        })
            .then(() => {
                showNotification("✅ Reminder set successfully!");
                setReminderTask(null);
            })
            .catch((err) => {
                console.error("Failed to set reminder:", err);
                showNotification("❌ Failed to set reminder. Please try again.");
            });
    };

    const handleReminderClick = (task) => {
        setReminderTask(task);
    };

    const filteredTodos = () => {
        switch (filter) {
            case "active":
                return todos.filter((todo) => !todo.is_completed);
            case "completed":
                return todos.filter((todo) => todo.is_completed);
            default:
                return todos;
        }
    };

    const activeTodosCount = todos.filter((todo) => !todo.is_completed).length;
    const completedTodosCount = todos.filter((todo) => todo.is_completed).length;

    return (
        <div className="app-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <div className="logo-circle">
                            <div className="checkmark"></div>
                        </div>
                        <span className="brand-name">TaskFlow</span>
                    </div>

                    <div className="navbar-actions">
                        <button className="nav-icon-btn" title="Notifications">
                            <Bell size={20} />
                        </button>
                        <button className="nav-icon-btn" title="Calendar">
                            <Calendar size={20} />
                        </button>
                        <div className="nav-profile-dropdown">
                            <button
                                className="nav-profile-btn"
                                onClick={() => setShowNavDropdown(!showNavDropdown)}
                            >
                                <User size={20} />
                            </button>
                            {showNavDropdown && (
                                <div className="nav-dropdown">
                                    <button className="nav-dropdown-item">
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                    <button className="nav-dropdown-item" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Background Effects */}
            <div className="home-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Main Content */}
            <div className="home-content">
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Welcome back!</h1>
                        <p>Let's organize your day and stay productive</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon active">
                                <Circle size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{activeTodosCount}</h3>
                                <p>Active Tasks</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon completed">
                                <CheckCircle size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{completedTodosCount}</h3>
                                <p>Completed</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon total">
                                <Calendar size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{todos.length}</h3>
                                <p>Total Tasks</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="todo-container">
                    <div className="todo-card">
                        <div className="todo-card-header">
                            <h2>My Tasks</h2>
                            <button className="add-task-btn-header" onClick={() => setShowModal(true)}>
                                <Plus size={20} />
                                Add Task
                            </button>
                        </div>

                        <div className="todo-filters">
                            <button
                                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${filter === "active" ? "active" : ""}`}
                                onClick={() => setFilter("active")}
                            >
                                Active
                            </button>
                            <button
                                className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                                onClick={() => setFilter("completed")}
                            >
                                Completed
                            </button>
                        </div>

                        <div className="todo-list">
                            {filteredTodos().length > 0 ? (
                                filteredTodos().map((todo) => (
                                    <div
                                        className={`todo-item ${todo.is_completed ? "completed" : ""}`}
                                        key={todo.id}
                                    >
                                        <div className="todo-item-container">
                                            <button
                                                className="todo-checkbox"
                                                onClick={() => handleToggleComplete(todo.id, todo.is_completed)}
                                            >
                                                {todo.is_completed ? (
                                                    <CheckCircle size={20} className="check-icon" />
                                                ) : (
                                                    <Circle size={20} className="circle-icon" />
                                                )}
                                            </button>
                                            <div className="todo-item-text">{todo.title}</div>
                                        </div>
                                        <div className="todo-item-actions">
                                            <button
                                                className="action-btn reminder"
                                                title="Set Reminder"
                                                onClick={() => handleReminderClick(todo)}
                                            >
                                                <Bell size={16} />
                                            </button>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleEditClick(todo)}
                                                title="Edit Task"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(todo.id)}
                                                title="Delete Task"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-list">
                                    <div className="empty-icon">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h3>No tasks found</h3>
                                    <p>
                                        {filter === "all"
                                            ? "Start by adding your first task!"
                                            : filter === "active"
                                                ? "All tasks are completed! Great job!"
                                                : "No completed tasks yet."
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating Add Button */}
                <button className="add-task-btn-floating" onClick={() => setShowModal(true)}>
                    <Plus size={24} />
                </button>
            </div>

            {/* Modals */}
            {showModal && (
                <AddTaskModal onAdd={handleAddTask} onClose={() => setShowModal(false)} />
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onUpdate={handleUpdateTask}
                    onClose={() => setEditingTask(null)}
                />
            )}

            {reminderTask && (
                <ReminderModal
                    task={reminderTask}
                    onSetReminder={handleSetReminder}
                    onClose={() => setReminderTask(null)}
                />
            )}
        </div>
    );
};

export default Home;