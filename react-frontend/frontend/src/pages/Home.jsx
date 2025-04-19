import { useEffect, useState } from "react"
import api from "../services/api";
import "../CSS/Home.css";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import { Trash2, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const Home = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem("access_token");
        if (!access) {
            navigate("/login"); // redirect to login
        }
    }, [navigate]);

    useEffect(() => {
        api.get("tasks/")
            .then((res) => setTodos(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token");
        navigate("/"); // redirect to login after logout
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
                    prevTodos.map((todo) =>
                        todo.id === res.data.id ? res.data : todo
                    )
                );
                setEditingTask(null); // Close the modal after update
            })
            .catch((err) => console.error("Update Failed", err));
    };


    return (
        <div className="todo">
            <div className="todo-header">
                To-Do List
                <button className="logout-btn" onClick={handleLogout}>Logout</button> {/* 🆕 Logout */}
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="todo-add-btn" onClick={() => setShowModal(true)}>
                    + Add
                </button>
                {showModal && (
                    <AddTaskModal onAdd={handleAddTask} onClose={() => setShowModal(false)} />
                )}
                {editingTask && ( // 🟢 Conditional rendering of Edit Modal
                    <EditTaskModal
                        task={editingTask}
                        onUpdate={handleUpdateTask}
                        onClose={() => setEditingTask(null)}
                    />
                )}
            </div>

            <div className="todo-list">
                {todos.map((todo) => (
                    <div className="todo-items" key={todo.id}>
                        <div className="todo-items-container">
                            <input
                                type="checkbox"
                                checked={todo.is_completed}
                                onChange={() => handleToggleComplete(todo.id, todo.is_completed)}
                            />
                            <div className="todo-items-text">{todo.title}</div>
                        </div>
                        <div className="todo-icons">
                            <Pencil
                                className="todo-items-edit-icon"
                                onClick={() => handleEditClick(todo)}
                                size={20}
                                style={{ marginRight: "10px", cursor: "pointer" }}
                            />
                            <Trash2
                                className="todo-items-cross-icon"
                                onClick={() => handleDelete(todo.id)}
                                size={20}
                                style={{ cursor: "pointer", color: "#e74c3c" }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
