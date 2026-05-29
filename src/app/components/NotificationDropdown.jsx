import { useState, useRef, useEffect } from 'react';
import { Bell, UserPlus, CheckCircle, Film, MessageSquare, Check } from 'lucide-react'; // Check toegevoegd
import { useNotifications } from '../context/NotificationContext';

export function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    // Voeg markAsRead toe aan de destructing van de context
    const { notifications, loading, refreshNotifications, markAsRead } = useNotifications(); 
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

    const toggleDropdown = () => {
        if (!showNotifications) {
            refreshNotifications();
        }
        setShowNotifications(!showNotifications);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'friend_request': return <UserPlus className="w-5 h-5 text-[#BFBCFC]" />;
            case 'friend_accepted': return <CheckCircle className="w-5 h-5 text-[#44FFFF]" />;
            case 'new_movie': return <Film className="w-5 h-5 text-[#BFBCFC]" />;
            case 'comment_reply': return <MessageSquare className="w-5 h-5 text-[#BFBCFC]" />;
            default: return <Bell className="w-5 h-5 text-[#BFBCFC]" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown} 
                className="relative p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors rounded-lg hover:bg-white/5"
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#BFBCFC] rounded-full border-2 border-[#151921]" />
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#151921]/95 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#BFBCFC]/15">
                        <h3 className="text-[#F8FAFC] font-bold text-lg">Notifications</h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[#94A3B8]">Laden...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-[#94A3B8]">Geen meldingen</div>
                        ) : (
                            notifications.map((n) => (
                                <div key={n.id} className="px-4 py-3 border-b border-[#BFBCFC]/10 hover:bg-[#BFBCFC]/5 transition-colors flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">{getIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#F8FAFC] font-medium text-sm">{n.title}</p>
                                        <p className="text-[#94A3B8] text-sm line-clamp-2">{n.message}</p>
                                        <p className="text-[#BFBCFC] text-xs mt-1">{n.time}</p>
                                    </div>
                                    {/* De Read-knop */}
                                    <button 
                                        onClick={() => markAsRead(n.id)}
                                        className="flex-shrink-0 p-1.5 text-[#94A3B8] hover:text-[#44FFFF] hover:bg-[#44FFFF]/10 rounded-full transition-all"
                                        title="Markeer als gelezen"
                                    >
                                        <Check size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}