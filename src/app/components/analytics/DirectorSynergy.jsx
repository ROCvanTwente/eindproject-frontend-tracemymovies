import { useState } from "react";
import { GitCommit, ArrowRight, Info, X, Users, Award } from "lucide-react";

export function DirectorSynergy({ rawPairings }) {
  const [showInfo, setShowInfo] = useState(false);
  const hasData = rawPairings && rawPairings.length > 0;

  return (
    <div className="bg-[#151921]/10 rounded-2xl p-6 backdrop-blur-md h-full min-h-[420px] flex flex-col justify-between relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 flex-none">
        <div className="flex items-center gap-2.5">
          <GitCommit className="w-4 h-4 text-accent rotate-45" />
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#94A3B8]">Director Synergy Vector</h3>
        </div>
        <button 
          onClick={() => setShowInfo(true)}
          className="text-[#94A3B8] hover:text-accent transition-all duration-200 p-1 hover:bg-white/5 rounded-md cursor-pointer hover:scale-115"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Guide Overlay Layer */}
      <div 
        className={`absolute inset-0 bg-[#0B0E14]/98 backdrop-blur-md z-30 p-6 rounded-2xl flex flex-col justify-between border border-accent/20 transition-all duration-300 ease-out origin-top-right ${
          showInfo ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-accent">
              <Users className="w-4 h-4" />
              <h4 className="text-sm font-bold tracking-wide">Synergy Telemetry Guide</h4>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-[#94A3B8] hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            This module processes recurring cast-crew relationships inside your watch logs by isolating correlations between behind-the-camera crew and on-screen talent:
          </p>
          <ul className="space-y-3 text-[11px] text-[#94A3B8]">
            <li>
              <strong className="text-white block mb-0.5">Match Rate (% ACC)</strong> 
              Frequency metrics tracking how often an actor surfaces inside your logged director libraries.
            </li>
          </ul>
        </div>
        <p className="text-[10px] text-accent/60 font-semibold italic border-t border-white/5 pt-2">
          Parsed instantly from dynamic user history tracking arrays.
        </p>
      </div>

      {/* Stacked Connection Cards Layer */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-center min-h-0 relative">
        {hasData ? (
          rawPairings.map((pair, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between bg-[#0B0E14]/40 hover:bg-[#151921] border border-white/5 hover:border-[#44FFFF]/20 rounded-xl p-4 transition-all duration-300 group cursor-pointer shadow-sm"
            >
              <div className="min-w-0 flex-1 space-y-1 pr-4">
                <div className="text-sm font-black text-white tracking-wide truncate">{pair.director}</div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8] flex-wrap">
                  <ArrowRight className="w-3 h-3 text-accent/40 group-hover:text-accent transition-colors flex-shrink-0" />
                  <span className="text-[#F8FAFC]/80 group-hover:text-white transition-colors truncate">{pair.actor}</span>
                  <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-accent font-data font-semibold flex-shrink-0">{pair.count} films</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center flex-shrink-0 border-l border-white/5 pl-4 min-w-[75px]">
                <span className="text-xs font-black font-data text-accent tracking-tight">{pair.synergy}%</span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#94A3B8]/40 group-hover:text-accent/50 transition-colors">Match</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Award className="w-8 h-8 text-[#94A3B8]/20 mb-2" />
            <p className="text-xs text-[#94A3B8] font-medium max-w-[220px]">
              No director/actor partnerships found in your catalog profiles yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}