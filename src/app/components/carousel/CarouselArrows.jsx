import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NextArrow({ className, onClick }) {
    if (className?.includes('slick-disabled') || !onClick) return null;

    return (
        <button 
            type="button" 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }} 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-[#151921]/90 backdrop-blur-sm hover:bg-[#BFBCFC] hover:text-[#0B0E14] text-[#F8FAFC] p-3 rounded-xl transition-all duration-200 hover:scale-110 border border-[#BFBCFC]/20 hover:shadow-lg hover:shadow-[#BFBCFC]/30 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
        >
            <ChevronRight className="w-6 h-6" /> 
        </button>
    );
}

export function PrevArrow({ className, onClick }) {
    if (className?.includes('slick-disabled') || !onClick) return null;

    return (
        <button 
            type="button" 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }} 
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-[#151921]/90 backdrop-blur-sm hover:bg-[#BFBCFC] hover:text-[#0B0E14] text-[#F8FAFC] p-3 rounded-xl transition-all duration-200 hover:scale-110 border border-[#BFBCFC]/20 hover:shadow-lg hover:shadow-[#BFBCFC]/30 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
        >
            <ChevronLeft className="w-6 h-6" /> 
        </button>
    );
}