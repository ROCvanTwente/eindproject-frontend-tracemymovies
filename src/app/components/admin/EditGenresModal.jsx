import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function EditGenresModal({ isOpen, onClose, movieTitle, currentGenres, onSave }) {
  const [genresText, setGenresText] = useState('');

  useEffect(() => {
    setGenresText(currentGenres ? currentGenres.join(', ') : '');
  }, [currentGenres, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/80 backdrop-blur-sm">
      <div className="bg-[#151921] border border-[#BFBCFC]/20 p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#F8FAFC]">Edit Genres</h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-[#94A3B8] text-sm mb-4">
          Editing genres for <span className="text-[#F8FAFC] font-semibold">{movieTitle}</span>.
        </p>
        
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
            Comma Separated Genres
          </label>
          <input 
            type="text" 
            value={genresText} 
            onChange={(e) => setGenresText(e.target.value)}
            className="w-full bg-[#0B0E14] text-[#F8FAFC] p-3 rounded-xl border border-[#BFBCFC]/20 focus:outline-none focus:border-[#BFBCFC] focus:ring-1 focus:ring-[#BFBCFC]/50 transition-all"
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => { 
              onSave(genresText.split(',').map(s => s.trim()).filter(Boolean)); 
              onClose(); 
            }} 
            className="px-5 py-2 text-sm bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] font-semibold rounded-lg shadow-lg shadow-[#BFBCFC]/20 transition-all"
          >
            Save Genres
          </button>
        </div>
      </div>
    </div>
  );
}