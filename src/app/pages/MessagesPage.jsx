import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { MessageCircle, Send, Search, UserPlus, MoreVertical, Film } from 'lucide-react';
import { Link } from 'react-router';
export function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState(1);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const chats = [
        {
            id: 1,
            friendId: 1,
            friendName: 'Sarah Williams',
            friendAvatar: 'SW',
            lastMessage: 'Heb je Oppenheimer al gezien? Echt een meesterwerk!',
            timestamp: '2 min',
            unread: 2,
            online: true,
        },
        {
            id: 2,
            friendId: 2,
            friendName: 'John Doe',
            friendAvatar: 'JD',
            lastMessage: 'Zullen we vrijdag naar de bioscoop?',
            timestamp: '1 uur',
            unread: 0,
            online: true,
        },
        {
            id: 3,
            friendId: 3,
            friendName: 'Alex Johnson',
            friendAvatar: 'AJ',
            lastMessage: 'Thanks voor de aanbeveling!',
            timestamp: '3 uur',
            unread: 0,
            online: false,
        },
    ];
    const messages = [
        {
            id: 1,
            senderId: 1,
            text: 'Hey! Heb je al Dune: Part Two gezien?',
            timestamp: '10:30',
        },
        {
            id: 2,
            senderId: 0,
            text: 'Ja gisteren! Wat een visueel spektakel 🎬',
            timestamp: '10:32',
        },
        {
            id: 3,
            senderId: 1,
            text: 'Ik ga vanavond! Kan niet wachten',
            timestamp: '10:33',
            movieReference: {
                id: 693134,
                title: 'Dune: Part Two',
                poster: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
            },
        },
        {
            id: 4,
            senderId: 0,
            text: 'Je gaat het geweldig vinden! De soundtrack is ook amazing',
            timestamp: '10:35',
        },
        {
            id: 5,
            senderId: 1,
            text: 'Heb je Oppenheimer al gezien? Echt een meesterwerk!',
            timestamp: '10:40',
        },
    ];
    const selectedChatData = chats.find((c) => c.id === selectedChat);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim())
            return;
        // Handle sending message
        setMessageText('');
    };
    const filteredChats = chats.filter((chat) => chat.friendName.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsx("div", { className: "min-h-screen py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold font-heading text-[#F8FAFC] mb-2", children: "Berichten" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Chat met je filmvrienden" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]", children: [_jsxs("div", { className: "lg:col-span-1 bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-[#BFBCFC]/15", children: [_jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Zoek vrienden...", className: "w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 pr-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm" })] }), _jsxs("button", { className: "w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2", children: [_jsx(UserPlus, { className: "w-4 h-4" }), "Nieuwe Chat"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: filteredChats.map((chat) => (_jsx("div", { className: `relative w-full p-4 border-b border-[#BFBCFC]/10 hover:bg-[#BFBCFC]/5 transition-all ${selectedChat === chat.id ? 'bg-[#BFBCFC]/10' : ''}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: `/user/${chat.friendId}`, className: "relative flex-shrink-0 hover:opacity-80 transition-opacity", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-[#0B0E14] font-bold", children: chat.friendAvatar }) }), chat.online && (_jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#151921]" }))] }), _jsxs("button", { onClick: () => setSelectedChat(chat.id), className: "flex-1 min-w-0 text-left", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h3", { className: "text-[#F8FAFC] font-medium truncate", children: chat.friendName }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: chat.timestamp })] }), _jsx("p", { className: "text-[#94A3B8] text-sm truncate", children: chat.lastMessage })] }), chat.unread > 0 && (_jsx("div", { className: "bg-[#FF61D2] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", children: chat.unread }))] }) }, chat.id))) })] }), _jsx("div", { className: "lg:col-span-2 bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl overflow-hidden flex flex-col", children: selectedChatData ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-4 border-b border-[#BFBCFC]/15 flex items-center justify-between", children: [_jsxs(Link, { to: `/user/${selectedChatData.friendId}`, className: "flex items-center gap-3 hover:opacity-80 transition-opacity", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-[#0B0E14] font-bold text-sm", children: selectedChatData.friendAvatar }) }), selectedChatData.online && (_jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#151921]" }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-[#F8FAFC] font-bold", children: selectedChatData.friendName }), _jsx("p", { className: "text-[#44FFFF] text-xs", children: selectedChatData.online ? 'Online' : 'Offline' })] })] }), _jsx("button", { className: "p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#BFBCFC]/10 transition-all", children: _jsx(MoreVertical, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: messages.map((message) => (_jsxs("div", { className: `flex gap-2 items-end ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`, children: [message.senderId !== 0 && selectedChatData && (_jsx(Link, { to: `/user/${selectedChatData.friendId}`, className: "flex-shrink-0 hover:opacity-80 transition-opacity", children: _jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-[#0B0E14] font-bold text-xs", children: selectedChatData.friendAvatar }) }) })), _jsxs("div", { className: `max-w-[70%] ${message.senderId === 0
                                                        ? 'bg-[#BFBCFC] text-[#0B0E14]'
                                                        : 'bg-[#0B0E14] text-[#F8FAFC]'} rounded-2xl px-4 py-2`, children: [message.movieReference && (_jsxs(Link, { to: `/movie/${message.movieReference.id}`, className: "flex items-center gap-3 mb-2 p-2 bg-black/20 rounded-xl hover:bg-black/30 transition-all", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w92${message.movieReference.poster}`, alt: message.movieReference.title, className: "w-12 h-16 object-cover rounded" }), _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Film, { className: "w-4 h-4" }), _jsx("span", { className: "font-medium text-sm", children: message.movieReference.title })] }) })] })), _jsx("p", { className: "text-sm", children: message.text }), _jsx("p", { className: `text-xs mt-1 ${message.senderId === 0
                                                                ? 'text-[#0B0E14]/60'
                                                                : 'text-[#94A3B8]'}`, children: message.timestamp })] })] }, message.id))) }), _jsx("form", { onSubmit: handleSendMessage, className: "p-4 border-t border-[#BFBCFC]/15", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: messageText, onChange: (e) => setMessageText(e.target.value), placeholder: "Type een bericht...", className: "flex-1 bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20" }), _jsx("button", { type: "submit", className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] p-3 rounded-xl transition-all", children: _jsx(Send, { className: "w-5 h-5" }) })] }) })] })) : (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(MessageCircle, { className: "w-24 h-24 text-[#BFBCFC]/20 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-bold text-[#F8FAFC] mb-2", children: "Selecteer een chat" }), _jsx("p", { className: "text-[#94A3B8]", children: "Kies een vriend om mee te chatten" })] }) })) })] })] }) }));
}
