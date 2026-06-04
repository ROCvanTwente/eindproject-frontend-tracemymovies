import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export function useOnlineStatus(token) {
  const [onlineUsers, setOnlineUsers] = useState({});
  const connectionRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/online`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on("UserStatusChanged", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
    });

    connection.start().catch((err) => console.error("SignalR error:", err));
    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [token]);

  const isUserOnline = (userId, fallback) => {
    if (userId in onlineUsers) return onlineUsers[userId];
    return fallback ?? false;
  };

  return { isUserOnline, onlineUsers };
}
