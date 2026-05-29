import React from "react";
import { X } from "lucide-react";

export function TrailerModal({ isOpen, isAnimateIn, onClose, videoKey }) {
  if (!isOpen || !videoKey) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md transition-opacity duration-200 ${
        isAnimateIn ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-5xl bg-[#151921] rounded-2xl overflow-hidden border border-[#BFBCFC]/20 shadow-2xl aspect-video transition-all duration-200 ${
          isAnimateIn ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2.5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
          title="Trailer"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}