import React, { useState } from "react";
import { Star, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";

export function ReviewForm({ movieTitle, isAuthenticated, isSubmitting, onSubmit }) {
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [containsSpoilers, setContainsSpoilers] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const MAX_REVIEW_LENGTH = 500;

    const handleSubmit = () => {
        if (reviewRating === 0) {
            toast.error("Select a score.");
            return;
        }
        if (!reviewText.trim()) {
            toast.error("Write a review first.");
            return;
        }
        if (reviewText.trim().length > MAX_REVIEW_LENGTH) {
            toast.error(`Maximum ${MAX_REVIEW_LENGTH} characters allowed.`);
            return;
        }

        onSubmit(reviewRating, reviewText, containsSpoilers, () => {
            setReviewText("");
            setReviewRating(0);
            setContainsSpoilers(false);
            setHoverRating(0);
        });
    };

    return (
        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-6">
            <h4 className="text-base md:text-lg font-bold font-heading text-[#F8FAFC] mb-4">Write a Review</h4>
            {!isAuthenticated ? (
                <div className="rounded-xl border border-[#BFBCFC]/15 bg-[#0B0E14] p-4 text-sm text-[#94A3B8]">
                    Log in to post a review.
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
                                        <Star className={`w-8 h-8 transition-all duration-200 ${active ? "text-[#44FFFF] fill-[#44FFFF] scale-110" : "text-[#94A3B8] fill-transparent scale-100"}`} />
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
                            {reviewText.length} / {MAX_REVIEW_LENGTH} characters
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
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40 flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            )}
        </div>
    );
}