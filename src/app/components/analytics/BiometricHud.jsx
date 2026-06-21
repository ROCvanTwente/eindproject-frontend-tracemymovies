// HUD-component dat de top 4 key metrics (films, rating, streak en kijktijd) toont in glassmorphic kaarten.
import { Film, Star, Flame, Clock } from "lucide-react";

export function BiometricHud({ stats }) {
  const displayStats = stats || {
    thisMonthCount: 0,
    averageScore: 0,
    currentStreak: 0,
    totalHours: 0
  };

  // Haal de gelokaliseerde huidige maandnaam en het jaar op (bijv. "juni 2026")
  const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const metrics = [
    { 
      label: "Movies Watched", 
      value: displayStats.thisMonthCount, 
      sub: "total for this month", 
      badge: currentMonth,
      isMonthly: true,
      icon: Film, 
      color: "text-[#44FFFF]",
      glowColor: "group-hover:shadow-[0_0_15px_rgba(68,255,255,0.2)]"
    },
    { 
      label: "Average Rating", 
      value: displayStats.averageScore > 0 ? Number(displayStats.averageScore).toFixed(1) : "0.0", 
      sub: "monthly critique mean", 
      badge: currentMonth,
      isMonthly: true,
      icon: Star, 
      color: "text-[#44FFFF]",
      glowColor: "group-hover:shadow-[0_0_15px_rgba(68,255,255,0.2)]"
    },
    { 
      label: "Login Streak", 
      value: `${displayStats.currentStreak}d`, 
      sub: "active login streak", 
      badge: "Ongoing",
      isMonthly: false,
      icon: Flame, 
      color: "text-[#44FFFF]",
      glowColor: "group-hover:shadow-[0_0_15px_rgba(68,255,255,0.2)]"
    },
    { 
      label: "Time Watched", 
      value: `${displayStats.totalHours}h`, 
      sub: "hours watched this month", 
      badge: currentMonth,
      isMonthly: true,
      icon: Clock, 
      color: "text-[#44FFFF]",
      glowColor: "group-hover:shadow-[0_0_15px_rgba(68,255,255,0.2)]"
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none relative z-10 py-2">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div 
            key={index} 
            className="flex flex-col justify-between p-6 rounded-2xl bg-[#151921]/45 border border-white/[0.04] shadow-lg backdrop-blur-md transition-all duration-300 hover:translate-y-[-4px] hover:border-white/10 hover:bg-[#151921]/60 group relative overflow-hidden"
          >
            {/* Achtergrond Hover Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none bg-[#44FFFF]" />
            
            {/* Bovenste rij: Icoon en Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className={`w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center transition-all duration-300 group-hover:bg-[#44FFFF]/5 ${metric.glowColor}`}>
                <Icon className={`w-5 h-5 ${metric.color} transition-transform duration-500 group-hover:scale-110`} />
              </div>
              <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border uppercase ${
                metric.isMonthly 
                  ? "bg-[#44FFFF]/4 border-[#44FFFF]/25 text-[#44FFFF] shadow-[0_0_8px_rgba(68,255,255,0.05)]" 
                  : "bg-white/5 border-white/10 text-[#94A3B8] shadow-sm"
              }`}>
                {metric.badge}
              </span>
            </div>

            {/* Onderste rij: Statistieken en Labels */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]/60 font-black">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-3xl font-black font-heading text-white tracking-tight leading-none">
                  {metric.value}
                </span>
                <span className="text-[10px] text-[#94A3B8]/60 font-semibold truncate tracking-wide">
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