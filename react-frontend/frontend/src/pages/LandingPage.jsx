import React from "react";
import { Link } from "react-router-dom";
import "../CSS/LandingPage.css"; 

const LandingPage = () => {
    return (
        <div className="landing-container">
            <h1>Welcome to Your To-Do App</h1>
            <p>Stay organized, be productive.</p>
            <h2>Get Started</h2>
            <div className="landing-buttons">
                <Link to="/register" className="btn">Register</Link>
                <Link to="/login" className="btn">Login</Link>
            </div>
        </div>
    );
};

export default LandingPage;
