import React, { useEffect, useRef, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import "../CSS/NotificationProvider.css";

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const socketRef = useRef(null);

  // 🔁 Check localStorage for token changes (e.g., on login/register/logout)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 1000); // every 1s — lightweight and reliable
    return () => clearInterval(interval);
  }, [token]);

  // 🔌 Handle WebSocket connection
  useEffect(() => {
    if (!token) return;

    // 🛑 Close old socket if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(
      `${import.meta.env.VITE_WS_URL}notifications/?token=${token}`
    );
    socketRef.current = socket;


    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotification(data.message);
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };


    socket.onerror = (event) => {
      console.error("⚠️ WebSocket error:", event);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  // ⏳ Auto-hide after 8s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Manual usage via context
  const showNotification = (message) => {
    setNotification(message);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="notification-popup">
          <span className="notification-message">{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="notification-close-btn"
          >
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
