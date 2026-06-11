import { useEffect, useState, useMemo } from 'react';
import { MessageCircle, Send, Search, UserPlus, MoreVertical, Film } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from "../context/AuthContext";
import * as signalR from "@microsoft/signalr";

export function MessagesPage() {
    const [selectedFriend, setSelectedFriend] = useState('');
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const auth = useAuth();
    console.log(auth.user);//
    const [myFriends, setMyFriends] = useState([]);
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim())
            return;
        try {
            await connection.invoke(
                "SendMessagePrivate",
                selectedFriend.userId,
                messageText
            );
        } catch (err) {
            console.error(err);
        } finally {
            setMessageText('');
        }
    };

    const token = useMemo(() => {
        return (
            auth?.token || auth?.user?.token || localStorage.getItem("authToken") ||
            localStorage.getItem("auth_token") || localStorage.getItem("token") ||
            sessionStorage.getItem("authToken") || sessionStorage.getItem("auth_token") ||
            sessionStorage.getItem("token")
        );
    }, [auth]);


    useEffect(() => {
        const headers = { 'Authorization': `Bearer ${token}` };
        fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetMyFriends`, { headers })
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                setMyFriends(data);
                console.log(data);
            })
            .catch((err) => console.log(err));

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/hubs/chat`, {
                accessTokenFactory: () => token
            })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => {
                console.log("Verbonden met SignalR");

                newConnection.on("ReceiveMessage", (senderId, messageId, message, timeSended) => {
                    setMessages((prev) => [
                        ...prev,
                        { senderId, messageId, message, timeSended }
                    ]);
                });
            })
            .catch((err) => console.error(err));

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, [token]);

    useEffect(() => {
        const chatDiv = document.querySelector("#chatDiv");
        if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight;
    }, [messages]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages([])
    }, [selectedFriend])

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading text-[#F8FAFC] mb-2">
                        Messages
                    </h1>
                    <p className="text-[#94A3B8] text-sm md:text-base">
                        Chat with your movie friends
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">

                    {/* Left Column: Chat List */}
                    <div className="lg:col-span-1 bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-[#BFBCFC]/15">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search friends..."
                                    className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 pr-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm"
                                />
                            </div>
                            <button className="w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                New Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {myFriends.map((friend) => (
                                <div
                                    key={friend.userId}
                                    className={`cursor-pointer relative w-full p-4 border-b border-[#BFBCFC]/10 hover:bg-[#BFBCFC]/5 transition-all ${selectedFriend === friend.userId ? 'bg-[#BFBCFC]/10' : ''}`}
                                    onClick={() => setSelectedFriend(friend)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Link
                                            to={`/user/${friend.userId}`}
                                            className="relative flex-shrink-0 hover:opacity-80 transition-opacity"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img
                                                className='w-12 h-12 rounded-full flex items-center justify-center'
                                                src={`data:image/png;base64,${friend.profileImageBase64}`}
                                                alt={friend.userId}
                                            />
                                            {friend.isOnline ? (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#151921]" />
                                            ) : (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3b424f] rounded-full border-2 border-[#151921]" />
                                            )}
                                        </Link>

                                        <button
                                            className="cursor-pointer flex-1 min-w-0 text-left"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-[#F8FAFC] font-medium truncate">{friend.userName}</h3>
                                            </div>
                                            <p className="text-[#94A3B8] text-sm truncate"></p>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Chat Window */}
                    <div className="lg:col-span-2 bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl overflow-hidden flex flex-col">
                        {selectedFriend ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-[#BFBCFC]/15 flex items-center justify-between">
                                    <Link
                                        to={`/user/${selectedFriend.friendId}`}
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <div className="relative">
                                            <img
                                                className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center"
                                                src={`data:image/png;base64,${selectedFriend.profileImageBase64}`}
                                                alt={selectedFriend.userId}
                                            />
                                            {selectedFriend.isOnline ? (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#151921]" />
                                            ) : (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3b424f] rounded-full border-2 border-[#151921]" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-[#F8FAFC] font-bold">{selectedFriend.userName}</h2>
                                            <p className="text-[#44FFFF] text-xs">
                                                {selectedFriend.isOnline ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </Link>
                                    <button className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#BFBCFC]/10 transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Messages List */}
                                <div id="chatDiv" className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.messageId}
                                            className={`flex gap-2 items-end ${message.senderId === auth.user.userId ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <Link
                                                to={`/user/${message.senderId == auth.user.userId ? auth.user.userId : selectedFriend.userId}`}
                                                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                                            >
                                                <img
                                                    className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center"
                                                    src={message.senderId == auth.user.userId ? auth.user.profilePicture : `data:image/png;base64,${selectedFriend.profileImageBase64}`}
                                                    alt={message.senderId == auth.user.userId ? auth.user.username : selectedFriend.userName}
                                                />
                                            </Link>

                                            <div
                                                className={`max-w-[70%] ${message.senderId == auth.user.userId
                                                    ? 'bg-[#BFBCFC] text-[#0B0E14]'
                                                    : 'bg-[#0B0E14] text-[#F8FAFC]'
                                                    } rounded-2xl px-4 py-2`}
                                            >
                                                {message.movieReference && (
                                                    <Link
                                                        to={`/movie/${message.movieReference.id}`}
                                                        className="flex items-center gap-3 mb-2 p-2 bg-black/20 rounded-xl hover:bg-black/30 transition-all"
                                                    >
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w92${message.movieReference.poster}`}
                                                            alt={message.movieReference.title}
                                                            className="w-12 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <Film className="w-4 h-4" />
                                                                <span className="font-medium text-sm">
                                                                    {message.movieReference.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}
                                                <p className="text-sm">{message.message}</p>
                                                <p className={`text-xs mt-1 text-[#94A3B8]`}>{message.timeSended}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input Form */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#BFBCFC]/15">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] p-3 rounded-xl transition-all"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            /* No Chat Selected State */
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className="w-24 h-24 text-[#BFBCFC]/20 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">Select a chat</h3>
                                    <p className="text-[#94A3B8]">Choose a friend to chat with</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
