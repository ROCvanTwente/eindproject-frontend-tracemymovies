import React, { Fragment, useEffect, useRef, useState } from "react";
import { Search, LogOut, Menu, X, MessageCircle, Plus } from "lucide-react";

import { Link, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

import { toast } from "sonner";

import { NotificationDropdown } from "./NotificationDropdown";
import { WatchLogModal } from "./WatchLogModal";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWatchLogModal, setShowWatchLogModal] = useState(false);

  // NEW
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const menuRef = useRef(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
              <form
                onSubmit={handleSearch}
                className="relative hidden lg:block"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
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

                  <Link
                    to="/messages"
                    className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 rounded-lg hover:bg-white/5 hidden md:block"
                    title="Messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>

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
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Logout</h2>

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
