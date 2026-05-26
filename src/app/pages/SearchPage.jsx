import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, SlidersHorizontal, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router';
import { MovieCard } from '../components/MovieCard';

const BROWSE_URL = `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/get20movies`;
const SEARCH_URL = `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/search`;

export function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlQuery = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [showFilters, setShowFilters] = useState(false);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [filters, setFilters] = useState({ genre: [] });
    const [sortBy, setSortBy] = useState('popularity');

    const fetchSearchResults = useCallback(async (query) => {
        setLoading(true);
        setError(false);
        try {
            const response = await fetch(`${SEARCH_URL}?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setMovies(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetch100Movies = useCallback(async () => {
        setLoading(true);
        setError(false);
        let allFetchedMovies = [];
        try {
            for (let i = 0; i < 5; i++) {
                const response = await fetch(`${BROWSE_URL}?page=${i + 1}`);
                if (!response.ok) throw new Error('API faal');
                const data = await response.json();
                const newMovies = data.results || data;
                if (Array.isArray(newMovies)) {
                    allFetchedMovies = [...allFetchedMovies, ...newMovies];
                }
            }
            setMovies(allFetchedMovies);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setSearchQuery(urlQuery);
        if (urlQuery.trim()) {
            fetchSearchResults(urlQuery);
        } else {
            fetch100Movies();
        }
    }, [urlQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            setSearchParams({ q: trimmed });
        } else {
            setSearchParams({});
        }
    };

    const toggleGenre = (genre) => {
        setFilters(prev => ({
            ...prev,
            genre: prev.genre.includes(genre)
                ? prev.genre.filter((g) => g !== genre)
                : [...prev.genre, genre],
        }));
    };

    const filteredMovies = urlQuery
        ? movies
        : movies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

    // --- Error View (Geen kaders/randjes) ---
    if (error && !loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0E14] px-4 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] mb-3 font-heading">
                    Verbinding mislukt
                </h2>
                <p className="text-[#94A3B8] mb-10 max-w-md leading-relaxed">
                    De films konden niet worden opgehaald. Controleer of de API <span className="text-[#BFBCFC]">actief</span> is.
                </p>
                <button 
                    onClick={fetch100Movies}
                    className="flex items-center gap-3 bg-[#44FFFF] text-[#0B0E14] py-4 px-10 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#44FFFF]/20"
                >
                    <RefreshCw className="w-5 h-5" />
                    Opnieuw proberen
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0E14]">
            {/* Header & Search */}
            <div className="bg-[#151921]/70 backdrop-blur-xl border-b border-[#BFBCFC]/15 py-6 md:py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-4 md:mb-6">Search Movies</h1>
                    <form onSubmit={handleSearch} className="flex gap-3 md:gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 md:w-5 h-4 md:h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search movies..."
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            type="button"
                            className="bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 md:px-6 py-3 md:py-4 rounded-xl border border-[#BFBCFC]/15 transition-all flex items-center gap-2"
                        >
                            <Filter className="w-4 md:w-5 h-4 md:h-5" />
                            <span className="hidden md:inline">Filters</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 max-w-7xl py-6 md:py-8">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    
                    {/* Sidebar Filters */}
                    {showFilters && (
                        <aside className="w-full lg:w-80 flex-shrink-0">
                            <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 lg:sticky lg:top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-heading font-bold text-[#F8FAFC]">Filters</h2>
                                    <button onClick={() => setShowFilters(false)} className="text-[#94A3B8] hover:text-[#F8FAFC]">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-[#F8FAFC] mb-3 font-medium">Genre</label>
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map((genre) => (
                                            <button 
                                                key={genre}
                                                onClick={() => toggleGenre(genre)} 
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.genre.includes(genre) ? 'bg-[#BFBCFC] text-[#0B0E14]' : 'bg-[#0B0E14] text-[#94A3B8] border border-[#BFBCFC]/15'}`}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Movie Grid Area */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <p className="text-[#94A3B8] text-sm md:text-base">
                                {urlQuery
                                    ? <>Results for <span className="text-[#BFBCFC] font-medium">"{urlQuery}"</span>: <span className="text-[#44FFFF] font-medium">{filteredMovies.length}</span></>
                                    : <>Found <span className="text-[#44FFFF] font-medium">{filteredMovies.length}</span> movies</>
                                }
                            </p>
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#94A3B8]" />
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)} 
                                    className="bg-[#151921] text-[#F8FAFC] px-3 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]"
                                >
                                    <option value="popularity">Popularity</option>
                                    <option value="rating-high">Highest Rating</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-12 h-12 animate-spin text-[#BFBCFC]" />
                                <p className="text-[#94A3B8]">Loading movies...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
    {filteredMovies.map((movie, index) => (
        <MovieCard key={`${movie.id}-${index}`} movie={movie} />
    ))}
</div>
                        )}

                        {!loading && filteredMovies.length === 0 && (
                            <div className="text-center py-20">
                                <Search className="w-16 h-16 text-[#BFBCFC]/20 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-[#F8FAFC]">No results found</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}