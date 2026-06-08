import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, AlignLeft, Heart, RotateCcw, Star, User, Users, Bookmark, X } from 'lucide-react';
import { useBadge } from '../context/BadgeContext';
import { TIER, CATEGORY_TIERS } from '../utils/badgeTiers';
import { BADGE_OVERRIDES } from './BadgesSection';

const CATEGORY_ICON = {
  watched:   Film,
  reviews:   AlignLeft,
  liked:     Heart,
  rewatch:   RotateCcw,
  special:   Star,
  profile:   User,
  social:    Users,
  collector: Bookmark,
};
const CATEGORY_LABEL = {
  watched:   'Films Watched',
  reviews:   'Reviews Written',
  liked:     'Films Liked',
  rewatch:   'Rewatches',
  special:   'Special Achievement',
  profile:   'Profile',
  social:    'Social',
  collector: 'Collector',
};

const DURATION = 5000;

function Rays({ color }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 0.18, 0], scaleY: [0, 1, 0] }}
          transition={{ delay: 0.3 + i * 0.04, duration: 1.2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 2,
            height: 120,
            background: `linear-gradient(to top, ${color}, transparent)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
            left: '50%',
            marginLeft: -1,
            rotate: `${i * 30}deg`,
            borderRadius: 9999,
          }}
        />
      ))}
    </div>
  );
}

function BadgeEmblem({ badge, t }) {
  const Icon = CATEGORY_ICON[badge.category] || Film;
  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -16, borderRadius: '50%',
          background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: -4, borderRadius: '50%',
          border: `2px dashed ${t.ring}`,
          opacity: 0.4,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${t.ring}`, opacity: 0.6 }} />
      <div style={{
        position: 'absolute', inset: 4, borderRadius: '50%',
        background: t.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.4), 0 0 30px ${t.glow}`,
      }}>
        <Icon size={36} color={t.iconColor} strokeWidth={2} />
      </div>
    </div>
  );
}

export function BadgeUnlockOverlay() {
  const { pendingUnlocks, dismissUnlock } = useBadge();
  const [progress, setProgress] = useState(100);

  const badge = pendingUnlocks[0] ?? null;
  const t = badge
    ? (BADGE_OVERRIDES[badge.id] || CATEGORY_TIERS[badge.category]?.[badge.tier] || TIER[badge.tier] || TIER.bronze)
    : null;

  useEffect(() => {
    if (!badge) return;
    setProgress(100);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(interval);
    }, 50);
    const timer = setTimeout(() => dismissUnlock(), DURATION);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [badge?.id]);

  return (
    <AnimatePresence>
      {badge && t && (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismissUnlock}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(7,9,14,0.82)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              background: `radial-gradient(ellipse at 50% 0%, ${t.cardGlow} 0%, #0c1018 55%)`,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 24,
              padding: '40px 48px 32px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
              minWidth: 320,
              boxShadow: `0 0 60px ${t.cardGlow}, 0 24px 60px rgba(0,0,0,0.6)`,
              overflow: 'hidden',
              cursor: 'default',
            }}
          >
            <Rays color={t.ring} />

            <button
              onClick={dismissUnlock}
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#94a3b8',
              }}
            >
              <X size={14} />
            </button>

            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.25em',
                textTransform: 'uppercase', color: t.labelColor,
                marginBottom: -8,
              }}
            >
              Badge Unlocked
            </motion.p>

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
              style={{ zIndex: 1 }}
            >
              <BadgeEmblem badge={badge} t={t} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ textAlign: 'center', zIndex: 1 }}
            >
              <p style={{ color: '#F8FAFC', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {badge.name}
              </p>
              <p style={{ color: t.labelColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4 }}>
                {CATEGORY_LABEL[badge.category] ?? badge.category}
              </p>
              <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>
                {badge.description}
              </p>
            </motion.div>

            <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, zIndex: 1, marginTop: 4 }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                width: `${progress}%`,
                background: t.gradient,
                transition: 'width 0.05s linear',
              }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
