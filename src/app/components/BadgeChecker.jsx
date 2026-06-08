import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBadge } from '../context/BadgeContext';

const EARNED_KEY = 'earned_badge_ids';
const INIT_KEY   = 'badge_init';
const POLL_MS    = 10000;

export function BadgeChecker() {
  const { user, isAuthenticated } = useAuth();
  const { addUnlock } = useBadge();
  const runningRef = useRef(false);

  const check = async () => {
    if (!isAuthenticated || !user || runningRef.current) return;
    runningRef.current = true;
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Badge/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;

      const { badges = [] } = await res.json();
      const earnedIds = badges.filter(b => b.earned).map(b => b.id);
      const storeKey = `${EARNED_KEY}_${user.id}`;
      const initKey  = `${INIT_KEY}_${user.id}`;

      const initialized = localStorage.getItem(initKey) === '1';
      const stored = new Set(JSON.parse(localStorage.getItem(storeKey) || '[]'));

      if (!initialized) {
        localStorage.setItem(storeKey, JSON.stringify(earnedIds));
        localStorage.setItem(initKey, '1');
        return;
      }

      const newlyEarned = badges.filter(b => b.earned && !stored.has(b.id));
      if (newlyEarned.length > 0) {
        newlyEarned.forEach(b => addUnlock(b));
        localStorage.setItem(storeKey, JSON.stringify(earnedIds));
      }
    } catch {}
    finally { runningRef.current = false; }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    check();

    const onBadgeCheck = () => check();
    window.addEventListener('signalr:badgecheck', onBadgeCheck);

    const interval = setInterval(check, POLL_MS);

    window.addEventListener('focus', check);

    return () => {
      window.removeEventListener('signalr:badgecheck', onBadgeCheck);
      window.removeEventListener('focus', check);
      clearInterval(interval);
    };
  }, [isAuthenticated, user?.id]);

  return null;
}
