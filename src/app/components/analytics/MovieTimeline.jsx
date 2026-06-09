import { useState } from 'react';
import { Clock } from 'lucide-react';

const PALETTE = ['#44FFFF', '#FF61D2', '#BFBCFC', '#AFA9FF', '#3B82F6', '#EC4899'];

export function MovieTimeline({ rawData }) {
  const [activeIdx, setActiveIdx] = useState(null);

  // Safe parsing of dynamic backend data map
  const timelineData = (rawData || []).map((item, idx) => ({
    id: item.id || idx,
    label: item.label || item.eraName || 'Unknown Era',
    range: item.range || item.eraRange || '',
    pct: item.pct || item.percentage || 0,
    summary: item.summary || item.description || 'No description available for this cinematic era.',
    color: item.color || PALETTE[idx % PALETTE.length],
  }));

  if (timelineData.length === 0) {
    return (
      <div className="w-full py-8 text-center text-[#94A3B8] text-sm font-medium border border-dashed border-white/5 rounded-xl">
        No timeline breakdown metrics detected.
      </div>
    );
  }

  return (
    <div className="w-full select-none flex flex-col h-full bg-transparent">
      {/* Header Info */}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-[#44FFFF] drop-shadow-[0_0_8px_rgba(68,255,255,0.5)]" />
        <h3 className="text-[#F8FAFC] font-bold font-heading text-xl tracking-wide">Movie Timeline</h3>
      </div>
      <p className="text-[#94A3B8] text-xs mb-6">
        A dynamic chronological dissection of your viewing habits mapped across historical release eras.
      </p>

      {/* Dynamic Ribbon Block with subtle glowing properties */}
      <div 
        className="h-7 w-full rounded-xl flex overflow-hidden border border-white/10 mb-8 bg-[#151921]/40 backdrop-blur-sm p-[3px] transition-all duration-300"
        onMouseLeave={() => setActiveIdx(null)}
      >
        {timelineData.map((item, idx) => {
          const isDimmed = activeIdx !== null && activeIdx !== idx;
          const isCurrent = activeIdx === idx;
          return (
            <div
              key={item.id}
              className="h-full first:rounded-l-lg last:rounded-r-lg cursor-pointer transition-all duration-500 relative"
              style={{ 
                width: `${item.pct}%`, 
                backgroundColor: item.color,
                opacity: isDimmed ? 0.2 : 1,
                boxShadow: isCurrent ? `0 0 20px ${item.color}80` : 'none',
                zIndex: isCurrent ? 10 : 1
              }}
              onMouseEnter={() => setActiveIdx(idx)}
            />
          );
        })}
      </div>

      {/* Grid distribution across the expanded space */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {timelineData.map((item, idx) => {
          const isHighlighted = activeIdx === idx;
          const processingHover = activeIdx !== null;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className="p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between gap-3 relative overflow-hidden group cursor-pointer"
              style={{
                backgroundColor: isHighlighted ? 'rgba(21, 25, 33, 0.6)' : 'rgba(21, 25, 33, 0.15)',
                borderColor: isHighlighted ? `${item.color}50` : 'rgba(255, 255, 255, 0.03)',
                boxShadow: isHighlighted ? `0 10px 25px -5px ${item.color}15` : 'none',
                opacity: processingHover && !isHighlighted ? 0.35 : 1,
                transform: isHighlighted ? 'translateY(-4px)' : 'translateY(0px)'
              }}
            >
              {/* Decorative Subtle Background Glow Accent on Card Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: item.color }}
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: item.color }} />
                  <h4 className="font-bold text-sm text-[#F8FAFC] tracking-wide">
                    {item.label}
                  </h4>
                </div>
                <span className="inline-block text-[10px] uppercase font-semibold font-data tracking-wider opacity-60 px-1.5 py-0.5 rounded bg-white/5 text-[#94A3B8]">
                  {item.range}
                </span>
                <p className="text-[#94A3B8] text-xs leading-relaxed mt-2 pt-1 border-t border-white/[0.03]">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-baseline justify-end mt-2">
                <span className="text-2xl font-data font-black tracking-tighter" style={{ color: item.color }}>
                  {item.pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}