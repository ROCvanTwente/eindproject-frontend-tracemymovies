import { useEffect, useState } from "react";
import { useRefresh } from "../context/RefreshContext";

const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
const API = import.meta.env.VITE_API_BASE_URL;

export function useOwnProfileData() {
  const { refreshKey } = useRefresh();

  const [favoriteMovies, setFavoriteMovies] = useState([null, null, null, null]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [likedMoviesCount, setLikedMoviesCount] = useState(0);
  const [watchedMoviesCount, setWatchedMoviesCount] = useState(0);
  const [watchedThisYear, setWatchedThisYear] = useState(0);
  const [listsCount, setListsCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentReviewsLoading, setRecentReviewsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [watchlistPreview, setWatchlistPreview] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const idsRes = await fetch(`${API}/Favorites`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!idsRes.ok) return;
        const ids = await idsRes.json();
        const movies = await Promise.all(
          ids.slice(0, 4).map((id) =>
            fetch(`${API}/tmdbmovie/GetMovieDetails?id=${id}`).then((r) => r.ok ? r.json() : null)
          )
        );
        const slots = [null, null, null, null];
        movies.forEach((m, i) => { if (m) slots[i] = m; });
        setFavoriteMovies(slots);
      } catch (err) { console.error("Error fetching favorite movies:", err); }
      finally { setFavoritesLoading(false); }
    };
    fetch_();
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/database/GetLikedMoviesCount`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const d = await res.json();
        setLikedMoviesCount(d.count ?? 0);
      } catch (err) { console.error("Error fetching liked movies count:", err); }
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Activity/WatchedCount`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const d = await res.json();
        setWatchedMoviesCount(d.count ?? 0);
      } catch (err) { console.error("Error fetching watched count:", err); }
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Activity/WatchedThisYear`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const d = await res.json();
        setWatchedThisYear(d.count ?? 0);
      } catch {}
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Lists`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const d = await res.json();
        setListsCount(Array.isArray(d) ? d.length : 0);
      } catch (err) { console.error("Error fetching lists count:", err); }
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/UserActivity/Recent`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        setRecentActivity((Array.isArray(data) ? data : [data]).sort((a, b) => new Date(b.loggedDate) - new Date(a.loggedDate)));
      } catch (err) { console.error("Error fetching recent activity:", err); }
      finally { setActivityLoading(false); }
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/friend/GetMyFriends`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setFriends(await res.json());
      } catch {}
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Activity/GetWatchlist`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setWatchlistPreview(await res.json());
      } catch {} finally { setWatchlistLoading(false); }
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Badge/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const d = await res.json();
        setBadges(d.badges || []);
        const ids = d.selectedBadgeIds || [];
        setSelectedBadges((d.badges || []).filter(b => ids.includes(b.id)));
        setIsAdmin(d.isAdmin ?? false);
      } catch {}
    };
    fetch_();
  }, [refreshKey]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Log/MyRecentReviews`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setRecentReviews(await res.json());
      } catch (err) { console.error("Error fetching recent reviews:", err); }
      finally { setRecentReviewsLoading(false); }
    };
    fetch_();
  }, [refreshKey]);

  const saveFavoriteSlots = async (slots) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API}/Favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ movieIds: slots.filter(Boolean).map((m) => m.id) }),
    });
  };

  const addFavorite = async (movie, targetSlot) => {
    if (favoriteMovies.filter(Boolean).some((m) => m.id === movie.id)) {
      return { error: `"${movie.title}" is already in your favourites.` };
    }
    const newSlots = [...favoriteMovies];
    newSlots[targetSlot] = movie;
    setFavoriteMovies(newSlots);
    await saveFavoriteSlots(newSlots);
    return { success: true };
  };

  const removeFavorite = async (slotIndex) => {
    const newSlots = [...favoriteMovies];
    newSlots[slotIndex] = null;
    const compacted = [...newSlots.filter(Boolean), null, null, null, null].slice(0, 4);
    setFavoriteMovies(compacted);
    await saveFavoriteSlots(compacted);
  };

  const swapFavorites = async (fromSlot, toSlot) => {
    const newSlots = [...favoriteMovies];
    [newSlots[fromSlot], newSlots[toSlot]] = [newSlots[toSlot], newSlots[fromSlot]];
    setFavoriteMovies(newSlots);
    await saveFavoriteSlots(newSlots);
  };

  return {
    favoriteMovies, favoritesLoading,
    likedMoviesCount, watchedMoviesCount, watchedThisYear, listsCount,
    recentActivity, activityLoading,
    recentReviews, recentReviewsLoading,
    friends, watchlistPreview, watchlistLoading,
    badges, selectedBadges, isAdmin,
    addFavorite, removeFavorite, swapFavorites,
  };
}
