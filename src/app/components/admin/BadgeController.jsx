import { useState, useEffect } from 'react';
import { Award, Plus, Trash2, Search, X, Loader2, Info, AlertTriangle, Film, AlignLeft, Heart, RotateCcw, Star, User, Users, Bookmark, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { TIER, CATEGORY_TIERS } from '../../utils/badgeTiers';
import { BADGE_OVERRIDES } from '../BadgesSection';

const CATEGORY_META = {
  watched:    { Icon: Film,      label: 'Films Watched',   color: '#BFBCFC' },
  reviews:    { Icon: AlignLeft, label: 'Reviews',         color: '#f472b6' },
  liked:      { Icon: Heart,     label: 'Liked',           color: '#fb7185' },
  rewatch:    { Icon: RotateCcw, label: 'Rewatches',       color: '#34d399' },
  special:    { Icon: Star,      label: 'Special',         color: '#fbbf24' },
  profile:    { Icon: User,      label: 'Profile',         color: '#60a5fa' },
  social:     { Icon: Users,     label: 'Social',          color: '#a78bfa' },
  collector:  { Icon: Bookmark,  label: 'Collector',       color: '#f97316' },
  ultra_rare: { Icon: Sparkles,  label: 'Ultra Rare',      color: '#c084fc' },
};

const SHIELD_MASK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .88-1L12 3l7 2.12A1 1 0 0 1 20 6Z' fill='white'/%3E%3C/svg%3E\")";
const shieldMask = { WebkitMaskImage: SHIELD_MASK, maskImage: SHIELD_MASK, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' };

function BadgeEmblem({ badgeStringId, category, tier, size = 52 }) {
  const getTierDetails = () => {
    return BADGE_OVERRIDES[badgeStringId]
      || CATEGORY_TIERS[category]?.[tier]
      || TIER[tier]
      || TIER.bronze;
  };

  const t = getTierDetails();
  const meta = CATEGORY_META[category] || CATEGORY_META.watched;
  const Icon = meta.Icon;
  const iconSz = Math.round(size * 0.38);

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Outer glow */}
      <div style={{ position: 'absolute', inset: -8, background: `radial-gradient(circle, ${t.glow || 'transparent'} 0%, transparent 60%)`, filter: 'blur(8px)', zIndex: 0, opacity: 0.8 }} />
      {/* Ring layer */}
      <div style={{ position: 'absolute', inset: 0, ...shieldMask, background: t.ring || '#ccc', opacity: 0.5, zIndex: 1 }} />
      {/* Gradient fill */}
      <div style={{
        position: 'absolute', inset: 2, ...shieldMask, background: t.gradient || '#666', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={iconSz} color={t.iconColor || '#fff'} strokeWidth={2.2} />
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

export function BadgeController() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    badgeStringId: '',
    name: '',
    description: '',
    category: 'watched',
    tier: 'bronze',
    metric: 'watched',
    threshold: 1
  });

  const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/Badge/admin/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBadges(data);
      } else {
        toast.error("Failed to load badges from server.");
      }
    } catch (err) {
      console.error("Error fetching badges:", err);
      toast.error("Network error while loading badges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenAddModal = () => {
    setForm({
      badgeStringId: '',
      name: '',
      description: '',
      category: 'watched',
      tier: 'bronze',
      metric: 'watched',
      threshold: 1
    });
    setIsAddModalOpen(true);
  };

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!form.badgeStringId.trim() || !form.name.trim() || !form.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const sanitizedId = form.badgeStringId.trim().toLowerCase().replace(/\s+/g, '_');
    if (!/^[a-z0-9_-]+$/.test(sanitizedId)) {
      toast.error("Badge String ID can only contain letters, numbers, underscores, or hyphens.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/Badge/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          badgeStringId: sanitizedId,
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          tier: form.tier,
          threshold: parseInt(form.threshold, 10) || 1,
          metric: form.metric
        })
      });

      if (response.ok) {
        toast.success("Badge successfully created!");
        setIsAddModalOpen(false);
        fetchBadges();
      } else {
        const text = await response.text();
        toast.error(text || "Failed to create badge.");
      }
    } catch (err) {
      console.error("Error creating badge:", err);
      toast.error("Network error while creating badge.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBadge = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/Badge/admin/${deleteTarget.badgeStringId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success(`Badge "${deleteTarget.badgeName}" removed successfully.`);
        setDeleteTarget(null);
        fetchBadges();
      } else {
        const text = await response.text();
        toast.error(text || "Failed to remove badge.");
      }
    } catch (err) {
      console.error("Error deleting badge:", err);
      toast.error("Network error while deleting badge.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBadges = badges.filter(b => 
    (b.badgeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.badgeStringId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.badgeDescription || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#F8FAFC] flex items-center gap-2">
            <Award className="w-8 h-8 text-[#BFBCFC]" />
            Badge Controller
          </h2>
          <p className="text-[#94A3B8] mt-1 text-sm">Create, view, and delete system badge definitions and rules</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] font-bold px-5 py-3 rounded-xl shadow-lg shadow-[#BFBCFC]/10 transition-all active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-5 h-5" />
          Add New Badge
        </button>
      </div>

      {/* Filters/Toolbar */}
      <div className="bg-[#151921] border border-[#BFBCFC]/10 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badges by name, ID or description..."
            className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-12 pr-4 py-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm"
          />
        </div>
        <div className="text-xs text-[#94A3B8] font-medium bg-[#0B0E14] px-4 py-2 rounded-xl border border-[#BFBCFC]/5">
          Total Badges: <span className="text-[#BFBCFC] font-bold font-mono">{filteredBadges.length}</span> / <span className="text-[#94A3B8] font-mono">{badges.length}</span>
        </div>
      </div>

      {/* Badges List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-[#94A3B8] gap-3">
          <Loader2 className="w-8 h-8 text-[#BFBCFC] animate-spin" />
          <p className="text-sm font-medium">Fetching badge database...</p>
        </div>
      ) : filteredBadges.length === 0 ? (
        <div className="text-center py-16 bg-[#151921] border border-[#BFBCFC]/10 rounded-2xl">
          <Award className="w-12 h-12 text-[#94A3B8]/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">No Badges Found</h3>
          <p className="text-[#94A3B8] text-sm max-w-sm mx-auto mt-1">
            {searchQuery ? "Try checking spelling or resetting your search filter." : "Get started by adding a badge definition to the database."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => {
            const catInfo = CATEGORY_META[badge.category] || CATEGORY_META.watched;
            const tierDetails = TIER[badge.tier] || TIER.bronze;
            return (
              <div
                key={badge.badgeId}
                className="group relative bg-gradient-to-br from-[#151921] to-[#0B0E14] border border-[#BFBCFC]/15 hover:border-[#BFBCFC]/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Visual hover background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#BFBCFC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div>
                  {/* Card Header: Emblem + Identity */}
                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    <BadgeEmblem
                      badgeStringId={badge.badgeStringId}
                      category={badge.category}
                      tier={badge.tier}
                    />
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-[#F8FAFC] truncate" title={badge.badgeName}>
                        {badge.badgeName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-[#0B0E14]"
                          style={{ background: tierDetails.labelColor || '#BFBCFC' }}
                        >
                          {badge.tier}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1E2535] text-[#94A3B8] border border-[#BFBCFC]/10">
                          {catInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Info details */}
                  <div className="space-y-3 relative z-10 text-xs border-t border-[#BFBCFC]/5 pt-3 mt-1">
                    <p className="text-[#94A3B8] leading-relaxed line-clamp-2" title={badge.badgeDescription}>
                      {badge.badgeDescription}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 bg-[#0B0E14]/40 p-2.5 rounded-lg border border-[#BFBCFC]/5 font-mono text-[11px]">
                      <div>
                        <span className="text-[#4B5563] block text-[9px] uppercase tracking-wider font-sans font-bold">Badge ID</span>
                        <span className="text-[#BFBCFC] truncate block" title={badge.badgeStringId}>{badge.badgeStringId}</span>
                      </div>
                      <div>
                        <span className="text-[#4B5563] block text-[9px] uppercase tracking-wider font-sans font-bold">Rule Condition</span>
                        <span className="text-[#F8FAFC] block truncate" title={`${badge.threshold} on ${badge.metric}`}>
                          {badge.threshold} × {badge.metric}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 flex justify-end items-center border-t border-[#BFBCFC]/5 pt-4 relative z-10">
                  <button
                    onClick={() => setDeleteTarget(badge)}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Badge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Badge Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#151921] border border-[#BFBCFC]/20 p-6 rounded-2xl w-full max-w-lg shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#BFBCFC]" />
                Add New Badge
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBadge} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Badge String ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="badgeStringId"
                    value={form.badgeStringId}
                    onChange={handleInputChange}
                    placeholder="e.g. cinema_5"
                    required
                    className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm font-mono"
                  />
                  <span className="text-[10px] text-[#4B5563] mt-1 block">lowercase, no spaces (use underscores)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Badge Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Cinephile Gold"
                    required
                    className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm"
                  >
                    {Object.keys(CATEGORY_META).map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_META[cat].label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Tier <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="tier"
                    value={form.tier}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm uppercase"
                  >
                    {Object.keys(TIER).map(tier => (
                      <option key={tier} value={tier}>{TIER[tier].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Trigger Metric <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="metric"
                    value={form.metric}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm"
                  >
                    <option value="watched">movies watched</option>
                    <option value="reviews">reviews written</option>
                    <option value="liked">movies liked</option>
                    <option value="rewatch">rewatches</option>
                    <option value="special_perfect">special_perfect (5-star ratings)</option>
                    <option value="special_harsh">special_harsh (0.5-star ratings)</option>
                    <option value="flag_picture">flag_picture (profile picture uploaded)</option>
                    <option value="flag_bio">flag_bio (profile bio filled)</option>
                    <option value="flag_location">flag_location (profile location filled)</option>
                    <option value="social">social (friends count)</option>
                    <option value="collector">collector (favorites/watchlist count)</option>
                    <option value="all_badges">all_badges (requires earning all regular badges)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Metric Threshold <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="threshold"
                    min="1"
                    value={form.threshold}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm font-mono"
                  />
                  <span className="text-[10px] text-[#4B5563] mt-1 block">Value required to trigger badge award</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Badge Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Awarded for watching 5 cinema films."
                  rows="3"
                  required
                  className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-[#BFBCFC]/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 text-sm bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] font-bold rounded-lg shadow-lg shadow-[#BFBCFC]/20 transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/80 backdrop-blur-sm p-4">
          <div className="bg-[#151921] border border-red-500/30 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">Confirm Deletion</h3>
                <p className="text-xs text-[#94A3B8]">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed">
              Are you sure you want to delete the badge <span className="text-[#F8FAFC] font-semibold">"{deleteTarget.badgeName}"</span> (<span className="text-[#BFBCFC] font-mono text-xs">{deleteTarget.badgeStringId}</span>)?
              This will remove the badge from all users who have currently unlocked it.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBadge}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg shadow-lg shadow-red-500/10 transition-all disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Yes, Delete Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
