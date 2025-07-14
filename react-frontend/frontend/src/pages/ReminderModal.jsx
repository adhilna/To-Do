import React, { useState } from 'react';
import { X, Clock, Calendar, Bell } from 'lucide-react';
import '../CSS/ReminderModal.css'

const ReminderModal = ({ task, onSetReminder, onClose }) => {
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderType, setReminderType] = useState('once'); // 'once', 'daily', 'weekly'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reminderDate && reminderTime) {
            const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
            onSetReminder({
                taskId: task.id,
                datetime: reminderDateTime,
                type: reminderType
            });
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content reminder-modal">
                <div className="modal-header">
                    <h3>Set Reminder</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="task-info">
                        <h4>Task: {task.title}</h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                <Calendar size={16} />
                                Date
                            </label>
                            <input
                                type="date"
                                value={reminderDate}
                                onChange={(e) => setReminderDate(e.target.value)}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Clock size={16} />
                                Time
                            </label>
                            <input
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Bell size={16} />
                                Repeat
                            </label>
                            <select
                                value={reminderType}
                                onChange={(e) => setReminderType(e.target.value)}
                            >
                                <option value="once">Once</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                Set Reminder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReminderModal;