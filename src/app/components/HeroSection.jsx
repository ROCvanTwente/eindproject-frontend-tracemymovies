import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, BookmarkPlus, ChevronLeft, ChevronRight, Star, Calendar, ArrowRight, Info } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const TMDB_IMG = 'https://image.tmdb.org/t/p/';
const AUTO_MS = 4500;
const FADE_MS = 400;

// ─── Brand intro slide ────────────────────────────────────────────────────────
function BrandSlide({ movies, isAuthenticated }) {
  const pool = (movies || [])
    .filter((m) => m.poster_path)
    .map((m) => `${TMDB_IMG}w342${m.poster_path}`);

  const COLS = 7;
  const ROWS = 6;

  const cols = Array.from({ length: COLS }, (_, ci) =>
    Array.from({ length: ROWS }, (_, ri) => pool.length ? pool[(ci * 3 + ri) % pool.length] : null)
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Poster mosaic */}
      {pool.length > 0 && (
        <div className="absolute flex gap-2 blur-[3px]" style={{ inset: '-8%' }}>
          {cols.map((col, ci) => (
            <div
              key={ci}
              className="flex flex-col gap-2 flex-1"
              style={{ transform: `translateY(${ci % 2 === 0 ? '-10%' : '4%'})` }}
            >
              {col.map((url, ri) =>
                url ? (
                  <div key={ri} className="flex-1 overflow-hidden rounded-md min-h-0">
                    <img src={url} alt="" draggable="false" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                ) : null
              )}
            </div>
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-[#0B0E14]/70" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, transparent 0%, rgba(11,14,20,0.92) 100%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0B0E14] to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-[90px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(191,188,252,0.13) 0%, rgba(68,255,255,0.05) 55%, transparent 75%)' }}
      />

      {/* Content — stacked on mobile, row on sm+ */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-5">
          <img
            src="/logo.png"
            alt="TraceMyMovies"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_28px_rgba(191,188,252,0.65)]"
          />
          <span
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#F8FAFC] tracking-tight"
            style={{ textShadow: '0 2px 32px rgba(0,0,0,0.95), 0 0 40px rgba(191,188,252,0.22)' }}
          >
            TraceMyMovies
          </span>
        </div>

        <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#BFBCFC]/50 to-transparent mb-5" />

        <p
          className="text-[#CBD5E1] text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-snug mb-7"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}
        >
          Track films you've watched.
          <br />
          Save those you want to see.
          <br />
          <span className="text-[#BFBCFC]">Tell your friends what's good.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 bg-[#BFBCFC] hover:bg-white text-[#0B0E14] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-black text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-[#BFBCFC]/40"
          >
            <Info className="w-4 h-4" />
            Learn more about us
          </Link>
          {isAuthenticated ? (
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium transition-colors"
            >
              Browse films
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium transition-colors"
            >
              Create account
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Movie slide ──────────────────────────────────────────────────────────────
function MovieSlide({ movie, navigate }) {
  const backdrop = movie.backdrop_path ? `${TMDB_IMG}original${movie.backdrop_path}` : null;
  const year     = movie.release_date?.split('-')[0];
  const rating   = movie.vote_average >= 0.1 ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="relative w-full h-full">
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          draggable="false"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/70 to-[#0B0E14]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/20 to-transparent" />

      {/* Content — vertically centred on mobile, pinned to bottom on md+ */}
      <div className="relative z-10 h-full flex items-center md:items-end pb-0 md:pb-24 pt-8 md:pt-0">
        <div className="container mx-auto px-5 sm:px-8 max-w-7xl w-full">
          <div className="max-w-xl">
            {/* Badges */}
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-[#FF61D2]/15 border border-[#FF61D2]/35 text-[#FF61D2] px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-[0.12em] uppercase">
                🔥 Trending
              </span>
              {rating && (
                <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-[#FFD700]/20 text-[#FFD700] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <Star className="w-2.5 h-2.5 fill-[#FFD700]" />
                  {rating}
                </span>
              )}
              {year && (
                <span className="inline-flex items-center gap-1 text-[#64748B] text-[10px] font-medium">
                  <Calendar className="w-2.5 h-2.5" />
                  {year}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-black text-[#F8FAFC] leading-[1.05] mb-3 text-[clamp(1.55rem,6vw,3.8rem)]"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.85)' }}
            >
              {movie.title}
            </h1>

            {/* Overview — 2 lines on mobile, 3 on desktop */}
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-5 line-clamp-2 md:line-clamp-3">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="flex items-center gap-2 bg-[#BFBCFC] hover:bg-white text-[#0B0E14] px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-[#BFBCFC]/40"
              >
                <Play className="w-4 h-4 fill-current" />
                View Film
              </button>
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-[#F8FAFC] px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-white/12 hover:bg-white/18"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span className="hidden xs:inline">Watchlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────
export function HeroSection({ movies }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const slides = [
    { isBrandSlide: true, id: '__brand__' },
    ...(movies || []).map((m) => ({ ...m, isBrandSlide: false })),
  ];

  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const fadingRef = useRef(false);
  const touchStartX = useRef(null);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((newIdx) => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    setFading(true);
    setProgress(0);
    setTimeout(() => {
      setIdx(newIdx);
      setFading(false);
      fadingRef.current = false;
    }, FADE_MS);
  }, []);

  const slideDuration = slides[idx]?.isBrandSlide ? 6000 : AUTO_MS;
  useEffect(() => {
    if (!slides.length) return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / slideDuration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) goTo((idx + 1) % slides.length);
    }, 40);
    return () => clearInterval(tick);
  }, [idx, slides.length, goTo, slideDuration]);

  if (!slides.length) {
    return (
      <div className="bg-[#0B0E14] animate-pulse" style={{ height: 'clamp(380px, 72vh, 750px)' }} />
    );
  }

  const current = slides[idx];

  return (
    <div
      className="relative overflow-hidden bg-[#0B0E14] select-none h-[52vh] md:h-[78vh] md:min-h-[400px] md:max-h-[780px]"
      style={{ boxShadow: '0 3px 0 0 #0B0E14' }}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50)
          goTo(diff > 0 ? (idx + 1) % slides.length : (idx - 1 + slides.length) % slides.length);
        touchStartX.current = null;
      }}
    >
      {/* Fade wrapper */}
      <div
        className="absolute inset-0 transition-opacity duration-[400ms]"
        style={{ opacity: fading ? 0 : 1 }}
      >
        {current.isBrandSlide
          ? <BrandSlide movies={movies} isAuthenticated={isAuthenticated} />
          : <MovieSlide movie={current} navigate={navigate} />
        }
      </div>

      {/* Progress dots + arrows */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-8 max-w-7xl flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                style={{ width: i === idx ? 36 : 14, background: i === idx ? 'transparent' : 'rgba(255,255,255,0.2)' }}
              >
                {i === idx && (
                  <div className="absolute inset-0 bg-white/20 rounded-full">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#BFBCFC] rounded-full"
                      style={{ width: `${progress}%`, transition: 'width 40ms linear' }}
                    />
                  </div>
                )}
              </button>
            ))}

            <div className="ml-auto flex gap-1.5">
              <button
                onClick={() => goTo((idx - 1 + slides.length) % slides.length)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-[#BFBCFC]/20 text-white/60 hover:text-[#BFBCFC] transition-all border border-white/8 backdrop-blur-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => goTo((idx + 1) % slides.length)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-[#BFBCFC]/20 text-white/60 hover:text-[#BFBCFC] transition-all border border-white/8 backdrop-blur-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
