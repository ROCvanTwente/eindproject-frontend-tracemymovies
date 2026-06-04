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
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Already connected or connecting — don't start again
    const state = connectionRef.current?.state;
    if (
      state === signalR.HubConnectionState.Connected ||
      state === signalR.HubConnectionState.Connecting ||
      state === signalR.HubConnectionState.Reconnecting
    ) return;

    const hubUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "") + "/hubs/online";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on("UserStatusChanged", ({ userId, isOnline, lastSeen }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
      if (!isOnline && lastSeen)
        setLastSeenUsers((prev) => ({ ...prev, [userId]: lastSeen }));
      window.dispatchEvent(new CustomEvent("signalr:userstatuschanged", {
        detail: { userId, isOnline, lastSeen }
      }));
    });

    connection.on("FriendListChanged", () => {
      window.dispatchEvent(new CustomEvent("signalr:friendlistchanged"));
    });

    connection.on("ReceiveNotification", (notification) => {
      window.dispatchEvent(new CustomEvent("signalr:notification", { detail: notification }));
    });

    connection.onclose(() => setIsConnected(false));
    connection.onreconnected(() => setIsConnected(true));

    connectionRef.current = connection;

    connection.start()
      .then(() => setIsConnected(true))
      .catch((err) => console.error("SignalR connection failed:", err));

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
