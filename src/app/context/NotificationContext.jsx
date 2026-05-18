import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const NotificationContext = createContext(undefined);
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'friend_request',
            title: 'New Friend Request',
            message: 'John Doe sent you a friend request',
            time: '2 minutes ago',
            read: false,
        },
        {
            id: 2,
            type: 'friend_accepted',
            title: 'Friend Request Accepted',
            message: 'Sarah Williams accepted your friend request',
            time: '1 hour ago',
            read: false,
        },
    ]);
    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: Date.now(),
            time: 'Just now',
            read: false,
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };
    const markAsRead = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };
    const unreadCount = notifications.filter((n) => !n.read).length;
    return (_jsx(NotificationContext.Provider, { value: {
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            unreadCount,
        }, children: children }));
}
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
