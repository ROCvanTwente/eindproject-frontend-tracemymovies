import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";

import ChatNotification from "../components/ChatNotification";

const SignalRContext = createContext(null);

export function SignalRProvider({ children }) {
  const { user } = useAuth();
  const connectionRef = useRef(null);
  const connectionChatRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [lastSeenUsers, setLastSeenUsers] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  const [isConnectedChat, setIsConnectedChat] = useState(false);
  const [messageInfo, setMessageInfo] = useState(null);


  const token = useMemo(
    () =>
      user?.token ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token"),
    [user]
  );

  useEffect(() => {
    if (!messageInfo) return;

    const timer = setTimeout(() => {
      console.log("5 seconden zijn voorbij, we halen het bericht weg.");
      setMessageInfo(null);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [messageInfo]);

  useEffect(() => {
    if (!token || !user) {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
      if (connectionChatRef.current) {
        connectionChatRef.current.stop();
        connectionChatRef.current = null;
        setIsConnectedChat(false);
      }
      return;
    }

    // Already connected or connecting — don't start again
    const state = connectionRef.current?.state;
    const stateChat = connectionChatRef.current?.state;
    if (
      state === signalR.HubConnectionState.Connected ||
      state === signalR.HubConnectionState.Connecting ||
      state === signalR.HubConnectionState.Reconnecting ||
      stateChat === signalR.HubConnectionState.Connected ||
      stateChat === signalR.HubConnectionState.Connecting ||
      stateChat === signalR.HubConnectionState.Reconnecting
    ) return;

    const hubUrl = import.meta.env.VITE_HUB_URL ||
      import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "") + "/hubs/online";

    const chatHubUrl = import.meta.env.VITE_HUB_URL ||
      import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "") + "/hubs/chat";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    const connectionChat = new signalR.HubConnectionBuilder()
      .withUrl(chatHubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionChat.on("ReceiveMessage", (senderId, messageId, message, timeSended, isRead, senderUserName, profileImg) => {
      if (window.location.pathname == "/messages") {
        console.log("NIET")
      } else {
        console.log("GEKREGEN VIA CONTEXT, Message is " + message)
        setMessageInfo({ senderId, messageId, message, timeSended, senderUserName, profileImg })
        connectionChat.invoke("GetTotalNotReadMessages", "");
      }
    });

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

    connection.on("TriggerBadgeCheck", () => {
      window.dispatchEvent(new CustomEvent("signalr:badgecheck"));
    });

    connection.onclose(() => setIsConnected(false));
    connection.onreconnected(() => setIsConnected(true));
    connection.onclose(() => setIsConnectedChat(false));
    connection.onreconnected(() => setIsConnectedChat(true));

    connectionRef.current = connection;
    connectionChatRef.current = connectionChat;

    connection.start()
      .then(() => setIsConnected(true))
      .catch((err) => console.error("SignalR connection failed:", err));

    connectionChat.start()
      .then(() => setIsConnectedChat(true))
      .catch((err) => console.error("SignalR connection failed:", err));

    return () => {
      connection.stop();
      connectionChat.stop();
      connectionRef.current = null;
      connectionChatRef.current = null;
      setIsConnected(false);
      setIsConnectedChat(false);
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
      {messageInfo != null && (
        <ChatNotification messageInfo={messageInfo} setMessageInfo={setMessageInfo}/>
      )}
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  const ctx = useContext(SignalRContext);
  if (!ctx) throw new Error("useSignalR must be used within SignalRProvider");
  return ctx;
}
