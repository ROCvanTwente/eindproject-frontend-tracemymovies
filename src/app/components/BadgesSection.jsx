import { Film, AlignLeft, Lock } from 'lucide-react';
import { TIER } from '../utils/badgeTiers';

function Emblem({ badge, size = 56 }) {
  const t = TIER[badge.tier] || TIER.bronze;
  const Icon = badge.category === 'watched' ? Film : AlignLeft;
  const iconSz = Math.round(size * 0.36);

  if (!badge.earned) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: '#11151e', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Lock size={iconSz - 2} color="rgba(148,163,184,0.18)" />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* ambient glow behind emblem */}
      <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: `radial-gradient(circle, ${t.glow} 0%, transparent 65%)`, filter: 'blur(8px)', zIndex: 0 }} />
      {/* outer ring */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid ${t.ring}`, opacity: 0.45, zIndex: 1 }} />
      {/* main face */}
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

function BadgeCard({ badge }) {
  const t = TIER[badge.tier] || TIER.bronze;
  const pct = Math.min(100, Math.round((badge.progress / badge.threshold) * 100));

  return (
    <div style={{
      position: 'relative',
      background: badge.earned
        ? `radial-gradient(ellipse at 50% -10%, ${t.cardGlow} 0%, #0c1018 55%)`
        : '#0a0c13',
      border: `1px solid ${badge.earned ? t.cardBorder : 'rgba(255,255,255,0.04)'}`,
      borderRadius: 14,
      padding: '14px 8px 10px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
      opacity: badge.earned ? 1 : 0.42,
      boxShadow: badge.earned ? `0 0 20px ${t.cardGlow}` : 'none',
      transition: 'all 0.2s ease',
    }}>

      <Emblem badge={badge} size={54} />

      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <p style={{ color: badge.earned ? '#F8FAFC' : '#334155', fontSize: 10, fontWeight: 700, marginBottom: 3, letterSpacing: '0.01em' }}>
          {badge.name}
        </p>
        <p style={{ fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: badge.earned ? t.labelColor : '#1e2d3d' }}>
          {t.label}
        </p>
      </div>

      {!badge.earned && (
        <div style={{ width: '100%' }}>
          <div style={{ height: 2, background: '#161d2a', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(191,188,252,0.25)', borderRadius: 9999 }} />
          </div>
          <p style={{ fontSize: 8.5, color: '#2a3a4d', textAlign: 'center', marginTop: 3 }}>
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
  const Icon = badge.category === 'watched' ? Film : AlignLeft;
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
  const watched = badges.filter(b => b.category === 'watched');
  const reviews = badges.filter(b => b.category === 'reviews');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {watched.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 3, height: 14, borderRadius: 9999, background: 'linear-gradient(to bottom, #BFBCFC, #44FFFF)' }} />
            <Film className="w-3.5 h-3.5 text-[#BFBCFC]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#BFBCFC]">Film Badges</span>
            <span className="text-[10px] text-[#94A3B8]/40 ml-1">
              {watched.filter(b => b.earned).length}/{watched.length}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {watched.map(b => <BadgeCard key={b.id} badge={b} />)}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 3, height: 14, borderRadius: 9999, background: 'linear-gradient(to bottom, #FF61D2, #BFBCFC)' }} />
            <AlignLeft className="w-3.5 h-3.5 text-[#FF61D2]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF61D2]">Review Badges</span>
            <span className="text-[10px] text-[#94A3B8]/40 ml-1">
              {reviews.filter(b => b.earned).length}/{reviews.length}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2.5">
            {reviews.map(b => <BadgeCard key={b.id} badge={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}
