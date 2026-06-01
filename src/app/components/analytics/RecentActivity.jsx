import { Clock } from "lucide-react";

export function RecentActivity({ recentActivity }) {
  return (
    <div className="bg-surface/40 backdrop-blur-xl border border-primary/10 rounded-xl p-4 h-110 flex flex-col w-full">
      <h2 className="text-xl font-bold font-heading text-foreground mb-4 flex items-center gap-2 flex-none">
        <Clock className="w-5 h-5 text-accent" />
        Recent Activity
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {recentActivity.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">No recent activity found.</p>
        ) : (
          recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="bg-background/60 border border-primary/10 rounded-xl p-3 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-foreground font-medium text-sm truncate max-w-[70%] group-hover:text-accent transition-colors">
                  {activity.movieTitle}
                </h4>
                <span className="text-accent font-data text-xs font-bold bg-accent/10 px-2 py-0.5 rounded-full">
                  ★ {Number(activity.tmdbRating).toFixed(1)}
                </span>
              </div>

              <p className="text-muted-foreground text-xs mb-2 line-clamp-2 leading-relaxed">
                {activity.overview}
              </p>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground/80">
                <p>{new Date(activity.watchedDate).toLocaleDateString()}</p>
                <p className="text-accent/80 font-data">
                  Watched <span className="font-bold text-accent">{activity.amountWatched}x</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}