import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from "../context/AuthContext";
import { Check, X as XIcon, UserPlus, UserMinus, Search, Users, Clock, Mail, UserCheck } from "lucide-react";
import { toast } from 'sonner';
 
const AVATAR_GRADIENTS = [
  ['from-[#BFBCFC]', 'to-[#8B5CF6]'],
  ['from-[#44FFFF]', 'to-[#0EA5E9]'],
  ['from-[#FF61D2]', 'to-[#E879Fa9]'],
  ['from-[#FBBF24]', 'to-[#F59E0B]'],
  ['from-[#34D399]', 'to-[#059669]'],
];
 
const Avatar = ({ name, size = "md" }) => {
  const [from, to] = AVATAR_GRADIENTS[(name?.charCodeAt(0) ?? 0) % AVATAR_GRADIENTS.length];
  const cls = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  return (
    <div className={`${cls} bg-gradient-to-br ${from} ${to} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-[#0B0E14] font-bold">{name ? name.charAt(0).toUpperCase() : '?'}</span>
    </div>
  );
};
 
const FriendPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const auth = useAuth();
 
  const token = useMemo(() => {
    return (
      auth?.token || auth?.user?.token || localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") || localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") || sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token")
    );
  }, [auth]);
 
  const getRelationshipStatus = (userId) => {
    if (friends.some(f => f.userId === userId)) return 'friend';
    if (outgoingRequests.some(r => r.userId === userId)) return 'sended';
    if (friendRequests.some(r => r.userId === userId)) return 'incoming';
    return null;
  };
 
  const fetchData = async () => {
    if (!token) return;
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [dashRes, friendRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetFriendDashboard`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetMyFriends`, { headers })
      ]);
      if (dashRes.ok) {
        const data = await dashRes.json();
        setFriendRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      }
      if (friendRes.ok) {
        const friendData = await friendRes.json();
        setFriends(friendData);
      }
    } catch (e) { console.error("Error fetching data:", e); }
  };
 
  useEffect(() => { fetchData(); }, [token]);
 
  const handleRespondToRequest = async (senderId, action) => {
    const endpoint = action === 'accept' ? 'AcceptFriendRequest' : 'DeclineFriendRequest';
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/${endpoint}?senderId=${senderId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success(action === 'accept' ? 'Friend request accepted!' : 'Request declined.');
        fetchData();
      }
    } catch (e) { toast.error("Something went wrong."); }
  };
 
  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/RemoveFriend?friendId=${friendId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Friend removed.');
        fetchData();
      } else {
        toast.error("Could not remove friend.");
      }
    } catch (e) { toast.error("Network error."); }
  };
 
  const handleCancelRequest = async (friendId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/CancelFriendRequest?friendId=${friendId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Request cancelled.');
        fetchData();
      } else {
        toast.error("Could not cancel request.");
      }
    } catch (e) { toast.error("Network error."); }
  };
 
  const handleSendRequest = async (friendId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/SendFriendRequest?friendId=${friendId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        toast.info('Request sent!');
        fetchData();
      }
    } catch (e) { toast.error('Network error.'); }
  };
 
  useEffect(() => {
    if (searchTerm.length < 1) { setSuggestions([]); return; }
    const fetchSuggestions = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/SearchUsers?searchTerm=${searchTerm}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) { console.error('Search error:', error); }
    };
    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, token]);
 
  const onlineFriends = friends.filter(f => f.isOnline);
 
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F8FAFC]">
 
      {/* HERO HEADER */}
      <div className="relative overflow-hidden border-b border-[#BFBCFC]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#BFBCFC]/5 via-transparent to-[#44FFFF]/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[#BFBCFC] text-xs font-bold uppercase tracking-widest mb-2">Social</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Friends</h1>
              <p className="text-[#94A3B8] mt-2 text-sm">Connect and stay updated with your movie community</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-[#151921] border border-[#BFBCFC]/10 rounded-2xl px-5 py-3 text-center min-w-[72px]">
                <p className="text-2xl font-bold text-[#BFBCFC]">{friends.length}</p>
                <p className="text-[#94A3B8] text-xs mt-0.5">Friends</p>
              </div>
              <div className="bg-[#151921] border border-[#BFBCFC]/10 rounded-2xl px-5 py-3 text-center min-w-[72px]">
                <p className="text-2xl font-bold text-[#44FFFF]">{onlineFriends.length}</p>
                <p className="text-[#94A3B8] text-xs mt-0.5">Online</p>
              </div>
              {friendRequests.length > 0 && (
                <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/20 rounded-2xl px-5 py-3 text-center min-w-[72px]">
                  <p className="text-2xl font-bold text-[#FF61D2]">{friendRequests.length}</p>
                  <p className="text-[#94A3B8] text-xs mt-0.5">Requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
 
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
 
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-5">
 
          {/* INCOMING REQUESTS */}
          <div className="bg-[#151921] border border-[#BFBCFC]/10 rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#BFBCFC]/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#FF61D2]/10 rounded-xl flex items-center justify-center">
                  <Mail size={15} className="text-[#FF61D2]" />
                </div>
                <h2 className="font-semibold text-[#F8FAFC]">Incoming</h2>
              </div>
              {friendRequests.length > 0 && (
                <span className="bg-[#FF61D2] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {friendRequests.length}
                </span>
              )}
            </div>
            <div className="p-3 space-y-2">
              {friendRequests.length > 0 ? friendRequests.map((r) => (
                <div key={r.userId} className="flex items-center gap-3 p-3 bg-[#0B0E14]/50 rounded-2xl">
                  <Avatar name={r.userName} size="sm" />
                  <span className="font-medium text-sm flex-1 text-[#F8FAFC] truncate">{r.userName}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleRespondToRequest(r.userId, 'accept')}
                      className="w-8 h-8 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/25 flex items-center justify-center transition-colors"
                      title="Accept"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => handleRespondToRequest(r.userId, 'decline')}
                      className="w-8 h-8 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/25 flex items-center justify-center transition-colors"
                      title="Decline"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 bg-[#FF61D2]/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Mail size={18} className="text-[#94A3B8]/40" />
                  </div>
                  <p className="text-sm text-[#94A3B8]">No new requests</p>
                </div>
              )}
            </div>
          </div>
 
          {/* SENT REQUESTS */}
          <div className="bg-[#151921] border border-[#BFBCFC]/10 rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#BFBCFC]/10 flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#BFBCFC]/10 rounded-xl flex items-center justify-center">
                <Clock size={15} className="text-[#BFBCFC]" />
              </div>
              <h2 className="font-semibold text-[#F8FAFC]">Sent</h2>
            </div>
            <div className="p-3 space-y-2">
              {outgoingRequests.length > 0 ? outgoingRequests.map((r) => (
                <div key={r.userId} className="flex items-center gap-3 p-3 bg-[#0B0E14]/50 rounded-2xl group">
                  <Avatar name={r.userName} size="sm" />
                  <span className="flex-1 text-sm text-[#94A3B8] truncate">{r.userName}</span>
                  <button
                    onClick={() => toast.error('Are you sure?', {
                      description: `Cancel request to ${r.userName}?`,
                      action: { label: 'Cancel', onClick: () => handleCancelRequest(r.userId) },
                    })}
                    className="w-7 h-7 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Cancel request"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 bg-[#BFBCFC]/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Clock size={18} className="text-[#94A3B8]/40" />
                  </div>
                  <p className="text-sm text-[#94A3B8]">No pending requests</p>
                </div>
              )}
            </div>
          </div>
 
          {/* FRIENDS LIST */}
          <div className="bg-[#151921] border border-[#BFBCFC]/10 rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#BFBCFC]/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#44FFFF]/10 rounded-xl flex items-center justify-center">
                  <Users size={15} className="text-[#44FFFF]" />
                </div>
                <h2 className="font-semibold text-[#F8FAFC]">My Friends</h2>
              </div>
              {friends.length > 0 && (
                <span className="text-[#94A3B8] text-xs">{friends.length} total</span>
              )}
            </div>
            <div className="p-3 space-y-1">
              {friends.length > 0 ? friends.map((f) => (
                <div key={f.userId} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl transition-all group">
                  <div className="relative">
                    <Avatar name={f.userName} size="sm" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#151921] ${f.isOnline ? 'bg-[#44FFFF] shadow-[0_0_6px_#44FFFF]' : 'bg-[#94A3B8]/30'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#F8FAFC] truncate">{f.userName}</p>
                    <p className={`text-xs ${f.isOnline ? 'text-[#44FFFF]' : 'text-[#94A3B8]'}`}>
                      {f.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <button
                    onClick={() => toast.error('Remove friend?', {
                      description: `Do you really want to remove ${f.userName} from your friends list?`,
                      action: { label: 'Remove', onClick: () => handleRemoveFriend(f.userId) },
                    })}
                    className="w-7 h-7 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove friend"
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 bg-[#44FFFF]/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users size={18} className="text-[#44FFFF]/40" />
                  </div>
                  <p className="text-sm text-[#94A3B8]">No friends yet</p>
                  <p className="text-xs text-[#94A3B8]/50 mt-1">Search to add people</p>
                </div>
              )}
            </div>
          </div>
        </div>
 
        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
 
          {/* SEARCH */}
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-1">Find People</h2>
            <p className="text-[#94A3B8] text-sm mb-5">Search for users to add them as friends</p>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-14 pr-6 rounded-2xl bg-[#151921] border border-[#BFBCFC]/10 text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#BFBCFC]/40 focus:ring-2 focus:ring-[#BFBCFC]/10 outline-none transition-all text-base"
              />
            </div>
          </div>
 
          {/* SEARCH RESULTS */}
          {searchTerm.length > 0 && (
            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <div className="py-16 text-center bg-[#151921] border border-[#BFBCFC]/10 rounded-3xl">
                  <div className="w-14 h-14 bg-[#BFBCFC]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search size={22} className="text-[#94A3B8]/40" />
                  </div>
                  <p className="text-[#F8FAFC] font-medium">No users found</p>
                  <p className="text-[#94A3B8] text-sm mt-1">Try a different username</p>
                </div>
              ) : suggestions.map((user) => {
                const status = getRelationshipStatus(user.id);
                return (
                  <div key={user.id} className="flex items-center gap-4 p-5 bg-[#151921] border border-[#BFBCFC]/10 rounded-2xl hover:border-[#BFBCFC]/25 transition-all">
                    <Avatar name={user.userName} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#F8FAFC]">{user.userName}</p>
                      {status === 'friend' && <p className="text-green-400 text-xs mt-0.5 flex items-center gap-1"><UserCheck size={11} /> Already friends</p>}
                      {status === 'sended' && <p className="text-[#BFBCFC] text-xs mt-0.5">Request sent</p>}
                      {status === 'incoming' && <p className="text-yellow-400 text-xs mt-0.5">Wants to be your friend</p>}
                    </div>
                    {status === 'friend' && (
                      <span className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold">
                        <UserCheck size={15} /> Friends
                      </span>
                    )}
                    {status === 'sended' && (
                      <span className="bg-[#BFBCFC]/10 text-[#BFBCFC] px-4 py-2 rounded-xl text-sm font-medium">Pending</span>
                    )}
                    {status === 'incoming' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespondToRequest(user.id, 'accept')}
                          className="px-4 py-2 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/25 text-sm font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleRespondToRequest(user.id, 'decline')}
                          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/25 text-sm font-semibold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {!status && (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        className="flex items-center gap-2 bg-[#BFBCFC]/10 hover:bg-[#BFBCFC] hover:text-[#0B0E14] text-[#BFBCFC] px-5 py-2.5 rounded-xl font-semibold transition-all text-sm"
                      >
                        <UserPlus size={16} /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
 
          {/* FRIENDS GRID (shown when not searching) */}
          {searchTerm.length === 0 && friends.length > 0 && (
            <div>
              <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-4">All Friends</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friends.map((f) => (
                  <div key={f.userId} className="flex items-center gap-4 p-4 bg-[#151921] border border-[#BFBCFC]/10 rounded-2xl hover:border-[#BFBCFC]/20 transition-all group">
                    <div className="relative">
                      <Avatar name={f.userName} size="md" />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#151921] ${f.isOnline ? 'bg-[#44FFFF] shadow-[0_0_6px_#44FFFF]' : 'bg-[#94A3B8]/30'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#F8FAFC] truncate">{f.userName}</p>
                      <p className={`text-xs ${f.isOnline ? 'text-[#44FFFF]' : 'text-[#94A3B8]'}`}>
                        {f.isOnline ? '● Online' : '○ Offline'}
                      </p>
                    </div>
                    <button
                      onClick={() => toast.error('Remove friend?', {
                        description: `Do you really want to remove ${f.userName} from your friends list?`,
                        action: { label: 'Remove', onClick: () => handleRemoveFriend(f.userId) },
                      })}
                      className="w-8 h-8 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <UserMinus size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {/* EMPTY STATE (no friends, not searching) */}
          {searchTerm.length === 0 && friends.length === 0 && (
            <div className="py-20 text-center bg-[#151921] border border-[#BFBCFC]/10 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-br from-[#BFBCFC]/10 to-[#44FFFF]/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <Users size={32} className="text-[#BFBCFC]/50" />
              </div>
              <h3 className="text-[#F8FAFC] font-bold text-lg">No friends yet</h3>
              <p className="text-[#94A3B8] text-sm mt-2 max-w-xs mx-auto">
                Search for users above to start building your movie community
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default FriendPage;
 