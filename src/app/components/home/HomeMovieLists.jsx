import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import { ProfilePosterCard } from '../ProfilePosterCard';

// Helper function to build the correct TMDB poster image URLs
const getImageUrl = (path, size = 'w342') => {
  if (!path) return 'https://via.placeholder.com/342x513?text=No+Poster';
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export function HomeMovieLists({ popularMovies = [], topRatedMovies = [], upcomingMovies = [] }) {
  const popularTrackRef = useRef(null);
  const topRatedTrackRef = useRef(null);
  const upcomingTrackRef = useRef(null);

  const handleScroll = (trackRef, direction) => {
    if (trackRef.current) {
      const scrollAmount = 500;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-12 container mx-auto px-6 py-8 max-w-7xl bg-[#090D14] text-white">
      
      {/* POPULAR NOW SLIDER */}
      <div className="relative">
        <h2 className="text-xl font-bold mb-5 text-[#F8FAFC] tracking-wide">Popular Now</h2>
        <div className="relative group/slider">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#090D14] via-[#090D14]/70 to-transparent z-10 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300" />
          <button
            onClick={() => handleScroll(popularTrackRef, 'left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 shadow-xl"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            ref={popularTrackRef}
            className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-2 pt-9 pb-1"
          >
            {popularMovies.map((movie) => {
              const posterPath = movie.poster_path || movie.poster || movie.image;
              const movieId = movie.id || movie.movieId;
              const title = movie.title || movie.name;
              const rating = movie.vote_average || movie.rating || 0;

              return (
                <div 
                  key={movieId} 
                  className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[175px] select-none relative"
                >
                  <ProfilePosterCard
                    movieId={movieId}
                    poster={getImageUrl(posterPath, 'w342')}
                    title={title}
                    to={`/movie/${movieId}`}
                  />
                  {/* Absolute Rating Badge */}
                  {rating > 0 && (
                    <div className="absolute top-2 right-2 z-30 bg-black/80 backdrop-blur-md text-[#44FFFF] text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-white/5 shadow-md pointer-events-none">
                      <Star size={10} className="fill-[#44FFFF] text-[#44FFFF]" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleScroll(popularTrackRef, 'right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 shadow-xl"
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#090D14] via-[#090D14]/70 to-transparent z-10 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* TOP RATED SLIDER */}
      <div className="relative">
        <h2 className="text-xl font-bold mb-5 text-[#F8FAFC] tracking-wide">Top Rated</h2>
        <div className="relative group/slider">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#090D14] via-[#090D14]/70 to-transparent z-10 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300" />
          <button
            onClick={() => handleScroll(topRatedTrackRef, 'left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            ref={topRatedTrackRef}
            className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-2 pt-9 pb-1"
          >
            {topRatedMovies.map((movie) => {
              const posterPath = movie.poster_path || movie.poster || movie.image;
              const movieId = movie.id || movie.movieId;
              const title = movie.title || movie.name;
              const rating = movie.vote_average || movie.rating || 0;

              return (
                <div 
                  key={movieId} 
                  className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[175px] select-none relative"
                >
                  <ProfilePosterCard
                    movieId={movieId}
                    poster={getImageUrl(posterPath, 'w342')}
                    title={title}
                    to={`/movie/${movieId}`}
                  />
                  {/* Absolute Rating Badge */}
                  {rating > 0 && (
                    <div className="absolute top-2 right-2 z-30 bg-black/80 backdrop-blur-md text-[#44FFFF] text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-white/5 shadow-md pointer-events-none">
                      <Star size={10} className="fill-[#44FFFF] text-[#44FFFF]" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleScroll(topRatedTrackRef, 'right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 shadow-xl"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#090D14] via-[#090D14]/70 to-transparent z-10 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* UPCOMING MOVIES SLIDER */}
      <div className="relative">
        <h2 className="text-xl font-bold mb-5 text-[#F8FAFC] tracking-wide">Upcoming Movies</h2>
        <div className="relative group/slider">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#090D14] via-[#090D14]/70 to-transparent z-10 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300" />
          <button
            onClick={() => handleScroll(upcomingTrackRef, 'left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            ref={upcomingTrackRef}
            className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-2 pt-9 pb-1"
          >
            {upcomingMovies.map((movie) => {
              const posterPath = movie.poster_path || movie.poster || movie.image;
              const movieId = movie.id || movie.movieId;
              const title = movie.title || movie.name;
              
              // Extract and safely transform release_date (e.g. "2026-06-20" -> "20 June")
              const releaseDateStr = movie.release_date;
              const formattedDate = releaseDateStr 
                ? new Date(releaseDateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) 
                : null;

              return (
                <div 
                  key={movieId} 
                  className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[175px] select-none relative"
                >
                  <ProfilePosterCard
                    movieId={movieId}
                    poster={getImageUrl(posterPath, 'w342')}
                    title={title}
                    to={`/movie/${movieId}`}
                  />
                  {/* Absolute Calendar Date Badge for unreleased films */}
                  {formattedDate && (
                    <div className="absolute top-2 right-2 z-30 bg-black/80 backdrop-blur-md text-[#44FFFF] text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/5 shadow-md pointer-events-none whitespace-nowrap">
                      <Calendar size={10} className="text-[#44FFFF]" />
                      <span>{formattedDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleScroll(upcomingTrackRef, 'right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 shadow-xl"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#090D14] via-[#090D14]/70 to-transparent z-10 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

    </div>
  );
}