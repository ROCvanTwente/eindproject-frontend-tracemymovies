import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { User, Calendar, MapPin, Star, Film, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const PER_PAGE = 24;

const IMG = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const age = (birthday, deathday) => {
  if (!birthday) return null;
  const end = deathday ? new Date(deathday) : new Date();
  const birth = new Date(birthday);
  const y = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  return m < 0 || (m === 0 && end.getDate() < birth.getDate()) ? y - 1 : y;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

export function ActorPage() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setActor(null);
    setPage(1);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/Actor/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setActor(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#BFBCFC]/20 border-t-[#BFBCFC] rounded-full animate-spin" />
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <User size={48} className="text-[#94A3B8]/30" />
        <p className="text-[#94A3B8]">Actor not found</p>
        <Link to="/" className="text-[#BFBCFC] text-sm hover:underline">Go back</Link>
      </div>
    );
  }

  const photo = IMG(actor.profile_path, 'w342');
  const personAge = age(actor.birthday, actor.deathday);
  const allCredits = (actor.movie_credits?.cast || [])
    .filter((m, i, arr) => m.release_date && arr.findIndex(x => x.id === m.id) === i)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const totalPages = Math.ceil(allCredits.length / PER_PAGE);
  const credits = allCredits.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const bio = actor.biography || '';
  const bioShort = bio.length > 400;
  const displayBio = bioShort && !showFullBio ? bio.slice(0, 400) + '...' : bio;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F8FAFC]">

      {/* Back button */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-8">

          {/* Photo */}
          <div className="flex-shrink-0">
            {photo ? (
              <img src={photo} alt={actor.name}
                className="w-44 h-60 sm:w-52 sm:h-72 object-cover rounded-2xl shadow-2xl shadow-black/50" />
            ) : (
              <div className="w-44 h-60 sm:w-52 sm:h-72 bg-[#151921] border border-[#BFBCFC]/10 rounded-2xl flex items-center justify-center">
                <User size={48} className="text-[#94A3B8]/30" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-[#BFBCFC] text-xs font-bold uppercase tracking-widest mb-1">
                {actor.known_for_department || 'Actor'}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{actor.name}</h1>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
              {actor.birthday && (
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Calendar size={14} className="text-[#BFBCFC]" />
                  <span>{fmtDate(actor.birthday)}{personAge && ` (${personAge} jaar)`}</span>
                </div>
              )}
              {actor.deathday && (
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Calendar size={14} className="text-red-400" />
                  <span>Overleden: {fmtDate(actor.deathday)}</span>
                </div>
              )}
              {actor.place_of_birth && (
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <MapPin size={14} className="text-[#44FFFF]" />
                  <span>{actor.place_of_birth}</span>
                </div>
              )}
              {actor.popularity && (
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Star size={14} className="text-[#FBBF24]" />
                  <span>Populariteit {actor.popularity.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {bio && (
              <div>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{displayBio}</p>
                {bioShort && (
                  <button onClick={() => setShowFullBio(v => !v)}
                    className="text-[#BFBCFC] text-xs mt-2 hover:underline">
                    {showFullBio ? 'Lees minder' : 'Lees meer'}
                  </button>
                )}
              </div>
            )}

            {/* Known for count */}
            <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
              <Film size={14} className="text-[#BFBCFC]" />
              <span>{actor.movie_credits?.cast?.length || 0} films</span>
            </div>
          </div>
        </div>
      </div>

      {/* Movies grid */}
      {allCredits.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">
              Filmografie
            </h2>
            <p className="text-[#64748B] text-sm">Pagina {page} van {totalPages}</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {credits.map(movie => (
              <Link key={`${movie.id}-${movie.credit_id}`} to={`/movie/${movie.id}`} className="group block">
                <div className="relative overflow-hidden rounded-xl bg-[#151921] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 transition-all">
                  {movie.poster_path ? (
                    <img
                      src={IMG(movie.poster_path, 'w185')}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] flex items-center justify-center bg-[#0F1319]">
                      <Film size={24} className="text-[#334155]" />
                    </div>
                  )}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm text-[#FBBF24] text-[10px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
                      <Star size={9} /> {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <p className="text-[#F8FAFC] text-xs font-medium mt-1.5 truncate">{movie.title}</p>
                <p className="text-[#64748B] text-[10px]">{movie.release_date?.slice(0, 4)}</p>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#151921] border border-[#BFBCFC]/10 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dot-${i}`} className="text-[#475569] px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                        page === p
                          ? 'bg-[#BFBCFC] text-[#0B0E14]'
                          : 'bg-[#151921] border border-[#BFBCFC]/10 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/30'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#151921] border border-[#BFBCFC]/10 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
