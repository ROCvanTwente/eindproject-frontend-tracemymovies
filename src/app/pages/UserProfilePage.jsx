import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Heart,
  Star,
  List,
  Calendar,
  Eye,
  Clock,
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
  Pencil,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { useSignalR } from "../context/SignalRContext";
import { ProfilePosterCard } from "../components/ProfilePosterCard";

export function UserProfilePage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [likedMoviesCount, setLikedMoviesCount] = useState(0);
  const [watchedMoviesCount, setWatchedMoviesCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");
  const [friends, setFriends] = useState([]);

  const isOwnProfile = !id;
  const { refreshKey } = useRefresh();
  const { isUserOnline } = useSignalR();
  const [publicProfile, setPublicProfile] = useState(null);
  const [publicLoading, setPublicLoading] = useState(!isOwnProfile);

  const getToken = () =>
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  // OTHER USER PROFILE
  useEffect(() => {
    if (isOwnProfile) return;
    const fetchPublicProfile = async () => {
      try {
        setPublicLoading(true);
        const token = getToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        setPublicProfile(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setPublicLoading(false);
      }
    };
    fetchPublicProfile();
  }, [id, isOwnProfile]);

  // FAVORITES
  useEffect(() => {
    if (!isOwnProfile) return;
    const fetchFavorites = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const idsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/Favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!idsRes.ok) return;

        const ids = await idsRes.json();
        const top4 = ids.slice(0, 4);

        const movies = await Promise.all(
          top4.map((movieId) =>
            fetch(
              `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/GetMovieDetails?id=${movieId}`
            ).then((r) => (r.ok ? r.json() : null))
          )
        );
        setFavoriteMovies(movies.filter(Boolean));
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      } finally {
        setFavoritesLoading(false);
      }
    };
    fetchFavorites();
  }, [isOwnProfile, refreshKey]);

  // LIKED MOVIES COUNT
  useEffect(() => {
    if (!isOwnProfile) return;
    const fetchLikedCount = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/GetLikedMoviesCount`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setLikedMoviesCount(data.count ?? 0);
      } catch (error) {
        console.error("Error fetching liked movies count:", error);
      }
    };
    fetchLikedCount();
  }, [isOwnProfile, refreshKey]);

  // WATCHED MOVIES COUNT (unique films)
  useEffect(() => {
    if (!isOwnProfile) return;
    const fetchWatchedCount = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/Activity/WatchedCount`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setWatchedMoviesCount(data.count ?? 0);
      } catch (error) {
        console.error("Error fetching watched count:", error);
      }
    };
    fetchWatchedCount();
  }, [isOwnProfile, refreshKey]);

  // RECENT ACTIVITY
  useEffect(() => {
    if (!isOwnProfile) return;
    const fetchRecentActivity = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/UserActivity/Recent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) return;

        const data = await response.json();
        const sorted = (Array.isArray(data) ? data : [data])
          .sort((a, b) => new Date(b.loggedDate) - new Date(a.loggedDate));
        setRecentActivity(sorted);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchRecentActivity();
  }, [isOwnProfile, refreshKey]);

  // FRIENDS
  useEffect(() => {
    if (!isOwnProfile) return;
    const fetchFriends = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetMyFriends`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        setFriends(await res.json());
      } catch {}
    };
    fetchFriends();
  }, [isOwnProfile, refreshKey]);

  // SEARCH FAVORITES MODAL
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
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchModalOpen]);

  const addFavorite = async (movie) => {
    if (favoriteMovies.length >= 4) return;
    if (favoriteMovies.some((m) => m.id === movie.id)) {
      setDuplicateError(`"${movie.title}" is already in your favourites.`);
      return;
    }
    setDuplicateError("");
    setSearchModalOpen(false);
    setFavoriteMovies((prev) => [...prev, movie]);
    try {
      const token = getToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Favorites/${movie.id}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) setFavoriteMovies((prev) => prev.filter((m) => m.id !== movie.id));
    } catch {
      setFavoriteMovies((prev) => prev.filter((m) => m.id !== movie.id));
    }
  };

  const removeFavorite = async (movieId) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/Favorites/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavoriteMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  const openSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setDuplicateError("");
    setSearchModalOpen(true);
  };

  const displayName = user?.username || user?.email || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // ── OTHER USER'S PROFILE ──
  if (!isOwnProfile) {
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

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">{pub.username}</h1>
                {pub.bio && (
                  <p className="text-[#94A3B8] text-sm mb-2 max-w-sm leading-relaxed">{pub.bio}</p>
                )}
                {pub.location && (
                  <div className="flex items-center gap-1.5 text-[#94A3B8] text-sm">
                    <MapPin className="w-4 h-4" />
                    {pub.location}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center">
                {[
                  { label: "WATCHED", value: pub.watchedCount, to: `/user/${id}/watched` },
                  { label: "LIKED", value: pub.likedCount, to: `/user/${id}/liked` },
                  { label: "LISTS", value: "—" },
                ].map(({ label, value, to }, i, arr) => (
                  <div key={label} className="flex items-center">
                    <div
                      onClick={() => to && navigate(to)}
                      className={`px-5 text-center transition-transform duration-100 ${to ? "cursor-pointer group active:scale-95" : ""}`}
                    >
                      <p className={`text-2xl md:text-3xl font-bold font-data mb-0.5 transition-colors duration-200 ${to ? "text-[#F8FAFC] group-hover:text-[#FF61D2]" : "text-[#F8FAFC]"}`}>{value}</p>
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
                  <Heart className="w-3.5 h-3.5" fill="currentColor" />
                  Favourite Films
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const movie = pub.favorites[i];
                    return movie ? (
                      <ProfilePosterCard
                        key={movie.id}
                        movieId={movie.id}
                        poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        title={movie.title}
                      />
                    ) : (
                      <div key={`empty-${i}`} className="bg-[#151921]/50 border border-dashed border-[#BFBCFC]/10 rounded-xl aspect-[2/3]" />
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#44FFFF]" />
                    Recent Activity
                  </h2>
                  {pub.recentActivity.length > 4 && (
                    <Link to={`/user/${id}/watched`} className="text-xs text-[#94A3B8] hover:text-[#44FFFF] transition-colors font-medium uppercase tracking-widest">
                      All →
                    </Link>
                  )}
                </div>
                {pub.recentActivity.length === 0 ? (
                  <p className="text-[#94A3B8] text-sm">No recent activity.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {pub.recentActivity.slice(0, 4).map((activity, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <ProfilePosterCard
                          movieId={activity.id}
                          poster={activity.poster}
                          title={activity.movieTitle}
                          to={`/log/${activity.logId}`}
                        />
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
            </div>

            {/* Sidebar */}
            <div className="space-y-8 pt-8">

              {/* Quick links */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFBCFC]">Quick links</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#BFBCFC]/30 to-transparent" />
                </div>
                <div className="space-y-0.5">
                  <Link to="/analytics" className="flex items-center gap-2.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-2 group">
                    <Star className="w-3.5 h-3.5 group-hover:text-[#44FFFF] transition-colors" />
                    Movie DNA & Analytics
                  </Link>
                  <Link to={`/user/${id}/watched`} className="flex items-center gap-2.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-2 group">
                    <Eye className="w-3.5 h-3.5 group-hover:text-[#BFBCFC] transition-colors" />
                    Watched Films
                  </Link>
                  <Link to={`/user/${id}/liked`} className="flex items-center gap-2.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-2 group">
                    <Heart className="w-3.5 h-3.5 group-hover:text-[#FF61D2] transition-colors" />
                    Liked Films
                  </Link>
                </div>
              </div>

              {/* Lists — placeholder */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#44FFFF]">Lists</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#44FFFF]/30 to-transparent" />
                </div>
                <p className="text-[#94A3B8]/50 text-xs italic">No lists yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Profile Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative flex-shrink-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={displayName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#BFBCFC]/30 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
                  <span className="text-[#0B0E14] font-bold text-3xl md:text-5xl">
                    {avatarLetter}
                  </span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#44FFFF] rounded-full border-4 border-[#151921]" />
            </div>

            <div className="flex-1 min-w-0">

              {/* Name + Edit button inline */}
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC] leading-none">
                  {displayName}
                </h1>
                <Link
                  to="/profile"
                  className="ml-4 flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#BFBCFC]/10 hover:bg-[#BFBCFC]/20 border border-[#BFBCFC]/20 hover:border-[#BFBCFC]/45 text-[#BFBCFC] text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Profile
                </Link>
              </div>

              {/* Bio */}
              {user?.bio && (
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-2 max-w-sm">
                  {user.bio}
                </p>
              )}

              {/* Location */}
              {user?.location && (
                <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#BFBCFC]/50" />
                  <span className="uppercase tracking-wide">{user.location}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center">
              {[
                { label: "WATCHED", value: watchedMoviesCount, onClick: () => navigate('/watched') },
                { label: "LIKED", value: likedMoviesCount, onClick: () => navigate('/likedmoviespage') },
                { label: "LISTS", value: "—" },
              ].map(({ label, value, onClick }, i, arr) => (
                <div key={label} className="flex items-center">
                  <div
                    onClick={onClick}
                    className={`px-5 text-center ${onClick ? 'cursor-pointer group' : ''}`}
                  >
                    <p className={`text-2xl md:text-3xl font-bold font-data mb-0.5 transition-colors duration-200 ${onClick ? 'text-[#F8FAFC] group-hover:text-[#FF61D2]' : 'text-[#F8FAFC]'}`}>
                      {value}
                    </p>
                    <p className="text-[#94A3B8] text-xs uppercase tracking-widest">
                      {label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px h-10 bg-[#BFBCFC]/15" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 space-y-8">

            {/* Liked Films */}
            <div
              onClick={() => navigate('/likedmoviespage')}
              className="cursor-pointer"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-4 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5" fill="currentColor" />
                Favourite Films
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 4 }).map((_, i) => {
                  const movie = favoritesLoading ? undefined : favoriteMovies[i];
                  return movie ? (
                    <div key={movie.id} className="relative group">
                      <ProfilePosterCard
                        movieId={movie.id}
                        poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        title={movie.title}
                      />
                      {isOwnProfile && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFavorite(movie.id); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm z-10"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      )}
                    </div>
                  ) : favoritesLoading ? (
                    <div key={`skel-${i}`} className="w-full aspect-[2/3] rounded-lg bg-[#151921] animate-pulse" />
                  ) : isOwnProfile ? (
                    <button
                      key={`empty-${i}`}
                      onClick={(e) => { e.stopPropagation(); openSearch(); }}
                      className="group relative w-full aspect-[2/3] rounded-lg border border-dashed border-[#BFBCFC]/20 hover:border-[#FF61D2]/50 hover:bg-[#FF61D2]/5 transition-all duration-300 flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full border border-dashed border-[#BFBCFC]/25 group-hover:border-[#FF61D2]/60 flex items-center justify-center transition-all duration-300 group-hover:bg-[#FF61D2]/10">
                        <Plus className="w-4 h-4 text-[#94A3B8] group-hover:text-[#FF61D2] transition-all duration-300 group-hover:rotate-90" />
                      </div>
                      <span className="text-[#94A3B8] text-xs group-hover:text-[#FF61D2] transition-colors duration-200">Add</span>
                    </button>
                  ) : (
                    <div
                      key={`empty-${i}`}
                      className="bg-[#151921]/50 border border-dashed border-[#BFBCFC]/10 rounded-xl aspect-[2/3]"
                    />
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#44FFFF]" />
                  Recent Activity
                </h2>
                {recentActivity.length > 4 && (
                  <Link
                    to="/activity"
                    className="text-xs text-[#94A3B8] hover:text-[#44FFFF] transition-colors font-medium uppercase tracking-widest"
                  >
                    All →
                  </Link>
                )}
              </div>

              {activityLoading ? (
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[2/3] rounded-lg bg-[#151921] animate-pulse" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-[#94A3B8] text-sm">No recent activity found.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {recentActivity.slice(0, 4).map((activity, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <ProfilePosterCard
                        movieId={activity.id}
                        poster={activity.poster}
                        title={activity.movieTitle}
                        to={`/log/${activity.logId}`}
                        isWatchedProp={true}
                        isLikedProp={activity.isLiked}
                        hasActivityProp={true}
                      />
                      {/* Icons + log link */}
                      <Link to={`/log/${activity.logId}`} className="flex items-center gap-1 flex-wrap px-0.5">
                        {activity.userRating > 0 && (
                          <div className="grid grid-cols-5 gap-0.5">
                            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                              <Star key={n} className={`w-2.5 h-2.5 ${n <= activity.userRating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/20"}`} />
                            ))}
                          </div>
                        )}
                        {activity.isLiked && <Heart className="w-3 h-3 text-[#FF61D2] fill-[#FF61D2]" />}
                        {activity.isRewatch && <RotateCw className="w-3 h-3 text-[#44FFFF]" />}
                        {activity.hasReview && <AlignLeft className="w-3 h-3 text-[#94A3B8]" />}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Friends */}
            {friends.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFBCFC]">Friends</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#BFBCFC]/30 to-transparent" />
                  <span className="text-[#94A3B8]/50 text-xs">{friends.length}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {friends.map((f) => (
                    <Link
                      key={f.userId}
                      to={`/user/${f.userId}`}
                      title={f.userName}
                      className="group relative flex-shrink-0"
                    >
                      {f.profileImageBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${f.profileImageBase64}`}
                          alt={f.userName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#BFBCFC]/20 group-hover:border-[#BFBCFC]/60 transition-all duration-200 group-hover:scale-105 shadow-md"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] flex items-center justify-center border-2 border-transparent group-hover:border-[#BFBCFC]/60 transition-all duration-200 group-hover:scale-105 shadow-md">
                          <span className="text-[#0B0E14] font-bold text-sm">
                            {f.userName?.charAt(0).toUpperCase() ?? "?"}
                          </span>
                        </div>
                      )}
                      {/* Online dot */}
                      {isUserOnline(f.userId, f.isOnline) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#0B0E14]" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8 pt-8">

            {/* Quick links */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFBCFC]">Quick links</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#BFBCFC]/30 to-transparent" />
              </div>
              <div className="space-y-0.5">
                <Link to="/analytics" className="flex items-center gap-2.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-2 group">
                  <Star className="w-3.5 h-3.5 group-hover:text-[#44FFFF] transition-colors" />
                  Movie DNA & Analytics
                </Link>
                <Link to="/my-lists" className="flex items-center gap-2.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-2 group">
                  <List className="w-3.5 h-3.5 group-hover:text-[#BFBCFC] transition-colors" />
                  My Lists
                </Link>
                <Link to="/likedmoviespage" className="flex items-center gap-2.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-2 group">
                  <Heart className="w-3.5 h-3.5 group-hover:text-[#FF61D2] transition-colors" />
                  Liked Films
                </Link>
              </div>
            </div>

            {/* Recent Lists */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#44FFFF]">Recent Lists</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#44FFFF]/30 to-transparent" />
              </div>
              <div className="space-y-1">
                {[
                  { name: "Top 10 Sci-Fi", count: 10 },
                  { name: "Favourite Thrillers", count: 7 },
                  { name: "Must Watch 2024", count: 15 },
                ].map((list) => (
                  <div key={list.name} className="flex items-center justify-between cursor-pointer group py-1.5">
                    <span className="text-[#94A3B8] text-sm group-hover:text-[#F8FAFC] transition-colors">{list.name}</span>
                    <span className="text-[#94A3B8]/40 text-xs tabular-nums">{list.count}</span>
                  </div>
                ))}
              </div>
              <Link to="/my-lists" className="mt-3 inline-flex items-center gap-1 text-[#44FFFF]/50 text-xs hover:text-[#44FFFF] transition-colors">
                View all →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151921] border border-[#BFBCFC]/20 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#BFBCFC]/10">
              <h3 className="text-[#F8FAFC] font-bold font-heading">Search for a film</h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-[#BFBCFC]/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for a film..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#BFBCFC]/15 rounded-lg pl-9 pr-4 py-2.5 text-[#F8FAFC] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#BFBCFC]/40"
                />
              </div>

              {duplicateError && (
                <p className="mt-2 text-xs text-[#FF61D2] bg-[#FF61D2]/10 border border-[#FF61D2]/20 rounded-lg px-3 py-2">
                  {duplicateError}
                </p>
              )}

              <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
                {searchLoading && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-5 h-5 text-[#BFBCFC] animate-spin" />
                  </div>
                )}
                {!searchLoading && searchQuery && searchResults.length === 0 && (
                  <p className="text-[#94A3B8] text-sm text-center py-6">No films found.</p>
                )}
                {!searchLoading && !searchQuery && (
                  <p className="text-[#94A3B8] text-sm text-center py-6">Type a film title to search.</p>
                )}
                {searchResults.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => addFavorite(m)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#BFBCFC]/10 transition-colors text-left"
                  >
                    {m.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                        alt={m.title}
                        className="w-9 h-14 object-cover rounded flex-none"
                      />
                    ) : (
                      <div className="w-9 h-14 bg-[#0B0E14] rounded flex-none flex items-center justify-center">
                        <Film className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[#F8FAFC] text-sm font-medium truncate">{m.title}</p>
                      <p className="text-[#94A3B8] text-xs">{m.release_date?.slice(0, 4)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
