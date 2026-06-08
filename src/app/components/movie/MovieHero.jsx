import React from "react";

export function MovieHero({ movie }) {
    return (
        <div className="relative h-[200px] md:h-[280px] overflow-hidden">
            <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />
        </div>
    );
}
