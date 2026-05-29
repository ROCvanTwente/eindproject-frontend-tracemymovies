import { Star, Heart, Eye } from 'lucide-react';

export function MovieCarouselCard({ 
    movie, 
    index, 
    showRanking, 
    showReleaseDate, 
    onMovieClick, 
    onLike, 
    onLog 
}) {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750/151921/BFBCFC?text=No+Poster';

    const getRankingBadge = () => {
        if (!showRanking || index > 2) return null;
        
        const badges = [
            { color: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-500/50', number: '1' },
            { color: 'from-gray-300 to-gray-500', glow: 'shadow-gray-400/50', number: '2' },
            { color: 'from-orange-400 to-orange-600', glow: 'shadow-orange-500/50', number: '3' },
        ];
        const badge = badges[index];

        return (
            <div className={`absolute top-2 left-2 z-10 bg-gradient-to-br ${badge.color} rounded-lg w-8 h-8 shadow-lg ${badge.glow} flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{badge.number}</span>
            </div>
        );
    };

    return (
        <div className="px-2">
            <div className="group cursor-pointer" onClick={(e) => onMovieClick(e, movie.id)}>
                <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-[#151921] border border-[#BFBCFC]/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#BFBCFC]/30 hover:border-[#BFBCFC]/40">
                    
                    {getRankingBadge()}
                    
                    {showReleaseDate && movie.release_date && (
                        <div className="absolute top-2 right-2 z-10 bg-[#44FFFF]/90 backdrop-blur-sm text-[#0B0E14] px-2 py-1 rounded-lg text-xs font-bold">
                            {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                    
                    <img 
                        src={imageUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    
                    {/* Hover Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            
                            {movie.vote_average > 0 ? (
                                <div className="flex items-center gap-1.5 text-[#44FFFF] text-sm mb-2 font-data font-medium">
                                    <Star className="w-4 h-4" fill="currentColor" />
                                    <span>{movie.vote_average.toFixed(1)}</span>
                                </div>
                            ) : (
                                <div className="text-[#94A3B8] text-xs mb-2.5 font-data font-medium tracking-wide uppercase">
                                    Not Yet Rated
                                </div>
                            )}
                            
                            <h3 className="text-[#F8FAFC] font-heading font-medium text-sm line-clamp-2 leading-tight mb-2">
                                {movie.title}
                            </h3>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-center gap-4">
                                <button 
                                    onClick={(e) => onLike(e, movie.id)}
                                    className="text-[#F8FAFC] hover:text-[#FF61D2] transition-all duration-200 hover:scale-125"
                                >
                                    <Heart className="w-6 h-6 hover:fill-current" />
                                </button>
                                <button 
                                    onClick={(e) => onLog(e, movie.id)}
                                    className="text-[#F8FAFC] hover:text-[#44FFFF] transition-all duration-200 hover:scale-125"
                                >
                                    <Eye className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}