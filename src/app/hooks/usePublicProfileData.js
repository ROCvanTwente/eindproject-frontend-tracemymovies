import { useEffect, useState } from "react";

const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
const API = import.meta.env.VITE_API_BASE_URL;

export function usePublicProfileData(userId) {
  const [publicProfile, setPublicProfile] = useState(null);
  const [publicLoading, setPublicLoading] = useState(true);
  const [publicRecentReviews, setPublicRecentReviews] = useState([]);
  const [publicRecentReviewsLoading, setPublicRecentReviewsLoading] = useState(true);
  const [publicFriends, setPublicFriends] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [listsCount, setListsCount] = useState(0);
  const [recentLists, setRecentLists] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetch_ = async () => {
      try {
        setPublicLoading(true);
        const token = getToken();
        const res = await fetch(`${API}/PublicProfile/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setPublicProfile(await res.json());
      } catch (err) { console.error(err); }
      finally { setPublicLoading(false); }
    };
    fetch_();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Log/RecentReviews/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setPublicRecentReviews(await res.json());
      } catch {} finally { setPublicRecentReviewsLoading(false); }
    };
    fetch_();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/friend/GetUserFriends/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setPublicFriends(await res.json());
      } catch {}
    };
    fetch_();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/Badge/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const d = await res.json();
        setBadges(d.badges || []);
        const ids = d.selectedBadgeIds || [];
        setSelectedBadges((d.badges || []).filter(b => ids.includes(b.id)));
        setIsAdmin(d.isAdmin ?? false);
      } catch {}
    };
    fetch_();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetch_ = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API}/PublicProfile/${userId}/Lists`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const d = await res.json();
        setListsCount(Array.isArray(d) ? d.length : 0);
        setRecentLists(Array.isArray(d) ? d.slice(0, 3) : []);
      } catch {}
    };
    fetch_();
  }, [userId]);

  return { publicProfile, publicLoading, publicRecentReviews, publicRecentReviewsLoading, publicFriends, badges, selectedBadges, isAdmin, listsCount, recentLists };
}
