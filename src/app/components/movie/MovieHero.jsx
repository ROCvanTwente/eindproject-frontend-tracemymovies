import React from "react";
import { MovieHeroDetails } from "./MovieHeroDetails";
import { MovieHeroActions } from "./MovieHeroActions";

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
                            <MovieHeroDetails
                                title={movie.title}
                                tagline={movie.tagline}
                                releaseDate={movie.release_date}
                                runtime={movie.runtime}
                                ageRating={movie.age_rating}
                            />

                            <MovieHeroActions
                                isWatched={isWatched}
                                isFavorite={isFavorite}
                                isInWatchlist={isInWatchlist}
                                isSavingWatch={isSavingWatch}
                                isSavingLike={isSavingLike}
                                onToggleWatch={onToggleWatch}
                                onToggleLike={onToggleLike}
                                onToggleWatchlist={onToggleWatchlist}
                                onOpenTrailer={onOpenTrailer}
                                onOpenShare={onOpenShare}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}