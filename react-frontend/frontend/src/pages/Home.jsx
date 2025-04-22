import { useEffect, useState } from "react";
import api from "../services/api";
import "../CSS/Home.css";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import { Trash2, Pencil, Plus, LogOut, CheckCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState("all"); // "all", "active", "completed"
    const navigate = useNavigate();

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
        api.get("tasks/")
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
        api.put(`tasks/${updatedTask.id}/`, updatedTask)
            .then((res) => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) => (todo.id === res.data.id ? res.data : todo))
                );
                setEditingTask(null);
            })
            .catch((err) => console.error("Update Failed", err));
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

    return (
        <div className="todo-container">
            <div className="todo">
                <header className="todo-header">
                    <h1>My Tasks</h1>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </header>

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

                <div className="todo-stats">
                    <span>{activeTodosCount} tasks remaining</span>
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
                                        className="action-btn edit"
                                        onClick={() => handleEditClick(todo)}
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDelete(todo.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-list">
                            <p>No tasks found.</p>
                        </div>
                    )}
                </div>

                <button className="add-task-btn" onClick={() => setShowModal(true)}>
                    <Plus size={24} />
                </button>
            </div>

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
        </div>
    );
};

export default Home;