// Component dat de verdeling van de bekeken films over verschillende historische tijdperken visualiseert (Movie Timeline).
import { useState } from 'react';
import { Clock } from 'lucide-react';

// Expliciete kleurtoewijzing op basis van filmtijdlijntijdperken
const getEraColor = (label, idx) => {
  const lower = (label || '').toLowerCase();
  
  if (lower.includes('vintage classics')) return '#22ffe9';
  if (lower.includes('nostalgia gold')) return '#bfbcfc';
  if (lower.includes('modern blockbusters')) return '#ff69ff';
  if (lower.includes('streaming era')) return '#00FFFF';
  
  // Fallback-palet voor eventuele onverwachte dynamische tijdperken
  const fallbackPalette = ['#FF61D2', '#3B82F6', '#EC4899', '#AFA9FF'];
  return fallbackPalette[idx % fallbackPalette.length];
};

export function MovieTimeline({ rawData }) {
  const [activeIdx, setActiveIdx] = useState(null);

  // Veilige verwerking van dynamische backend-datatoewijzing
  const timelineData = (rawData || []).map((item, idx) => {
    const label = item.label || item.eraName || 'Unknown Era';
    return {
      id: item.id || idx,
      label,
      range: item.range || item.eraRange || '',
      pct: item.pct || item.percentage || 0,
      color: getEraColor(label, idx),
    };
  });

  if (timelineData.length === 0) {
    return (
      <div className="w-full py-8 text-center text-[#94A3B8] text-sm font-medium border border-dashed border-white/5 rounded-xl">
        No timeline breakdown metrics detected.
      </div>
    );
  }

  return (
    <div className="w-full select-none flex flex-col h-full bg-transparent">
      {/* Header-informatie */}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-[#44FFFF] drop-shadow-[0_0_8px_rgba(68,255,255,0.5)]" />
        <h3 className="text-[#F8FAFC] font-bold font-heading text-xl tracking-wide">Movie Timeline</h3>
      </div>
      <p className="text-[#94A3B8] text-xs mb-6">
        A dynamic chronological dissection of your viewing habits mapped across historical release eras.
      </p>

      {/* Naadloze doorlopende balk zonder interne randen */}
      <div 
        className="h-8 w-full rounded-xl flex overflow-hidden border border-white/10 mb-8 bg-[#151921]/40 backdrop-blur-sm p-[3px] transition-all duration-300"
        onMouseLeave={() => setActiveIdx(null)}
      >
        {timelineData.map((item, idx) => {
          const isDimmed = activeIdx !== null && activeIdx !== idx;
          const isCurrent = activeIdx === idx;
          return (
            <div
              key={item.id}
              className="h-full first:rounded-l-lg last:rounded-r-lg cursor-pointer transition-all duration-300 relative"
              style={{ 
                width: `${item.pct}%`, 
                backgroundColor: item.color,
                opacity: isDimmed ? 0.35 : 1,
                boxShadow: isCurrent ? `0 0 25px ${item.color}bf` : 'none',
                transform: isCurrent ? 'scaleY(1.08)' : 'scaleY(1)',
                zIndex: isCurrent ? 10 : 1
              }}
              onMouseEnter={() => setActiveIdx(idx)}
            />
          );
        })}
      </div>

      {/* Grid-verdeling over de beschikbare ruimte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {timelineData.map((item, idx) => {
          const isHighlighted = activeIdx === idx;
          const processingHover = activeIdx !== null;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className="p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden group cursor-pointer"
              style={{
                backgroundColor: isHighlighted ? 'rgba(21, 25, 33, 0.7)' : 'rgba(21, 25, 33, 0.15)',
                borderColor: isHighlighted ? `${item.color}60` : 'rgba(255, 255, 255, 0.03)',
                boxShadow: isHighlighted ? `0 12px 30px -5px ${item.color}20` : 'none',
                opacity: processingHover && !isHighlighted ? 0.4 : 1,
                transform: isHighlighted ? 'translateY(-4px)' : 'translateY(0px)'
              }}
            >
              {/* Decoratieve subtiele achtergrondgloed bij hoveren over de kaart */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: item.color }}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125" 
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`
                    }} 
                  />
                  <h4 className="font-bold text-sm text-[#F8FAFC] tracking-wide transition-colors duration-300">
                    {item.label}
                  </h4>
                </div>
                <div>
                  <span className="inline-block text-[10px] uppercase font-semibold font-data tracking-wider opacity-70 px-1.5 py-0.5 rounded bg-white/5 text-[#94A3B8]">
                    {item.range}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-end mt-1">
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