import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Bell, UserPlus, CheckCircle, Film, MessageSquare, X, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router';
import { useNotifications } from '../context/NotificationContext';
export function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, markAsRead, markAllAsRead, removeNotification, unreadCount } = useNotifications();
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const getIcon = (type) => {
        switch (type) {
            case 'login':
                return _jsx(LogIn, { className: "w-5 h-5 text-[#44FFFF]" });
            case 'logout':
                return _jsx(LogOut, { className: "w-5 h-5 text-[#FF61D2]" });
            case 'friend_request':
                return _jsx(UserPlus, { className: "w-5 h-5 text-[#BFBCFC]" });
            case 'friend_accepted':
                return _jsx(CheckCircle, { className: "w-5 h-5 text-[#44FFFF]" });
            case 'new_movie':
                return _jsx(Film, { className: "w-5 h-5 text-[#BFBCFC]" });
            case 'comment_reply':
                return _jsx(MessageSquare, { className: "w-5 h-5 text-[#BFBCFC]" });
            default:
                return _jsx(Bell, { className: "w-5 h-5 text-[#BFBCFC]" });
        }
    };
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setShowNotifications(!showNotifications), className: "relative p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5", children: [_jsx(Bell, { className: "w-5 h-5" }), unreadCount > 0 && (_jsx("span", { className: "absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#FF61D2] text-white text-xs font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-[#151921] animate-pulse", children: unreadCount }))] }), showNotifications && (_jsxs("div", { className: "absolute right-0 mt-2 w-80 md:w-96 bg-[#151921]/95 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl shadow-2xl overflow-hidden z-50", children: [_jsxs("div", { className: "px-4 py-3 border-b border-[#BFBCFC]/15 flex items-center justify-between", children: [_jsx("h3", { className: "text-[#F8FAFC] font-heading font-bold text-lg", children: "Notifications" }), unreadCount > 0 && (_jsx("button", { onClick: markAllAsRead, className: "text-[#BFBCFC] hover:text-[#AFA9FF] text-sm font-medium transition-colors", children: "Mark all read" }))] }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: notifications.length === 0 ? (_jsxs("div", { className: "p-8 text-center", children: [_jsx(Bell, { className: "w-12 h-12 text-[#BFBCFC]/20 mx-auto mb-3" }), _jsx("p", { className: "text-[#94A3B8]", children: "No notifications" })] })) : (notifications.map((notification) => (_jsx("div", { className: `px-4 py-3 border-b border-[#BFBCFC]/10 hover:bg-[#BFBCFC]/5 transition-colors ${!notification.read ? 'bg-[#BFBCFC]/5' : ''}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 mt-1", children: getIcon(notification.type) }), _jsx("div", { className: "flex-1 min-w-0", children: notification.link ? (_jsxs(Link, { to: notification.link, onClick: () => {
                                                markAsRead(notification.id);
                                                setShowNotifications(false);
                                            }, className: "block", children: [_jsx("p", { className: "text-[#F8FAFC] font-medium text-sm mb-1", children: notification.title }), _jsx("p", { className: "text-[#94A3B8] text-sm line-clamp-2", children: notification.message }), _jsx("p", { className: "text-[#BFBCFC] text-xs mt-1 font-data", children: notification.time })] })) : (_jsxs("div", { onClick: () => markAsRead(notification.id), className: "cursor-pointer", children: [_jsx("p", { className: "text-[#F8FAFC] font-medium text-sm mb-1", children: notification.title }), _jsx("p", { className: "text-[#94A3B8] text-sm line-clamp-2", children: notification.message }), _jsx("p", { className: "text-[#BFBCFC] text-xs mt-1 font-data", children: notification.time })] })) }), _jsx("button", { onClick: () => removeNotification(notification.id), className: "flex-shrink-0 text-[#94A3B8] hover:text-[#FF61D2] transition-colors p-1", children: _jsx(X, { className: "w-4 h-4" }) })] }) }, notification.id)))) }), notifications.length > 0 && (_jsx("div", { className: "px-4 py-3 border-t border-[#BFBCFC]/15 text-center", children: _jsx("button", { className: "text-[#BFBCFC] hover:text-[#AFA9FF] text-sm font-medium transition-colors", children: "View All Notifications" }) }))] }))] }));
}
