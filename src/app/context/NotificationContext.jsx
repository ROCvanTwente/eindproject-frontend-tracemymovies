import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from "../context/AuthContext";

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = useAuth();

    const token = useMemo(() => {
        return (
            auth?.token || auth?.user?.token || localStorage.getItem("authToken") ||
            localStorage.getItem("auth_token") || localStorage.getItem("token") ||
            sessionStorage.getItem("authToken") || sessionStorage.getItem("auth_token") ||
            sessionStorage.getItem("token")
        );
    }, [auth]);

    // Ophalen van notificaties
    const fetchNotifications = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Notification/GetMyNotifications`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Kon notificaties niet ophalen");

            const data = await response.json();
            // Filter hier alvast op ongelezen notificaties als je wilt dat ze "verdwijnen"
            setNotifications(data.filter(n => !n.read));
        } catch (err) {
            console.error("Fout bij ophalen notificaties:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Notificatie markeren als gelezen
    const markAsRead = useCallback(async (notificationId) => {
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Notification/MarkAsRead/${notificationId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Verwijder de notificatie direct uit de lijst in de state
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
            }
        } catch (err) {
            console.error("Fout bij markeren als gelezen:", err);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [token, fetchNotifications]);

    // Listen for live notifications via SignalR custom event
    useEffect(() => {
        const handleSignalRNotification = (event) => {
            const notification = event.detail;
            if (!notification) return;
            setNotifications((prev) => {
                // Avoid duplicates
                if (prev.some((n) => n.id === notification.id)) return prev;
                return [notification, ...prev];
            });
        };
        window.addEventListener("signalr:notification", handleSignalRNotification);
        return () => window.removeEventListener("signalr:notification", handleSignalRNotification);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            loading,
            error,
            refreshNotifications: fetchNotifications,
            markAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}