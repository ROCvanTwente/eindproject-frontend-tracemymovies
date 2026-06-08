import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBadge } from '../context/BadgeContext';
import { decodeJwtPayload } from '../services/auth';

const POLL_MS = 10000;

function resolveUserId(user) {
  if (user?.id) return String(user.id);
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    || payload?.nameid
    || payload?.sub
    || null;
}

export function BadgeChecker() {
  const { user, isAuthenticated } = useAuth();
  const badge = useBadge();
  const runningRef = useRef(false);
  const checkRef = useRef(null);

  useEffect(() => {
    checkRef.current = async () => {
      if (!isAuthenticated || !user) return;
      if (runningRef.current) return;
      runningRef.current = true;

      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (!token) return;

        const userId = resolveUserId(user);
        if (!userId) return;

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Badge/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const { badges = [] } = await res.json();
        const earnedIds = badges.filter(b => b.earned).map(b => b.id);

        const storeKey = `earned_badge_ids_${userId}`;
        const initKey  = `badge_init_${userId}`;

        const initialized = localStorage.getItem(initKey) === '1';

        if (!initialized) {
          localStorage.setItem(storeKey, JSON.stringify(earnedIds));
          localStorage.setItem(initKey, '1');
          return;
        }

        const stored = new Set(JSON.parse(localStorage.getItem(storeKey) || '[]'));
        const newlyEarned = badges.filter(b => b.earned && !stored.has(b.id));

        if (newlyEarned.length > 0) {
          newlyEarned.forEach(b => badge?.addUnlock(b));
          localStorage.setItem(storeKey, JSON.stringify(earnedIds));
        }
      } catch (err) {
        console.warn('[BadgeChecker] check failed:', err);
      } finally {
        runningRef.current = false;
      }
    };
  });

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const run = () => checkRef.current?.();

    run();

    window.addEventListener('signalr:badgecheck', run);
    window.addEventListener('focus', run);
    const interval = setInterval(run, POLL_MS);

    return () => {
      window.removeEventListener('signalr:badgecheck', run);
      window.removeEventListener('focus', run);
      clearInterval(interval);
    };
  }, [isAuthenticated, user?.id]);

  return null;
}
