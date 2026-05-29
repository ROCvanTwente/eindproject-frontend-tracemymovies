import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from "../context/AuthContext";
import { Check, X as XIcon, UserPlus, UserMinus, Search, Users, Clock, Mail, UserCheck } from "lucide-react";
import { toast } from 'sonner';

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

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#12161D] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h2 className="flex items-center gap-2 font-bold mb-5 text-[#BFBCFC] tracking-wide uppercase text-xs">
                <Mail size={16} /> Incoming
            </h2>
            {friendRequests.length > 0 ? friendRequests.map((r) => (
              <div key={r.userId} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                <span className="font-medium text-sm">{r.userName}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleRespondToRequest(r.userId, 'accept')} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20"><Check size={16}/></button>
                  <button onClick={() => handleRespondToRequest(r.userId, 'decline')} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><XIcon size={16}/></button>
                </div>
              </div>
            )) : <p className="text-sm text-slate-600 italic">No new requests.</p>}
          </div>

          <div className="bg-[#12161D] border border-white/5 rounded-3xl p-6">
            <h2 className="flex items-center gap-2 font-bold mb-5 text-[#BFBCFC] tracking-wide uppercase text-xs">
                <Clock size={16} /> Sended
            </h2>
            {outgoingRequests.length > 0 ? outgoingRequests.map((r) => (
              <div key={r.userId} className="flex justify-between items-center py-2 text-sm text-slate-400">
                <span>{r.userName}</span>
                <button 
                    onClick={() => toast.error('Are you sure?', {
                        description: `Cancel request to ${r.userName}?`,
                        action: { label: 'Cancel', onClick: () => handleCancelRequest(r.userId) },
                    })}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                >
                    <XIcon size={16}/>
                </button>
              </div>
            )) : <p className="text-sm text-slate-600 italic">No pending requests.</p>}
          </div>

          <div className="bg-[#12161D] border border-white/5 rounded-3xl p-6">
            <h2 className="flex items-center gap-2 font-bold mb-5 text-[#BFBCFC] tracking-wide uppercase text-xs">
                <Users size={16} /> My Friends
            </h2>
            <div className="space-y-1">
                {friends.map((f) => (
                <div key={f.userId} className="flex justify-between items-center py-2.5 px-3 hover:bg-white/5 rounded-xl transition-all group">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${f.isOnline ? 'bg-[#44FFFF] shadow-[0_0_8px_#44FFFF]' : 'bg-slate-700'}`} />
                        <span className="font-medium text-sm">{f.userName}</span>
                    </div>
                    <button 
                        onClick={() => toast.error('Remove friend?', {
                            description: `Do you really want to remove ${f.userName} from your friends list?`,
                            action: { label: 'Remove', onClick: () => handleRemoveFriend(f.userId) },
                        })}
                        className="p-2 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                    >
                        <UserMinus size={16}/>
                    </button>
                </div>
                ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
            <Search size={28} className="text-[#44FFFF]"/> Add Friends
          </h1>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-5 pl-14 rounded-2xl bg-[#12161D] border border-white/5 text-white placeholder-slate-600 focus:border-[#44FFFF]/50 outline-none transition-all shadow-2xl"
            />
            <Search className="absolute left-5 top-5.5 text-slate-500 group-focus-within:text-[#44FFFF] transition-colors" size={22} />
          </div>
          
          <ul className="mt-6 space-y-3">
            {searchTerm.length > 0 && suggestions.length === 0 && (
                <li className="p-8 text-slate-500 text-center italic">No user found.</li>
            )}
            {suggestions.map((user) => {
                const status = getRelationshipStatus(user.id);
                return (
                <li key={user.id} className="flex justify-between items-center p-5 bg-[#12161D] rounded-2xl border border-white/5 hover:border-[#44FFFF]/20 transition-all">
                    <span className="font-semibold text-lg">{user.userName}</span>
                    
                    {status === 'friend' && (
                        <span className="flex items-center gap-2 text-green-400 font-bold text-sm"><UserCheck size={18}/> Friends</span>
                    )}
                    {status === 'sended' && (
                        <span className="text-slate-500 font-bold text-sm italic">Sended</span>
                    )}
                    {status === 'incoming' && (
                        <span className="text-yellow-500 font-bold text-sm">Request Pending</span>
                    )}
                    {!status && (
                        <button 
                            onClick={() => handleSendRequest(user.id)} 
                            className="flex items-center gap-2 bg-white/5 hover:bg-[#44FFFF] hover:text-[#0A0C10] text-[#44FFFF] px-6 py-2.5 rounded-xl font-bold transition-all"
                        >
                            <UserPlus size={18} /> Add
                        </button>
                    )}
                </li>
            )})}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FriendPage;