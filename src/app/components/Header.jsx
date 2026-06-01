import React, { Fragment, useEffect, useRef, useState, useMemo } from "react";
import {
  Search,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Plus,
  Heart,
  Users,
  Loader2,
} from "lucide-react";

import { Link, NavLink, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

import { toast } from "sonner";

import { NotificationDropdown } from "./NotificationDropdown";
import { WatchLogModal } from "./WatchLogModal";

export function Header() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || "");
  }, [searchParams]);
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
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
                {[
                  { to: "/", label: "Home", end: true },
                  { to: "/movies", label: "Movies" },
                  ...(isAuthenticated ? [
                    { to: "/the-queue", label: "Lists" },
                    { to: "/weekly-favorites", label: "Trends" },
                    { to: "/global-dna", label: "Community" },
                  ] : []),
                ].map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#F8FAFC] font-medium transition-colors duration-200"
                        : "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200"
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* SEARCH */}
              <form onSubmit={handleSearch} className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-[#151921] text-[#F8FAFC] placeholder:text-[#94A3B8] pl-10 pr-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 w-64 transition-all duration-200"
                />
              </form>

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

                  <NavLink
                    to="/messages"
                    className={({ isActive }) =>
                      `p-2 transition-colors duration-200 rounded-lg hidden md:block ${
                        isActive ? "text-[#F8FAFC] bg-white/10" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                      }`
                    }
                    title="Messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </NavLink>

                  {/* LIKED DROPDOWN */}
                  <div
                    className="relative hidden md:block"
                    ref={likedRef}
                  >
                    <button
                      onClick={handleLikedDropdown}
                      className={`p-2 transition-all duration-200 rounded-lg ${
                        showLikedDropdown
                          ? "text-[#FF61D2] bg-[#FF61D2]/10"
                          : "text-[#94A3B8] hover:text-[#FF61D2] hover:bg-[#FF61D2]/10"
                      }`}
                      title="Liked Movies"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-200 ${
                          showLikedDropdown ? "fill-[#FF61D2] scale-110" : ""
                        }`}
                      />
                    </button>

                    {showLikedDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-[#151921]/95 backdrop-blur-xl border border-[#FF61D2]/20 rounded-2xl shadow-2xl shadow-[#FF61D2]/10 overflow-hidden z-50">

                        {/* HEADER */}
                        <div className="px-4 py-3.5 border-b border-[#FF61D2]/15 flex items-center gap-2.5 bg-gradient-to-r from-[#FF61D2]/8 to-transparent">
                          <div className="w-7 h-7 bg-[#FF61D2]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Heart className="w-3.5 h-3.5 text-[#FF61D2] fill-[#FF61D2]" />
                          </div>
                          <div>
                            <h3 className="text-[#F8FAFC] font-semibold text-sm leading-none">
                              Recently Liked
                            </h3>
                            <p className="text-[#94A3B8] text-xs mt-0.5">Your latest favorites</p>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="max-h-[300px] overflow-y-auto">
                          {likedLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                              <div className="relative w-8 h-8">
                                <div className="absolute inset-0 rounded-full border-t-2 border-[#FF61D2] animate-spin" />
                                <Heart className="absolute inset-0 m-auto w-3.5 h-3.5 text-[#FF61D2]/50" />
                              </div>
                              <p className="text-[#94A3B8] text-xs">Loading...</p>
                            </div>
                          ) : likedMovies.length === 0 ? (
                            <div className="py-10 text-center px-4">
                              <Heart className="w-8 h-8 text-[#94A3B8]/30 mx-auto mb-2" />
                              <p className="text-[#94A3B8] text-sm">No liked movies yet</p>
                            </div>
                          ) : (
                            likedMovies.map((movie) => (
                              <Link
                                key={movie._id}
                                to={`/movie/${movie.movieId}`}
                                onClick={() => setShowLikedDropdown(false)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-[#FF61D2]/5 transition-colors border-b border-[#BFBCFC]/8 last:border-none group"
                              >
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-10 h-14 object-cover rounded-lg border border-[#BFBCFC]/10 group-hover:border-[#FF61D2]/30 transition-colors"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[#F8FAFC] font-medium text-sm truncate group-hover:text-[#FF61D2] transition-colors">
                                    {movie.title}
                                  </p>
                                  {movie.year && (
                                    <p className="text-[#94A3B8] text-xs mt-0.5">
                                      {movie.year}
                                    </p>
                                  )}
                                </div>
                                <Heart className="w-3.5 h-3.5 text-[#FF61D2]/40 fill-[#FF61D2]/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ))
                          )}
                        </div>

                        {/* FOOTER */}
                        <div className="p-3 border-t border-[#FF61D2]/15">
                          <Link
                            to="/likedmoviespage"
                            onClick={() => setShowLikedDropdown(false)}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#FF61D2]/15 to-[#BFBCFC]/10 hover:from-[#FF61D2]/25 hover:to-[#BFBCFC]/15 text-[#FF61D2] py-2.5 rounded-xl transition-all font-medium text-sm border border-[#FF61D2]/20 hover:border-[#FF61D2]/35"
                          >
                            <Heart className="w-3.5 h-3.5 fill-[#FF61D2]" />
                            View All Liked Movies
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <NavLink
                    to="/FriendPage"
                    className={({ isActive }) =>
                      `p-2 transition-colors duration-200 rounded-lg hidden md:block ${
                        isActive ? "text-[#F8FAFC] bg-white/10" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                      }`
                    }
                    title="Friends"
                  >
                    <Users className="w-5 h-5" />
                  </NavLink>

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

                      {[
                        { to: "/my-profile", label: "Profiel" },
                        { to: "/my-lists", label: "My Lists" },
                        { to: "/profile", label: "Account" },
                        { to: "/messages", label: "Messages" },
                      ].map(({ to, label }) => (
                        <NavLink
                          key={to}
                          to={to}
                          onClick={() => setShowUserMenu(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 transition-colors ${
                              isActive
                                ? "bg-[#BFBCFC]/15 text-[#F8FAFC] font-medium"
                                : "text-[#F8FAFC] hover:bg-[#BFBCFC]/10"
                            }`
                          }
                        >
                          {label}
                        </NavLink>
                      ))}

                      {user.isAdmin && (
                        <NavLink
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 transition-colors font-medium ${
                              isActive
                                ? "bg-[#44FFFF]/15 text-[#44FFFF]"
                                : "text-[#44FFFF] hover:bg-[#44FFFF]/10"
                            }`
                          }
                        >
                          Admin Panel
                        </NavLink>
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
