import { useEffect, useState, useMemo, useCallback, use } from 'react';
import { MessageCircle, Send, Search, UserPlus, MoreVertical, Film, Check, CheckCheck, EllipsisVertical, Pencil, Trash } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from "../context/AuthContext";
import * as signalR from "@microsoft/signalr";

export function MessagesPage() {
    const [selectedFriend, setSelectedFriend] = useState('');
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const auth = useAuth();
    const [myFriends, setMyFriends] = useState([]);
    const [filterMyFriends, setFilterMyFriends] = useState([]);
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!messageText.trim() || messageText.length > 4000)
            return;
        try {
            await connection.invoke(
                "SendMessagePrivate",
                selectedFriend.userId,
                `0.${messageText}`
            );
        } catch (err) {
            console.error(err);
        } finally {
            setMessageText('');
        }
    });

    const handleLiveIsRead = useCallback(async (senderId, messageId) => {
        try {
            await connection.invoke(
                "LiveIsRead",
                senderId,
                messageId
            );
        } catch (err) {
            console.error(err);
        } finally {
            setMessageText('');
        }
    });

    const handleDeleteMessage = useCallback(async (messageId) => {
        try {
            await connection.invoke(
                "DeleteMessage",
                messageId
            );
        } catch (err) {
            console.error(err);
        } finally {
            setMessageText('');
        }
    });

    const getCorrectImgMessage = useCallback((senderId) => {
        if (senderId == auth.user.userId && auth.user.profilePicture) {
            return <img
                className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center"
                src={auth.user.profilePicture}
                alt={auth.user.userName}
            />
        } else if (senderId == selectedFriend.userId && selectedFriend.profileImageBase64) {
            return <img
                className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center"
                src={`data:image/png;base64,${selectedFriend.profileImageBase64}`}
                alt={selectedFriend.userName}
            />
        } else {
            return <div className="w-12 h-12 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
                <span className="text-[#0B0E14] font-bold text-xl">{senderId == auth.user.userId ? auth.user.username[0] : selectedFriend.userName[0]}</span>
            </div>
        }
    });

    const token = useMemo(() => {
        return (
            auth?.token || auth?.user?.token || localStorage.getItem("authToken") ||
            localStorage.getItem("auth_token") || localStorage.getItem("token") ||
            sessionStorage.getItem("authToken") || sessionStorage.getItem("auth_token") ||
            sessionStorage.getItem("token")
        );
    }, [auth]);

    const getMyFriends = useCallback(() => {
        const headers = { 'Authorization': `Bearer ${token}` };
        fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetMyFriends`, { headers })
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                setMyFriends(data);
                setFilterMyFriends(data);
            })
            .catch((err) => console.log(err));

        fetch(`${import.meta.env.VITE_API_BASE_URL}/database/GetLastMessages`, { headers })
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                setLastMessages(data);
            })
            .catch((err) => console.log(err));
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

        if (newConnection.state === signalR.HubConnectionState.Disconnected) {
            newConnection.start()
                .then(() => {
                    console.log("Verbonden met SignalR");

                    newConnection.on("ReceiveIsRead", (senderId) => {
                        setMessages(prev => {
                            return prev.map(message => {
                                return {
                                    ...message,
                                    isRead: true
                                }
                            });
                        });
                    });
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
    }, [token, auth]);

    useEffect(() => {
        if (!selectedFriend) return

        const headers = { 'Authorization': `Bearer ${token}` };
        fetch(`${import.meta.env.VITE_API_BASE_URL}/database/GetMessages?friendId=${selectedFriend.userId}`, { headers })
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                setMessages(data);
                if (lastMessages.length != 0) {
                    setLastMessages(prev => {
                        return prev.map(lastmessage => {
                            if (lastmessage.friendId == selectedFriend.userId) {
                                return {
                                    ...lastmessage,
                                    isRead: true,
                                    totalNotReadMessages: 0
                                }
                            }
                            return (lastmessage);
                        })
                    });
                }

                if (data[data.length - 1]?.senderId != auth.user.userId) {
                    handleLiveIsRead(selectedFriend.userId, 0);
                    connection.invoke("GetTotalNotReadMessages", "");
                }
            })
            .catch((err) => console.log(err));
    }, [selectedFriend, token])

    useEffect(() => {
        if (searchQuery == '') {
            setFilterMyFriends(myFriends)
        } else {
            let filterMyFriends = myFriends.filter((friend) => friend.userName.includes(searchQuery));
            setFilterMyFriends(filterMyFriends);
        }
    }, [searchQuery])

    useEffect(() => {
        if (!connection) return
        connection.off("ReceiveMessage");
        connection.off("receiveDeleteMessage");
        connection.on("ReceiveMessage", (senderId, messageId, message, timeSended, isRead, movie) => {
            if (selectedFriend.userId == senderId || auth.user.userId == senderId) {
                setMessages((prev) => [
                    ...prev,
                    { senderId, messageId, message, timeSended, isRead, movie }
                ]);
            }
            
            if (selectedFriend.userId == senderId) {
                console.log("Stuur NU DE LIVE EVENT: IsRead")
                handleLiveIsRead(selectedFriend.userId, messageId);
            } else if (auth.user.userId != senderId) {
                console.log("Het is van de andere vriend")
                setLastMessages(prev => {
                    return prev.map(lastmessage => {
                        if (lastmessage.friendId == senderId) {

                            if (movie != null) message = "Shared a movie";

                            return {
                                ...lastmessage,
                                message: message,
                                isRead: false,
                                totalNotReadMessages: lastmessage.totalNotReadMessages + 1
                            };
                        }
                        return (lastmessage);
                    });
                });
                connection.invoke("GetTotalNotReadMessages", "");
            }
        });

        connection.on("receiveDeleteMessage", (messageId) => {
            setMessages(prev => {
                return prev.filter(message => message.messageId !== messageId)
            })
            const headers = { 'Authorization': `Bearer ${token}` };
            fetch(`${import.meta.env.VITE_API_BASE_URL}/database/GetLastMessages`, { headers })
                .then((r) => r.ok ? r.json() : [])
                .then((data) => {
                    setLastMessages(data);
                    connection.invoke("GetTotalNotReadMessages", "");
                })
                .catch((err) => console.log(err));
        });
    }, [selectedFriend, lastMessages, connection, auth])

    useEffect(() => {
        const chatDiv = document.querySelector("#chatDiv");
        if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight;
    }, [messages]);

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading text-[#F8FAFC] mb-2">
                        Chats
                    </h1>
                    <p className="text-[#94A3B8] text-sm md:text-base">
                        Chat with your friends
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">

                    {/* Left Column: Chat List */}
                    <div className="lg:col-span-1 bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-[#BFBCFC]/15">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search friends..."
                                    className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 pr-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {filterMyFriends.map((friend) => (
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
                                            {friend.profileImageBase64 ? (
                                                <img
                                                    className='w-12 h-12 rounded-full flex items-center justify-center'
                                                    src={`data:image/png;base64,${friend.profileImageBase64}`}
                                                    alt={friend.userId}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
                                                    <span className="text-[#0B0E14] font-bold text-xl">{friend.userName[0]}</span>
                                                </div>
                                            )}
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
                                            <div className='flex row justify-between items-center'>
                                                <p
                                                    className={`text-[#94A3B8] text-sm truncate ${(lastMessages.length != 0 && !lastMessages.find(lm => lm.friendId == friend.userId)?.isRead && lastMessages.find(lm => lm.friendId == friend.userId)?.senderId != auth.user.userId) && "font-black"}`}>
                                                    {lastMessages.length != 0 && (lastMessages.find(lm => lm.friendId == friend.userId)?.message?.length > 30 ?
                                                        lastMessages.find(lm => lm.friendId == friend.userId)?.message?.substring(0, 30) + "..." :
                                                        lastMessages.find(lm => lm.friendId == friend.userId)?.message
                                                    )}
                                                </p>
                                                <div className='flex justify-center bg-[#ff61d2] rounded-full w-[10%]'>{(lastMessages.length != 0
                                                    && lastMessages.find(lm => lm.friendId == friend.userId)?.totalNotReadMessages != 0
                                                    && lastMessages.find(lm => lm.friendId == friend.userId)?.senderId != auth.user.userId)
                                                    && lastMessages.find(lm => lm.friendId == friend.userId)?.totalNotReadMessages}
                                                </div>
                                            </div>
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
                                        to={`/user/${selectedFriend.userId}`}
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <div className="relative">
                                            {selectedFriend.profileImageBase64 ? (
                                                <img
                                                    className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center"
                                                    src={`data:image/png;base64,${selectedFriend.profileImageBase64}`}
                                                    alt={selectedFriend.userId}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
                                                    <span className="text-[#0B0E14] font-bold text-xl">{selectedFriend.userName[0]}</span>
                                                </div>
                                            )}
                                            {selectedFriend.isOnline ? (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#151921]" />
                                            ) : (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3b424f] rounded-full border-2 border-[#151921]" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-[#F8FAFC] font-bold">{selectedFriend.userName}</h2>
                                            <p className={`${selectedFriend.isOnline ? 'text-[#44FFFF]' : 'text-[#3b424f]'} text-xs`}>
                                                {selectedFriend.isOnline ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </Link>
                                </div>

                                {/* Messages List */}
                                <div id="chatDiv" className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.messageId}
                                            className={`relative flex gap-2 items-end ${message.senderId === auth.user.userId ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <Link
                                                to={`/user/${message.senderId == auth.user.userId ? auth.user.userId : selectedFriend.userId}`}
                                                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                                            >
                                                {getCorrectImgMessage(message.senderId)}
                                            </Link>

                                            <div
                                                className={`max-w-[70%] ${message.senderId == auth.user.userId
                                                    ? 'bg-[#BFBCFC] text-[#0B0E14]'
                                                    : 'bg-[#0B0E14] text-[#F8FAFC]'
                                                    } relative rounded-2xl px-4 py-3 break-all`}
                                            >
                                                {message.movie != null && (
                                                    <Link
                                                        to={`/movie/${message.movie.movieId}`}
                                                        className="flex items-center gap-3 mb-2 p-2 bg-black/20 rounded-xl hover:bg-black/30 transition-all"
                                                    >
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w92${message.movie.posterImg}`}
                                                            alt={message.movie.title}
                                                            className="w-12 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <Film className="w-4 h-4" />
                                                                <span className="font-medium text-sm">
                                                                    {message.movie.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}
                                                <p className="text-sm">{message.message}</p>
                                                <p className={`text-xs mt-1 text-[#94A3B8]`}>{message.timeSended}</p>
                                            </div>
                                            {message.senderId == auth.user.userId && (
                                                <div className='flex flex-col justify-between'>
                                                    <span className='absolute top-0 text-[#736afc] cursor-pointer' onClick={() => handleDeleteMessage(message.messageId)}><Trash className='h-4' /></span>
                                                    <span className='text-[#736afc]'>{message.isRead ? <CheckCheck /> : <Check />}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input Form */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#BFBCFC]/15">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={messageText}
                                            maxLength={4000}
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
                                    <p className={`text-xs mt-3 ${messageText.length == 4000 ? "text-[#fa5252]" : "text-[#AFA9FF]"}`}>{messageText ? messageText.length : 0}/4000 karakters</p>
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
