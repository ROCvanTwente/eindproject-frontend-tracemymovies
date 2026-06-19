import { X } from "lucide-react";

export function ProfilePictureModal({ isOpen, onClose, src, name }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-72 h-72 md:w-96 md:h-96 rounded-full object-cover border-4 border-[#BFBCFC]/30 shadow-2xl"
          />
        ) : (
          <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-2xl shadow-[#BFBCFC]/30">
            <span className="text-[#0B0E14] font-bold text-8xl">{name?.charAt(0).toUpperCase() ?? "?"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
