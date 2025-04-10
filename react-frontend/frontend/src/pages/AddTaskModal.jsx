import { useState } from "react";
import api from "../services/api";
import "../CSS/Modal.css"; // Import modal styles

const AddTaskModal = ({ onAdd, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAdd = () => {
        if (title.trim() === "") return;

        api
            .post("tasks/", {
                title: title,
                description: description,
                is_completed: false,
            })
            .then((res) => {
                onAdd(res.data);
                setTitle("");
                setDescription("");
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Task</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    className="modal-input"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    className="modal-input"
                />
                <div className="modal-buttons">
                    <button className="modal-button add" onClick={handleAdd}>
                        Add
                    </button>
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
