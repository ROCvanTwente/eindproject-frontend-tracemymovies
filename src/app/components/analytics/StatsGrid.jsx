import { Film, Star, Flame, Clock, TrendingUp } from "lucide-react";

export function StatsGrid({ stats }) {
  const displayStats = stats || {
    totalWatched: 0,
    thisMonthCount: 0,
    averageScore: 0,
    currentStreak: 0,
    totalHours: 0
  };

  const items = [
    {
      title: "Total Watched",
      value: displayStats.totalWatched,
      sub: `+${displayStats.thisMonthCount} this month`,
      icon: Film,
    },
    {
      title: "Average Score",
      value: displayStats.averageScore > 0 ? `${displayStats.averageScore}` : "N/A",
      sub: "out of 10 stars",
      icon: Star,
      fillIcon: true
    },
    {
      title: "Watch Streak",
      value: displayStats.currentStreak,
      sub: "consecutive days",
      icon: Flame,
    },
    {
      title: "Screen Time",
      value: `${displayStats.totalHours}h`,
      sub: `≈ ${Math.round((displayStats.totalHours / 24) * 10) / 10} days`,
      icon: Clock,
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div 
            key={i} 
            className="group relative overflow-hidden bg-linear-to-br from-surface/90 to-background/90 border border-border hover:border-accent/40 rounded-2xl p-5 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            {/* Ambient inner glow layer */}
            <div className="absolute inset-0 bg-linear-to-br from-accent/8 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-accent/4 rounded-full blur-xl transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 border border-accent/20 bg-accent/5 group-hover:bg-accent/20">
                  <Icon 
                    className="w-5 h-5 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[8deg]" 
                    fill={item.fillIcon ? "var(--color-accent)" : "none"}
                  />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              </div>
              
              <h3 className="text-muted-foreground/80 font-semibold text-xs tracking-widest uppercase mb-1">
                {item.title}
              </h3>
              <p className="text-3xl md:text-4xl font-black font-heading text-white tracking-tight transition-all duration-300 group-hover:text-accent">
                {item.value}
              </p>
            </div>

            <div className="relative z-10 mt-4 pt-3 border-t border-white/4 flex items-center gap-1.5">
              {item.title === "Total Watched" && <TrendingUp className="w-3.5 h-3.5 text-accent" />}
              <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors duration-300">
                {item.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}