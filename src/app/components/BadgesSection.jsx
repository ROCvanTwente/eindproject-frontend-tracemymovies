import { useState } from 'react';
import { Film, AlignLeft, Lock, Heart, RotateCcw, Star, User, Users, Bookmark } from 'lucide-react';
import { Pin } from 'lucide-react';
import { TIER, CATEGORY_TIERS } from '../utils/badgeTiers';

const CATEGORY_META = {
  watched:   { Icon: Film,      label: 'Films Watched',   color: '#BFBCFC' },
  reviews:   { Icon: AlignLeft, label: 'Reviews',         color: '#f472b6' },
  liked:     { Icon: Heart,     label: 'Liked',           color: '#fb7185' },
  rewatch:   { Icon: RotateCcw, label: 'Rewatches',       color: '#34d399' },
  special:   { Icon: Star,      label: 'Special',         color: '#fbbf24' },
  profile:   { Icon: User,      label: 'Profile',         color: '#60a5fa' },
  social:    { Icon: Users,     label: 'Social',          color: '#a78bfa' },
  collector: { Icon: Bookmark,  label: 'Collector',       color: '#f97316' },
};

const CATEGORY_ORDER = ['watched', 'reviews', 'liked', 'rewatch', 'special', 'profile', 'social', 'collector'];

// Per-badge color overrides — beat the tier defaults for thematic badges
export const BADGE_OVERRIDES = {
  // ── SPECIAL ──────────────────────────────────────────
  special_harsh: {
    gradient:   'linear-gradient(145deg, #ef4444 0%, #7f1d1d 100%)',
    ring:        '#ef4444',
    glow:        'rgba(239,68,68,0.70)',
    cardGlow:    'rgba(239,68,68,0.14)',
    cardBorder:  'rgba(239,68,68,0.45)',
    iconColor:   '#fff',
    labelColor:  '#fca5a5',
    special: true,
  },
  special_perfect: {
    gradient:   'linear-gradient(145deg, #fff9c4 0%, #fbbf24 40%, #f59e0b 100%)',
    ring:        '#fde68a',
    glow:        'rgba(253,230,138,0.75)',
    cardGlow:    'rgba(253,230,138,0.14)',
    cardBorder:  'rgba(253,230,138,0.50)',
    iconColor:   '#451a03',
    labelColor:  '#fde68a',
    special: true,
  },
  // ── LIKED ─────────────────────────────────────────────
  heart_75: {
    gradient:   'linear-gradient(145deg, #fb7185 0%, #e11d48 50%, #9f1239 100%)',
    ring:        '#fb7185',
    glow:        'rgba(251,113,133,0.70)',
    cardGlow:    'rgba(251,113,133,0.13)',
    cardBorder:  'rgba(251,113,133,0.45)',
    iconColor:   '#fff',
    labelColor:  '#fda4af',
    special: true,
  },
  // ── SOCIAL ────────────────────────────────────────────
  social_25: {
    gradient:   'linear-gradient(145deg, #f0abfc 0%, #a855f7 50%, #7c3aed 100%)',
    ring:        '#e879f9',
    glow:        'rgba(232,121,249,0.70)',
    cardGlow:    'rgba(232,121,249,0.13)',
    cardBorder:  'rgba(232,121,249,0.45)',
    iconColor:   '#fff',
    labelColor:  '#f0abfc',
    special: true,
  },
  // ── REWATCH ───────────────────────────────────────────
  rewatch_5: {
    gradient:   'linear-gradient(145deg, #fdba74 0%, #f97316 50%, #c2410c 100%)',
    ring:        '#fb923c',
    glow:        'rgba(251,146,60,0.65)',
    cardGlow:    'rgba(251,146,60,0.11)',
    cardBorder:  'rgba(251,146,60,0.40)',
    iconColor:   '#fff',
    labelColor:  '#fed7aa',
    special: true,
  },
  // ── PROFILE ───────────────────────────────────────────
  profile_location: {
    gradient:   'linear-gradient(145deg, #6ee7b7 0%, #10b981 50%, #065f46 100%)',
    ring:        '#34d399',
    glow:        'rgba(52,211,153,0.60)',
    cardGlow:    'rgba(52,211,153,0.10)',
    cardBorder:  'rgba(52,211,153,0.38)',
    iconColor:   '#fff',
    labelColor:  '#6ee7b7',
  },
  // ── COLLECTOR ─────────────────────────────────────────
  fav_10: {
    gradient:   'linear-gradient(145deg, #fcd34d 0%, #d97706 50%, #92400e 100%)',
    ring:        '#fcd34d',
    glow:        'rgba(252,211,77,0.65)',
    cardGlow:    'rgba(252,211,77,0.12)',
    cardBorder:  'rgba(252,211,77,0.42)',
    iconColor:   '#451a03',
    labelColor:  '#fef08a',
    special: true,
  },
};

const getTier = (badge) =>
  BADGE_OVERRIDES[badge.id]
  || CATEGORY_TIERS[badge.category]?.[badge.tier]
  || TIER[badge.tier]
  || TIER.bronze;

// Exact Lucide Shield path as SVG mask — scales to any size, preserves rounded corners
const SHIELD_MASK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .88-1L12 3l7 2.12A1 1 0 0 1 20 6Z' fill='white'/%3E%3C/svg%3E\")";
const shieldMask = { WebkitMaskImage: SHIELD_MASK, maskImage: SHIELD_MASK, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' };

function Emblem({ badge, size = 54 }) {
  const t = getTier(badge);
  const meta = CATEGORY_META[badge.category] || CATEGORY_META.watched;
  const Icon = meta.Icon;
  const iconSz = Math.round(size * 0.36);

  if (!badge.earned) {
    return (
      <div style={{
        width: size, height: size, flexShrink: 0,
        ...shieldMask,
        background: '#1a2035',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Lock size={iconSz - 2} color="rgba(148,163,184,0.75)" />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Outer glow */}
      <div style={{ position: 'absolute', inset: -8, background: `radial-gradient(circle, ${t.glow} 0%, transparent 60%)`, filter: 'blur(10px)', zIndex: 0 }} />
      {/* Ring layer */}
      <div style={{ position: 'absolute', inset: 0, ...shieldMask, background: t.ring, opacity: 0.5, zIndex: 1 }} />
      {/* Gradient fill */}
      <div style={{
        position: 'absolute', inset: 2, ...shieldMask, background: t.gradient, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={iconSz} color={t.iconColor} strokeWidth={2.2} />
      </div>
      {/* Gloss highlight */}
      <div style={{
        position: 'absolute', inset: 2, ...shieldMask, zIndex: 3,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 35%, transparent 60%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

function BadgeTooltip({ badge, t }) {
  const pct = Math.min(100, Math.round((badge.progress / badge.threshold) * 100));
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 50,
      width: 168,
      background: '#0f1420',
      border: `1px solid ${badge.earned ? t.cardBorder : 'rgba(255,255,255,0.10)'}`,
      borderRadius: 10,
      padding: '10px 12px',
      pointerEvents: 'none',
      boxShadow: `0 8px 32px rgba(0,0,0,0.6)${badge.earned ? `, 0 0 16px ${t.cardGlow}` : ''}`,
    }}>
      <div style={{
        position: 'absolute', bottom: -5, left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
        width: 8, height: 8,
        background: '#0f1420',
        borderRight: `1px solid ${badge.earned ? t.cardBorder : 'rgba(255,255,255,0.10)'}`,
        borderBottom: `1px solid ${badge.earned ? t.cardBorder : 'rgba(255,255,255,0.10)'}`,
      }} />
      <p style={{ color: '#F8FAFC', fontSize: 11, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>
        {badge.name}
      </p>
      <p style={{ color: '#94A3B8', fontSize: 10, lineHeight: 1.5, marginBottom: badge.earned ? 0 : 8 }}>
        {badge.description}
      </p>
      {!badge.earned && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9.5, color: '#475569' }}>Progress</span>
            <span style={{ fontSize: 9.5, color: '#64748B' }}>{badge.progress} / {badge.threshold}</span>
          </div>
          <div style={{ height: 3, background: '#1a2236', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(191,188,252,0.55)', borderRadius: 9999 }} />
          </div>
        </div>
      )}
      {badge.earned && (
        <p style={{ fontSize: 9, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>Earned ✓</p>
      )}
    </div>
  );
}

function BadgeCard({ badge, isSelected, onToggleSelect }) {
  const t = getTier(badge);
  const pct = Math.min(100, Math.round((badge.progress / badge.threshold) * 100));
  const [hovered, setHovered] = useState(false);
  const canSelect = badge.earned && onToggleSelect;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => canSelect && onToggleSelect(badge.id)}
      style={{
        position: 'relative',
        background: badge.earned
          ? `radial-gradient(ellipse at 50% -10%, ${t.cardGlow} 0%, #0c1018 55%)`
          : '#0a0c13',
        border: isSelected
          ? `2px solid #BFBCFC`
          : `1px solid ${badge.earned ? t.cardBorder : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 14,
        padding: '14px 8px 10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        opacity: badge.earned ? 1 : 0.92,
        boxShadow: isSelected
          ? `0 0 0 3px rgba(191,188,252,0.25), 0 0 20px ${t.cardGlow}`
          : badge.earned
            ? t.legendary
              ? `0 0 28px ${t.cardGlow}, 0 0 50px rgba(191,188,252,0.08), 0 0 70px rgba(68,255,255,0.05)`
              : t.special
                ? `0 0 24px ${t.cardGlow}, 0 0 40px ${t.cardGlow}`
                : `0 0 20px ${t.cardGlow}`
            : 'none',
        transition: 'all 0.2s ease',
        cursor: canSelect ? 'pointer' : 'default',
      }}
    >
      {hovered && <BadgeTooltip badge={badge} t={t} />}

      <Emblem badge={badge} size={54} />

      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <p style={{ color: badge.earned ? '#F8FAFC' : '#94A3B8', fontSize: 10, fontWeight: 700, letterSpacing: '0.01em' }}>
          {badge.name}
        </p>
      </div>

      {!badge.earned && (
        <div style={{ width: '100%' }}>
          <div style={{ height: 2, background: '#161d2a', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(191,188,252,0.45)', borderRadius: 9999 }} />
          </div>
          <p style={{ fontSize: 8.5, color: '#64748B', textAlign: 'center', marginTop: 3 }}>
            {badge.progress} / {badge.threshold}
          </p>
        </div>
      )}

      {/* Shimmer sweep for diamond / legendary */}
      {badge.earned && t.special && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.07) 50%, transparent 80%)',
            animation: 'shimmer 3s ease-in-out infinite',
          }} />
        </div>
      )}

      {badge.earned && !isSelected && (
        <div style={{
          position: 'absolute', top: 7, right: 7,
          width: 15, height: 15, borderRadius: '50%',
          background: '#16a34a', border: '1.5px solid #0a0c13',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3.2 5.8L6.5 2.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      {isSelected && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 17, height: 17, borderRadius: '50%',
          background: '#BFBCFC', border: '1.5px solid #0a0c13',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}>
          <Pin size={9} color="#0B0E14" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

export function BadgeChip({ badge, size = 30 }) {
  const t = getTier(badge);
  const meta = CATEGORY_META[badge.category] || CATEGORY_META.watched;
  const Icon = meta.Icon;
  const iconSz = Math.round(size * 0.42);
  return (
    <span
      title={`${badge.name} — ${t.label}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, flexShrink: 0,
        position: 'relative',
        filter: `drop-shadow(0 0 5px ${t.glow}) drop-shadow(0 0 10px ${t.glow})`,
        cursor: 'default',
      }}
    >
      <span style={{
        position: 'absolute', inset: 0,
        ...shieldMask,
        background: t.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={iconSz} color={t.iconColor} strokeWidth={2.5} />
      </span>
      {/* Gloss highlight */}
      <span style={{
        position: 'absolute', inset: 0,
        ...shieldMask,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 35%, transparent 60%)',
        pointerEvents: 'none',
      }} />
    </span>
  );
}

function CategoryRow({ category, badges, selectedIds, onToggleSelect }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.watched;
  const { Icon, label, color } = meta;

  // Earned badges first, then locked — stable order within each group
  const sorted = [
    ...badges.filter(b => b.earned),
    ...badges.filter(b => !b.earned),
  ];

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div>
      {/* Row header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={14} color={color} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#CBD5E1' }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 9999 }} />
        <span style={{ fontSize: 11, color: earnedCount > 0 ? color : '#334155', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {earnedCount}/{badges.length}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2" style={{ overflow: 'visible' }}>
        {sorted.map(b => (
          <BadgeCard
            key={b.id}
            badge={b}
            isSelected={selectedIds?.includes(b.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function BadgesSection({ badges, selectedIds = [], onToggleSelect = null }) {
  const byCategory = {};
  for (const b of badges) {
    if (!byCategory[b.category]) byCategory[b.category] = [];
    byCategory[b.category].push(b);
  }

  const categories = CATEGORY_ORDER.filter(c => byCategory[c]?.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, overflow: 'visible' }}>
      {categories.map(cat => (
        <CategoryRow
          key={cat}
          category={cat}
          badges={byCategory[cat]}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
