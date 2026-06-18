import React, { useState, useEffect } from "react";
import { Star, AlertCircle, MoreVertical, Trash, Edit, Flag, Eye, Shield } from "lucide-react";
import { ExpandableReviewText } from "./ExpandableReviewText";
import { BadgeChip } from "../BadgesSection";
import { getToken } from "../../services/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Module-level cache — avoids re-fetching the same user across re-renders
const _badgeCache = {};
const _adminCache = {};

function UserAvatar({ profileImageBase64, author }) {
    const imgSrc = profileImageBase64
        ? (profileImageBase64.startsWith('data:') || profileImageBase64.startsWith('http')
            ? profileImageBase64
            : `data:image/jpeg;base64,${profileImageBase64}`)
        : null;

    if (imgSrc) {
        return (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#BFBCFC]/20">
                <img src={imgSrc} alt={author} className="w-full h-full object-cover" />
            </div>
        );
    }
    return (
        <div className="w-10 h-10 bg-[#BFBCFC]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#BFBCFC] font-bold">{author.charAt(0).toUpperCase()}</span>
        </div>
    );
}

export function ReviewItem({
    review, reviewKey, movieTitle, isLiked, canEdit, canDelete,
    isMenuOpen, onToggleMenu,
    onToggleLike, onEdit, onDelete, onReport
}) {
    const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false);
    const [topBadges, setTopBadges] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const author = review.user?.userName || review.userName || review.authorName || (review.userId ? `User #${review.userId}` : "Anonymous");
    const profileImg = review.profileImageBase64 ?? review.user?.profileImageBase64 ?? review.profilePicture ?? review.user?.profilePicture;
    const content = review.review || "";
    const rating = review.rating ?? 0;
    const spoiler = review.containsSpoilers ?? false;
    const likes = review.likes ?? 0;
    const dateValue = review.date_created;
    const dateString = dateValue ? new Date(dateValue).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }) : "No date";

    const userId = review.userId ?? review.user?.id ?? review.user?.userId ?? review.user?.userID;

    useEffect(() => {
        if (!userId) return;
        if (_badgeCache[userId] !== undefined) {
            setTopBadges(_badgeCache[userId]);
            setIsAdmin(_adminCache[userId] ?? false);
            return;
        }
        const token = getToken();
        if (!token) { _badgeCache[userId] = []; setTopBadges([]); return; }

        fetch(`${API_BASE}/Badge/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                const selectedIds = data?.selectedBadgeIds ?? [];
                const allBadges = data?.badges ?? [];

                const result = allBadges.filter(b => selectedIds.includes(b.id));

                _badgeCache[userId] = result;
                _adminCache[userId] = data?.isAdmin ?? false;
                setTopBadges(result);
                setIsAdmin(data?.isAdmin ?? false);
            })
            .catch(() => { _badgeCache[userId] = []; setTopBadges([]); });
    }, [userId]);

    return (
        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <UserAvatar profileImageBase64={profileImg} author={author} />
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[#F8FAFC] font-medium">{author}</p>
                            {isAdmin && (
                                <span
                                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 text-red-300 border border-red-500/60"
                                    style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.25) 0%, rgba(239,68,68,0.15) 100%)', boxShadow: '0 0 10px rgba(239,68,68,0.5), 0 0 20px rgba(239,68,68,0.25), inset 0 0 8px rgba(239,68,68,0.1)' }}
                                >
                                    <Shield className="w-3 h-3 text-red-400" />Admin
                                </span>
                            )}
                            {topBadges && topBadges.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {topBadges.map(b => <BadgeChip key={b.id} badge={b} size={22} />)}
                                </div>
                            )}
                            <span className="text-[#94A3B8] text-xs">•</span>
                            <span className="text-[#94A3B8] text-xs">{dateString}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-4 h-4 text-[#44FFFF]" fill="currentColor" />
                            <span className="text-[#44FFFF] font-data text-sm">{rating}/10</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap justify-end relative">
                    <button
                        onClick={() => onToggleLike(review, reviewKey)}
                        className={`transition-colors font-medium ${isLiked ? "text-[#FF61D2]" : "text-[#94A3B8] hover:text-[#BFBCFC]"}`}
                    >
                        ♥ {likes}
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => onToggleMenu(reviewKey)}
                            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                            aria-label="Review actions"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-9 z-20 w-56 rounded-2xl border border-[#BFBCFC]/15 bg-[#151921] shadow-2xl shadow-black/40 p-2">
                                {canDelete && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete(review, reviewKey)}
                                        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#FF61D2] hover:bg-[#1E2230] transition-colors"
                                    >
                                        <Trash className="w-4 h-4 text-[#FF61D2]/90" />
                                        Delete
                                    </button>
                                )}
                                {canEdit && (
                                    <button
                                        type="button"
                                        onClick={() => onEdit(review)}
                                        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#BFBCFC] hover:bg-[#1E2230] transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-[#BFBCFC]" />
                                        Edit
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onReport(review, reviewKey)}
                                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#94A3B8] bg-[#0B0E14] transition-colors"
                                >
                                    <Flag className="w-4 h-4 text-[#94A3B8]" />
                                    Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {spoiler && !isSpoilerRevealed ? (
                <div className="my-4">
                    <div className="bg-[#FF61D2]/5 border-2 border-[#FF61D2]/20 rounded-xl p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <AlertCircle className="w-6 h-6 text-[#FF61D2]" />
                            <h4 className="text-[#FF61D2] font-bold text-lg">Spoiler Warning</h4>
                        </div>
                        <p className="text-[#94A3B8] mb-4 text-sm">
                            This review contains spoilers for {movieTitle || "this movie"}
                        </p>
                        <button
                            onClick={() => setIsSpoilerRevealed(true)}
                            className="px-6 py-2.5 bg-[#FF61D2]/10 hover:bg-[#FF61D2]/20 text-[#FF61D2] rounded-lg font-medium transition-all border border-[#FF61D2]/30 flex items-center gap-2 mx-auto"
                        >
                            <Eye className="w-4 h-4" />
                            Reveal Spoilers
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {spoiler && (
                        <div className="mb-3 inline-flex items-center gap-1 bg-[#FF61D2]/10 border border-[#FF61D2]/30 text-[#FF61D2] px-3 py-1.5 rounded-lg text-xs font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Contains Spoilers
                        </div>
                    )}
                    <ExpandableReviewText text={content} maxLength={300} />
                </>
            )}
        </div>
    );
}
