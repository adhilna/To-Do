import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Auth.css";
import api from "../services/api";

// Validation helpers
const validateLogin = (data) => {
  const errors = {};
  if (!data.username.trim()) {
    errors.username = "Username is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }
  return errors;
};

const validateRegister = (data) => {
  const errors = {};

  // USERNAME VALIDATION
  const username = data.username.trim();
  const usernameRegex = /^[a-z][a-z0-9]{2,19}$/;

  if (!username) {
    errors.username = "Username is required";
  } else if (!usernameRegex.test(username)) {
    errors.username =
      "Username must start with a letter and contain only lowercase letters and numbers (3–20 characters)";
  }

  // EMAIL VALIDATION
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = "Email address is required";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  const password = data.password;

  // PASSWORD VALIDATION
  if (!password) {
    errors.password = "Password is required";
  } else {
    const lengthCheck = password.length >= 8;
    const upperCheck = /[A-Z]/.test(password);
    const lowerCheck = /[a-z]/.test(password);
    const digitCheck = /[0-9]/.test(password);
    const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noSpaceCheck = !/\s/.test(password);

    if (!lengthCheck) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!upperCheck) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!lowerCheck) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!digitCheck) {
      errors.password = "Password must contain at least one number";
    } else if (!specialCheck) {
      errors.password = "Password must contain at least one special character";
    } else if (!noSpaceCheck) {
      errors.password = "Password cannot contain spaces";
    }
  }

  return errors;
};

const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginErrors({ ...loginErrors, [e.target.name]: undefined });
  };

  // Handle register form changes
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setRegisterErrors({ ...registerErrors, [e.target.name]: undefined });
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLogin(loginData);
    if (Object.keys(errors).length) {
      setLoginErrors(errors);
      return;
    }
    try {
      const res = await api.post("accounts/login/", loginData);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Please check your credentials and try again.");
    }
  };

  // Handle register submit
const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  const errors = validateRegister(registerData);
  if (Object.keys(errors).length) {
    setRegisterErrors(errors);
    return;
  }

  try {
    await api.post("accounts/register/", registerData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Auto-fill login form with registered credentials
    setLoginData({
      username: registerData.username,
      password: registerData.password,
    });

    setMessage("✅ Registration successful! You can now log in.");
    setIsLoginForm(true); // switch to login form

  } catch (err) {
    console.error(err);
    setMessage("❌ Registration failed. Please try again.");
  }
};


  // Toggle between login and register forms
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setMessage("");
    setLoginErrors({});
    setRegisterErrors({});
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
  };

  return (
    <div className="auth-container">
      <div className="forms-container">
        <div className={`slider-container ${isLoginForm ? "" : "slide-right"}`}>
          {/* Login Form */}
          <div className="form login-form">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p className="form-subtitle">Sign in to your account</p>
            </div>

            {message && isLoginForm && (
              <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                <div className="message-content">
                  {message.includes('successful') ? (
                    <svg className="message-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="message-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message}
                </div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    required
                    autoComplete="username"
                    className={loginErrors.username ? 'error' : ''}
                  />
                  <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                {loginErrors.username && (
                  <div className="error-message">
                    <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {loginErrors.username}
                  </div>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    autoComplete="current-password"
                    className={loginErrors.password ? 'error' : ''}
                  />
                  <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <div className="error-message">
                    <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {loginErrors.password}
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn">
                <span>Sign In</span>
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="form-footer">
              <p className="toggle-text">
                Don't have an account?{" "}
                <span className="toggle-link" onClick={toggleForm}>
                  Create one
                </span>
              </p>
            </div>
          </div>

          {/* Register Form */}
          <div className="form register-form">
            <div className="form-header">
              <h2>Create Account</h2>
              <p className="form-subtitle">Join us today</p>
            </div>

            {message && !isLoginForm && (
              <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                <div className="message-content">
                  {message.includes('successful') ? (
                    <svg className="message-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="message-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message}
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} noValidate>
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    required
                    className={registerErrors.username ? 'error' : ''}
                  />
                  <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                {registerErrors.username && (
                  <div className="error-message">
                    <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {registerErrors.username}
                  </div>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="off"
                    className={registerErrors.email ? 'error' : ''}
                  />
                  <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                {registerErrors.email && (
                  <div className="error-message">
                    <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {registerErrors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    className={registerErrors.password ? 'error' : ''}
                  />
                  <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                {registerErrors.password && (
                  <div className="error-message">
                    <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {registerErrors.password}
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn">
                <span>Create Account</span>
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="form-footer">
              <p className="toggle-text">
                Already have an account?{" "}
                <span className="toggle-link" onClick={toggleForm}>
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;