import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useSignalR } from "../context/SignalRContext";
import { Users, Eye, Heart, List, ChevronDown } from "lucide-react";
import { ReviewPagination } from "../components/review/ReviewPagination";

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: "online", label: "Online first" },
  { value: "name", label: "Name (A-Z)" },
  { value: "recent", label: "Recently added" },
  { value: "watched", label: "Most watched" },
  { value: "liked", label: "Most liked" },
  { value: "lists", label: "Most lists" },
  { value: "friends", label: "Most friends" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap bg-[#BFBCFC]/15 border-[#BFBCFC]/40 text-[#BFBCFC]"
      >
        {current.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-[#1A2030] border border-[#BFBCFC]/20 rounded-xl shadow-2xl shadow-black/50 min-w-[180px] max-w-[calc(100vw-2rem)] overflow-hidden">
          <div className="max-h-80 overflow-y-auto py-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#BFBCFC]/25 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#BFBCFC]/50">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === opt.value
                    ? "text-[#BFBCFC] bg-[#BFBCFC]/12 font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const AVATAR_GRADIENTS = [
  ['from-[#BFBCFC]', 'to-[#8B5CF6]'],
  ['from-[#44FFFF]', 'to-[#0EA5E9]'],
  ['from-[#FF61D2]', 'to-[#E879F9]'],
  ['from-[#FBBF24]', 'to-[#F59E0B]'],
  ['from-[#34D399]', 'to-[#059669]'],
];

const Avatar = ({ name, src, size = "md" }) => {
  const [from, to] = AVATAR_GRADIENTS[(name?.charCodeAt(0) ?? 0) % AVATAR_GRADIENTS.length];
  const cls = size === "xl" ? "w-32 h-32 text-5xl" : "w-10 h-10 text-sm";
  const imgSrc = src
    ? (src.startsWith('data:') || src.startsWith('http') ? src : `data:image/jpeg;base64,${src}`)
    : null;
  if (imgSrc) {
    return (
      <div className={`${cls} rounded-full overflow-hidden flex-shrink-0`}>
        <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${cls} bg-gradient-to-br ${from} ${to} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-[#0B0E14] font-bold">{name ? name.charAt(0).toUpperCase() : '?'}</span>
    </div>
  );
};

const AllFriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("online");
  const auth = useAuth();
  const navigate = useNavigate();
  const { isUserOnline } = useSignalR();

  const token = useMemo(() => {
    return (
      auth?.token || auth?.user?.token || localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") || localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") || sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token")
    );
  }, [auth]);

  const sortedFriends = useMemo(() => {
    const arr = [...friends];
    switch (sortBy) {
      case "name":
        return arr.sort((a, b) => (a.userName || "").localeCompare(b.userName || ""));
      case "watched":
        return arr.sort((a, b) => (b.watchedCount ?? 0) - (a.watchedCount ?? 0));
      case "liked":
        return arr.sort((a, b) => (b.likedCount ?? 0) - (a.likedCount ?? 0));
      case "lists":
        return arr.sort((a, b) => (b.listsCount ?? 0) - (a.listsCount ?? 0));
      case "friends":
        return arr.sort((a, b) => (b.friendCount ?? 0) - (a.friendCount ?? 0));
      case "recent":
        return arr.sort((a, b) => {
          const aTime = a.friendsSince ? new Date(a.friendsSince).getTime() : 0;
          const bTime = b.friendsSince ? new Date(b.friendsSince).getTime() : 0;
          return bTime - aTime;
        });
      case "online":
      default:
        return arr.sort((a, b) => {
          const aOnline = isUserOnline(a.userId, a.isOnline) ? 1 : 0;
          const bOnline = isUserOnline(b.userId, b.isOnline) ? 1 : 0;
          return bOnline - aOnline;
        });
    }
  }, [friends, sortBy, isUserOnline]);

  useEffect(() => {
    if (!token) return;
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetMyFriendsWithStats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) { setFriends(await res.json()); setPage(0); }
      } catch (e) {
        console.error("Error fetching friends:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#BFBCFC]/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-[#BFBCFC] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#BFBCFC] animate-spin" />
          </div>
          <p className="text-[#94A3B8] text-sm">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">

      {/* ── CINEMATIC HEADER ── */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#BFBCFC]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#44FFFF]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        <div className="relative container mx-auto px-4 max-w-7xl py-6 md:py-8">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex-1 ml-5">
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">
                <span className="bg-gradient-to-r from-[#BFBCFC] via-[#cc7be0] to-[#44FFFF] bg-clip-text text-transparent ">
                  Friends
                </span>
              </h1>
            </div>

            {friends.length > 0 && (
              <div className="bg-[#BFBCFC]/12 border border-[#BFBCFC]/25 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#BFBCFC] leading-none tabular-nums">
                  {friends.length}
                </p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  {friends.length === 1 ? "friend" : "friends"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 max-w-7xl py-8 md:py-10">
        {friends.length === 0 ? (
          <EmptyState />
        ) : (
          <>
          <div className="flex justify-end mb-5">
            <SortDropdown value={sortBy} onChange={(v) => { setSortBy(v); setPage(0); }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
            {sortedFriends.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((f) => (
              <div
                key={f.userId}
                onClick={() => navigate(`/user/${f.userId}`)}
                className="flex flex-col items-center gap-3 p-3 hover:opacity-80 transition-opacity cursor-pointer text-center"
              >
                <div className="relative">
                  <Avatar name={f.userName} src={f.profileImageBase64} size="xl" />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#151921] ${isUserOnline(f.userId, f.isOnline) ? 'bg-[#44FFFF] shadow-[0_0_6px_#44FFFF]' : 'bg-[#94A3B8]/30'}`} />
                </div>

                <p className="font-semibold text-lg text-[#F8FAFC] truncate w-full">{f.userName}</p>

                <div className="flex items-center gap-1.5 text-[#94A3B8] text-base">
                  <Users size={18} className="text-[#BFBCFC]" />
                  <span>{f.friendCount ?? 0} {f.friendCount === 1 ? "friend" : "friends"}</span>
                </div>

                <div className="flex items-center justify-center gap-5 w-full pt-4 border-t border-white/5">
                  <div
                    onClick={(e) => { e.stopPropagation(); navigate(`/user/${f.userId}/watched`); }}
                    className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                    title="Films watched"
                  >
                    <Eye size={26} className="text-[#44FFFF]" />
                    <span className="text-base font-bold text-[#F8FAFC]">{f.watchedCount ?? 0}</span>
                  </div>
                  <div
                    onClick={(e) => { e.stopPropagation(); navigate(`/user/${f.userId}/liked`); }}
                    className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                    title="Films liked"
                  >
                    <Heart size={26} className="text-[#FF61D2]" />
                    <span className="text-base font-bold text-[#F8FAFC]">{f.likedCount ?? 0}</span>
                  </div>
                  <div
                    onClick={(e) => { e.stopPropagation(); navigate(`/user/${f.userId}/lists`); }}
                    className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                    title="Lists"
                  >
                    <List size={26} className="text-[#BFBCFC]" />
                    <span className="text-base font-bold text-[#F8FAFC]">{f.listsCount ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ReviewPagination
            currentPage={page + 1}
            totalPages={Math.max(1, Math.ceil(friends.length / PAGE_SIZE))}
            onPageChange={(p) => setPage(p - 1)}
          />
          </>
        )}
      </div>
    </div>
  );
};

/* ── EMPTY STATE ── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-[#BFBCFC]/12 to-[#44FFFF]/6 rounded-full flex items-center justify-center border border-[#BFBCFC]/15">
        <Users className="w-16 h-16 text-[#BFBCFC]/30" />
      </div>
      <div className="absolute inset-0 rounded-full bg-[#BFBCFC]/6 blur-2xl -z-10" />
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] mb-3">
      No friends yet
    </h2>
    <p className="text-[#94A3B8] text-sm md:text-base max-w-xs mb-2 leading-relaxed">
      Search for users on the Friends page to start building your movie community.
    </p>
  </div>
);

export default AllFriendsPage;
