import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Heart,
  Star,
  List,
  Calendar,
  Eye,
  Film,
  X,
  Search,
  Plus,
  Loader2,
  MapPin,
  MessageCircle,
  UserPlus,
  RotateCw,
  AlignLeft,
  Shield,
  Pencil,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSignalR } from "../context/SignalRContext";
import { ProfilePosterCard } from "../components/ProfilePosterCard";
import { BadgeChip } from "../components/BadgesSection";
import { FavouriteSearchModal } from "../components/profile/FavouriteSearchModal";
import { FriendsSection } from "../components/profile/FriendsSection";
import { ActivityPosterItem } from "../components/profile/ActivityPosterItem";
import { ReviewCard } from "../components/profile/ReviewCard";
import { useOwnProfileData } from "../hooks/useOwnProfileData";
import { usePublicProfileData } from "../hooks/usePublicProfileData";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==";

function BioText({ bio }) {
  const [expanded, setExpanded] = useState(false);
  if (!bio) return null;
  const isLong = bio.length > 160;

  return (
    <div className="mb-2 max-w-sm">
      <p className={`text-[#94A3B8] text-sm leading-relaxed break-words ${!expanded ? "line-clamp-3" : ""}`}>
        {bio}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[#BFBCFC] text-xs font-medium hover:text-[#AFA9FF] transition-colors mt-0.5"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function RecentListCard({ list, to }) {
  const posters = (list.previewPosters ?? []).filter(Boolean).slice(0, 6);

  return (
    <Link to={to} className="group inline-block px-1 py-1 rounded-lg hover:bg-[#44FFFF]/6 transition-all">
      <div className="flex items-center h-32">
        {posters.length > 0 ? (
          posters.map((poster, i) => (
            <div
              key={i}
              className={`w-24 h-32 rounded-md overflow-hidden border-2 border-[#151921] shadow-lg shadow-black/40 ${i > 0 ? "-ml-12" : ""}`}
              style={{ zIndex: i + 1 }}
            >
              <img src={poster} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))
        ) : (
          <div className="w-24 h-32 rounded-md bg-[#0B0E14]" />
        )}
      </div>
      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <span className="text-[#94A3B8] text-sm group-hover:text-[#F8FAFC] transition-colors truncate">{list.listName}</span>
        <span className="text-[#94A3B8]/40 text-xs ml-2 flex-shrink-0">
          {list.movieCount} {list.movieCount === 1 ? "film" : "films"}
        </span>
      </div>
    </Link>
  );
}

export function UserProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  if (!id || id === user?.id) return <OwnProfileView />;
  return <PublicProfileView id={id} />;
}

// ── OWN PROFILE ──────────────────────────────────────────────────────────────

function OwnProfileView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    favoriteMovies, favoritesLoading,
    watchedMoviesCount, watchedThisYear, listsCount, recentLists,
    recentActivity, activityLoading,
    recentReviews, recentReviewsLoading,
    friends, badges, selectedBadges, isAdmin,
    addFavorite, removeFavorite, swapFavorites,
  } = useOwnProfileData();

  const [targetSlot, setTargetSlot] = useState(0);
  const [draggedSlot, setDraggedSlot] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  const transparentImgRef = useRef(null);
  const dragInfoRef = useRef({ width: 0, height: 0, offsetX: 0, offsetY: 0 });
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");

  useEffect(() => {
    if (draggedSlot === null) return;
    const handleDragOver = (e) => setDragPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("dragover", handleDragOver);
    return () => window.removeEventListener("dragover", handleDragOver);
  }, [draggedSlot]);

  useEffect(() => {
    if (!searchModalOpen) return;
    const q = searchQuery.trim();
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/search?query=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchModalOpen]);

  const openSearch = (slotIndex) => {
    setTargetSlot(slotIndex);
    setSearchQuery("");
    setSearchResults([]);
    setDuplicateError("");
    setSearchModalOpen(true);
  };

  const handleAddFavourite = async (movie) => {
    const firstEmpty = favoriteMovies.findIndex((m) => m === null);
    const slot = firstEmpty !== -1 ? firstEmpty : targetSlot;
    const result = await addFavorite(movie, slot);
    if (result.error) { setDuplicateError(result.error); return; }
    setSearchModalOpen(false);
    setDuplicateError("");
  };

  const displayBadges = selectedBadges ?? [];

  const displayName = user?.username || user?.email || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Profile Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative flex-shrink-0">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={displayName} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#BFBCFC]/30 shadow-lg" />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
                  <span className="text-[#0B0E14] font-bold text-3xl md:text-5xl">{avatarLetter}</span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#44FFFF] rounded-full border-4 border-[#151921]" />
            </div>

            <div className="flex-1 min-w-0 md:self-start">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC] leading-none">{displayName}</h1>
                {isAdmin && (
                                <span
                                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 text-red-300 border border-red-500/60"
                                    style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.25) 0%, rgba(239,68,68,0.15) 100%)', boxShadow: '0 0 10px rgba(239,68,68,0.5), 0 0 20px rgba(239,68,68,0.25), inset 0 0 8px rgba(239,68,68,0.1)' }}
                                >
                                    <Shield className="w-3 h-3 text-red-400" />Admin
                                </span>
                            )}
                {displayBadges.map(b => <BadgeChip key={b.id} badge={b} />)}
                <Link to="/profile" className="hidden md:flex ml-4 items-center gap-1.5 px-4 py-2 rounded-md bg-[#BFBCFC]/10 hover:bg-[#BFBCFC]/20 border border-[#BFBCFC]/20 hover:border-[#BFBCFC]/45 text-[#BFBCFC] text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap">
                  <Pencil className="w-3 h-3" />
                  Edit Profile
                </Link>
              </div>
              <BioText bio={user?.bio} />
              {user?.location && (
                <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#BFBCFC]/50" />
                  <span className="uppercase tracking-wide">{user.location}</span>
                </div>
              )}
              <Link to="/profile" className="md:hidden flex items-center justify-center gap-1.5 px-4 py-2 mt-3 rounded-md bg-[#BFBCFC]/10 hover:bg-[#BFBCFC]/20 border border-[#BFBCFC]/20 hover:border-[#BFBCFC]/45 text-[#BFBCFC] text-[10px] font-bold uppercase tracking-widest transition-all duration-200 w-fit">
                <Pencil className="w-3 h-3" />
                Edit Profile
              </Link>
            </div>

            <div className="flex items-center">
              {[
                { label: "FILMS", value: watchedMoviesCount, onClick: () => navigate("/watched") },
                { label: "THIS YEAR", value: watchedThisYear, onClick: () => navigate("/diary") },
                { label: "LISTS", value: listsCount, onClick: () => navigate("/my-lists") },
                { label: "FRIENDS", value: friends.length, onClick: () => navigate("/friends") },
              ].map(({ label, value, onClick }, i, arr) => (
                <div key={label} className="flex items-center">
                  <div onClick={onClick} className={`px-5 text-center ${onClick ? "cursor-pointer group" : ""}`}>
                    <p className={`text-2xl md:text-3xl font-bold font-data mb-0.5 transition-colors duration-200 ${onClick ? "text-[#F8FAFC] group-hover:text-[#44FFFF]" : "text-[#F8FAFC]"}`}>{value}</p>
                    <p className="text-[#94A3B8] text-xs uppercase tracking-widest">{label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-10 bg-[#BFBCFC]/15" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 space-y-8">

            {/* Favourite Films */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-4 flex items-center gap-2">
                Favourite Films
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[0, 1, 2, 3].map((i) => {
                  const movie = favoritesLoading ? undefined : favoriteMovies[i];
                  const isDragging = draggedSlot === i;
                  const isDragOver = dragOverSlot === i;
                  const dropProps = {
                    onDragOver: (e) => { e.preventDefault(); setDragOverSlot(i); },
                    onDragLeave: () => setDragOverSlot(null),
                    onDrop: (e) => {
                      e.preventDefault();
                      setDragOverSlot(null);
                      if (draggedSlot === null || draggedSlot === i) return;
                      swapFavorites(draggedSlot, i);
                      setDraggedSlot(null);
                    },
                  };
                  return movie ? (
                    <div key={`slot-${i}`}
                      className={`relative group transition-all duration-150 ${isDragging ? "opacity-0" : ""} ${isDragOver && draggedSlot !== i ? "ring-2 ring-[#FF61D2]/60 rounded-xl scale-[1.02]" : ""}`}
                      draggable
                      onDragStart={(e) => {
                        setDraggedSlot(i);
                        const rect = e.currentTarget.getBoundingClientRect();
                        dragInfoRef.current = {
                          width: rect.width,
                          height: rect.height,
                          offsetX: e.clientX - rect.left,
                          offsetY: e.clientY - rect.top,
                        };
                        setDragPos({ x: e.clientX, y: e.clientY });
                        if (transparentImgRef.current) e.dataTransfer.setDragImage(transparentImgRef.current, 0, 0);
                      }}
                      onDragEnd={() => { setDraggedSlot(null); setDragOverSlot(null); setDragPos(null); }}
                      {...dropProps}
                    >
                      <ProfilePosterCard movieId={movie.id} poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} title={movie.title} />
                      <button onClick={(e) => { e.stopPropagation(); removeFavorite(i); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm z-10">
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ) : favoritesLoading ? (
                    <div key={`skel-${i}`} className="w-full aspect-[2/3] rounded-lg bg-[#151921] animate-pulse" />
                  ) : (
                    <div key={`empty-${i}`}
                      className={`relative group w-full aspect-[2/3] rounded-lg border border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 ${isDragOver ? "border-[#FF61D2]/60 bg-[#FF61D2]/8 scale-[1.02]" : "border-[#BFBCFC]/20 hover:border-[#FF61D2]/50 hover:bg-[#FF61D2]/5"}`}
                      {...dropProps}
                    >
                      <button onClick={(e) => { e.stopPropagation(); openSearch(i); }} className="flex flex-col items-center justify-center gap-2 w-full h-full">
                        <div className="w-10 h-10 rounded-full border border-dashed border-[#BFBCFC]/25 group-hover:border-[#FF61D2]/60 flex items-center justify-center transition-all duration-300 group-hover:bg-[#FF61D2]/10">
                          <Plus className="w-4 h-4 text-[#94A3B8] group-hover:text-[#FF61D2] transition-all duration-300 group-hover:rotate-90" />
                        </div>
                        <span className="text-[#94A3B8] text-xs group-hover:text-[#FF61D2] transition-colors duration-200">Add</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <img
                ref={transparentImgRef}
                src={TRANSPARENT_PIXEL}
                alt=""
                style={{ position: "fixed", top: -1, left: -1, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
              />

              {draggedSlot !== null && dragPos && favoriteMovies[draggedSlot] && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: dragInfoRef.current.width,
                      height: dragInfoRef.current.height,
                      transform: `translate(${dragPos.x - dragInfoRef.current.offsetX}px, ${dragPos.y - dragInfoRef.current.offsetY}px)`,
                    }}
                    className="rounded-lg overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-[#BFBCFC]"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${favoriteMovies[draggedSlot].poster_path}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                  Recent Activity
                </h2>
                <Link to="/diary" className="text-xs text-[#94A3B8] hover:text-[#44FFFF] transition-colors font-medium uppercase tracking-widest">All</Link>
              </div>
              {activityLoading ? (
                <div className="grid grid-cols-4 gap-3">
                  {[0,1,2,3].map((i) => <div key={i} className="aspect-[2/3] rounded-lg bg-[#151921] animate-pulse" />)}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-[#94A3B8] text-sm">No recent activity found.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {recentActivity.slice(0, 4).map((activity, idx) => (
                    <ActivityPosterItem key={idx} activity={activity} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            {(recentReviewsLoading || recentReviews.length > 0) && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    Recent Reviews
                  </h2>
                  <Link to="/reviews" className="text-xs text-[#94A3B8] hover:text-[#FF61D2] transition-colors font-medium uppercase tracking-widest">All</Link>
                </div>
                {recentReviewsLoading ? (
                  <div className="space-y-6">
                    {[0, 1].map((i) => (
                      <div key={i} className="flex gap-5">
                        <div className="w-28 aspect-[2/3] rounded-lg bg-[#151921] animate-pulse flex-none" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-5 bg-[#151921] animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-1/3" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-full mt-4" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-5/6" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-4/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {recentReviews.map((review, idx) => (
                      <ReviewCard key={review.logId} review={review} index={idx} total={recentReviews.length} showInteractions />
                    ))}
                  </div>
                )}
              </div>
            )}

            <FriendsSection friends={friends} linkTo="/friends" />
          </div>

          {/* Sidebar */}
          <div className="space-y-8 pt-8">
            <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#BFBCFC]/8 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFBCFC]">Quick links</span>
              </div>
              <div className="p-2">
                {[
                  { to: "/watchlist", icon: <Bookmark className="w-3.5 h-3.5" />, label: "Watchlist", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                  { to: "/diary", icon: <BookOpen className="w-3.5 h-3.5" />, label: "Diary", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                  { to: "/analytics", icon: <Star className="w-3.5 h-3.5" />, label: "Movie DNA & Analytics", color: "group-hover:text-[#44FFFF]", bg: "group-hover:bg-[#44FFFF]/8" },
                  { to: "/my-lists", icon: <List className="w-3.5 h-3.5" />, label: "My Lists", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                  { to: "/likedmoviespage", icon: <Heart className="w-3.5 h-3.5" />, label: "Liked Films", color: "group-hover:text-[#FF61D2]", bg: "group-hover:bg-[#FF61D2]/8" },
                  { to: "/badges", icon: <Shield className="w-3.5 h-3.5" />, label: "Badges", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                ].map(({ to, icon, label, color, bg }) => (
                  <Link key={to} to={to} className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] transition-all text-sm ${bg}`}>
                    <span className={`transition-colors ${color}`}>{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#151921]/80 border border-[#44FFFF]/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#44FFFF]/8 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#44FFFF]">Recent Lists</span>
                <Link to="/my-lists" className="text-[#44FFFF]/50 text-[10px] hover:text-[#44FFFF] transition-colors uppercase tracking-wider">All →</Link>
              </div>
              <div className="p-2 divide-y divide-white/5">
                {recentLists.length > 0 ? (
                  recentLists.map((list) => (
                    <RecentListCard key={list.listId} list={list} to={`/list/${list.listId}`} />
                  ))
                ) : (
                  <p className="text-[#94A3B8]/40 text-xs italic px-3 py-2.5">No lists yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {searchModalOpen && (
        <FavouriteSearchModal
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          searchLoading={searchLoading}
          duplicateError={duplicateError}
          onAdd={handleAddFavourite}
          onClose={() => setSearchModalOpen(false)}
        />
      )}
    </div>
  );
}

// ── PUBLIC PROFILE ────────────────────────────────────────────────────────────

function PublicProfileView({ id }) {
  const navigate = useNavigate();
  const { isUserOnline } = useSignalR();
  const { user } = useAuth();
  const { publicProfile, publicLoading, publicRecentReviews, publicRecentReviewsLoading, publicFriends, badges, selectedBadges, isAdmin, listsCount, recentLists } = usePublicProfileData(id);

  const displayBadges = selectedBadges ?? [];

  if (publicLoading) {
    return (
      <div className="min-h-screen py-6 md:py-8 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#BFBCFC]/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#BFBCFC] animate-spin" />
        </div>
      </div>
    );
  }
  if (!publicProfile) {
    return (
      <div className="min-h-screen py-6 md:py-8 flex items-center justify-center">
        <p className="text-[#94A3B8]">User not found.</p>
      </div>
    );
  }

  const pub = publicProfile;
  const pubLetter = pub.username?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Profile Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative flex-shrink-0">
              {pub.profilePicture ? (
                <img src={pub.profilePicture} alt={pub.username} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#BFBCFC]/30 shadow-lg" />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
                  <span className="text-[#0B0E14] font-bold text-3xl md:text-5xl">{pubLetter}</span>
                </div>
              )}
              {isUserOnline(pub?.userId ?? user?.id, pub?.isOnline ?? user?.isOnline) && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#44FFFF] rounded-full border-4 border-[#151921]" />
              )}
            </div>

            <div className="flex-1 md:self-start">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC]">{pub.username}</h1>
                {isAdmin && (
                                <span
                                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 text-red-300 border border-red-500/60"
                                    style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.25) 0%, rgba(239,68,68,0.15) 100%)', boxShadow: '0 0 10px rgba(239,68,68,0.5), 0 0 20px rgba(239,68,68,0.25), inset 0 0 8px rgba(239,68,68,0.1)' }}
                                >
                                    <Shield className="w-3 h-3 text-red-400" />Admin
                                </span>
                            )}
                {displayBadges.map(b => <BadgeChip key={b.id} badge={b} />)}
              </div>
              <BioText bio={pub.bio} />
              {pub.location && (
                <div className="flex items-center gap-1.5 text-[#94A3B8] text-sm">
                  <MapPin className="w-4 h-4" />
                  {pub.location}
                </div>
              )}
            </div>

            <div className="flex items-center">
              {[
                { label: "FILMS", value: pub.watchedCount, to: `/user/${id}/watched` },
                { label: "THIS YEAR", value: pub.watchedThisYear ?? 0, to: `/user/${id}/diary` },
                { label: "LISTS", value: listsCount, to: `/user/${id}/lists` },
                { label: "FRIENDS", value: pub.friendCount ?? 0 },
              ].map(({ label, value, to }, i, arr) => (
                <div key={label} className="flex items-center">
                  <div onClick={() => to && navigate(to)} className={`px-5 text-center transition-transform duration-100 ${to ? "cursor-pointer group active:scale-95" : ""}`}>
                    <p className={`text-2xl md:text-3xl font-bold font-data mb-0.5 transition-colors duration-200 ${to ? "text-[#F8FAFC] group-hover:text-[#44FFFF]" : "text-[#F8FAFC]"}`}>{value}</p>
                    <p className="text-[#94A3B8] text-xs uppercase tracking-widest">{label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-10 bg-[#BFBCFC]/15" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 space-y-8">

            {/* Favourite Films */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-4 flex items-center gap-2">
                Favourite Films
              </h2>
              {(pub.favorites ?? []).filter(Boolean).length === 0 ? (
                <p className="text-[#94A3B8] text-sm">This user hasn't added any favourite films yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {(pub.favorites ?? []).filter(Boolean).map((movie) => (
                    <ProfilePosterCard
                      key={movie.id}
                      movieId={movie.id}
                      poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      title={movie.title}
                      to={movie.latestLogId ? `/log/${movie.latestLogId}` : `/movie/${movie.id}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                  Recent Activity
                </h2>
                <Link to={`/user/${id}/diary`} className="text-xs text-[#94A3B8] hover:text-[#44FFFF] transition-colors font-medium uppercase tracking-widest">All</Link>
              </div>
              {pub.recentActivity.length === 0 ? (
                <p className="text-[#94A3B8] text-sm">No recent activity.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {pub.recentActivity.slice(0, 4).map((activity, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <ProfilePosterCard movieId={activity.id} poster={activity.poster} title={activity.movieTitle} to={`/log/${activity.logId}`} />
                      <Link to={`/log/${activity.logId}`} className="flex items-center gap-1 px-0.5 flex-wrap">
                        {activity.userRating > 0 && (
                          <div className="grid grid-cols-5 gap-[2px]">
                            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                              <Star key={n} className={`w-2 h-2 ${n <= activity.userRating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/20"}`} />
                            ))}
                          </div>
                        )}
                        {activity.isLiked && <Heart className="w-3 h-3 text-[#FF61D2] fill-[#FF61D2]" />}
                        {activity.hasReview && <AlignLeft className="w-3 h-3 text-[#94A3B8]" />}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            {(publicRecentReviewsLoading || publicRecentReviews.length > 0) && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    Recent Reviews
                  </h2>
                  <Link to={`/user/${id}/reviews`} className="text-xs text-[#94A3B8] hover:text-[#FF61D2] transition-colors font-medium uppercase tracking-widest">All</Link>
                </div>
                {publicRecentReviewsLoading ? (
                  <div className="space-y-6">
                    {[0, 1].map((i) => (
                      <div key={i} className="flex gap-5">
                        <div className="w-28 aspect-[2/3] rounded-lg bg-[#151921] animate-pulse flex-none" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-5 bg-[#151921] animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-1/3" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-full mt-4" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-5/6" />
                          <div className="h-3 bg-[#151921] animate-pulse rounded w-4/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {publicRecentReviews.map((review, idx) => (
                      <ReviewCard key={review.logId} review={review} index={idx} total={publicRecentReviews.length} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <FriendsSection friends={publicFriends} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8 pt-8">
            <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#BFBCFC]/8 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFBCFC]">Quick links</span>
              </div>
              <div className="p-2">
                {[
                  { to: `/user/${id}/watchlist`, icon: <Bookmark className="w-3.5 h-3.5" />, label: "Watchlist", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                  { to: `/user/${id}/diary`, icon: <BookOpen className="w-3.5 h-3.5" />, label: "Diary", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                  { to: `/user/${id}/analytics`, icon: <Star className="w-3.5 h-3.5" />, label: "Movie DNA & Analytics", color: "group-hover:text-[#44FFFF]", bg: "group-hover:bg-[#44FFFF]/8" },
                  { to: `/user/${id}/lists`, icon: <List className="w-3.5 h-3.5" />, label: "Lists", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                  { to: `/user/${id}/liked`, icon: <Heart className="w-3.5 h-3.5" />, label: "Liked Films", color: "group-hover:text-[#FF61D2]", bg: "group-hover:bg-[#FF61D2]/8" },
                  { to: `/user/${id}/badges`, icon: <Shield className="w-3.5 h-3.5" />, label: "Badges", color: "group-hover:text-[#BFBCFC]", bg: "group-hover:bg-[#BFBCFC]/8" },
                ].map(({ to, icon, label, color, bg }) => (
                  <Link key={to} to={to} className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] transition-all text-sm ${bg}`}>
                    <span className={`transition-colors ${color}`}>{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#151921]/80 border border-[#44FFFF]/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#44FFFF]/8 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#44FFFF]">Recent Lists</span>
                <Link to={`/user/${id}/lists`} className="text-[#44FFFF]/50 text-[10px] hover:text-[#44FFFF] transition-colors uppercase tracking-wider">All →</Link>
              </div>
              {recentLists.length > 0 ? (
                <div className="p-2 divide-y divide-white/5">
                  {recentLists.map((list) => (
                    <RecentListCard key={list.listId} list={list} to={`/user/${id}/list/${list.listId}`} />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3">
                  <p className="text-[#94A3B8]/40 text-xs italic">No lists yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
