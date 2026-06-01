import { Clock } from "lucide-react";

export function RecentActivity({ recentActivity }) {
  return (
    <div className="bg-[#151921]/40 backdrop-blur-xl border border-[#BFBCFC]/10 rounded-xl p-4 h-[440px] flex flex-col w-full">
      <h2 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2 flex-none">
        <Clock className="w-5 h-5 text-[#44FFFF]" />
        Recent Activity
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-[#BFBCFC]/15 scrollbar-track-transparent hover:scrollbar-thumb-[#BFBCFC]/30 transition-colors">
        {recentActivity.length === 0 ? (
          <p className="text-[#94A3B8] text-sm py-4">No recent activity found.</p>
        ) : (
          recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="bg-[#0B0E14]/60 border border-[#BFBCFC]/10 rounded-xl p-3 hover:border-[#44FFFF]/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[#F8FAFC] font-medium text-sm truncate max-w-[70%] group-hover:text-[#44FFFF] transition-colors">
                  {activity.movieTitle}
                </h4>
                <span className="text-[#44FFFF] font-data text-xs font-bold bg-[#44FFFF]/10 px-2 py-0.5 rounded-full">
                  ★ {Number(activity.tmdbRating).toFixed(1)}
                </span>
              </div>

              <p className="text-[#94A3B8] text-xs mb-2 line-clamp-2 leading-relaxed">
                {activity.overview}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                <p>{new Date(activity.watchedDate).toLocaleDateString()}</p>
                <p className="text-[#44FFFF]/80 font-data">
                  Watched <span className="font-bold text-[#44FFFF]">{activity.amountWatched}x</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}