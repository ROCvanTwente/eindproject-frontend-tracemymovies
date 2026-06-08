import { Film, Star, Flame, Clock } from "lucide-react";

export function BiometricHud({ stats }) {
  const displayStats = stats || {
    totalWatched: 14,
    thisMonthCount: 10,
    averageScore: 8.4,
    currentStreak: 3,
    totalHours: 26
  };

  const metrics = [
    { label: "Captured Footprint", value: displayStats.totalWatched, sub: `+${displayStats.thisMonthCount} cycles`, icon: Film, color: "text-accent" },
    { label: "Target Baseline", value: displayStats.averageScore || "8.4", sub: "critique mean", icon: Star, color: "text-primary" },
    { label: "Sync Velocity", value: `${displayStats.currentStreak}d`, sub: "active streak", icon: Flame, color: "text-secondary" },
    { label: "Temporal Depth", value: `${displayStats.totalHours}h`, sub: `~${Math.round(displayStats.totalHours / 24)} days`, icon: Clock, color: "text-accent" },
  ];

  return (
    <div className="w-full bg-[#151921]/30 backdrop-blur-3xl rounded-2xl p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 lg:divide-x divide-white/5 shadow-2xl">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div 
            key={index} 
            className={`flex items-center gap-4 group justify-center sm:justify-start pt-4 lg:pt-0 first:pt-0 ${
              index === 1 ? "md:pt-0" : ""
            } lg:pl-6 first:pl-0`}
          >
            <div className="w-11 h-11 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center transition-all duration-300 group-hover:border-accent/30 shadow-inner">
              <Icon className={`w-4 h-4 ${metric.color} transition-transform duration-500 group-hover:scale-110`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]/60 font-bold mb-0.5">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-heading text-white tracking-tight group-hover:text-accent transition-colors">
                  {metric.value}
                </span>
                <span className="text-[10px] text-[#94A3B8]/80 font-medium truncate">
                  {metric.sub}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}