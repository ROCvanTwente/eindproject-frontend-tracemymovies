import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BadgeCtx = createContext(null);

export function BadgeProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [pendingUnlocks, setPendingUnlocks] = useState([]);
  const [badgeNotifs, setBadgeNotifs] = useState([]);

  useEffect(() => {
    setPendingUnlocks([]);
    if (!userId) {
      setBadgeNotifs([]);
      return;
    }
    localStorage.removeItem('badge_notifs');
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
