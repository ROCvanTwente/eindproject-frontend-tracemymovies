import { Eye, Heart, Plus, Play, Share2, Loader2 } from "lucide-react";

export function MovieHero({
    movie,
    isWatched,
    isFavorite,
    isInWatchlist,
    isSavingWatch,
    isSavingLike,
    onToggleWatch,
    onToggleLike,
    onToggleWatchlist,
    onOpenTrailer,
    onOpenShare,
}) {
    return (
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
            <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0">
                <div className="container mx-auto px-4 max-w-7xl pb-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-32 md:w-48 rounded-lg shadow-2xl border border-[#BFBCFC]/20 md:-mb-12 hidden md:block"
                        />

                        <div className="flex-1 md:pt-16">
                            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1.5">
                                {movie.title}
                            </h1>

                            {movie.tagline && (
                                <p className="text-[#BFBCFC] text-base md:text-lg italic mb-3">
                                    {movie.tagline}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                                <span className="text-[#94A3B8] font-data text-xs md:text-sm">
                                    {new Date(movie.release_date).getFullYear()}
                                </span>

                                <span className="text-[#94A3B8] hidden md:inline">•</span>

                                <span className="text-[#94A3B8] font-data text-xs md:text-sm">
                                    {movie.runtime} min
                                </span>

                                {movie.age_rating && (
                                    <span className="bg-[#FF61D2]/20 text-[#FF61D2] px-2 py-0.5 rounded-lg text-xs font-medium">
                                        {movie.age_rating}
                                    </span>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={onToggleWatch}
                                    disabled={isSavingWatch}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium flex items-center gap-1.5 text-xs md:text-sm w-[115px] justify-center transition-all ${
                                        isWatched
                                            ? "bg-[#44FFFF] text-[#000]"
                                            : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20 hover:bg-[#151921]"
                                    }`}
                                >
                                    {isSavingWatch ? (
                                        <Loader2 className="w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Eye className="w-4" />
                                            Watched
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onToggleLike}
                                    disabled={isSavingLike}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 text-xs md:text-sm transition-all ${
                                        isFavorite
                                            ? "bg-[#44FFFF] text-[#000]"
                                            : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"
                                    }`}
                                >
                                    {isSavingLike ? (
                                        <Loader2 className="w-4 animate-spin" />
                                    ) : (
                                        <Heart className={`w-4 ${isFavorite ? "fill-current" : ""}`} />
                                    )}
                                    Like
                                </button>

                                <button
                                    onClick={onToggleWatchlist}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 text-xs md:text-sm ${
                                        isInWatchlist
                                            ? "bg-[#44FFFF] text-[#000]"
                                            : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"
                                    }`}
                                >
                                    <Plus className="w-4" />
                                    Watchlist
                                </button>

                                <button
                                    onClick={onOpenTrailer}
                                    className="bg-[#FF61D2]/10 hover:bg-[#FF61D2] text-[#FF61D2] hover:text-[#0B0E14] px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 border border-[#FF61D2]/30 text-xs md:text-sm"
                                >
                                    <Play className="w-4 fill-current" />
                                    Trailer
                                </button>

                                <button
                                    onClick={onOpenShare}
                                    className="bg-[#151921]/70 hover:bg-[#44FFFF] hover:text-[#0B0E14] text-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 border border-[#BFBCFC]/20 text-xs md:text-sm"
                                >
                                    <Share2 className="w-4" />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}