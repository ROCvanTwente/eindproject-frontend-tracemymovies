import { Link } from "react-router";
import { Star, Heart } from "lucide-react";
import { ProfilePosterCard } from "../ProfilePosterCard";
import { ReviewTextBlock } from "./ReviewTextBlock";

export function ReviewCard({ review, index, total, showInteractions = false, posterClassName = "w-36 flex-none" }) {
  return (
    <div className={`flex gap-5 pb-6 ${index > 0 ? "pt-6" : ""} ${index < total - 1 ? "border-b border-[#BFBCFC]/8" : ""}`}>
      <div className={posterClassName}>
        <ProfilePosterCard
          movieId={review.movieId}
          poster={review.poster}
          title={review.title}
          to={`/log/${review.logId}`}
          isWatchedProp={showInteractions ? true : undefined}
          isLikedProp={showInteractions ? review.filmIsLiked : undefined}
          hasActivityProp={showInteractions ? true : undefined}
        />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <Link to={`/log/${review.logId}`} className="group/title">
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <span className="text-[#F8FAFC] font-bold text-lg leading-snug group-hover/title:text-[#BFBCFC] transition-colors">{review.title}</span>
            <span className="text-[#94A3B8] text-sm">{review.releaseYear}</span>
          </div>
        </Link>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {review.rating > 0 && (
            <div className="flex gap-[2px]">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/15"}`} />
              ))}
            </div>
          )}
          <span className="text-[#94A3B8]/70 text-xs">
            {review.isRewatch ? "Rewatched" : "Watched"}{" "}
            {new Date(review.watchedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          {review.isLiked && <Heart className="w-3.5 h-3.5 text-[#FF61D2] fill-[#FF61D2]" />}
        </div>
        <ReviewTextBlock text={review.reviewText} containsSpoilers={review.containsSpoilers} />
        <div className="mt-3 flex items-center gap-2 text-[#94A3B8]/60 text-sm">
          <Heart className={`w-4 h-4 ${(review.likes ?? 0) > 0 ? "fill-current text-[#FF61D2]/70" : ""}`} />
          <span>{(review.likes ?? 0) > 0 ? `${review.likes} like${review.likes !== 1 ? "s" : ""}` : "No likes yet"}</span>
        </div>
      </div>
    </div>
  );
}
