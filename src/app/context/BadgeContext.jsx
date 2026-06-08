import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { decodeJwtPayload } from '../services/auth';

const BadgeCtx = createContext(null);

// New badge IDs all start with these prefixes — old IDs used "watched_" / "reviews_"
const NEW_ID_PREFIXES = ['cinema_', 'voice_', 'heart_', 'rewatch_', 'special_'];
const BADGE_STORE_VERSION = '2';

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

export function BadgeProvider({ children }) {
  const { user } = useAuth();
  const userId = resolveUserId(user);

  const [pendingUnlocks, setPendingUnlocks] = useState([]);
  const [badgeNotifs, setBadgeNotifs] = useState([]);

  useEffect(() => {
    setPendingUnlocks([]);
    if (!userId) {
      setBadgeNotifs([]);
      return;
    }

    // If stored badge IDs are from the old format, wipe them so the checker re-initialises
    const versionKey = `badge_version_${userId}`;
    const storeKey   = `earned_badge_ids_${userId}`;
    const initKey    = `badge_init_${userId}`;

    if (localStorage.getItem(versionKey) !== BADGE_STORE_VERSION) {
      localStorage.removeItem(storeKey);
      localStorage.removeItem(initKey);
      localStorage.setItem(versionKey, BADGE_STORE_VERSION);
    }

    try {
      const stored = JSON.parse(localStorage.getItem(`badge_notifs_${userId}`) || '[]');
      setBadgeNotifs(stored);
    } catch {
      setBadgeNotifs([]);
    }
  }, [userId]);

  const addUnlock = useCallback((badge) => {
    if (!userId) return;
    setPendingUnlocks(prev => [...prev, badge]);
    const notif = {
      id: `badge_${badge.id}_${Date.now()}`,
      type: 'badge',
      tier: badge.tier,
      category: badge.category,
      title: 'Badge Unlocked!',
      message: badge.name,
      time: 'Just now',
    };
    setBadgeNotifs(prev => {
      const updated = [notif, ...prev].slice(0, 10);
      localStorage.setItem(`badge_notifs_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const dismissUnlock = useCallback(() => {
    setPendingUnlocks(prev => prev.slice(1));
  }, []);

  const clearBadgeNotif = useCallback((id) => {
    if (!userId) return;
    setBadgeNotifs(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem(`badge_notifs_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  return (
    <BadgeCtx.Provider value={{ pendingUnlocks, badgeNotifs, addUnlock, dismissUnlock, clearBadgeNotif }}>
      {children}
    </BadgeCtx.Provider>
  );
}

export const useBadge = () => useContext(BadgeCtx);
