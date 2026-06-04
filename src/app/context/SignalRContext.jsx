import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";

const SignalRContext = createContext(null);

export function SignalRProvider({ children }) {
  const { user } = useAuth();
  const connectionRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [lastSeenUsers, setLastSeenUsers] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  const token = useMemo(
    () =>
      user?.token ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token"),
    [user]
  );

  useEffect(() => {
    if (!token || !user) {
      // Disconnect if logged out
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Already connected
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) return;

    const hubUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "") + "/hubs/online";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Online status event
    connection.on("UserStatusChanged", ({ userId, isOnline, lastSeen }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
      if (!isOnline && lastSeen)
        setLastSeenUsers((prev) => ({ ...prev, [userId]: lastSeen }));
      // Dispatch so FriendPage can update its local state directly
      window.dispatchEvent(new CustomEvent("signalr:userstatuschanged", {
        detail: { userId, isOnline, lastSeen }
      }));
    });

    // Friend list changed event
    connection.on("FriendListChanged", () => {
      window.dispatchEvent(new CustomEvent("signalr:friendlistchanged"));
    });

    // Live notification event
    connection.on("ReceiveNotification", (notification) => {
      // Dispatch a custom event so NotificationContext can pick it up
      window.dispatchEvent(
        new CustomEvent("signalr:notification", { detail: notification })
      );
    });

    connection.onclose(() => setIsConnected(false));
    connection.onreconnected(() => setIsConnected(true));

    connection.start()
      .then(() => setIsConnected(true))
      .catch((err) => console.error("SignalR connection failed:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
      connectionRef.current = null;
      setIsConnected(false);
    };
  }, [token, user]);

  const isUserOnline = (userId, fallback = false) => {
    if (userId in onlineUsers) return onlineUsers[userId];
    return fallback;
  };

  const getUserLastSeen = (userId, fallback = null) => {
    if (userId in lastSeenUsers) return lastSeenUsers[userId];
    return fallback;
  };

  return (
    <SignalRContext.Provider value={{ isConnected, isUserOnline, getUserLastSeen, onlineUsers }}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  const ctx = useContext(SignalRContext);
  if (!ctx) throw new Error("useSignalR must be used within SignalRProvider");
  return ctx;
}
