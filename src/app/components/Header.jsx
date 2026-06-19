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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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

  const { addNotification, notifications } = useNotifications();

  const [seenFriendRequestIds, setSeenFriendRequestIds] = useState(() => {
    try {
      const stored = sessionStorage.getItem("seenFriendRequestIds");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const friendRequestNotifs = notifications.filter(
    (n) => n.type?.toLowerCase() === "friendrequest"
  );

  const pendingFriendRequests = friendRequestNotifs.filter(
    (n) => !seenFriendRequestIds.has(n.id)
  ).length;

  const markFriendRequestsSeen = () => {
    const allIds = friendRequestNotifs.map((n) => n.id);
    const updated = new Set([...seenFriendRequestIds, ...allIds]);
    setSeenFriendRequestIds(updated);
    try {
      sessionStorage.setItem("seenFriendRequestIds", JSON.stringify([...updated]));
    } catch {}
  };

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
  const handleSearch = (e, closeMobileSearch = false) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (closeMobileSearch) setShowMobileSearch(false);
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
      <header className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/8">
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between">

            {/* LEFT — logo + nav grouped */}
            <div className="flex items-center gap-2 lg:gap-4">
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <img src="logo.png" alt="TraceMyMovies" className="h-12 md:h-14 w-auto" />
                <span className="font-black text-base md:text-lg text-[#F8FAFC] tracking-tight">
                  TraceMyMovies
                </span>
              </Link>

              {/* Nav links — desktop only */}
              <nav className="hidden lg:flex items-center gap-0.5">
                {[
                  { to: "/", label: "Home", end: true },
                  { to: "/movies", label: "Movies" },
                  { to: "/about", label: "About" },
                  { to: "/featured-lists", label: "Lists" },
                ].map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "text-[#F8FAFC] bg-white/8"
                          : "text-[#64748B] hover:text-[#CBD5E1] hover:bg-white/5"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* RIGHT — actions */}
            <div className="flex items-center gap-1 md:gap-1.5">

              {/* Desktop search */}
              <form onSubmit={handleSearch} className="relative hidden lg:block mr-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] w-3.5 h-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search films..."
                  className="bg-white/5 text-[#F8FAFC] placeholder:text-[#475569] pl-9 pr-4 py-1.5 rounded-full border border-white/8 focus:outline-none focus:border-[#BFBCFC]/40 focus:bg-white/8 w-48 text-sm transition-all duration-200"
                />
              </form>

              {/* Mobile search */}
              <button
                onClick={() => { setShowMobileSearch(!showMobileSearch); setShowMobileMenu(false); }}
                className={`lg:hidden p-2 transition-colors rounded-xl ${showMobileSearch ? "text-[#BFBCFC] bg-white/8" : "text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5"}`}
              >
                {showMobileSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* AUTH CONTENT */}
              {isAuthenticated && (
                <Fragment>
                  <NotificationDropdown />

                  <NavLink
                    to="/messages"
                    className={({ isActive }) =>
                      `p-2 transition-colors rounded-xl hidden md:flex items-center justify-center ${
                        isActive ? "text-[#F8FAFC] bg-white/8" : "text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5"
                      }`
                    }
                    title="Messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </NavLink>

                  {/* LIKED DROPDOWN */}
                  <div className="relative hidden md:block" ref={likedRef}>
                    <button
                      onClick={handleLikedDropdown}
                      className={`p-2 transition-all rounded-xl ${
                        showLikedDropdown
                          ? "text-[#FF61D2] bg-[#FF61D2]/12"
                          : "text-[#64748B] hover:text-[#FF61D2] hover:bg-[#FF61D2]/10"
                      }`}
                      title="Liked Movies"
                    >
                      <Heart className={`w-5 h-5 transition-all duration-200 ${showLikedDropdown ? "fill-[#FF61D2]" : ""}`} />
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
                    onClick={markFriendRequestsSeen}
                    className={({ isActive }) =>
                      `relative p-2 transition-colors rounded-xl hidden md:flex items-center justify-center ${
                        isActive ? "text-[#F8FAFC] bg-white/8" : "text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5"
                      }`
                    }
                    title="Friends"
                  >
                    <Users className="w-5 h-5" />
                    {pendingFriendRequests > 0 && (
                      <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF61D2] text-[8px] font-bold text-white ring-1 ring-[#0D1117]">
                        {pendingFriendRequests > 9 ? "9+" : pendingFriendRequests}
                      </span>
                    )}
                  </NavLink>

                  <button
                    onClick={() => setShowWatchLogModal(true)}
                    className="hidden md:flex items-center gap-1.5 bg-[#BFBCFC]/10 hover:bg-[#BFBCFC]/20 text-[#BFBCFC] border border-[#BFBCFC]/20 px-3 py-1.5 rounded-full text-sm font-bold transition-all"
                    title="Log a movie"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Log
                  </button>
                </Fragment>
              )}

              {/* USER MENU */}
              {isAuthenticated && user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl transition-all duration-200 ${
                      showUserMenu ? "bg-white/8" : "hover:bg-white/5"
                    }`}
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username || user.email}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-[#BFBCFC]/30"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center ring-2 ring-[#BFBCFC]/20">
                        <span className="text-[#0B0E14] font-bold text-xs">
                          {user.username
                            ? user.username.charAt(0).toUpperCase()
                            : user.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <span className="hidden lg:block text-[#CBD5E1] text-base font-medium">
                      {user.username || user.email}
                    </span>
                  </button>

                  {/* DROPDOWN */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0D1117]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="text-[#F8FAFC] font-semibold text-sm">
                          {user.username || user.email}
                        </p>
                        <p className="text-[#475569] text-xs truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {[
                        { to: "/my-profile", label: "Profile" },
                        { to: "/featured-lists", label: "Lists" },
                        { to: "/watchlist", label: "Watchlist" },
                        { to: "/profile", label: "Account" },
                        { to: "/messages", label: "Messages" },
                      ].map(({ to, label }) => (
                        <NavLink
                          key={to}
                          to={to}
                          onClick={() => setShowUserMenu(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-[#BFBCFC]/12 text-[#F8FAFC] font-medium"
                                : "text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]"
                            }`
                          }
                        >
                          {label}
                        </NavLink>
                      ))}

                      {(user.role === 'Admin' || user.role === 'Moderator') && (
                        <NavLink
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-[#44FFFF]/12 text-[#44FFFF]"
                                : "text-[#44FFFF] hover:bg-[#44FFFF]/8"
                            }`
                          }
                        >
                          Admin Panel
                        </NavLink>
                      )}

                      <div className="border-t border-white/8 mt-1 pt-1">
                        <button
                          onClick={() => setShowLogoutPopup(true)}
                          className="w-full text-left px-4 py-2 text-sm text-[#FF61D2] hover:bg-[#FF61D2]/8 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="shrink-0 whitespace-nowrap text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:block shrink-0 whitespace-nowrap bg-[#BFBCFC] hover:bg-white text-[#0B0E14] px-4 py-1.5 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#BFBCFC]/20"
                  >
                    Get started
                  </Link>
                </div>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => { setShowMobileMenu(!showMobileMenu); setShowMobileSearch(false); }}
                className="lg:hidden p-2 text-[#64748B] hover:text-[#F8FAFC] transition-colors rounded-xl hover:bg-white/5 ml-0.5"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH PANEL */}
      {showMobileSearch && (
        <div className="lg:hidden fixed top-[76px] left-0 right-0 bg-[#0D1117]/98 backdrop-blur-xl border-b border-white/8 z-40 px-4 py-3">
          <form onSubmit={(e) => handleSearch(e, true)} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] w-4 h-4 pointer-events-none" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search films..."
              className="w-full bg-white/5 text-[#F8FAFC] placeholder:text-[#475569] pl-10 pr-4 py-2.5 rounded-full border border-white/8 focus:outline-none focus:border-[#BFBCFC]/40 focus:bg-white/8 text-sm transition-all"
            />
          </form>
        </div>
      )}

      {/* MOBILE MENU PANEL */}
        {showMobileMenu && (
          <div className="lg:hidden fixed top-[76px] left-0 right-0 bg-[#0D1117]/98 backdrop-blur-xl border-b border-white/8 z-40 max-h-[calc(100vh-76px)] overflow-y-auto">
            <div className="container mx-auto px-4 py-3 space-y-0.5">
              {[
                { to: "/", label: "Home", end: true },
                { to: "/movies", label: "Movies" },
                { to: "/about", label: "About" },
                { to: "/featured-lists", label: "Lists" },
              ].map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#BFBCFC]/15 text-[#F8FAFC]"
                        : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

            {isAuthenticated && (
              <>
                <div className="border-t border-[#BFBCFC]/10 my-2" />
                <NavLink
                  to="/messages"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive ? "bg-white/10 text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                    }`
                  }
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </NavLink>
                <NavLink
                  to="/FriendPage"
                  onClick={() => { setShowMobileMenu(false); markFriendRequestsSeen(); }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive ? "bg-white/10 text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                    }`
                  }
                >
                  <div className="relative">
                    <Users className="w-4 h-4" />
                    {pendingFriendRequests > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF61D2] text-[8px] font-bold text-white ring-1 ring-[#0D1117]">
                        {pendingFriendRequests > 9 ? "9+" : pendingFriendRequests}
                      </span>
                    )}
                  </div>
                  Friends
                  {pendingFriendRequests > 0 && (
                    <span className="ml-auto bg-[#FF61D2]/15 text-[#FF61D2] text-xs font-bold px-2 py-0.5 rounded-full">
                      {pendingFriendRequests}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/likedmoviespage"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive ? "text-[#FF61D2] bg-[#FF61D2]/10" : "text-[#64748B] hover:text-[#FF61D2] hover:bg-[#FF61D2]/8"
                    }`
                  }
                >
                  <Heart className="w-4 h-4" />
                  Liked Movies
                </NavLink>
                <button
                  onClick={() => { setShowMobileMenu(false); setShowWatchLogModal(true); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors w-full text-left"
                >
                  <Plus className="w-4 h-4" />
                  Log a Movie
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <div className="border-t border-white/8 my-2" />
                <div className="flex flex-col gap-2 pt-1">
                  <NavLink
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-center border border-white/10 text-[#CBD5E1] px-4 py-2.5 rounded-xl font-medium transition-all text-sm hover:bg-white/5"
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-center bg-[#BFBCFC] hover:bg-white text-[#0B0E14] px-4 py-2.5 rounded-xl font-bold transition-all text-sm"
                  >
                    Get started
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
      />
    </>
  );
}
