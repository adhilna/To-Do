import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/LandingPage.css";

const LandingPage = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger animations after component mount
        setIsLoaded(true);
    }, []);

    return (
        <div className="landing-page">
            <div className="landing-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>

            <div className={`landing-content ${isLoaded ? 'visible' : ''}`}>
                <div className="landing-logo">
                    <div className="logo-circle">
                        <div className="checkmark"></div>
                    </div>
                    <h1>TaskFlow</h1>
                </div>

                <div className="landing-text">
                    <h2>Organize your tasks,<br />streamline your life</h2>
                    <p>
                        A simple, intuitive todo app designed to help you stay focused,
                        organized, and productive throughout your day.
                    </p>
                </div>

                <div className="feature-highlights">
                    <div className="feature">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <span>Easy Task Management</span>
                    </div>

                    <div className="feature">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <span>Smart Organization</span>
                    </div>

                    <div className="feature">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </div>
                        <span>Task Reminders</span>
                    </div>
                </div>

                <div className="landing-actions">
                    <Link to="/auth" className="cta-button">
                        Get Started
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>

                <div className="app-preview">
                    <div className="task-preview">
                        <div className="task-item">
                            <div className="task-check checked"></div>
                            <div className="task-text completed">Complete project proposal</div>
                        </div>
                        <div className="task-item">
                            <div className="task-check"></div>
                            <div className="task-text">Schedule team meeting</div>
                        </div>
                        <div className="task-item">
                            <div className="task-check"></div>
                            <div className="task-text">Research new frameworks</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;