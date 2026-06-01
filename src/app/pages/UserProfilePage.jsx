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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";

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

  const isOwnProfile = !id;
  const { refreshKey } = useRefresh();

  const getToken = () =>
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

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
          .sort((a, b) => new Date(b.watchedDate) - new Date(a.watchedDate));
        setRecentActivity(sorted);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchRecentActivity();
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
      setDuplicateError(`"${movie.title}" staat al in je favorieten.`);
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

  const displayName = user?.username || user?.email || "Gebruiker";
  const avatarLetter = displayName.charAt(0).toUpperCase();

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

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                {displayName}
              </h1>
              <p className="text-[#BFBCFC] text-sm md:text-base mb-3">
                @{user?.username || "gebruiker"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[#94A3B8] text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Lid van TraceMyMovies
                </div>
              </div>
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
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-4 flex items-center gap-2 hover:text-[#FF61D2] transition-colors duration-200">
                <Heart className="w-3.5 h-3.5" fill="currentColor" />
                Favourite Films
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 4 }).map((_, i) => {
                  const movie = favoritesLoading ? undefined : favoriteMovies[i];
                  return movie ? (
                    <div
                      key={movie.id}
                      onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg transition-all duration-300 group-hover:opacity-80 group-hover:scale-[1.02]"
                      />
                      {isOwnProfile && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFavorite(movie.id); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
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
                      <span className="text-[#94A3B8] text-xs group-hover:text-[#FF61D2] transition-colors duration-200">Voeg toe</span>
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
                <p className="text-[#94A3B8] text-sm">Geen recente activiteit gevonden.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {recentActivity
                    .slice(0, 4)
                    .map((activity, idx) => (
                      <Link
                        key={idx}
                        to={`/log/${activity.logId}`}
                        className="block group"
                      >
                        {/* Poster */}
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#0B0E14] border border-white/5 group-hover:border-[#BFBCFC]/30 transition-all duration-200 group-hover:scale-[1.02] mb-2">
                          {activity.poster ? (
                            <img
                              src={activity.poster}
                              alt={activity.movieTitle}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-6 h-6 text-[#94A3B8]/20" />
                            </div>
                          )}
                        </div>

                        {/* Icons row */}
                        <div className="flex items-center gap-1 flex-wrap px-0.5">
                          {/* Stars — 5 boven 5 grid */}
                          {activity.userRating > 0 && (
                            <div className="grid grid-cols-5 gap-0.5">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                <Star
                                  key={n}
                                  className={`w-2.5 h-2.5 ${
                                    n <= activity.userRating
                                      ? "text-[#44FFFF] fill-[#44FFFF]"
                                      : "text-[#94A3B8]/20"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          {activity.isLiked && (
                            <Heart className="w-3 h-3 text-[#FF61D2] fill-[#FF61D2]" />
                          )}
                          {activity.isRewatch && (
                            <RotateCw className="w-3 h-3 text-[#44FFFF]" />
                          )}
                          {activity.hasReview && (
                            <AlignLeft className="w-3 h-3 text-[#94A3B8]" />
                          )}
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Friends */}
            <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-1 pb-3 border-b border-[#BFBCFC]/10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#BFBCFC]">
                  Following
                </h2>
                <span className="text-[#94A3B8] text-sm font-data">4</span>
              </div>
              <div className="flex items-center gap-3 pt-3">
                {[
                  { letter: "A", color: "from-[#BFBCFC] to-[#44FFFF]" },
                  { letter: "J", color: "from-[#FF61D2] to-[#BFBCFC]" },
                  { letter: "M", color: "from-[#44FFFF] to-[#BFBCFC]" },
                  { letter: "S", color: "from-[#44FFFF] to-[#FF61D2]" },
                ].map(({ letter, color }) => (
                  <div
                    key={letter}
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 flex-shrink-0 shadow-md`}
                  >
                    <span className="text-[#0B0E14] font-bold text-sm">{letter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6">
              <h3 className="text-lg font-bold font-heading text-[#F8FAFC] mb-4">
                Snelle links
              </h3>
              <div className="space-y-2">
                <Link
                  to="/analytics"
                  className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-1"
                >
                  <Star className="w-4 h-4" />
                  Movie DNA & Analytics
                </Link>
                <Link
                  to="/my-lists"
                  className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-1"
                >
                  <List className="w-4 h-4" />
                  Mijn Lijsten
                </Link>
                <Link
                  to="/likedmoviespage"
                  className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-1"
                >
                  <Heart className="w-4 h-4" />
                  Gelikte Films
                </Link>
              </div>
            </div>

            {/* Recente Lijsten */}
            <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6">
              <h3 className="text-lg font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-[#44FFFF]" />
                Recente Lijsten
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Top 10 Sci-Fi", count: 10 },
                  { name: "Favoriete Thrillers", count: 7 },
                  { name: "Must Watch 2024", count: 15 },
                ].map((list) => (
                  <div
                    key={list.name}
                    className="flex items-center justify-between p-3 bg-[#0B0E14] rounded-lg border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/25 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#BFBCFC]/10 rounded-md flex items-center justify-center flex-shrink-0">
                        <List className="w-3.5 h-3.5 text-[#BFBCFC]" />
                      </div>
                      <span className="text-[#F8FAFC] text-sm font-medium group-hover:text-[#BFBCFC] transition-colors">
                        {list.name}
                      </span>
                    </div>
                    <span className="text-[#94A3B8] text-xs">{list.count} films</span>
                  </div>
                ))}
              </div>
              <Link
                to="/my-lists"
                className="mt-4 flex items-center gap-1.5 text-[#BFBCFC] text-xs hover:text-[#F8FAFC] transition-colors"
              >
                Bekijk alle lijsten
                <span className="text-xs">→</span>
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
              <h3 className="text-[#F8FAFC] font-bold font-heading">Film zoeken</h3>
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
                  placeholder="Zoek een film..."
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
                  <p className="text-[#94A3B8] text-sm text-center py-6">Geen films gevonden.</p>
                )}
                {!searchLoading && !searchQuery && (
                  <p className="text-[#94A3B8] text-sm text-center py-6">Typ een filmtitel om te zoeken.</p>
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
