import React, { Fragment, useEffect, useRef, useState, useMemo } from "react";
import {
  Search,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Plus,
  Heart,
  Loader2,
  Film,
} from "lucide-react";

import { Link, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

import { toast } from "sonner";

import { NotificationDropdown } from "./NotificationDropdown";
import { WatchLogModal } from "./WatchLogModal";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWatchLogModal, setShowWatchLogModal] = useState(false);

  // LOGOUT POPUP
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // LIKED DROPDOWN
  const [showLikedDropdown, setShowLikedDropdown] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const [likedLoading, setLikedLoading] = useState(false);

  const menuRef = useRef(null);
  const likedRef = useRef(null);

  const auth = useAuth();

  const token = useMemo(() => {
          return (
              auth?.token ||
              auth?.user?.token ||
              localStorage.getItem("authToken") ||
              localStorage.getItem("auth_token") ||
              localStorage.getItem("token") ||
              sessionStorage.getItem("authToken") ||
              sessionStorage.getItem("auth_token") ||
              sessionStorage.getItem("token")
          );
      }, [auth]);

  const {
    user,
    isAuthenticated,
    logout,
    addNotification: setAuthNotification,
  } = useAuth();

  const { addNotification } = useNotifications();

  const navigate = useNavigate();

  // CONNECT AUTH WITH NOTIFICATIONS
  useEffect(() => {
    if (setAuthNotification) {
      setAuthNotification(addNotification);
    }
  }, [setAuthNotification, addNotification]);

  // CLOSE MENU OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }

      if (likedRef.current && !likedRef.current.contains(event.target)) {
        setShowLikedDropdown(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // SEARCH SUGGESTIONS DEBOUNCE
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/search?query=${encodeURIComponent(q)}`
        );
        if (!res.ok) { setSuggestions([]); return; }
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (movie) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(`/movie/${movie.id}`);
  };


 // FETCH LIKED MOVIES
  const fetchLikedMovies = async () => {
    try {
      setLikedLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/GetLikedMovies`, { 
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },});

      if (!response.ok) {
        throw new Error("Failed to fetch liked movies");
      }

      const data = await response.json();

      setLikedMovies(data.slice(0, 3));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load liked movies");
    } finally {
      setLikedLoading(false);
    }
  };
  // OPEN/CLOSE LIKED DROPDOWN
  const handleLikedDropdown = async () => {
    if (!showLikedDropdown) {
      await fetchLikedMovies();
    }

    setShowLikedDropdown(!showLikedDropdown);
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully");

      navigate("/");

      setShowUserMenu(false);
      setShowLogoutPopup(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#151921]/70 backdrop-blur-xl border-b border-[#BFBCFC]/15">
        <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* LEFT SIDE */}
            <nav className="flex items-center gap-4 md:gap-8">
              <Link to="/" className="flex items-center">
                <div className="sm px-3 py-2 rounded-xl transition-all">
                  <img
                    src="/src/imports/logo.png"
                    alt="TraceMyMovies"
                    className="h-8 md:h-10 w-auto"
                  />
                </div>
              </Link>

              <div className="hidden lg:flex gap-6">
                <Link
                  to="/"
                  className="text-[#F8FAFC] hover:text-[#BFBCFC] transition-colors duration-200"
                >
                  Home
                </Link>

                <Link
                  to="/movies"
                  className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200"
                >
                  Movies
                </Link>

                {isAuthenticated && (
                  <Fragment>
                    <Link
                      to="/the-queue"
                      className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200"
                    >
                      Lists
                    </Link>

                    <Link
                      to="/weekly-favorites"
                      className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200"
                    >
                      Trends
                    </Link>

                    <Link
                      to="/global-dna"
                      className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200"
                    >
                      Community
                    </Link>
                  </Fragment>
                )}
              </div>
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* SEARCH */}
              <div ref={searchRef} className="relative hidden lg:block">
                <form onSubmit={handleSearch}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Search movies..."
                    className="bg-[#151921] text-[#F8FAFC] placeholder:text-[#94A3B8] pl-10 pr-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 w-64 transition-all duration-200"
                  />
                </form>

                {/* SUGGESTIONS DROPDOWN */}
                {showSuggestions && (
                  <div className="absolute top-full mt-2 left-0 w-80 bg-[#151921]/95 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {suggestionsLoading ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="w-5 h-5 text-[#BFBCFC] animate-spin" />
                      </div>
                    ) : suggestions.length === 0 ? (
                      <p className="text-[#94A3B8] text-sm text-center py-6">Geen films gevonden.</p>
                    ) : (
                      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#BFBCFC]/40 scrollbar-track-transparent hover:scrollbar-thumb-[#BFBCFC]/60">
                        {suggestions.map((movie) => (
                          <button
                            key={movie.id}
                            onMouseDown={() => handleSuggestionClick(movie)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-[#BFBCFC]/10 last:border-none"
                          >
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="w-9 h-14 object-cover rounded flex-none"
                              />
                            ) : (
                              <div className="w-9 h-14 bg-[#0B0E14] rounded flex-none flex items-center justify-center">
                                <Film className="w-4 h-4 text-[#94A3B8]" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-[#F8FAFC] text-sm font-medium truncate">{movie.title}</p>
                              <p className="text-[#94A3B8] text-xs">{movie.release_date?.slice(0, 4)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MOBILE SEARCH */}
              <Link
                to="/search"
                className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* AUTH CONTENT */}
              {isAuthenticated && (
                <Fragment>
                  <div className="hidden md:block">
                    <NotificationDropdown />
                  </div>

                  <Link
                    to="/messages"
                    className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5 hidden md:block"
                    title="Messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>

                  {/* LIKED DROPDOWN */}
                  <div
                    className="relative hidden md:block"
                    ref={likedRef}
                  >
                    <button
                      onClick={handleLikedDropdown}
                      className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5"
                      title="Liked"
                    >
                      <Heart className="w-5 h-5" />
                    </button>

                    {showLikedDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-[#151921]/95 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl shadow-2xl overflow-hidden z-50">
                        
                        {/* HEADER */}
                        <div className="px-4 py-3 border-b border-[#BFBCFC]/15">
                          <h3 className="text-[#F8FAFC] font-semibold">
                            Recently Liked
                          </h3>
                        </div>

                        {/* CONTENT */}
                        <div className="max-h-[320px] overflow-y-auto">
                          {likedLoading ? (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="w-5 h-5 animate-spin text-[#BFBCFC]" />
                            </div>
                          ) : likedMovies.length === 0 ? (
                            <div className="py-10 text-center text-[#94A3B8]">
                              No liked movies yet
                            </div>
                          ) : (
                            likedMovies.map((movie) => (
                              <Link
                                key={movie._id}
                                to={`/movie/${movie.movieId}`}
                                onClick={() =>
                                  setShowLikedDropdown(false)
                                }
                                className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-b border-[#BFBCFC]/10 last:border-none"
                              >
                                <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="w-12 h-16 object-cover rounded-sm"
                                />

                                <div className="flex-1 min-w-0">
                                  <p className="text-[#F8FAFC] font-medium truncate">
                                    {movie.title}
                                  </p>

                                  <p className="text-[#94A3B8] text-sm">
                                    {movie.year}
                                  </p>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>

                        {/* FOOTER */}
                        <div className="p-3 border-t border-[#BFBCFC]/15">
                          <Link
                            to="/likedmoviespage"
                            onClick={() =>
                              setShowLikedDropdown(false)
                            }
                            className="block w-full text-center bg-[#BFBCFC]/10 hover:bg-[#BFBCFC]/20 text-[#BFBCFC] py-2.5 rounded-xl transition-all font-medium"
                          >
                            View All
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowWatchLogModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5 hidden md:flex font-medium"
                    title="Add Watch Log"
                  >
                    <Plus className="w-4 h-4" />
                    Log
                  </button>
                </Fragment>
              )}

              {/* USER MENU */}
              {isAuthenticated && user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5"
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username || user.email}
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#BFBCFC]"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center">
                        <span className="text-[#0B0E14] font-bold text-sm">
                          {user.username
                            ? user.username.charAt(0).toUpperCase()
                            : user.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}

                    <span className="hidden lg:block text-[#F8FAFC] font-medium">
                      {user.username || user.email}
                    </span>
                  </button>

                  {/* DROPDOWN */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#151921]/95 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl shadow-2xl py-2">
                      <div className="px-4 py-3 border-b border-[#BFBCFC]/15">
                        <p className="text-[#F8FAFC] font-medium">
                          {user.username || user.email}
                        </p>

                        <p className="text-[#94A3B8] text-sm truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors"
                      >
                        Account
                      </Link>

                      <Link
                        to="/my-lists"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors"
                      >
                        My Lists
                      </Link>

                      <Link
                        to="/analytics"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors"
                      >
                        Profile
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors"
                      >
                        Messages
                      </Link>

                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-[#44FFFF] hover:bg-[#44FFFF]/10 transition-colors font-medium"
                        >
                          Admin Panel
                        </Link>
                      )}

                      {/* LOGOUT BUTTON */}
                      <div className="border-t border-[#BFBCFC]/15 mt-2 pt-2">
                        <button
                          onClick={() => setShowLogoutPopup(true)}
                          className="w-full text-left px-4 py-2 text-[#FF61D2] hover:bg-[#FF61D2]/10 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all hover:scale-105 text-sm md:text-base"
                >
                  Login
                </Link>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* LOGOUT POPUP */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-[#151921] border border-[#BFBCFC]/15 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">
              Logout
            </h2>

            <p className="text-[#94A3B8] mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 bg-[#0B0E14] text-[#F8FAFC] py-3 rounded-xl border border-[#BFBCFC]/15 hover:bg-[#1A1F2B] transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-[#FF61D2] hover:bg-[#ff4fc9] text-white py-3 rounded-xl font-medium transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WATCH LOG MODAL */}
      <WatchLogModal
        isOpen={showWatchLogModal}
        onClose={() => setShowWatchLogModal(false)}
        movieTitle=""
        movieYear=""
        moviePoster=""
      />
    </>
  );
}