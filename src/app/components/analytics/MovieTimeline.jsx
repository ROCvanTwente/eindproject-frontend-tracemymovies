import { useState } from 'react';
import { Clock } from 'lucide-react';

const ERA_DATA = [
  { id: 0, label: 'Vintage Classics', range: 'Pre-1980', color: '#BFBCFC', pct: 15, summary: 'Foundational cornerstones of cinema history and early narrative masterpieces.' },
  { id: 1, label: 'Nostalgia Gold', range: '1980 - 2000', color: '#FF61D2', pct: 35, summary: 'Practical effects, legendary scripts, and indie revolutions.' },
  { id: 2, label: 'Modern Blockbusters', range: '2000 - 2020', color: '#44FFFF', pct: 40, summary: 'Pristine digital workflows and sprawling complex franchises.' },
  { id: 3, label: 'Streaming Era', range: '2020+', color: '#AFA9FF', pct: 10, summary: 'Hyper-modern aesthetics and contemporary experimental formats.' }
];

export function MovieTimeline() {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <div className="bg-[#151921]/70 backdrop-blur-xl rounded-2xl p-6 flex flex-col h-full select-none">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-[#BFBCFC]" />
        <h3 className="text-[#F8FAFC] font-bold font-heading text-lg">Movie Timeline</h3>
      </div>
      <p className="text-[#94A3B8] text-xs mb-6">A breakdown of the historical release eras you spend the most time exploring.</p>

      <div 
        className="h-5 w-full rounded-full flex overflow-hidden border border-white/5 mb-6 transition-all duration-300"
        onMouseLeave={() => setActiveIdx(null)}
      >
        {ERA_DATA.map((item, idx) => {
          const isDimmed = activeIdx !== null && activeIdx !== idx;
          return (
            <div
              key={item.id}
              className="h-full cursor-pointer transition-all duration-300"
              style={{ 
                width: `${item.pct}%`, 
                backgroundColor: item.color,
                opacity: isDimmed ? 0.3 : 1
              }}
              onMouseEnter={() => setActiveIdx(idx)}
            />
          );
        })}
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {ERA_DATA.map((item, idx) => {
          const isHighlighted = activeIdx === idx;
          const processingHover = activeIdx !== null;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className="p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4"
              style={{
                backgroundColor: isHighlighted ? 'rgba(21, 25, 33, 0.9)' : 'transparent',
                borderColor: isHighlighted ? 'rgba(191, 188, 252, 0.25)' : 'transparent',
                opacity: processingHover && !isHighlighted ? 0.4 : 1
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#F8FAFC] truncate">
                    {item.label} <span className="text-[#94A3B8] font-normal text-xs font-data ml-1">({item.range})</span>
                  </h4>
                  <p className="text-[#94A3B8] text-xs truncate max-w-md hidden sm:block">{item.summary}</p>
                </div>
              </div>
              <span className="text-sm font-data font-bold flex-shrink-0" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}