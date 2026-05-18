import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, LogOut, Menu, X, MessageCircle, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'sonner';
import { NotificationDropdown } from './NotificationDropdown';
import { WatchLogModal } from './WatchLogModal';
export function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showWatchLogModal, setShowWatchLogModal] = useState(false);
    const menuRef = useRef(null);
    const { user, isAuthenticated, logout, addNotification: setAuthNotification } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    // Connect auth context with notification context
    useEffect(() => {
        if (setAuthNotification) {
            setAuthNotification(addNotification);
        }
    }, [setAuthNotification, addNotification]);
    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            setShowUserMenu(false);
        }
        catch (error) {
            toast.error('Logout failed');
        }
    };
    return (_jsxs("header", { className: "sticky top-0 z-50 bg-[#151921]/70 backdrop-blur-xl border-b border-[#BFBCFC]/15", children: [_jsxs("div", { className: "container mx-auto px-4 sm:px-6 py-3 md:py-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("nav", { className: "flex items-center gap-4 md:gap-8", children: [_jsx(Link, { to: "/", className: "flex items-center", children: _jsx("div", { className: "sm px-3 py-2 rounded-xl transition-all", children: _jsx("img", { src: "/src/imports/logo.png", alt: "TraceMyMovies", className: "h-8 md:h-10 w-auto" }) }) }), _jsxs("div", { className: "hidden lg:flex gap-6", children: [_jsx(Link, { to: "/", className: "text-[#F8FAFC] hover:text-[#BFBCFC] transition-colors duration-200", children: "Home" }), _jsx(Link, { to: "/movies", className: "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200", children: "Movies" }), isAuthenticated && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/the-queue", className: "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200", children: "Lists" }), _jsx(Link, { to: "/weekly-favorites", className: "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200", children: "Trends" }), _jsx(Link, { to: "/global-dna", className: "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200", children: "Community" })] }))] })] }), _jsxs("div", { className: "flex items-center gap-2 md:gap-4", children: [_jsxs("form", { onSubmit: handleSearch, className: "relative hidden lg:block", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search movies...", className: "bg-[#151921] text-[#F8FAFC] placeholder:text-[#94A3B8] pl-10 pr-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 w-64 transition-all duration-200" })] }), _jsx(Link, { to: "/search", className: "lg:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5", children: _jsx(Search, { className: "w-5 h-5" }) }), isAuthenticated && (_jsxs(_Fragment, { children: [_jsx("div", { className: "hidden md:block", children: _jsx(NotificationDropdown, {}) }), _jsx(Link, { to: "/messages", className: "p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5 hidden md:block", title: "Messages", children: _jsx(MessageCircle, { className: "w-5 h-5" }) }), _jsxs("button", { onClick: () => setShowWatchLogModal(true), className: "flex items-center gap-1.5 px-3 py-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5 hidden md:flex font-medium", title: "Add Watch Log", children: [_jsx(Plus, { className: "w-4 h-4" }), "Log"] })] })), isAuthenticated && user ? (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { onClick: () => setShowUserMenu(!showUserMenu), className: "flex items-center gap-2 p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5", children: [user.profilePicture ? (_jsx("img", { src: user.profilePicture, alt: user.username, className: "w-8 h-8 rounded-full object-cover border-2 border-[#BFBCFC]" })) : (_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-[#0B0E14] font-bold text-sm", children: user.username.charAt(0).toUpperCase() }) })), _jsx("span", { className: "hidden lg:block text-[#F8FAFC] font-medium", children: user.username })] }), showUserMenu && (_jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-[#151921]/95 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl shadow-2xl py-2", children: [_jsxs("div", { className: "px-4 py-3 border-b border-[#BFBCFC]/15", children: [_jsx("p", { className: "text-[#F8FAFC] font-medium", children: user.username }), _jsx("p", { className: "text-[#94A3B8] text-sm truncate", children: user.email })] }), _jsx(Link, { to: "/profile", onClick: () => setShowUserMenu(false), className: "block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors", children: "Account" }), _jsx(Link, { to: "/my-lists", onClick: () => setShowUserMenu(false), className: "block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors", children: "My Lists" }), _jsx(Link, { to: "/analytics", onClick: () => setShowUserMenu(false), className: "block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors", children: "Movie DNA" }), _jsx(Link, { to: "/messages", onClick: () => setShowUserMenu(false), className: "block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors", children: "Messages" }), user.isAdmin && (_jsx(Link, { to: "/admin", onClick: () => setShowUserMenu(false), className: "block px-4 py-2 text-[#44FFFF] hover:bg-[#44FFFF]/10 transition-colors font-medium", children: "Admin Panel" })), _jsx("div", { className: "border-t border-[#BFBCFC]/15 mt-2 pt-2", children: _jsxs("button", { onClick: handleLogout, className: "w-full text-left px-4 py-2 text-[#FF61D2] hover:bg-[#FF61D2]/10 transition-colors flex items-center gap-2", children: [_jsx(LogOut, { className: "w-4 h-4" }), "Logout"] }) })] }))] })) : (_jsx(Link, { to: "/login", className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all hover:scale-105 text-sm md:text-base", children: "Login" })), _jsx("button", { onClick: () => setShowMobileMenu(!showMobileMenu), className: "lg:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5", children: showMobileMenu ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) })] })] }), showMobileMenu && (_jsxs("div", { className: "lg:hidden mt-4 pb-4 border-t border-[#BFBCFC]/15 pt-4 space-y-2", children: [_jsx(Link, { to: "/", onClick: () => setShowMobileMenu(false), className: "block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 rounded-lg transition-colors", children: "Home" }), _jsx(Link, { to: "/movies", onClick: () => setShowMobileMenu(false), className: "block px-4 py-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/10 rounded-lg transition-colors", children: "Movies" }), isAuthenticated && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/the-queue", onClick: () => setShowMobileMenu(false), className: "block px-4 py-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/10 rounded-lg transition-colors", children: "Lists" }), _jsx(Link, { to: "/weekly-favorites", onClick: () => setShowMobileMenu(false), className: "block px-4 py-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/10 rounded-lg transition-colors", children: "Trends" }), _jsx(Link, { to: "/global-dna", onClick: () => setShowMobileMenu(false), className: "block px-4 py-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/10 rounded-lg transition-colors", children: "Community" }), _jsx(Link, { to: "/profile", onClick: () => setShowMobileMenu(false), className: "block px-4 py-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/10 rounded-lg transition-colors", children: "Account" })] }))] }))] }), _jsx(WatchLogModal, { isOpen: showWatchLogModal, onClose: () => setShowWatchLogModal(false), movieTitle: "", movieYear: "", moviePoster: "" })] }));
}
