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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function UserProfilePage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");

  const isOwnProfile = !id;

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
      }
    };
    fetchFavorites();
  }, [isOwnProfile]);

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
        setRecentActivity(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };
    fetchRecentActivity();
  }, [isOwnProfile]);

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
        <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative">
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

            {isOwnProfile && (
              <Link
                to="/profile"
                className="bg-[#BFBCFC]/10 hover:bg-[#BFBCFC]/20 text-[#BFBCFC] px-4 py-2 rounded-lg font-medium transition-all border border-[#BFBCFC]/20"
              >
                Instellingen
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Eye className="w-6 h-6 text-[#44FFFF]" />, label: "Watched", value: recentActivity.length },
            { icon: <Heart className="w-6 h-6 text-[#FF61D2]" />, label: "Favorites", value: favoriteMovies.length },
            { icon: <List className="w-6 h-6 text-[#BFBCFC]" />, label: "Lists", value: "—" },
            { icon: <Star className="w-6 h-6 text-[#44FFFF]" />, label: "Reviews", value: "—" },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 text-center"
            >
              <div className="flex justify-center mb-2">{icon}</div>
              <p className="text-2xl md:text-3xl font-bold font-data text-[#F8FAFC] mb-1">
                {value}
              </p>
              <p className="text-[#94A3B8] text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Favorite Films */}
            <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-[#FF61D2]" fill="#FF61D2" />
                Favorite Films
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 4 }).map((_, i) => {
                  const movie = favoriteMovies[i];
                  return movie ? (
                    <div
                      key={movie.id}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1"
                    >
                      <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#FF61D2]/60 group-hover:shadow-[0_8px_32px_rgba(255,97,210,0.25)]">
                        <div className="relative overflow-hidden">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                          {isOwnProfile && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeFavorite(movie.id); }}
                              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 backdrop-blur-sm"
                            >
                              <X className="w-3.5 h-3.5 text-white" />
                            </button>
                          )}
                        </div>
                        <div className="p-2.5">
                          <h3 className="text-[#F8FAFC] font-medium text-xs truncate">{movie.title}</h3>
                          <span className="text-[#94A3B8] text-xs">{movie.release_date?.slice(0, 4)}</span>
                        </div>
                      </div>
                    </div>
                  ) : isOwnProfile ? (
                    <button
                      key={`empty-${i}`}
                      onClick={openSearch}
                      className="group relative transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 text-left"
                    >
                      <div className="bg-[#151921]/50 backdrop-blur-xl border border-dashed border-[#BFBCFC]/20 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#FF61D2]/50 group-hover:bg-[#FF61D2]/5">
                        <div className="aspect-[2/3] flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 rounded-full border border-dashed border-[#BFBCFC]/25 group-hover:border-[#FF61D2]/60 flex items-center justify-center transition-all duration-300 group-hover:bg-[#FF61D2]/10">
                            <Plus className="w-5 h-5 text-[#94A3B8] group-hover:text-[#FF61D2] transition-all duration-300 group-hover:rotate-90" />
                          </div>
                          <span className="text-[#94A3B8] text-xs font-medium group-hover:text-[#FF61D2] transition-colors duration-200">
                            Voeg toe
                          </span>
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs invisible">-</p>
                          <p className="text-xs invisible">-</p>
                        </div>
                      </div>
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
            <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#44FFFF]" />
                Recent Activity
              </h2>

              {recentActivity.length === 0 ? (
                <p className="text-[#94A3B8] text-sm">Geen recente activiteit gevonden.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-[#0B0E14] rounded-lg p-4 border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[#F8FAFC] font-medium text-sm">{activity.movieTitle}</h4>
                        <span className="text-[#44FFFF] font-data text-xs font-bold">
                          ★ {Number(activity.tmdbRating).toFixed(1)}/10
                        </span>
                      </div>
                      <p className="text-[#94A3B8] text-xs mb-1.5 line-clamp-2">{activity.overview}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-[#94A3B8] text-xs">
                          {new Date(activity.watchedDate).toLocaleDateString()}
                        </p>
                        <p className="text-[#44FFFF] text-xs font-data">
                          Watched {activity.amountWatched}x
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
