import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    /// This message state is for showing feedback (like “✅ Success” or “❌ Error”) after submitting the form.
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    /// If the input's name is "email", then formData.email gets updated.

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/accounts/register/', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage('✅ Registration Successful!');
            console.log(res.data);
            navigate("/");
        } catch (err) {
            console.error(err.response?.data);
            setMessage('❌ Registration Failed!');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                    required
                />
                <br />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                />
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
