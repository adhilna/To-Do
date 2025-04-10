import { useEffect, useState } from "react";
import "../CSS/Modal.css"; // Import modal styles

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
        const updatedTask = {
            ...task,
            title,
            description,
        };
        onUpdate(updatedTask);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Task</h2>
                <input
                    className="modal-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Edit title"
                />
                <input
                    className="modal-input"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Edit description"
                />
                <div className="modal-buttons">
                    <button className="modal-button add" onClick={handleUpdate}>
                        Update
                    </button>
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
