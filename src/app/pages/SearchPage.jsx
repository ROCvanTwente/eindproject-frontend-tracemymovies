import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, AlertCircle, RefreshCw, Film, User, Building2, Library, Tag, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router';
import { MovieCard } from '../components/MovieCard';


const SEARCH_URL = `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/search/all`;
const BROWSE_URL = `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/get20movies`;


const FILTERS = [
    { id: 'all',        label: 'All' },
    { id: 'movie',      label: 'Films' },
    { id: 'person',     label: 'Cast & Crew' },
    { id: 'company',    label: 'Studios' },
    { id: 'collection', label: 'Collections' },
    { id: 'keyword',    label: 'Keywords' },
    { id: 'user',       label: 'Members' },
];


const TYPE_COLOR = {
    movie:      'text-[#BFBCFC]',
    person:     'text-[#FF61D2]',
    company:    'text-amber-400',
    collection: 'text-green-400',
    keyword:    'text-slate-300',
};


// ── Row components ────────────────────────────────────────────────


function MovieTvRow({ item, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex gap-4 py-5 border-b border-[#BFBCFC]/10 last:border-none group ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Poster */}
            <div className="w-16 flex-none rounded-lg overflow-hidden bg-[#0B0E14] aspect-[2/3]">
                {item.poster ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185${item.poster}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                )}
            </div>


            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <h3 className="text-[#F8FAFC] font-bold text-base group-hover:text-[#BFBCFC] transition-colors">
                        {item.title}
                    </h3>
                    {item.releaseDate && (
                        <span className="text-[#94A3B8] text-sm flex-none">
                            {item.releaseDate.slice(0, 4)}
                        </span>
                    )}
                    {item.voteAverage > 0 && (
                        <span className="text-[#44FFFF] text-xs font-bold flex-none">
                            ★ {item.voteAverage.toFixed(1)}
                        </span>
                    )}
                </div>


                {item.overview && (
                    <p className="text-[#94A3B8] text-sm line-clamp-2 leading-relaxed">
                        {item.overview}
                    </p>
                )}
            </div>
        </div>
    );
}


function PersonRow({ item, navigate }) {
    return (
        <div
            onClick={() => navigate(`/actor/${item.id}`)}
            className="flex gap-4 py-5 border-b border-[#BFBCFC]/10 last:border-none group cursor-pointer"
        >
            {/* Profile photo */}
            <div className="w-16 flex-none rounded-lg overflow-hidden bg-[#0B0E14] aspect-[2/3]">
                {item.profile ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185${item.profile}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                )}
            </div>


            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-[#F8FAFC] font-bold text-base group-hover:text-[#FF61D2] transition-colors">{item.name}</h3>
                    {item.department && (
                        <span className="text-[#FF61D2] text-xs font-semibold">{item.department}</span>
                    )}
                </div>


                {item.knownFor && Array.isArray(item.knownFor) && item.knownFor.length > 0 && (
                    <p className="text-[#94A3B8] text-sm">
                        Known for:{' '}
                        <span className="text-[#F8FAFC]/70">
                            {item.knownFor.map(k => k.title).filter(Boolean).slice(0, 3).join(', ')}
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}


function CompanyRow({ item }) {
    return (
        <div className="flex gap-4 py-5 border-b border-[#BFBCFC]/10 last:border-none items-center">
            <div className="w-16 h-10 flex-none rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                {item.logo ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185${item.logo}`}
                        alt={item.name}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <Building2 className="w-5 h-5 text-[#94A3B8]" />
                )}
            </div>
            <div className="min-w-0">
                <h3 className="text-[#F8FAFC] font-bold text-base">{item.name}</h3>
                {item.country && <p className="text-[#94A3B8] text-sm">{item.country}</p>}
            </div>
        </div>
    );
}


function CollectionRow({ item, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex gap-4 py-5 border-b border-[#BFBCFC]/10 last:border-none group cursor-pointer"
        >
            <div className="w-16 flex-none rounded-lg overflow-hidden bg-[#0B0E14] aspect-[2/3]">
                {item.poster ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185${item.poster}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Library className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-[#F8FAFC] font-bold text-base group-hover:text-green-400 transition-colors">
                    {item.name}
                </h3>
                <span className="text-green-400 text-xs font-semibold mt-0.5">Collection</span>
            </div>
        </div>
    );
}


function UserRow({ item, navigate }) {
    return (
        <div
            onClick={() => navigate(`/user/${item.id}`)}
            className="flex gap-4 py-5 border-b border-[#BFBCFC]/10 last:border-none items-center group cursor-pointer"
        >
            <div className="w-10 h-10 flex-none rounded-full overflow-hidden bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] flex items-center justify-center">
                {item.profilePicture ? (
                    <img
                        src={item.profilePicture.startsWith("data:") ? item.profilePicture : `data:image/jpeg;base64,${item.profilePicture}`}
                        alt={item.username}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-[#0B0E14] font-bold text-sm">
                        {item.username?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="min-w-0">
                <h3 className="text-[#F8FAFC] font-bold text-base group-hover:text-[#BFBCFC] transition-colors">
                    {item.username}
                </h3>
                <span className="text-[#94A3B8] text-xs">Member</span>
            </div>
        </div>
    );
}


function ResultRow({ item, navigate }) {
    if (item.type === 'person')     return <PersonRow item={item} navigate={navigate} />;
    if (item.type === 'company')    return <CompanyRow item={item} />;
    if (item.type === 'collection') return <CollectionRow item={item} onClick={() => {}} />;
    if (item.type === 'user')       return <UserRow item={item} navigate={navigate} />;
    if (item.type === 'keyword')    return null;
    return (
        <MovieTvRow
            item={item}
            onClick={item.type === 'movie' ? () => navigate(`/movie/${item.id}`) : null}
        />
    );
}


// ── Main page ──────────────────────────────────────────────────────


export function SearchPage() {
    const [searchParams] = useSearchParams();
    const urlQuery = searchParams.get('q') || '';
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [browseMovies, setBrowseMovies] = useState([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);


    const fetchSearch = useCallback(async (query) => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`${SEARCH_URL}?query=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            const combined = [
                ...(data.movies      ?? []),
                ...(data.people      ?? []),
                ...(data.companies   ?? []),
                ...(data.collections ?? []),
                ...(data.keywords    ?? []),
                ...(data.users       ?? []),
            ];
            setResults(combined);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchBrowse = useCallback(async () => {
        setLoading(true);
        setError(false);
        let all = [];
        try {
            for (let i = 0; i < 5; i++) {
                const res = await fetch(`${BROWSE_URL}?page=${i + 1}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                const movies = data.results || data;
                if (Array.isArray(movies)) all = [...all, ...movies];
            }
            setBrowseMovies(all);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        setActiveFilter('all');
        if (urlQuery.trim()) fetchSearch(urlQuery);
        else { setResults([]); fetchBrowse(); }
    }, [urlQuery]);


    const countFor = (id) => id === 'all'
        ? results.filter(r => r.type !== 'keyword').length
        : results.filter(r => r.type === id).length;


    const filtered = activeFilter === 'all'
        ? [...results.filter(r => r.type !== 'keyword')]
            .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
        : results.filter(r => r.type === activeFilter);


    const keywords = results.filter(r => r.type === 'keyword');




    // ── Error ──
    if (error && !loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0E14] px-4 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">Connection failed</h2>
                <p className="text-[#94A3B8] mb-10 max-w-md">Could not fetch results. Check if the API is running.</p>
                <button
                    onClick={() => urlQuery ? fetchSearch(urlQuery) : fetchBrowse()}
                    className="flex items-center gap-3 bg-[#44FFFF] text-[#0B0E14] py-4 px-10 rounded-2xl font-bold hover:scale-105 transition-all"
                >
                    <RefreshCw className="w-5 h-5" />
                    Try again
                </button>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#0B0E14]">
            <div className="container mx-auto px-4 max-w-7xl py-8">


                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-[#BFBCFC]" />
                        <p className="text-[#94A3B8]">Searching...</p>
                    </div>
                )}


                {/* Browse mode */}
                {!loading && !urlQuery && (
                    <>
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-6">
                            Browse Movies
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {browseMovies.map((movie, i) => (
                                <MovieCard key={`${movie.id}-${i}`} movie={movie} />
                            ))}
                        </div>
                    </>
                )}


                {/* Search results */}
                {!loading && urlQuery && (
                    <div className="flex gap-10">


                        {/* ── Left: results ── */}
                        <div className="flex-1 min-w-0">


                            {/* Heading + mobile filter button */}
                            <div className="flex items-center justify-between mb-1 pb-3 border-b border-[#BFBCFC]/15">
                                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
                                    Showing matches for &ldquo;{urlQuery}&rdquo;
                                </h2>
                                {results.length > 0 && (
                                    <button
                                        onClick={() => setShowFilterMenu(true)}
                                        className="lg:hidden flex items-center gap-1.5 text-sm text-[#BFBCFC] bg-[#BFBCFC]/10 hover:bg-[#BFBCFC]/20 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        {activeFilter !== 'all' && (
                                            <span className="w-2 h-2 rounded-full bg-[#BFBCFC] inline-block" />
                                        )}
                                        Filter
                                    </button>
                                )}
                            </div>

                            {/* Mobile filter overlay */}
                            {showFilterMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                                        onClick={() => setShowFilterMenu(false)}
                                    />
                                    <div className="fixed top-0 left-0 right-0 z-50 bg-[#151921] border-b border-[#BFBCFC]/15 lg:hidden">
                                        <div className="px-4 py-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
                                                    Show results for
                                                </p>
                                                <button
                                                    onClick={() => setShowFilterMenu(false)}
                                                    className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {FILTERS.map(({ id, label }) => {
                                                    const count = countFor(id);
                                                    return (
                                                        <button
                                                            key={id}
                                                            onClick={() => { setActiveFilter(id); setShowFilterMenu(false); }}
                                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                                activeFilter === id
                                                                    ? 'bg-[#BFBCFC] text-[#0B0E14] font-semibold'
                                                                    : 'bg-[#0B0E14] text-[#94A3B8] border border-[#BFBCFC]/15 hover:text-[#F8FAFC]'
                                                            }`}
                                                        >
                                                            {label}
                                                            {count > 0 && (
                                                                <span className="text-xs opacity-70">{count}</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}


                            {filtered.length === 0 ? (
                                <div className="text-center py-24">
                                    <Search className="w-16 h-16 text-[#BFBCFC]/20 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-[#F8FAFC]">No results found</h3>
                                    <p className="text-[#94A3B8] mt-2">Try a different search term or filter.</p>
                                </div>
                            ) : (
                                <div>
                                    {filtered.map(item => (
                                        <ResultRow
                                            key={`${item.type}-${item.id}`}
                                            item={item}
                                            navigate={navigate}
                                        />
                                    ))}
                                </div>
                            )}


                            {/* Keywords as chips at the bottom */}
                            {(activeFilter === 'all' || activeFilter === 'keyword') && keywords.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-[#BFBCFC]/15">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-3">Keywords</p>
                                    <div className="flex flex-wrap gap-2">
                                        {keywords.map(k => (
                                            <span
                                                key={k.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#151921] border border-[#BFBCFC]/15 rounded-full text-[#F8FAFC] text-sm hover:border-[#BFBCFC]/40 transition-colors"
                                            >
                                                <Tag className="w-3 h-3 text-[#94A3B8]" />
                                                {k.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* ── Right: filter sidebar ── */}
                        {results.length > 0 && (
                            <aside className="hidden lg:block w-48 flex-none">
                                <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-3 pb-3 border-b border-[#BFBCFC]/15">
                                    Show results for
                                </p>
                                <ul className="space-y-1">
                                    {FILTERS.map(({ id, label }) => {
                                        const count = countFor(id);
                                        return (
                                            <li key={id}>
                                                <button
                                                    onClick={() => setActiveFilter(id)}
                                                    className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors ${
                                                        activeFilter === id
                                                            ? 'text-[#F8FAFC] font-semibold bg-[#BFBCFC]/10'
                                                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                                                    }`}
                                                >
                                                    {label}
                                                    {count > 0 && (
                                                        <span className="text-xs text-[#94A3B8]">{count}</span>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </aside>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
