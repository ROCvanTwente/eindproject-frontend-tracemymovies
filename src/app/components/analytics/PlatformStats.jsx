import { Layers } from 'lucide-react';

export function PlatformStats({ likedCount = 0, reviewCount = 0, watchedCount = 0, listsCount = 0 }) {
  const statsList = [
    { label: 'TOTAL MOVIES WATCHED', value: watchedCount, color: 'text-[#44FFFF]' },
    { label: 'TOTAL REVIEWS WRITTEN', value: reviewCount, color: 'text-[#BFBCFC]' },
    { label: 'TOTAL MOVIES LIKED', value: likedCount, color: 'text-[#FF61D2]' },
    { label: 'TOTAL CUSTOM LISTS CREATED', value: listsCount, color: 'text-[#AFA9FF]' }
  ];

  return (
    <div className="bg-[#151921]/70 backdrop-blur-xl rounded-2xl p-6 flex flex-col h-full select-none">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-5 h-5 text-[#44FFFF]" />
        <h3 className="text-[#F8FAFC] font-bold font-heading text-lg">Platform Stats</h3>
      </div>
      <p className="text-[#94A3B8] text-xs mb-6">A real-time overview tracking your lifetime milestones and historical platform activity.</p>

      <div className="flex-1 flex flex-col justify-around gap-2">
        {statsList.map((stat, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between py-3 px-4 bg-[#0B0E14]/30 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
          >
            <span className="text-xs text-[#94A3B8] font-semibold tracking-wider">{stat.label}</span>
            <span className={`text-xl font-bold font-data ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}