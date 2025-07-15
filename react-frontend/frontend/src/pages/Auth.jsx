import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Auth.css"
import api from "../services/api";

const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle register form changes
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "accounts/login/",
        loginData
      );

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      console.log("User logged in", res.data);

      setMessage("✅ Login Successful!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      setMessage("❌ Login Failed!");
    }
  };

  // Handle register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "accounts/register/",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const loginResponse = await api.post(
        "accounts/login/",
        {
          username: registerData.username,
          password: registerData.password,
        }
      );

      const { access, refresh } = loginResponse.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setMessage("✅ Registration and Login Successful!");
      console.log("User registered and logged in", loginResponse.data);

      navigate("/");
    } catch (err) {
      console.error(err.response?.data);
      setMessage("❌ Registration Failed!");
    }
  };

  // Toggle between login and register forms
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setMessage(""); // Clear any messages when switching forms
  };

  return (
    <div className="auth-container">
      <div className="forms-container">
        <div className={`slider-container ${isLoginForm ? "" : "slide-right"}`}>
          {/* Login Form */}
          <div className="form login-form">
            <h2>Login</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="submit-btn">Login</button>
            </form>
            <p className="toggle-text">
              Don't have an account?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Register
              </span>
            </p>
          </div>

          {/* Register Form */}
          <div className="form register-form">
            <h2>Register</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Register</button>
            </form>
            <p className="toggle-text">
              Already have an account?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;