import { useState } from "react";
import { GitCommit, Info, X, Users, Award } from "lucide-react";

export function DirectorSynergy({ rawPairings }) {
  const [showInfo, setShowInfo] = useState(false);
  const hasData = rawPairings && rawPairings.length > 0;

  return (
    <div className="w-full h-full min-h-[420px] flex flex-col justify-between relative overflow-hidden select-none outline-none border-none">
      <div className="flex items-center justify-between pb-3 mb-4 flex-none border-b border-white/[0.03]">
        <div className="flex items-center gap-2.5">
          <GitCommit className="w-4 h-4 text-[#44FFFF] rotate-45" />
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#94A3B8]">Director Synergy Vector</h3>
        </div>
        <button 
          onClick={() => setShowInfo(true)}
          className="text-[#94A3B8] hover:text-[#44FFFF] transition-all duration-200 p-1 rounded-md cursor-pointer hover:scale-110 outline-none focus:outline-none"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Modern Friendly Explanation Overlay */}
      <div 
        className={`absolute inset-0 bg-[#0B0E14]/98 z-30 p-6 flex flex-col justify-between border border-[#44FFFF]/10 transition-all duration-200 ease-out origin-top-right ${
          showInfo ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-[#44FFFF]">
              <Users className="w-4 h-4" />
              <h4 className="text-sm font-bold tracking-wide">Director Synergy</h4>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-[#94A3B8] hover:text-white p-1 cursor-pointer outline-none focus:outline-none">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            This tracker cross-references directors from your logged history with their most frequent top-billed actors. The metric details your structural viewing overlaps between specific creative partners.
          </p>
        </div>
        <p className="text-[10px] text-[#44FFFF]/60 font-medium tracking-wide border-t border-white/5 pt-2">
          Calculated automatically via active production team graphs.
        </p>
      </div>

      {/* Floaty Borderless Matrix List Layout */}
      <div className="space-y-4 flex-1 flex flex-col justify-start pt-2 min-h-0 relative">
        {hasData ? (
          rawPairings.map((pair, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between group transition-all duration-200 py-3 border-b border-white/[0.02] last:border-none"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="text-sm font-black text-white tracking-wide truncate group-hover:text-[#44FFFF] transition-colors">
                  {pair.director}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]/50">
                  <span className="text-[#F8FAFC]/60 truncate">with {pair.actor}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center flex-shrink-0 pl-4 min-w-[100px]">
                <span className="text-xs font-black text-[#44FFFF] tracking-tight">
                  {pair.count} {pair.count === 1 ? 'project' : 'projects'}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#94A3B8]/30">
                  {pair.synergy}% overlap
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 my-auto">
            <Award className="w-8 h-8 text-[#94A3B8]/10 mb-2" />
            <p className="text-xs text-[#94A3B8]/50 font-medium max-w-[220px]">
              No direct production synergy metrics found in your library yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}