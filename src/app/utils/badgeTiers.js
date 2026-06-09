// Global fallback tiers (used when no category-specific override exists)
export const TIER = {
  bronze: {
    label: 'Bronze',
    gradient: 'linear-gradient(145deg, #f59e0b 0%, #92400e 100%)',
    ring: '#d97706', glow: 'rgba(217,119,6,0.55)',
    cardGlow: 'rgba(217,119,6,0.07)', cardBorder: 'rgba(217,119,6,0.28)',
    iconColor: '#fef3c7', labelColor: '#fbbf24',
  },
  silver: {
    label: 'Silver',
    gradient: 'linear-gradient(145deg, #e2e8f0 0%, #475569 100%)',
    ring: '#94a3b8', glow: 'rgba(148,163,184,0.5)',
    cardGlow: 'rgba(148,163,184,0.06)', cardBorder: 'rgba(148,163,184,0.25)',
    iconColor: '#0f172a', labelColor: '#cbd5e1',
  },
  gold: {
    label: 'Gold',
    gradient: 'linear-gradient(145deg, #fde68a 0%, #b45309 100%)',
    ring: '#fbbf24', glow: 'rgba(251,191,36,0.55)',
    cardGlow: 'rgba(251,191,36,0.07)', cardBorder: 'rgba(251,191,36,0.3)',
    iconColor: '#451a03', labelColor: '#fde68a',
  },
  platinum: {
    label: 'Platinum',
    gradient: 'linear-gradient(145deg, #e0dfff 0%, #6d28d9 100%)',
    ring: '#BFBCFC', glow: 'rgba(191,188,252,0.55)',
    cardGlow: 'rgba(191,188,252,0.08)', cardBorder: 'rgba(191,188,252,0.3)',
    iconColor: '#0B0E14', labelColor: '#BFBCFC',
  },
  diamond: {
    label: 'Diamond',
    gradient: 'linear-gradient(145deg, #e0f7ff 0%, #0891b2 50%, #0e7490 100%)',
    ring: '#44FFFF', glow: 'rgba(68,255,255,0.7)',
    cardGlow: 'rgba(68,255,255,0.14)', cardBorder: 'rgba(68,255,255,0.45)',
    iconColor: '#0B0E14', labelColor: '#44FFFF', special: true,
  },
  legendary: {
    label: 'Legendary',
    gradient: 'linear-gradient(145deg, #FF61D2 0%, #c084fc 40%, #BFBCFC 70%, #44FFFF 100%)',
    ring: '#FF61D2', glow: 'rgba(255,97,210,0.75)',
    cardGlow: 'rgba(255,97,210,0.16)', cardBorder: 'rgba(255,97,210,0.5)',
    iconColor: '#0B0E14', labelColor: '#FF61D2', special: true, legendary: true,
  },
  galaxy: {
    label: 'Galaxy',
    gradient: 'linear-gradient(145deg, #0d0221 0%, #1a0533 15%, #3b0764 30%, #7c3aed 45%, #c084fc 55%, #44FFFF 70%, #FF61D2 85%, #fbbf24 100%)',
    ring: '#c084fc', glow: 'rgba(192,132,252,0.90)',
    cardGlow: 'rgba(192,132,252,0.22)', cardBorder: 'rgba(192,132,252,0.65)',
    iconColor: '#fff', labelColor: '#e9d5ff', special: true, legendary: true, galaxy: true,
  },
};

// Per-category tier themes — category color dominates, tier sets intensity
export const CATEGORY_TIERS = {

  // ── WATCHED  Indigo / Cinema purple ──────────────────────────────────
  watched: {
    bronze:   { label:'Bronze',   gradient:'linear-gradient(145deg,#818cf8 0%,#312e81 100%)', ring:'#818cf8', glow:'rgba(129,140,248,0.55)', cardGlow:'rgba(129,140,248,0.08)', cardBorder:'rgba(129,140,248,0.30)', iconColor:'#fff', labelColor:'#a5b4fc' },
    silver:   { label:'Silver',   gradient:'linear-gradient(145deg,#a5b4fc 0%,#3730a3 100%)', ring:'#a5b4fc', glow:'rgba(165,180,252,0.60)', cardGlow:'rgba(165,180,252,0.09)', cardBorder:'rgba(165,180,252,0.34)', iconColor:'#fff', labelColor:'#c7d2fe' },
    gold:     { label:'Gold',     gradient:'linear-gradient(145deg,#c4b5fd 0%,#5b21b6 100%)', ring:'#c4b5fd', glow:'rgba(196,181,253,0.65)', cardGlow:'rgba(196,181,253,0.10)', cardBorder:'rgba(196,181,253,0.38)', iconColor:'#fff', labelColor:'#ddd6fe' },
    platinum: { label:'Platinum', gradient:'linear-gradient(145deg,#e0e7ff 0%,#4338ca 100%)', ring:'#e0e7ff', glow:'rgba(224,231,255,0.65)', cardGlow:'rgba(224,231,255,0.10)', cardBorder:'rgba(224,231,255,0.40)', iconColor:'#1e1b4b', labelColor:'#e0e7ff' },
    diamond:  { label:'Diamond',  gradient:'linear-gradient(145deg,#bfdbfe 0%,#1d4ed8 50%,#1e3a8a 100%)', ring:'#93c5fd', glow:'rgba(147,197,253,0.70)', cardGlow:'rgba(147,197,253,0.13)', cardBorder:'rgba(147,197,253,0.44)', iconColor:'#fff', labelColor:'#bfdbfe', special:true },
    legendary:{ label:'Legendary',gradient:'linear-gradient(145deg,#818cf8 0%,#c084fc 40%,#f0abfc 70%,#44FFFF 100%)', ring:'#a78bfa', glow:'rgba(167,139,250,0.75)', cardGlow:'rgba(167,139,250,0.16)', cardBorder:'rgba(167,139,250,0.50)', iconColor:'#0B0E14', labelColor:'#c4b5fd', special:true, legendary:true },
  },

  // ── REVIEWS  Teal / Emerald writing ──────────────────────────────────
  reviews: {
    bronze:   { label:'Bronze',   gradient:'linear-gradient(145deg,#6ee7b7 0%,#065f46 100%)', ring:'#6ee7b7', glow:'rgba(110,231,183,0.55)', cardGlow:'rgba(110,231,183,0.08)', cardBorder:'rgba(110,231,183,0.30)', iconColor:'#022c22', labelColor:'#a7f3d0' },
    silver:   { label:'Silver',   gradient:'linear-gradient(145deg,#99f6e4 0%,#0d9488 100%)', ring:'#5eead4', glow:'rgba(94,234,212,0.58)', cardGlow:'rgba(94,234,212,0.09)', cardBorder:'rgba(94,234,212,0.33)', iconColor:'#022c22', labelColor:'#ccfbf1' },
    gold:     { label:'Gold',     gradient:'linear-gradient(145deg,#67e8f9 0%,#0891b2 100%)', ring:'#67e8f9', glow:'rgba(103,232,249,0.62)', cardGlow:'rgba(103,232,249,0.10)', cardBorder:'rgba(103,232,249,0.37)', iconColor:'#0B0E14', labelColor:'#cffafe' },
    platinum: { label:'Platinum', gradient:'linear-gradient(145deg,#a5f3fc 0%,#0369a1 100%)', ring:'#7dd3fc', glow:'rgba(125,211,252,0.65)', cardGlow:'rgba(125,211,252,0.10)', cardBorder:'rgba(125,211,252,0.40)', iconColor:'#0B0E14', labelColor:'#e0f2fe' },
    legendary:{ label:'Legendary',gradient:'linear-gradient(145deg,#5eead4 0%,#22d3ee 40%,#818cf8 100%)', ring:'#22d3ee', glow:'rgba(34,211,238,0.75)', cardGlow:'rgba(34,211,238,0.15)', cardBorder:'rgba(34,211,238,0.50)', iconColor:'#0B0E14', labelColor:'#67e8f9', special:true, legendary:true },
  },

  // ── LIKED  Rose / Deep pink ───────────────────────────────────────────
  liked: {
    bronze:   { label:'Bronze',   gradient:'linear-gradient(145deg,#fda4af 0%,#9f1239 100%)', ring:'#fda4af', glow:'rgba(253,164,175,0.55)', cardGlow:'rgba(253,164,175,0.08)', cardBorder:'rgba(253,164,175,0.30)', iconColor:'#fff', labelColor:'#fecdd3' },
    silver:   { label:'Silver',   gradient:'linear-gradient(145deg,#fb7185 0%,#be123c 100%)', ring:'#fb7185', glow:'rgba(251,113,133,0.60)', cardGlow:'rgba(251,113,133,0.09)', cardBorder:'rgba(251,113,133,0.34)', iconColor:'#fff', labelColor:'#fda4af' },
    gold:     { label:'Gold',     gradient:'linear-gradient(145deg,#f472b6 0%,#9d174d 100%)', ring:'#f472b6', glow:'rgba(244,114,182,0.65)', cardGlow:'rgba(244,114,182,0.11)', cardBorder:'rgba(244,114,182,0.40)', iconColor:'#fff', labelColor:'#fbcfe8', special:true },
  },

  // ── REWATCH  Orange / Warm amber ──────────────────────────────────────
  rewatch: {
    bronze:   { label:'Bronze',   gradient:'linear-gradient(145deg,#fdba74 0%,#c2410c 100%)', ring:'#fb923c', glow:'rgba(251,146,60,0.58)', cardGlow:'rgba(251,146,60,0.09)', cardBorder:'rgba(251,146,60,0.32)', iconColor:'#fff', labelColor:'#fed7aa' },
    silver:   { label:'Silver',   gradient:'linear-gradient(145deg,#fbbf24 0%,#b45309 100%)', ring:'#fbbf24', glow:'rgba(251,191,36,0.62)', cardGlow:'rgba(251,191,36,0.10)', cardBorder:'rgba(251,191,36,0.36)', iconColor:'#451a03', labelColor:'#fde68a', special:true },
  },

  // ── PROFILE  Sky blue / Trustworthy ──────────────────────────────────
  profile: {
    bronze:   { label:'Bronze',   gradient:'linear-gradient(145deg,#93c5fd 0%,#1d4ed8 100%)', ring:'#93c5fd', glow:'rgba(147,197,253,0.55)', cardGlow:'rgba(147,197,253,0.08)', cardBorder:'rgba(147,197,253,0.30)', iconColor:'#fff', labelColor:'#bfdbfe' },
    silver:   { label:'Silver',   gradient:'linear-gradient(145deg,#60a5fa 0%,#1e40af 100%)', ring:'#60a5fa', glow:'rgba(96,165,250,0.60)', cardGlow:'rgba(96,165,250,0.09)', cardBorder:'rgba(96,165,250,0.34)', iconColor:'#fff', labelColor:'#93c5fd' },
    gold:     { label:'Gold',     gradient:'linear-gradient(145deg,#38bdf8 0%,#0369a1 100%)', ring:'#38bdf8', glow:'rgba(56,189,248,0.62)', cardGlow:'rgba(56,189,248,0.10)', cardBorder:'rgba(56,189,248,0.37)', iconColor:'#fff', labelColor:'#bae6fd' },
  },

  // ── SOCIAL  Violet / Fuchsia connection ──────────────────────────────
  social: {
    bronze:   { label:'Bronze',   gradient:'linear-gradient(145deg,#c084fc 0%,#4c1d95 100%)', ring:'#c084fc', glow:'rgba(192,132,252,0.55)', cardGlow:'rgba(192,132,252,0.08)', cardBorder:'rgba(192,132,252,0.30)', iconColor:'#fff', labelColor:'#e9d5ff' },
    silver:   { label:'Silver',   gradient:'linear-gradient(145deg,#a855f7 0%,#3b0764 100%)', ring:'#a855f7', glow:'rgba(168,85,247,0.60)', cardGlow:'rgba(168,85,247,0.09)', cardBorder:'rgba(168,85,247,0.34)', iconColor:'#fff', labelColor:'#d8b4fe' },
    gold:     { label:'Gold',     gradient:'linear-gradient(145deg,#d946ef 0%,#701a75 100%)', ring:'#d946ef', glow:'rgba(217,70,239,0.62)', cardGlow:'rgba(217,70,239,0.10)', cardBorder:'rgba(217,70,239,0.37)', iconColor:'#fff', labelColor:'#f0abfc' },
    platinum: { label:'Platinum', gradient:'linear-gradient(145deg,#f0abfc 0%,#a21caf 50%,#4a044e 100%)', ring:'#e879f9', glow:'rgba(232,121,249,0.70)', cardGlow:'rgba(232,121,249,0.13)', cardBorder:'rgba(232,121,249,0.45)', iconColor:'#fff', labelColor:'#fae8ff', special:true },
  },

  // ── COLLECTOR  Warm amber / Archive gold ─────────────────────────────
  collector: {
    bronze:   { label:'Bronze',   gradient:'linear-gradient(145deg,#fcd34d 0%,#78350f 100%)', ring:'#fcd34d', glow:'rgba(252,211,77,0.55)', cardGlow:'rgba(252,211,77,0.08)', cardBorder:'rgba(252,211,77,0.30)', iconColor:'#451a03', labelColor:'#fef08a' },
    silver:   { label:'Silver',   gradient:'linear-gradient(145deg,#fb923c 0%,#7c2d12 100%)', ring:'#fb923c', glow:'rgba(251,146,60,0.58)', cardGlow:'rgba(251,146,60,0.09)', cardBorder:'rgba(251,146,60,0.33)', iconColor:'#fff', labelColor:'#fed7aa' },
    gold:     { label:'Gold',     gradient:'linear-gradient(145deg,#fcd34d 0%,#d97706 50%,#92400e 100%)', ring:'#fcd34d', glow:'rgba(252,211,77,0.65)', cardGlow:'rgba(252,211,77,0.12)', cardBorder:'rgba(252,211,77,0.42)', iconColor:'#451a03', labelColor:'#fef9c3', special:true },
  },
};
