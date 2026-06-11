import { Film, Star, Flame, Clock } from "lucide-react";

export function BiometricHud({ stats }) {
  const displayStats = stats || {
    thisMonthCount: 0,
    averageScore: 0,
    currentStreak: 0,
    totalHours: 0
  };

  const metrics = [
    { 
      label: "This Month", 
      value: displayStats.thisMonthCount, 
      sub: "movies watched", 
      icon: Film, 
      color: "text-[#44FFFF]"
    },
    { 
      label: "Average Rating", 
      value: displayStats.averageScore > 0 ? Number(displayStats.averageScore).toFixed(1) : "0.0", 
      sub: "critique mean", 
      icon: Star, 
      color: "text-[#44FFFF]"
    },
    { 
      label: "Login Streak", 
      value: `${displayStats.currentStreak}d`, 
      sub: "active streak", 
      icon: Flame, 
      color: "text-[#44FFFF]"
    },
    { 
      label: "Total Time Watched", 
      value: `${displayStats.totalHours}h`, 
      sub: "cumulative depth", 
      icon: Clock, 
      color: "text-[#44FFFF]"
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 select-none relative z-10 py-2">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div 
            key={index} 
            className="flex items-center gap-4 group justify-start transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] flex items-center justify-center transition-all duration-300 group-hover:bg-white/[0.05] relative overflow-hidden">
              <Icon className={`w-5 h-5 ${metric.color} transition-transform duration-500 group-hover:scale-110`} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]/40 font-bold mb-0.5">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-heading text-white tracking-tight">
                  {metric.value}
                </span>
                <span className="text-[10px] text-[#94A3B8]/50 font-medium truncate tracking-wide">
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