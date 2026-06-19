import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Eye, Info, X, Film, Activity } from "lucide-react";

export function MoodRadar({ rawData }) {
  const [showInfo, setShowInfo] = useState(false);

  // Map data to handle .NET camelCase serialization formatting issues automatically
  const chartData = rawData && rawData.length > 0 
    ? rawData.map(item => ({
        subject: item.subject,
        A: item.A !== undefined ? item.A : item.a,
        fullMark: item.fullMark
      }))
    : [
        { subject: "Drama", A: 0 },
        { subject: "Action", A: 0 },
        { subject: "Comedy", A: 0 },
        { subject: "Sci-Fi", A: 0 },
        { subject: "Thriller", A: 0 },
        { subject: "Horror", A: 0 },
      ];

  const hasData = rawData && rawData.length > 0;

  return (
    <div className="w-full select-none relative flex flex-col overflow-hidden outline-none border-none focus:outline-none [&_*]:outline-none [&_*]:focus:outline-none [&_*]:ring-0 [&_*]:focus:ring-0">
      <div className="flex items-center justify-between pb-3 mb-4 flex-none border-b border-white/[0.03]">
        <div className="flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-[#44FFFF]" />
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#94A3B8]">Genre Breakdown</h3>
        </div>
        <button 
          onClick={() => setShowInfo(true)}
          className="text-[#94A3B8] hover:text-[#44FFFF] transition-all duration-200 p-1 rounded-md cursor-pointer hover:scale-110 outline-none focus:outline-none border-none"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Modern Friendly Explanation Overlay */}
      <div 
        className={`absolute inset-0 bg-[#0B0E14]/98 z-30 p-6 flex flex-col justify-between border border-[#44FFFF]/10 transition-all duration-200 ease-out origin-top-right rounded-xl ${
          showInfo ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-[#44FFFF]">
              <Film className="w-4 h-4" />
              <h4 className="text-sm font-bold tracking-wide">Genre Breakdown</h4>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-[#94A3B8] hover:text-white p-1 cursor-pointer outline-none focus:outline-none border-none">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            This graph highlights your top 6 most-watched movie genres. The blue metric lines expand outward toward specific genre labels to show where your tracking activity is concentrated.
          </p>
        </div>
        <p className="text-[10px] text-[#44FFFF]/60 font-medium tracking-wide border-t border-white/5 pt-2">
          Updates instantly as you update your library history.
        </p>
      </div>

      <div className="w-full h-[360px] relative flex items-center justify-center min-h-0 outline-none border-none focus:outline-none">
        {!hasData && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
            <Activity className="w-8 h-8 text-[#94A3B8]/20 mb-2 animate-pulse" />
            <p className="text-sm font-bold text-[#F8FAFC]">No Telemetry Footprint</p>
            <p className="text-xs text-[#94A3B8]/60 max-w-[200px] mt-1 text-center">Log or rate films to generate your personal Taste Matrix.</p>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%" className="outline-none border-none focus:outline-none">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="68%" 
            data={chartData} 
            tabIndex={-1}
            style={{ outline: "none", border: "none" }}
          >
            <PolarGrid stroke="#334155" opacity={0.2} style={{ outline: "none", border: "none" }} />
            <PolarAngleAxis 
              dataKey="subject" 
              stroke="#94A3B8" 
              fontSize={11} 
              fontWeight={800} 
              tickLine={false}
              style={{ outline: "none", border: "none" }}
            />
            <PolarRadiusAxis 
              domain={[0, 'dataMax']} 
              tick={false} 
              axisLine={false} 
              style={{ outline: "none", border: "none" }}
            />
            <Radar 
              name="Taste Matrix" 
              dataKey="A" 
              stroke="#44FFFF" 
              fill="#44FFFF" 
              fillOpacity={hasData ? 0.25 : 0.01} 
              strokeWidth={3} 
              activeDot={false}
              isAnimationActive={false}
              tabIndex={-1}
              style={{ outline: "none", border: "none" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}