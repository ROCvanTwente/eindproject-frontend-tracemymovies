import React, { useEffect, useMemo, useState } from "react";
import { Star, AlertCircle, Send, MoreVertical, Flag, Trash, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { addReview, getReviewsVoorFilm, addLikeReview, removeLikeReview, deleteReview, reportReview, getReviewById } from "../../services/reviews";
import { getToken, getCurrentUserId } from "../../services/auth";
import { DeleteReviewModal } from "./DeleteReviewModal";
import { ReviewModal } from "./ReviewModal";

export function ReviewSection({ movieId, movieTitle }) {
    const auth = useAuth();
    const isAuthenticated = !!(auth?.user || getToken());
    const token = auth?.user?.token ?? auth?.token ?? getToken();
    const currentUserId = getCurrentUserId();

    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [containsSpoilers, setContainsSpoilers] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [revealedSpoilers, setRevealedSpoilers] = useState({});
    const [likedMap, setLikedMap] = useState({});
    const [openMenuKey, setOpenMenuKey] = useState(null);

    const MAX_REVIEW_LENGTH = 500;

    const getLikeStorageKey = (reviewId) => {
        if (currentUserId == null || reviewId == null) return null;
        return `review-liked:${currentUserId}:${reviewId}`;
    };

    const hasUserLikedReview = (review, reviewKey) => {
        const reviewId = review?.id ?? review?.reviewId ?? reviewKey;
        const storageKey = getLikeStorageKey(reviewId);

        if (storageKey && localStorage.getItem(storageKey) === "true") {
            return true;
        }

        return !!likedMap[reviewKey];
    };

    const setUserLikedReview = (review, isLiked) => {
        const reviewId = review?.id ?? review?.reviewId;
        const storageKey = getLikeStorageKey(reviewId);

        if (storageKey) {
            if (isLiked) {
                localStorage.setItem(storageKey, "true");
            } else {
                localStorage.removeItem(storageKey);
            }
        }
    };

    const getReviewKey = (review, index = 0) => {
        if (review?.id != null) return `review-${review.id}`;
        if (review?.reviewId != null) return `review-${review.reviewId}`;

        const author = review?.user?.userName || review?.userName || (review?.userId ? `User #${review.userId}` : "Anonymous");
        const content = review?.review || review?.content || review?.reviewText || review?.text || "";
        return `${author}-${content.slice(0, 40)}-${index}`;
    };

    const getReviewOwnerId = (review) => review?.userId ?? review?.user?.id ?? review?.user?.userId ?? review?.user?.userID ?? null;

    const refreshReviews = async () => {
        const refreshed = await getReviewsVoorFilm(movieId);
        const loaded = Array.isArray(refreshed) ? refreshed : refreshed?.reviews || [];
        setReviews(loaded);

        const seeded = {};
        loaded.forEach((r, index) => {
            const reviewKey = getReviewKey(r, index);
            const reviewId = r?.id ?? r?.reviewId;
            const storageKey = getLikeStorageKey(reviewId);
            seeded[reviewKey] = !!(r.userLiked ?? r.likedByCurrentUser ?? r.isLiked ?? false) || (storageKey ? localStorage.getItem(storageKey) === "true" : false);
        });
        setLikedMap(seeded);
    };

    useEffect(() => {
        if (!movieId) return;

        // (debug logs removed)

        let isMounted = true;

        const loadReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const data = await getReviewsVoorFilm(movieId);
                if (isMounted) {
                    const loaded = Array.isArray(data) ? data : data?.reviews || [];
                    setReviews(loaded);

                    const seeded = {};
                    loaded.forEach((r, index) => {
                        const reviewKey = getReviewKey(r, index);
                        const reviewId = r?.id ?? r?.reviewId;
                        const storageKey = getLikeStorageKey(reviewId);
                        seeded[reviewKey] = !!(r.userLiked ?? r.likedByCurrentUser ?? r.isLiked ?? false) || (storageKey ? localStorage.getItem(storageKey) === "true" : false);
                    });
                    setLikedMap(seeded);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingReviews(false);
                }
            }
        };

        loadReviews();

        return () => {
            isMounted = false;
        };
    }, [movieId]);

    const normalizedReviews = useMemo(() => {
        return [...(reviews || [])].sort((a, b) => {
            const likesA = a.likes ?? a.likeCount ?? 0;
            const likesB = b.likes ?? b.likeCount ?? 0;
            return likesB - likesA;
        });
    }, [reviews]);

    const REVIEWS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(normalizedReviews.length / REVIEWS_PER_PAGE));

    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
        return normalizedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
    }, [normalizedReviews, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    

    const openDeleteModal = (review, reviewKey) => {
        setDeleteTarget({ review, reviewKey });
        setDeleteModalOpen(true);
        setOpenMenuKey(null);
    };

    const openEditModal = (review) => {
        setEditTarget(review);
        setEditModalOpen(true);
        setOpenMenuKey(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    

    const handleToggleLike = async (review, reviewKey) => {
        if (!currentUserId || !token) {
            toast.error("Log in to like a review.");
            return;
        }

        const currentlyLiked = hasUserLikedReview(review, reviewKey);
        if (currentlyLiked) {
            setLikedMap((prev) => ({ ...prev, [reviewKey]: false }));
            setReviews((prev) => prev.map((r, index) => {
                const key = getReviewKey(r, index);
                if (key !== reviewKey) return r;
                return { ...r, likes: Math.max(0, (r.likes ?? r.likeCount ?? 0) - 1) };
            }));

            const res = await removeLikeReview(review.id ?? review.reviewId ?? reviewKey, token);

            if (!res) {
                setLikedMap((prev) => ({ ...prev, [reviewKey]: true }));
                setUserLikedReview(review, true);
                setReviews((prev) => prev.map((r, index) => {
                    const key = getReviewKey(r, index);
                    if (key !== reviewKey) return r;
                    return { ...r, likes: (r.likes ?? r.likeCount ?? 0) + 1 };
                }));
                toast.error("Kon like niet verwijderen.");
                return;
            }

            const nextLikes = res?.currentLikes ?? res?.likes ?? res?.likeCount;
            if (typeof nextLikes === "number") {
                setReviews((prev) => prev.map((r, index) => {
                    const key = getReviewKey(r, index);
                    if (key !== reviewKey) return r;
                    return { ...r, likes: nextLikes };
                }));
            }

            setUserLikedReview(review, false);
            try { await refreshReviews(); } catch { /* ignore refresh failures */ }
            return;
        }

        setLikedMap((prev) => ({ ...prev, [reviewKey]: true }));
        setReviews((prev) => prev.map((r, index) => {
            const key = getReviewKey(r, index);
            if (key !== reviewKey) return r;
            return { ...r, likes: (r.likes ?? r.likeCount ?? 0) + 1 };
        }));

        const res = await addLikeReview(review.id ?? review.reviewId ?? reviewKey, token);

        if (!res) {
            setLikedMap((prev) => ({ ...prev, [reviewKey]: false }));
            setUserLikedReview(review, false);
            setReviews((prev) => prev.map((r, index) => {
                const key = getReviewKey(r, index);
                if (key !== reviewKey) return r;
                return { ...r, likes: (r.likes ?? r.likeCount ?? 0) - 1 };
            }));
            toast.error("Kon like niet bijwerken.");
            return;
        }

        const nextLikes = res?.currentLikes ?? res?.likes ?? res?.likeCount;
        if (typeof nextLikes === "number") {
            setReviews((prev) => prev.map((r, index) => {
                const key = getReviewKey(r, index);
                if (key !== reviewKey) return r;
                return { ...r, likes: nextLikes };
            }));
        }

        setUserLikedReview(review, true);
        setLikedMap((prev) => ({ ...prev, [reviewKey]: true }));

        try {
            await refreshReviews();
        } catch {
            // ignore refresh failures
        }
    };

    const handleDeleteReview = async (review, reviewKey) => {
        const reviewId = review.id ?? review.reviewId;
        if (!reviewId) {
            toast.error("Kon review-id niet vinden.");
            return false;
        }

        // re-fetch the review from the server to verify ownership before confirming
        // many backends don't expose a single-review endpoint (404). First try list lookup which is known to work.
        let latest = null;
            try {
                const all = await getReviewsVoorFilm(movieId);
                const loaded = Array.isArray(all) ? all : all?.reviews || [];
                latest = loaded.find((r) => String(r.id ?? r.reviewId) === String(reviewId));
            } catch (e) {
                latest = null;
            }

        // if not found in list, try single-review endpoint as last resort
        if (!latest) {
            latest = await getReviewById(reviewId, token);
        }

        if (!latest) {
            toast.error("Kon review niet verifiëren. Probeer opnieuw of herlaad de pagina.");
            return false;
        }

        const latestOwnerId = getReviewOwnerId(latest);
        if (!currentUserId || latestOwnerId == null || String(latestOwnerId) !== String(currentUserId)) {
            toast.error("Je kunt alleen je eigen review verwijderen.");
            return false;
        }

        const confirmed = window.confirm("Weet je zeker dat je deze review wilt verwijderen?");
        if (!confirmed) return false;

        const removed = await deleteReview(reviewId, token);
        if (!removed) {
            toast.error("Kon review niet verwijderen.");
            return false;
        }

        setReviews((prev) => prev.filter((r, index) => getReviewKey(r, index) !== reviewKey));
        setLikedMap((prev) => {
            const next = { ...prev };
            delete next[reviewKey];
            return next;
        });
        setUserLikedReview(review, false);
        setRevealedSpoilers((prev) => {
            const next = { ...prev };
            delete next[reviewKey];
            return next;
        });
        toast.success("Review verwijderd.");
        // close any open menu for this review
        setOpenMenuKey((prev) => (prev === reviewKey ? null : prev));
        return true;
    };

    const handleReportReview = async (review, reviewKey) => {
        const reviewId = review.id ?? review.reviewId;
        if (!reviewId) {
            toast.error("Kon review-id niet vinden.");
            return;
        }

        const reason = window.prompt("Waarom wil je deze review rapporteren?");
        if (reason === null) return;

        const trimmedReason = reason.trim();
        if (!trimmedReason) {
            toast.error("Geef een reden op.");
            return;
        }

        const result = await reportReview(reviewId, trimmedReason, token);
        if (!result) {
            toast.error("Kon review niet rapporteren.");
            return;
        }

        setOpenMenuKey((prev) => (prev === reviewKey ? null : prev));
        toast.success("Review gerapporteerd.");
    };

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            toast.error("Selecteer een score.");
            return;
        }

        if (!reviewText.trim()) {
            toast.error("Schrijf eerst een review.");
            return;
        }

        if (reviewText.trim().length > MAX_REVIEW_LENGTH) {
            toast.error(`Maximaal ${MAX_REVIEW_LENGTH} tekens toegestaan.`);
            return;
        }

        if (!token) {
            toast.error("Je sessie mist een geldige inlogtoken. Log opnieuw in.");
            return;
        }

        setIsSubmitting(true);
        try {
            const createdReview = await addReview({
                movieId: Number(movieId),
                rating: reviewRating,
                reviewText: reviewText.trim(),
                containsSpoilers,
            }, token);

            if (!createdReview) {
                toast.error("Kon review niet plaatsen. Controleer of de API draait op https://localhost:7112 en of je bent ingelogd.");
                return;
            }

            toast.success("Review opgeslagen.");
            setReviewText("");
            setReviewRating(0);
            setContainsSpoilers(false);
            setHoverRating(0);

            await refreshReviews();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4">Reviews</h3>

            <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-6">
                <h4 className="text-base md:text-lg font-bold font-heading text-[#F8FAFC] mb-4">Write a Review</h4>

                {!isAuthenticated ? (
                    <div className="rounded-xl border border-[#BFBCFC]/15 bg-[#0B0E14] p-4 text-sm text-[#94A3B8]">
                        Log in om een review te plaatsen.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#F8FAFC] text-sm font-medium mb-2">Your Rating</label>
                            <div className="flex gap-2 flex-wrap" onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => {
                                    const active = hoverRating ? rating <= hoverRating : rating <= reviewRating;

                                    return (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setReviewRating(rating)}
                                            onMouseEnter={() => setHoverRating(rating)}
                                            className="transition-all duration-200"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-all duration-200 ${active ? "text-[#44FFFF] fill-[#44FFFF] scale-110" : "text-[#94A3B8] fill-transparent scale-100"}`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#F8FAFC] text-sm font-medium mb-2">Your Review</label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder={`Share your thoughts about ${movieTitle}...`}
                                rows={4}
                                maxLength={MAX_REVIEW_LENGTH}
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none placeholder:text-[#94A3B8]"
                            />
                            <div className="text-right text-sm text-[#94A3B8] mt-1">
                                {reviewText.length} / {MAX_REVIEW_LENGTH} tekens
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="spoilers"
                                checked={containsSpoilers}
                                onChange={(e) => setContainsSpoilers(e.target.checked)}
                                className="w-4 h-4 rounded border-[#BFBCFC]/30 bg-[#0B0E14] checked:bg-[#FF61D2] focus:ring-2 focus:ring-[#FF61D2]/20"
                            />
                                <label htmlFor="spoilers" className="text-[#94A3B8] text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-[#FF61D2]" />
                                This review contains spoilers
                            </label>
                        </div>

                            <button
                                onClick={handleSubmitReview}
                                disabled={isSubmitting}
                                className="w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40 flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                    </div>
                )}
            </div>

            {isLoadingReviews ? (
                <div className="text-[#94A3B8] text-sm">Reviews laden...</div>
            ) : normalizedReviews.length === 0 ? (
                <div className="text-[#94A3B8] text-sm">Nog geen reviews voor deze film.</div>
            ) : (
                <>
                {paginatedReviews.map((review, pageIndex) => {
                    const index = (currentPage - 1) * REVIEWS_PER_PAGE + pageIndex;
                    const author = review.user?.userName || review.userName || (review.userId ? `User #${review.userId}` : "Anonymous");
                    const content = review.review || review.content || review.reviewText || review.text || "";
                    const rating = review.rating ?? review.score ?? 0;
                    const spoiler = review.spoiler ?? review.containsSpoilers ?? review.containSpoilers ?? review.containSpoiler ?? false;
                    const likes = review.likes ?? review.likeCount ?? 0;
                    // ownership is verified when attempting delete; do not expose IDs in the UI
                    const reviewKey = getReviewKey(review, index);

                    const toggleReveal = (key) => {
                        setRevealedSpoilers((prev) => ({ ...prev, [key]: !prev[key] }));
                    };

                    return (
                        <div key={reviewKey} className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#BFBCFC]/10 rounded-full flex items-center justify-center">
                                        <span className="text-[#BFBCFC] font-bold">{author.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-[#F8FAFC] font-medium break-words break-all">{author}</p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-[#44FFFF]" fill="currentColor" />
                                            <span className="text-[#44FFFF] font-data text-sm">{rating}/10</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap justify-end relative">
                                    <button
                                        onClick={() => handleToggleLike(review, reviewKey)}
                                        className={`transition-colors font-medium ${likedMap[reviewKey] ? "text-[#FF61D2]" : "text-[#94A3B8] hover:text-[#BFBCFC]"}`}
                                    >
                                        ♥ {likes}
                                    </button>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setOpenMenuKey((prev) => (prev === reviewKey ? null : reviewKey))}
                                            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                                            aria-label="Review actions"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {openMenuKey === reviewKey && (
                                            <div className="absolute right-0 top-9 z-20 w-56 rounded-2xl border border-[#BFBCFC]/15 bg-[#151921] shadow-2xl shadow-black/40 p-2">
                                                {(() => {
                                                    const reviewOwnerId = getReviewOwnerId(review);
                                                    const canDeleteReview = currentUserId != null && reviewOwnerId != null && String(reviewOwnerId) === String(currentUserId);
                                                    return canDeleteReview ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal(review, reviewKey)}
                                                            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#FF61D2] hover:bg-[#1E2230] transition-colors"
                                                        >
                                                            <Trash className="w-4 h-4 text-[#FF61D2]/90" />
                                                            Delete
                                                        </button>
                                                    ) : null;
                                                })()}
                                                {(() => {
                                                    const reviewOwnerId = getReviewOwnerId(review);
                                                    const canEditReview = currentUserId != null && reviewOwnerId != null && String(reviewOwnerId) === String(currentUserId);
                                                    return canEditReview ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(review)}
                                                            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#BFBCFC] hover:bg-[#1E2230] transition-colors"
                                                            aria-label="Bewerk review"
                                                        >
                                                            <Edit className="w-4 h-4 text-[#BFBCFC]" />
                                                            Bewerken
                                                        </button>
                                                    ) : null;
                                                })()}

                                                <button
                                                    type="button"
                                                    onClick={() => toast(`Komt binnenkort — ik wil dit later doen.`, { duration: 4000 })}
                                                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#94A3B8] bg-[#0B0E14] cursor-default"
                                                >
                                                    <Flag className="w-4 h-4 text-[#94A3B8]" />
                                                    Report (Komt binnenkort)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>

                            {spoiler && (
                                <div className="mb-2 inline-flex items-center gap-1 bg-[#FF61D2]/10 border border-[#FF61D2]/30 text-[#FF61D2] px-2 py-1 rounded text-xs font-medium">
                                        <AlertCircle className="w-3 h-3" />
                                        Contains Spoilers
                                </div>
                            )}
                            <DeleteReviewModal
                                isOpen={deleteModalOpen}
                                onClose={closeDeleteModal}
                                reviewAuthor={deleteTarget?.review.user?.userName || deleteTarget?.review.userName || 'Anonymous'}
                                reviewContent={deleteTarget?.review.review || deleteTarget?.review.content || deleteTarget?.review.reviewText || deleteTarget?.review.text || ''}
                                reviewId={deleteTarget?.review.id ?? deleteTarget?.review.reviewId}
                                onDeleted={async () => { await refreshReviews(); }}
                            />

                            <ReviewModal
                                isOpen={editModalOpen}
                                onClose={() => setEditModalOpen(false)}
                                existingReview={editTarget}
                                movieTitle={movieTitle}
                                onSaved={async () => {
                                    await refreshReviews();
                                    setEditModalOpen(false);
                                    toast.success("Review bijgewerkt.");
                                }}
                            />

                            

                            {spoiler && !revealedSpoilers[reviewKey] ? (
                                <div className="relative">
                                    <p className="text-[#94A3B8] leading-relaxed text-sm md:text-base break-words break-all blur-sm select-none">{content}</p>
                                    <button
                                        onClick={() => toggleReveal(reviewKey)}
                                        className="absolute inset-0 flex items-center justify-center text-[#FF61D2] bg-black/30 hover:bg-black/40 rounded-xl font-medium"
                                    >
                                        Contains Spoilers — Click to reveal
                                    </button>
                                </div>
                            ) : (
                                <p className="text-[#94A3B8] leading-relaxed text-sm md:text-base break-words break-all">{content}</p>
                            )}
                        </div>
                    );
                })
                }
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-[#151921] border border-[#BFBCFC]/15 text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E293B] transition-colors flex items-center justify-center"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-[#94A3B8] text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-[#151921] border border-[#BFBCFC]/15 text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E293B] transition-colors flex items-center justify-center"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                </>
            )}
        </div>
    );
}
