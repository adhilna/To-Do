import React, { useEffect, useRef, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import '../CSS/NotificationProvider.css';

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const socketRef = useRef(null);

  // Auto-hide the popup after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // WebSocket connection
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (!access) return;

    socketRef.current = new WebSocket(
      `ws://localhost:8001/ws/notifications/?token=${access}`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket opened");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received notification:", data.message);
      setNotification(data.message);
    };

    socketRef.current.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };

    socketRef.current.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // ✅ Add this function
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
