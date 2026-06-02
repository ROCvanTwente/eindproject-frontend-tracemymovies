import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Eye, Info, X, Film, Activity } from "lucide-react";

export function MoodRadar({ rawData }) {
  const [showInfo, setShowInfo] = useState(false);

  // Fallback map layout if user has no metrics recorded yet
  const chartData = rawData && rawData.length > 0 ? rawData : [
    { subject: "Sci-Fi & Mystery", A: 0 },
    { subject: "Action & Horror", A: 0 },
    { subject: "Fantasy & Adventure", A: 0 },
    { subject: "Drama & Realism", A: 0 },
    { subject: "Thriller & Noir", A: 0 },
    { subject: "Comedy & Feel-Good", A: 0 },
  ];

  const hasData = rawData && rawData.length > 0;

  return (
    <div className="w-full h-full min-h-[420px] bg-surface/10 rounded-2xl p-6 relative flex flex-col select-none backdrop-blur-md overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 flex-none">
        <div className="flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-accent" />
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#94A3B8]">Thematic Fingerprint</h3>
        </div>
        <button 
          onClick={() => setShowInfo(true)}
          className="text-[#94A3B8] hover:text-accent transition-all duration-200 p-1 hover:bg-white/5 rounded-md cursor-pointer hover:scale-115"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Guide Layer */}
      <div 
        className={`absolute inset-0 bg-[#0B0E14]/98 backdrop-blur-md z-30 p-6 rounded-2xl flex flex-col justify-between border border-accent/20 transition-all duration-300 ease-out origin-top-right ${
          showInfo ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-accent">
              <Film className="w-4 h-4" />
              <h4 className="text-sm font-bold tracking-wide">Cinematic Taste Profiles</h4>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-[#94A3B8] hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            This matrix tracks real-time data calculations across user profiles:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#94A3B8]">
            <li><strong className="text-white block mb-0.5">Sci-Fi & Mystery</strong> High-concept puzzle narratives.</li>
            <li><strong className="text-white block mb-0.5">Action & Horror</strong> High-impact visceral pacing.</li>
            <li><strong className="text-white block mb-0.5">Fantasy & Adventure</strong> Escapist alternate worlds.</li>
            <li><strong className="text-white block mb-0.5">Drama & Realism</strong> Grounded human complexities.</li>
          </ul>
        </div>
        <p className="text-[10px] text-accent/60 font-semibold italic border-t border-white/5 pt-2">
          Calculated dynamically from database logs.
        </p>
      </div>

      {/* Canvas Layer */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center min-h-0">
        {!hasData && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 bg-[#0B0E14]/20 backdrop-blur-xs">
            <Activity className="w-8 h-8 text-[#94A3B8]/30 mb-2 animate-pulse" />
            <p className="text-sm font-bold text-[#F8FAFC]">No Telemetry Footprint</p>
            <p className="text-xs text-[#94A3B8] max-w-[200px] mt-1">Log film reviews to generate your personal Taste Matrix.</p>
          </div>
        )}
        
        <div className="absolute inset-0 bg-radial from-accent/5 to-transparent blur-2xl pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="85%" data={chartData}>
            <PolarGrid stroke="var(--color-muted)" opacity={0.15} />
            <PolarAngleAxis dataKey="subject" stroke="var(--color-text-low)" fontSize={10} fontWeight={700} tickLine={false} />
            <Radar name="Taste Matrix" dataKey="A" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={hasData ? 0.1 : 0.02} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}