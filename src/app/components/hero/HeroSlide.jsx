import { Play, Info } from 'lucide-react';

export function HeroSlide({ movie, onViewDetails }) {
    const imageUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : 'https://via.placeholder.com/1920x1080/151921/BFBCFC?text=No+Image';

    return (
        <div className="w-full h-full min-w-full relative flex flex-col justify-end shrink-0">
            <img 
                src={imageUrl} 
                alt={movie.title} 
                draggable="false" 
                className="absolute inset-0 w-full h-full object-cover" 
            /> 
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" /> 
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14]/80 via-transparent to-transparent" /> 
            
            <div className="relative p-3 md:p-6 lg:p-8 z-10 w-full mb-6 md:mb-8">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <span className="bg-[#FF61D2] text-[#F8FAFC] px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs md:text-sm font-medium font-heading shadow-lg shadow-[#FF61D2]/30">
                            LIVE
                        </span> 
                        <div className="flex items-center gap-1">
                            <span className="text-[#44FFFF] font-data font-medium text-xs md:text-sm">
                                ★ {movie.vote_average.toFixed(1)}
                            </span>
                        </div> 
                    </div> 
                    
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#F8FAFC] mb-2 md:mb-4 max-w-4xl leading-tight pointer-events-auto">
                        {movie.title}
                    </h1> 
                    
                    <p className="text-[#94A3B8] text-xs md:text-sm lg:text-base leading-relaxed mb-3 md:mb-5 max-w-2xl line-clamp-2 md:line-clamp-3">
                        {movie.overview}
                    </p> 
                    
                    <div className="flex flex-wrap gap-2 md:gap-3 pointer-events-auto">
                        <button 
                            onClick={() => onViewDetails(movie.id)} 
                            className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-medium font-heading flex items-center gap-1.5 md:gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40 text-xs md:text-sm cursor-pointer"
                        >
                            <Play className="w-3.5 md:w-4 h-3.5 md:h-4" fill="currentColor" />
                            Watch Now
                        </button> 
                        <button 
                            onClick={() => onViewDetails(movie.id)} 
                            className="bg-[#151921]/70 backdrop-blur-xl hover:bg-[#151921] text-[#F8FAFC] px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-medium font-heading flex items-center gap-1.5 md:gap-2 transition-all duration-200 hover:scale-105 border border-[#BFBCFC]/20 text-xs md:text-sm cursor-pointer"
                        >
                            <Info className="w-3.5 md:w-4 h-3.5 md:h-4" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">Details</span>
                        </button> 
                    </div> 
                </div> 
            </div> 
        </div>
    );
}