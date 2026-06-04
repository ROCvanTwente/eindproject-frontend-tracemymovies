import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, UserPlus, CheckCircle, Film, MessageSquare, Check } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, loading, refreshNotifications, markAsRead } = useNotifications();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const getNavPath = (type) => {
        const t = type?.toLowerCase();
        if (t === 'friendrequest' || t === 'friendaccepted' || t === 'frienddeclined' || t === 'friendremoved') return '/FriendPage';
        return null;
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        if (!showNotifications) refreshNotifications();
        setShowNotifications(!showNotifications);
    };

    const getIcon = (type) => {
        const icons = {
            friend_request: <UserPlus className="w-5 h-5 text-[#BFBCFC]" />,
            friend_accepted: <CheckCircle className="w-5 h-5 text-[#44FFFF]" />,
            new_movie: <Film className="w-5 h-5 text-[#BFBCFC]" />,
            comment_reply: <MessageSquare className="w-5 h-5 text-[#BFBCFC]" />
        };
        return icons[type] || <Bell className="w-5 h-5 text-[#BFBCFC]" />;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown} 
                className="relative p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors rounded-lg hover:bg-white/5"
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF61D2] text-[9px] font-bold text-white shadow-sm ring-2 ring-[#151921]">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#151921] border border-[#BFBCFC]/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#BFBCFC]/10 bg-[#1E2530]">
                        <h3 className="text-[#F8FAFC] font-bold">Notifications</h3>
                    </div>
                    
                    {/* De scrollbare container (sidebar-stijl) */}
                    <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#BFBCFC]/20">
                        <AnimatePresence initial={false}>
                            {loading ? (
                                <div className="p-8 text-center text-[#94A3B8]">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-[#94A3B8]">No notifications</div>
                            ) : (
                                [...notifications].sort((a, b) => b.id - a.id).slice(0, 4).map((n) => (
                                    <motion.div 
                                        key={n.id}
                                        initial={{ opacity: 1 }}
                                        exit={{ 
                                            opacity: 0, 
                                            height: 0, 
                                            marginTop: 0, 
                                            marginBottom: 0,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            backgroundColor: "rgba(68, 255, 255, 0.1)",
                                            transition: { duration: 0.3, ease: "easeOut" } 
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div
                                            onClick={() => { const p = getNavPath(n.type); if (p) { setShowNotifications(false); navigate(p); } }}
                                            className={`px-4 py-3 border-b border-[#BFBCFC]/5 hover:bg-[#BFBCFC]/5 transition-colors flex items-start gap-3 ${getNavPath(n.type) ? 'cursor-pointer' : ''}`}
                                        >
                                            <div className="flex-shrink-0 mt-1">{getIcon(n.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#F8FAFC] font-medium text-sm">{n.title}</p>
                                                <p className="text-[#94A3B8] text-xs truncate">{n.message}</p>
                                                <p className="text-[#94A3B8] text-[10px] mt-1">{n.time}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                                className="group flex-shrink-0 p-2 rounded-full hover:bg-[#44FFFF]/20 transition-all"
                                            >
                                                <Check className="w-4 h-4 text-[#94A3B8] group-hover:text-[#44FFFF] transition-colors" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}