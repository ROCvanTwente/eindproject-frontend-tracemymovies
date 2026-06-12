import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Star, AlertCircle, MoreVertical, Trash, Edit, Flag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRefresh } from "../../context/RefreshContext";
import { addReview, getReviewsVoorFilm, addLikeReview, removeLikeReview, deleteReview, reportReview, getReviewById } from "../../services/reviews";
import { getToken, getCurrentUserId } from "../../services/auth";
import { DeleteReviewModal } from "./DeleteReviewModal";
import { ReviewModal } from "./ReviewModal";
import { ReportReviewModal } from "./ReportReviewModal";
import { ReviewForm } from "./ReviewForm";
import { ReviewPagination } from "./ReviewPagination";

export function ReviewSection({ movieId, movieTitle, hideForm = false }) {
    const auth = useAuth();
    const { refreshKey } = useRefresh();
    const isAuthenticated = !!(auth?.user || getToken());
    const token = auth?.user?.token ?? auth?.token ?? getToken();
    const currentUserId = getCurrentUserId();

    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [likedMap, setLikedMap] = useState({});
    const [openMenuKey, setOpenMenuKey] = useState(null);
    const [revealedSpoilers, setRevealedSpoilers] = useState({});

    const toggleReveal = (key) => setRevealedSpoilers((prev) => ({ ...prev, [key]: true }));

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

    useEffect(() => {
        if (!movieId) return;
        refreshReviews();
    }, [refreshKey]);

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
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportTarget, setReportTarget] = useState(null);
    

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

    const openReportModal = (review) => {
        setReportTarget(review);
        setReportModalOpen(true);
        setOpenMenuKey(null);
    };

    const closeReportModal = () => {
        setReportModalOpen(false);
        setReportTarget(null);
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
                toast.error("Could not remove like.");
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
            toast.error("Could not update like.");
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
            toast.error("Could not find review id.");
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
            toast.error("Could not verify review. Try again or reload the page.");
            return false;
        }

        const latestOwnerId = getReviewOwnerId(latest);
        if (!currentUserId || latestOwnerId == null || String(latestOwnerId) !== String(currentUserId)) {
            toast.error("You can only delete your own review.");
            return false;
        }

        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return false;

        const removed = await deleteReview(reviewId, token);
        if (!removed) {
            toast.error("Could not delete review.");
            return false;
        }

        setReviews((prev) => prev.filter((r, index) => getReviewKey(r, index) !== reviewKey));
        setLikedMap((prev) => {
            const next = { ...prev };
            delete next[reviewKey];
            return next;
        });
        setUserLikedReview(review, false);
        toast.success("Review deleted.");
        // close any open menu for this review
        setOpenMenuKey((prev) => (prev === reviewKey ? null : prev));
        return true;
    };

    const handleSubmitReview = async (reviewRating, reviewText, containsSpoilers, resetForm) => {
        if (reviewRating === 0) {
            toast.error("Selecteer een score.");
            return;
        }

        if (!reviewText.trim()) {
            toast.error("Schrijf eerst een review.");
            return;
        }

        const MAX_REVIEW_LENGTH = 5000;
        if (reviewText.trim().length > MAX_REVIEW_LENGTH) {
            toast.error(`Maximaal ${MAX_REVIEW_LENGTH} tekens toegestaan.`);
            return;
        }

        if (!token) {
            toast.error("Your session is missing a valid login token. Please log in again.");
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
                toast.error("Could not post review. Check if the API is running on https://localhost:7112 and if you are logged in.");
                return;
            }

            toast.success("Review saved.");
            resetForm();

            await refreshReviews();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4">Reviews</h3>

            {!hideForm && (
                <ReviewForm
                    movieTitle={movieTitle}
                    isAuthenticated={isAuthenticated}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitReview}
                />
            )}

            {isLoadingReviews ? (
                <div className="text-[#94A3B8] text-sm">Loading reviews...</div>
            ) : normalizedReviews.length === 0 ? (
                <div className="text-[#94A3B8] text-sm">No reviews for this movie yet.</div>
            ) : (
                <>
                {paginatedReviews.map((review, pageIndex) => {
                    const index = (currentPage - 1) * REVIEWS_PER_PAGE + pageIndex;
                    const reviewKey = getReviewKey(review, index);
                    const reviewOwnerId = getReviewOwnerId(review);
                    const isOwner = currentUserId != null && reviewOwnerId != null && String(reviewOwnerId) === String(currentUserId);

                    const author = review?.user?.userName || review?.userName || (review?.userId ? `User #${review.userId}` : "Anonymous");
                    const dateValue = review?.date_created || review?.createdAt || review?.date || review?.watchedDate;
                    const dateString = dateValue ? new Date(dateValue).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                    }) : "No date";
                    const rating = review?.rating ?? review?.score ?? 0;
                    const likes = review?.likes ?? review?.likeCount ?? 0;
                    const spoiler = review?.containsSpoilers ?? review?.spoiler ?? false;
                    const content = review?.review || review?.content || review?.reviewText || review?.text || "";

                    return (
                        <div key={reviewKey} className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#BFBCFC]/10 rounded-full flex items-center justify-center">
                                        <span className="text-[#BFBCFC] font-bold">{author.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[#F8FAFC] font-medium">{author}</p>
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

                                                {(() => {
                                                    const reviewOwnerId = getReviewOwnerId(review);
                                                    const isOwner = currentUserId != null && reviewOwnerId != null && String(reviewOwnerId) === String(currentUserId);
                                                    return !isOwner ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => openReportModal(review)}
                                                            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#94A3B8] hover:bg-[#1E2230] transition-colors"
                                                        >
                                                            <Flag className="w-4 h-4 text-[#94A3B8]" />
                                                            Report
                                                        </button>
                                                    ) : null;
                                                })()}
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

                            <ReportReviewModal
                                isOpen={reportModalOpen}
                                onClose={closeReportModal}
                                review={reportTarget}
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
                
                <ReviewPagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />

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
                        toast.success("Review updated.");
                    }}
                />

                <ReportModal
                    isOpen={reportModalOpen}
                    onClose={() => {
                        setReportModalOpen(false);
                        setReportTarget(null);
                    }}
                    reviewAuthor={reportTarget?.review.user?.userName || reportTarget?.review.userName || 'Anonymous'}
                    reviewContent={reportTarget?.review.review || reportTarget?.review.content || reportTarget?.review.reviewText || reportTarget?.review.text || ''}
                    reviewId={reportTarget?.review.id ?? reportTarget?.review.reviewId}
                    onReport={(reason) => {
                        toast.success("Review reported.");
                        setReportModalOpen(false);
                        setReportTarget(null);
                    }}
                />
                </>
            )}
        </div>
    );
}