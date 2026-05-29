import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroControls({ totalSlides, currentIndex, onSelectIndex, onPrevious, onNext }) {
    if (totalSlides <= 1) return null;

    return (
        <>
            {/* Fixed Bottom Pagination Dots */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 lg:p-8 z-20 pointer-events-none">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex gap-1.5 pointer-events-auto">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => onSelectIndex(index)} 
                                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                                    index === currentIndex ? 'w-6 bg-[#BFBCFC]' : 'w-3 bg-[#94A3B8]/50 hover:bg-[#94A3B8]'
                                }`} 
                            />
                        ))} 
                    </div> 
                </div> 
            </div>

            {/* Stationary Left Navigation Arrow */}
            <button 
                onClick={onPrevious} 
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-[#151921]/80 backdrop-blur-sm hover:bg-[#BFBCFC] text-[#F8FAFC] hover:text-[#0B0E14] p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
            >
                <ChevronLeft className="w-5 h-5" />
            </button> 

            {/* Stationary Right Navigation Arrow */}
            <button 
                onClick={onNext} 
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-[#151921]/80 backdrop-blur-sm hover:bg-[#BFBCFC] text-[#F8FAFC] hover:text-[#0B0E14] p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
            >
                <ChevronRight className="w-5 h-5" />
            </button> 
        </>
    );
}