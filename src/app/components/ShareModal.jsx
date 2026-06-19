import { useState, useCallback, useEffect } from 'react';
import { X, Search, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from "../context/AuthContext";
import * as signalR from "@microsoft/signalr";

export function ShareModal({ isOpen, onClose, movieTitle, movieId, token }) {
    if (!isOpen) return null;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [message, setMessage] = useState('');

    const [myFriends, setMyFriends] = useState([]);
    const [filterMyFriends, setFilterMyFriends] = useState([])
    const [connection, setConnection] = useState(null);
    const auth = useAuth();

    const handleSendMessage = useCallback(async () => {
        try {
            selectedFriends.forEach(async (selectedFriend) => {
                console.log(selectedFriend);
                await connection.invoke(
                    "SendMessagePrivate",
                    selectedFriend,
                    `${movieId}.${message}`
                );
            });
        } catch (err) {
            console.error(err);
        } finally {
            setMessage('');
        }
    });

    const getMyFriends = useCallback(() => {
        const headers = { 'Authorization': `Bearer ${token}` };
        fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetMyFriends`, { headers })
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                setMyFriends(data);
                setFilterMyFriends(data);
            })
            .catch((err) => console.log(err));
    });

    const getCorrectImgMessage = useCallback((friend) => {
        if (friend.profileImageBase64) {
            return <img
                className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center"
                src={`data:image/png;base64,${friend.profileImageBase64}`}
                alt={friend.userName}
            />
        } else {
            return <div className="w-12 h-12 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
                <span className="text-[#0B0E14] font-bold text-xl">{friend.userName[0]}</span>
            </div>
        }
    });

    useEffect(() => {
        getMyFriends();
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/hubs/chat`, {
                accessTokenFactory: () => token
            })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        console.log(newConnection)
        if (newConnection.state === signalR.HubConnectionState.Disconnected) {
            newConnection.start()
                .then(() => {
                    console.log("Verbonden met SignalR")
                })
                .catch((err) => console.error(err));
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConnection(newConnection);

        return () => {
            if (newConnection.state !== signalR.HubConnectionState.Disconnected) {
                newConnection.stop()
                    .then(() => console.log("SignalR netjes afgesloten"))
                    .catch(err => console.error("Fout bij sluiten:", err));
            }
            setConnection(null);
        };
    }, [token]);

    useEffect(() => {
        if (searchQuery == '') {
            setFilterMyFriends(myFriends)
        } else {
            let filterMyFriends = myFriends.filter((friend) => friend.userName.includes(searchQuery));
            setFilterMyFriends(filterMyFriends);
        }
    }, [searchQuery]);

    const toggleFriend = useCallback((friendId) => {
        setSelectedFriends((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    });

    const handleShare = useCallback(() => {
        if (selectedFriends.length === 0) {
            toast.error('Please select at least one friend');
            return;
        } else if (!message.trim() || message.length > 200) {
            toast.error("You must fill the message")
            return;
        }
        handleSendMessage();
        toast.success(`Shared "${movieTitle}" with ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''}`);
        onClose();
        setSelectedFriends([]);
        setMessage('');
        setSearchQuery('');
    });


    return (
        <div className="fixed inset-0 flex items-center justify-center px-4 py-8 z-[99999]" onClick={onClose}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" />

            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-[#151921] border border-[#BFBCFC]/20 rounded-xl shadow-2xl z-[100000] max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#BFBCFC]/15">
                    <div>
                        <h2 className="text-xl font-bold text-[#F8FAFC]">Share Movie</h2>
                        <p className="text-[#94A3B8] text-sm mt-0.5">{movieTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#FF61D2]/20 rounded-lg text-[#94A3B8] hover:text-[#FF61D2] transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Search Input */}
                    <div>
                        <label className="block text-[#F8FAFC] font-medium mb-2 text-sm">Select Friends</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search friends..."
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Friends List */}
                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                        {filterMyFriends.map((friend) => {
                            const isSelected = selectedFriends.includes(friend.userId);
                            return (
                                <button
                                    key={friend.userId}
                                    onClick={() => toggleFriend(friend.userId)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${isSelected ? 'bg-[#BFBCFC]/10 border-[#BFBCFC]/30' : 'bg-[#0B0E14] border-[#BFBCFC]/15 hover:border-[#BFBCFC]/25'}`}
                                >
                                    <div className="relative">
                                        {getCorrectImgMessage(friend)}
                                        {friend.isOnline ? (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#151921]" />
                                        ) : (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3b424f] rounded-full border-2 border-[#151921]" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-[#F8FAFC] font-medium text-sm">{friend.userName}</p>
                                        <p className="text-[#94A3B8] text-xs">{friend.isOnline ? 'Online' : 'Offline'}</p>
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 bg-[#44FFFF] rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-[#0B0E14]" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <label className="block text-[#F8FAFC] font-medium mb-2 text-sm">Type a Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell your friends why they should watch this..."
                            rows={3}
                            className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none text-sm placeholder:text-[#94A3B8]"
                            maxLength={200}
                        />
                        <p className="text-[#94A3B8] text-xs mt-1">{message.length}/200 characters</p>
                    </div>

                    {/* Badge Selected Counter */}
                    {selectedFriends.length > 0 && (
                        <div className="bg-[#44FFFF]/10 border border-[#44FFFF]/20 rounded-lg p-3">
                            <p className="text-[#44FFFF] text-sm">
                                {selectedFriends.length} friend{selectedFriends.length > 1 ? 's' : ''} selected
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 p-4 border-t border-[#BFBCFC]/15">
                    <button onClick={onClose} className="flex-1 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-2.5 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 text-sm">
                        Cancel
                    </button>
                    <button onClick={handleShare} className="flex-1 bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-[#44FFFF]/30 text-sm flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Share Movie
                    </button>
                </div>

            </div>
        </div>
    );
}