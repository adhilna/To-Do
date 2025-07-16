import { useState } from "react";
import api from "../services/api";
import "../CSS/Modal.css";
import { X, Plus } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

const AddTaskModal = ({ onAdd, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();

    const handleAdd = async () => {
        if (title.trim() === "") {
            showNotification("Please enter a title.");
            return;
        }
        if (description.trim() === "") {
            showNotification("Please write a description.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await api.post("home/tasks/", {
                title: title,
                description: description,
                is_completed: false,
            });

            onAdd(res.data);
            setTitle("");
            setDescription("");
            onClose();
        } catch (err) {
            console.error(err);
            showNotification("Failed to add task.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Task</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="input-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            className="modal-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="modal-input textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details (optional)"
                            rows={4}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="modal-button add"
                        onClick={handleAdd}
                        disabled={title.trim() === "" || isSubmitting}
                    >
                        <Plus size={16} />
                        <span>Add Task</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;