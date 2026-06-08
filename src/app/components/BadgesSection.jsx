import { useState } from 'react';
import { Film, AlignLeft, Lock, Heart, RotateCcw, Star } from 'lucide-react';
import { TIER } from '../utils/badgeTiers';

const CATEGORY_ICON = {
  watched: Film,
  reviews: AlignLeft,
  liked: Heart,
  rewatch: RotateCcw,
  special: Star,
};

function Emblem({ badge, size = 56 }) {
  const t = TIER[badge.tier] || TIER.bronze;
  const Icon = CATEGORY_ICON[badge.category] || Film;
  const iconSz = Math.round(size * 0.36);

  if (!badge.earned) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: '#11151e', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Lock size={iconSz - 2} color="rgba(148,163,184,0.45)" />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: `radial-gradient(circle, ${t.glow} 0%, transparent 65%)`, filter: 'blur(8px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid ${t.ring}`, opacity: 0.45, zIndex: 1 }} />
      <div style={{
        position: 'absolute', inset: 3, borderRadius: '50%', background: t.gradient, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `inset 0 2px 6px rgba(255,255,255,0.18), inset 0 -2px 6px rgba(0,0,0,0.35)`,
      }}>
        <Icon size={iconSz} color={t.iconColor} strokeWidth={2.2} />
      </div>
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
        <p style={{ fontSize: 9, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>Earned</p>
      )}
    </div>
  );
}

function BadgeCard({ badge }) {
  const t = TIER[badge.tier] || TIER.bronze;
  const pct = Math.min(100, Math.round((badge.progress / badge.threshold) * 100));
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: badge.earned
          ? `radial-gradient(ellipse at 50% -10%, ${t.cardGlow} 0%, #0c1018 55%)`
          : '#0a0c13',
        border: `1px solid ${badge.earned ? t.cardBorder : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 14,
        padding: '14px 8px 10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        opacity: badge.earned ? 1 : 0.65,
        boxShadow: badge.earned ? `0 0 20px ${t.cardGlow}` : 'none',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      {hovered && <BadgeTooltip badge={badge} t={t} />}

      <Emblem badge={badge} size={54} />

      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <p style={{ color: badge.earned ? '#F8FAFC' : '#64748B', fontSize: 10, fontWeight: 700, marginBottom: 3, letterSpacing: '0.01em' }}>
          {badge.name}
        </p>
        <p style={{ fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: badge.earned ? t.labelColor : '#475569' }}>
          {t.label}
        </p>
      </div>

      {!badge.earned && (
        <div style={{ width: '100%' }}>
          <div style={{ height: 2, background: '#161d2a', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(191,188,252,0.45)', borderRadius: 9999 }} />
          </div>
          <p style={{ fontSize: 8.5, color: '#475569', textAlign: 'center', marginTop: 3 }}>
            {badge.progress} / {badge.threshold}
          </p>
        </div>
      )}

      {badge.earned && (
        <div style={{
          position: 'absolute', top: 7, right: 7,
          width: 15, height: 15, borderRadius: '50%',
          background: '#16a34a', border: '1.5px solid #0a0c13',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3.2 5.8L6.5 2.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function BadgeChip({ badge }) {
  const t = TIER[badge.tier] || TIER.bronze;
  const Icon = CATEGORY_ICON[badge.category] || Film;
  return (
    <span
      title={`${badge.name} — ${t.label}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: t.gradient,
        boxShadow: `0 0 8px ${t.glow}, 0 0 14px ${t.glow}`,
        border: `1.5px solid rgba(255,255,255,0.15)`,
        cursor: 'default',
      }}
    >
      <Icon size={10} color={t.iconColor} strokeWidth={2.5} />
    </span>
  );
}

export function BadgesSection({ badges }) {
  const earned = badges.filter(b => b.earned).length;
  return (
    <div style={{ overflow: 'visible' }}>
      {earned > 0 && (
        <p className="text-[11px] text-[#94A3B8]/50 uppercase tracking-[0.18em] font-semibold mb-4">
          {earned} earned · {badges.length - earned} locked
        </p>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2.5" style={{ overflow: 'visible' }}>
        {badges.map(b => <BadgeCard key={b.id} badge={b} />)}
      </div>
    </div>
  );
}
