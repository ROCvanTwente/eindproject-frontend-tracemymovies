import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Send, Check } from 'lucide-react';
import { toast } from 'sonner';
const MOCK_FRIENDS = [
    { id: 1, name: 'Sarah Williams', avatar: 'SW', online: true },
    { id: 2, name: 'John Doe', avatar: 'JD', online: true },
    { id: 3, name: 'Alex Johnson', avatar: 'AJ', online: false },
    { id: 4, name: 'Emma Davis', avatar: 'ED', online: true },
    { id: 5, name: 'Michael Brown', avatar: 'MB', online: false },
];
export function ShareModal({ isOpen, onClose, movieTitle, movieId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [message, setMessage] = useState('');
    if (!isOpen)
        return null;
    const filteredFriends = MOCK_FRIENDS.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const toggleFriend = (friendId) => {
        setSelectedFriends((prev) => prev.includes(friendId)
            ? prev.filter((id) => id !== friendId)
            : [...prev, friendId]);
    };
    const handleShare = () => {
        if (selectedFriends.length === 0) {
            toast.error('Please select at least one friend');
            return;
        }
        toast.success(`Shared "${movieTitle}" with ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''}`);
        onClose();
        setSelectedFriends([]);
        setMessage('');
        setSearchQuery('');
    };
    const modalContent = (_jsxs("div", { className: "fixed inset-0 flex items-center justify-center px-4 py-8 z-[99999]", onClick: onClose, children: [_jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-md" }), _jsxs("div", { className: "relative w-full max-w-lg bg-[#151921] border border-[#BFBCFC]/20 rounded-xl shadow-2xl z-[100000] max-h-[85vh] overflow-hidden flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-[#BFBCFC]/15", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-[#F8FAFC]", children: "Share Movie" }), _jsx("p", { className: "text-[#94A3B8] text-sm mt-0.5", children: movieTitle })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-[#FF61D2]/20 rounded-lg text-[#94A3B8] hover:text-[#FF61D2] transition-all", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] font-medium mb-2 text-sm", children: "Select Friends" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search friends...", className: "w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm" })] })] }), _jsx("div", { className: "space-y-2 max-h-[250px] overflow-y-auto", children: filteredFriends.map((friend) => {
                                    const isSelected = selectedFriends.includes(friend.id);
                                    return (_jsxs("button", { onClick: () => toggleFriend(friend.id), className: `w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${isSelected
                                            ? 'bg-[#BFBCFC]/10 border-[#BFBCFC]/30'
                                            : 'bg-[#0B0E14] border-[#BFBCFC]/15 hover:border-[#BFBCFC]/25'}`, children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-[#0B0E14] font-bold text-sm", children: friend.avatar }) }), friend.online && (_jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#151921]" }))] }), _jsxs("div", { className: "flex-1 text-left", children: [_jsx("p", { className: "text-[#F8FAFC] font-medium text-sm", children: friend.name }), _jsx("p", { className: "text-[#94A3B8] text-xs", children: friend.online ? 'Online' : 'Offline' })] }), isSelected && (_jsx("div", { className: "w-6 h-6 bg-[#44FFFF] rounded-full flex items-center justify-center", children: _jsx(Check, { className: "w-4 h-4 text-[#0B0E14]" }) }))] }, friend.id));
                                }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] font-medium mb-2 text-sm", children: "Add a Message (Optional)" }), _jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Tell your friends why they should watch this...", rows: 3, className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none text-sm placeholder:text-[#94A3B8]", maxLength: 200 }), _jsxs("p", { className: "text-[#94A3B8] text-xs mt-1", children: [message.length, "/200 characters"] })] }), selectedFriends.length > 0 && (_jsx("div", { className: "bg-[#44FFFF]/10 border border-[#44FFFF]/20 rounded-lg p-3", children: _jsxs("p", { className: "text-[#44FFFF] text-sm", children: [selectedFriends.length, " friend", selectedFriends.length > 1 ? 's' : '', " selected"] }) }))] }), _jsxs("div", { className: "flex gap-2 p-4 border-t border-[#BFBCFC]/15", children: [_jsx("button", { onClick: onClose, className: "flex-1 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-2.5 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 text-sm", children: "Cancel" }), _jsxs("button", { onClick: handleShare, className: "flex-1 bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-[#44FFFF]/30 text-sm flex items-center justify-center gap-2", children: [_jsx(Send, { className: "w-4 h-4" }), "Share Movie"] })] })] })] }));
    return createPortal(modalContent, document.body);
}
