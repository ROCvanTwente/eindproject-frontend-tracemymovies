import React from 'react';
import { Link } from 'react-router'; // Correcte import voor de nieuwere React Router versies
import { Star } from 'lucide-react';

// Helperfunctie voor het genereren van de TMDB posterafbeelding-URL's
const getImageUrl = (path, size = 'w342') => {
  if (!path) return 'https://via.placeholder.com/342x513?text=No+Poster';
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default function HomeMovieCard({ movie }) {
  // Beveiliging/Guard clause: render niks als er per ongeluk geen film-object wordt meegegeven
  if (!movie) return null;

  // Fallback-toewijzingen voor flexibele data-extractie
  const posterPath = movie.poster_path || movie.poster || movie.image;
  const movieId = movie.id || movie.movieId;
  const rating = movie.vote_average || movie.rating || 0;

  return (
    <Link 
      to={`/movie/${movieId}`} 
      className="group block flex-shrink-0 w-[140px] sm:w-[160px] md:w-[175px] select-none transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Container voor de poster met animatie-effecten en dynamische randkleuren bij hover */}
      <div className="relative overflow-hidden rounded-xl bg-[#151921] border border-[#BFBCFC]/15 group-hover:border-[#BFBCFC]/40 transition-all duration-300 shadow-lg shadow-black/40 aspect-[2/3]">
        <img
          src={getImageUrl(posterPath, 'w342')}
          alt={movie.title || 'Movie Poster'}
          loading="lazy" // Zorgt voor luie weergave (lazy loading) ter verbetering van de paginasnelheid
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Rating badge die absoluut over de poster heen valt, mits de rating groter is dan 0 */}
        {rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-[#44FFFF] text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-white/5 shadow-md">
            <Star size={10} className="fill-[#44FFFF] text-[#44FFFF]" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Filmtitel onder de poster met automatische tekst-afkapping (truncate) */}
      <p className="text-[#94A3B8] group-hover:text-[#F8FAFC] text-xs font-medium mt-2 truncate transition-colors duration-200 px-0.5">
        {movie.title || movie.name}
      </p>
    </Link>
  );
}