import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { MovieCarouselCard } from './carousel/MovieCarouselCard';

export function MovieCarousel({ title, movies, showRanking = false, showReleaseDate = false }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const navigate = useNavigate();

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = setTimeout(sync, 80);
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => { clearTimeout(t); el.removeEventListener('scroll', sync); ro.disconnect(); };
  }, [movies, sync]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = ((card?.offsetWidth ?? 150) + 12) * 4;
    el.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' });
  };

  const handleMovieClick = (e, movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (!movies?.length) return null;

  return (
    <div className="relative group/row">
      {title && (
        <h2 className="text-lg md:text-xl font-heading text-[#F8FAFC] mb-3 md:mb-4 px-1">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Left fade + arrow */}
        <div
          className="absolute left-0 top-0 bottom-4 w-16 md:w-24 z-20 flex items-center pointer-events-none"
          style={{ opacity: canLeft ? 1 : 0, transition: 'opacity 0.25s' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/70 to-transparent" />
          <button
            onClick={() => scroll('left')}
            className="relative ml-1.5 md:ml-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#1C2333]/95 backdrop-blur-sm border border-[#BFBCFC]/25 text-[#F8FAFC] flex items-center justify-center hover:bg-[#BFBCFC] hover:text-[#0B0E14] hover:border-[#BFBCFC] transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-[#BFBCFC]/30 pointer-events-auto opacity-0 group-hover/row:opacity-100 focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {movies.map((movie, i) => (
            <div
              key={movie.id}
              data-card=""
              className="flex-shrink-0"
              style={{ width: 'clamp(118px, 13.5vw, 168px)' }}
            >
              <MovieCarouselCard
                movie={movie}
                index={i}
                showRanking={showRanking}
                showReleaseDate={showReleaseDate}
                onMovieClick={handleMovieClick}
              />
            </div>
          ))}
          <div className="flex-shrink-0 w-2" aria-hidden="true" />
        </div>

        {/* Right fade + arrow */}
        <div
          className="absolute right-0 top-0 bottom-4 w-16 md:w-24 z-20 flex items-center justify-end pointer-events-none"
          style={{ opacity: canRight ? 1 : 0, transition: 'opacity 0.25s' }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-[#0B0E14] via-[#0B0E14]/70 to-transparent" />
          <button
            onClick={() => scroll('right')}
            className="relative mr-1.5 md:mr-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#1C2333]/95 backdrop-blur-sm border border-[#BFBCFC]/25 text-[#F8FAFC] flex items-center justify-center hover:bg-[#BFBCFC] hover:text-[#0B0E14] hover:border-[#BFBCFC] transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-[#BFBCFC]/30 pointer-events-auto opacity-0 group-hover/row:opacity-100 focus:outline-none"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
