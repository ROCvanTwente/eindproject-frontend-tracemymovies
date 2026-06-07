import { Link } from "react-router";
import { Star, Heart, RotateCw, AlignLeft } from "lucide-react";
import { ProfilePosterCard } from "../ProfilePosterCard";

export function ActivityPosterItem({ activity }) {
  return (
    <div className="flex flex-col gap-1.5">
      <ProfilePosterCard
        movieId={activity.id}
        poster={activity.poster}
        title={activity.movieTitle}
        to={`/log/${activity.logId}`}
        isWatchedProp={true}
        isLikedProp={activity.filmIsLiked ?? activity.isLiked}
        hasActivityProp={true}
        watchCountProp={activity.watchCount ?? 0}
      />
      <Link to={`/log/${activity.logId}`} className="flex items-center gap-1 flex-wrap px-0.5">
        {activity.userRating > 0 && (
          <div className="grid grid-cols-5 gap-0.5">
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <Star key={n} className={`w-2.5 h-2.5 ${n <= activity.userRating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/20"}`} />
            ))}
          </div>
        )}
        {activity.isLiked && <Heart className="w-3 h-3 text-[#FF61D2] fill-[#FF61D2]" />}
        {activity.isRewatch && <RotateCw className="w-3 h-3 text-[#44FFFF]" />}
        {activity.hasReview && <AlignLeft className="w-3 h-3 text-[#94A3B8]" />}
      </Link>
    </div>
  );
}
