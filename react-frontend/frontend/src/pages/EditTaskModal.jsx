import { useEffect, useState } from "react";
import "../CSS/Modal.css";
import { X, Save } from "lucide-react";

const EditTaskModal = ({ task, onUpdate, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
        }
    }, [task]);

    const handleUpdate = () => {
        if (title.trim() === "") return;

        const updatedTask = {
            ...task,
            title,
            description,
        };
        onUpdate(updatedTask);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Task</h2>
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
                            placeholder="Task title"
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
                            placeholder="Task description (optional)"
                            rows={4}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="modal-button save"
                        onClick={handleUpdate}
                        disabled={title.trim() === ""}
                    >
                        <Save size={16} />
                        <span>Update</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;