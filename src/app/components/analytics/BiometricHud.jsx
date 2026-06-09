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
      color: "text-[#44FFFF]",
      glow: "group-hover:shadow-[0_0_20px_rgba(68,255,255,0.15)]"
    },
    { 
      label: "Average Rating", 
      value: displayStats.averageScore > 0 ? Number(displayStats.averageScore).toFixed(1) : "0.0", 
      sub: "critique mean", 
      icon: Star, 
      color: "text-[#BFBCFC]",
      glow: "group-hover:shadow-[0_0_20px_rgba(191,188,252,0.15)]"
    },
    { 
      label: "Login Streak", 
      value: `${displayStats.currentStreak}d`, 
      sub: "active streak", 
      icon: Flame, 
      color: "text-[#FF61D2]",
      glow: "group-hover:shadow-[0_0_20px_rgba(255,97,210,0.15)]"
    },
    { 
      label: "Total Time Watched", 
      value: `${displayStats.totalHours}h`, 
      sub: "cumulative depth", 
      icon: Clock, 
      color: "text-[#44FFFF]",
      glow: "group-hover:shadow-[0_0_20px_rgba(68,255,255,0.15)]"
    },
  ];

  return (
    <div className="w-full bg-[#151921]/20 backdrop-blur-xl rounded-2xl border border-white/[0.04] p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 lg:divide-x divide-white/[0.04] shadow-2xl relative overflow-hidden group/container">
      <div className="absolute inset-0 bg-gradient-to-r from-[#44FFFF]/[0.01] via-transparent to-[#FF61D2]/[0.01] opacity-50 pointer-events-none" />

      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div 
            key={index} 
            className={`flex items-center gap-4 group justify-center sm:justify-start pt-4 lg:pt-0 first:pt-0 ${
              index === 1 ? "md:pt-0" : ""
            } lg:pl-6 first:pl-0 transition-all duration-300`}
          >
            <div className={`w-12 h-12 rounded-xl bg-[#0B0E14]/60 border border-white/[0.05] flex items-center justify-center transition-all duration-500 group-hover:border-white/[0.15] group-hover:bg-[#0B0E14]/90 ${metric.glow} shadow-inner relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <Icon className={`w-5 h-5 ${metric.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`} />
            </div>
            
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]/50 font-bold mb-1 transition-colors group-hover:text-[#94A3B8]/70">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-heading text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all duration-300">
                  {metric.value}
                </span>
                <span className="text-[10px] text-[#94A3B8]/60 font-medium truncate tracking-wide">
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