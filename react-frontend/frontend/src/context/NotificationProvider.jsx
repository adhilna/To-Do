import React, { useEffect, useRef, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import "../CSS/NotificationProvider.css";

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [token, setToken] = useState(null);
  const socketRef = useRef(null);

  // ✅ Load token on mount (after it's available in localStorage)
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (access) {
      setToken(access);
    }
  }, []);

  // ✅ WebSocket connection (reacts when token is ready)
  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(
      `ws://localhost:8000/ws/notifications/?token=${token}`
    );
    socketRef.current = socket;

    socket.onopen = () => {
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotification(data.message);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  // ✅ Auto-hide notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ✅ Manual trigger for other components via context
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
