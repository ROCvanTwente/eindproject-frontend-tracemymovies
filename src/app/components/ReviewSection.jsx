import React, { useEffect, useMemo, useState } from "react";
import { Star, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { addReview, getReviewsVoorFilm } from "../services/reviews";
import { getToken } from "../services/auth";

export function ReviewSection({ movieId, movieTitle }) {
    const auth = useAuth();
    const isAuthenticated = !!(auth?.user || getToken());
    const token = auth?.user?.token ?? auth?.token ?? getToken();

    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [containsSpoilers, setContainsSpoilers] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!movieId) return;

        let isMounted = true;

        const loadReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const data = await getReviewsVoorFilm(movieId);
                if (isMounted) {
                    setReviews(Array.isArray(data) ? data : data?.reviews || []);
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

    const normalizedReviews = useMemo(() => reviews || [], [reviews]);

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            toast.error("Selecteer een score.");
            return;
        }

        if (!reviewText.trim()) {
            toast.error("Schrijf eerst een review.");
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

            const refreshed = await getReviewsVoorFilm(movieId);
            setReviews(Array.isArray(refreshed) ? refreshed : refreshed?.reviews || []);
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
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none placeholder:text-[#94A3B8]"
                            />
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
                normalizedReviews.map((review) => {
                    const author = review.user?.userName || review.userName || (review.userId ? `User #${review.userId}` : "Anonymous");
                    const content = review.review || review.content || review.reviewText || review.text || "";
                    const rating = review.rating ?? review.score ?? 0;
                    const spoiler = review.spoiler ?? review.containsSpoilers ?? false;
                    const likes = review.likes ?? 0;

                    return (
                        <div key={review.id || `${author}-${content.slice(0, 20)}`} className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#BFBCFC]/10 rounded-full flex items-center justify-center">
                                        <span className="text-[#BFBCFC] font-bold">{author.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-[#F8FAFC] font-medium">{author}</p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-[#44FFFF]" fill="currentColor" />
                                            <span className="text-[#44FFFF] font-data text-sm">{rating}/10</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-[#94A3B8] hover:text-[#BFBCFC] transition-colors">♥ {likes}</button>
                            </div>
                            {spoiler && (
                                <div className="mb-2 inline-flex items-center gap-1 bg-[#FF61D2]/10 border border-[#FF61D2]/30 text-[#FF61D2] px-2 py-1 rounded text-xs font-medium">
                                    <AlertCircle className="w-3 h-3" />
                                    Contains Spoilers
                                </div>
                            )}
                            <p className="text-[#94A3B8] leading-relaxed text-sm md:text-base">{content}</p>
                        </div>
                    );
                })
            )}
        </div>
    );
}