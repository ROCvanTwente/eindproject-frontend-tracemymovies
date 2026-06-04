import { useState } from 'react';
import { Palette, Film } from 'lucide-react';

// Example structured data your backend or service can map to
const MOCK_COLOR_AURA = [
  { id: 'neon', name: 'Cyberpunk Neon', hex: '#FF61D2', percentage: 35, movies: ['Inception', 'Blade Runner 2049'], description: 'You thrive in high-contrast, synth-soaked nightscapes.' },
  { id: 'gritty', name: 'Fincher Overcast', hex: '#334155', percentage: 28, movies: ['Fight Club', 'Seven'], description: 'Muted earth tones and dark, psychological thrillers dominate.' },
  { id: 'pastel', name: 'Electric Pastel', hex: '#BFBCFC', percentage: 22, movies: ['Interstellar'], description: 'Whimsical, cosmic, and visually surreal escapades.' }
];

export function ExposureSpectrum() {
  const [activePalette, setActivePalette] = useState(null);

  return (
    <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-[#44FFFF]" />
        <h3 className="text-[#F8FAFC] font-bold font-heading text-lg">Chromatic Visual Signature</h3>
      </div>
      
      <p className="text-[#94A3B8] text-sm mb-6">Your personal cinematic color aura based on structural backdrop palettes.</p>

      {/* The Visual Block Spectrum Stack */}
      <div className="h-8 w-full rounded-xl overflow-hidden flex border border-white/5 mb-6">
        {MOCK_COLOR_AURA.map((item) => (
          <button
            key={item.id}
            onMouseEnter={() => setActivePalette(item)}
            className="h-full transition-all duration-300 hover:opacity-80"
            style={{ width: `${item.percentage}%`, backgroundColor: item.hex }}
          />
        ))}
      </div>

      {/* Dynamic Context Container */}
      <div className="flex-1 bg-[#0B0E14]/50 border border-[#BFBCFC]/10 rounded-xl p-4 min-h-[120px] flex flex-col justify-center">
        {activePalette ? (
          <div className="animate-fade-in space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm" style={{ color: activePalette.hex }}>{activePalette.name} ({activePalette.percentage}%)</h4>
              <span className="text-xs text-[#94A3B8] font-data">Dominant Aura</span>
            </div>
            <p className="text-[#94A3B8] text-xs leading-relaxed">{activePalette.description}</p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#44FFFF]">
              <Film className="w-3 h-3" />
              <span className="truncate">Top contributors: {activePalette.movies.join(', ')}</span>
            </div>
          </div>
        ) : (
          <p className="text-[#94A3B8] text-xs text-center italic">Hover over the spectrum stream to unlock your cinematic color aura.</p>
        )}
      </div>
    </div>
  );
}