import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
const MOCK_MOVIES = [
    {
        id: 1,
        title: 'The Shawshank Redemption',
        poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        vote_average: 8.7,
        release_date: '1994-09-23',
    },
    {
        id: 2,
        title: 'The Godfather',
        poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        vote_average: 8.7,
        release_date: '1972-03-14',
    },
    {
        id: 550,
        title: 'Fight Club',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        vote_average: 8.4,
        release_date: '1999-10-15',
    },
    {
        id: 27205,
        title: 'Inception',
        poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        vote_average: 8.4,
        release_date: '2010-07-16',
    },
    {
        id: 157336,
        title: 'Interstellar',
        poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        vote_average: 8.4,
        release_date: '2014-11-07',
    },
    {
        id: 155,
        title: 'The Dark Knight',
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        vote_average: 8.5,
        release_date: '2008-07-18',
    },
];
export function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [movies, setMovies] = useState(MOCK_MOVIES);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);
    const [filters, setFilters] = useState({
        genre: [],
        year: '',
        rating: '',
        language: '',
        country: '',
        platform: '',
        runtime: '',
        ageRating: '',
    });
    const [sortBy, setSortBy] = useState('popularity');
    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];
    const years = Array.from({ length: 50 }, (_, i) => (2024 - i).toString());
    const platforms = ['Netflix', 'Disney+', 'Prime Video', 'HBO Max', 'Apple TV+'];
    const toggleGenre = (genre) => {
        setFilters({
            ...filters,
            genre: filters.genre.includes(genre)
                ? filters.genre.filter((g) => g !== genre)
                : [...filters.genre, genre],
        });
    };
    // Load more movies (simulated infinite scroll)
    const loadMoreMovies = async () => {
        if (loading || !hasMore)
            return;
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Add more movies (duplicating for demo)
        const newMovies = MOCK_MOVIES.map((movie) => ({
            ...movie,
            id: movie.id + page * 1000,
        }));
        setMovies((prev) => [...prev, ...newMovies]);
        setPage((prev) => prev + 1);
        // Stop after 3 pages for demo
        if (page >= 3) {
            setHasMore(false);
        }
        setLoading(false);
    };
    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadMoreMovies();
            }
        }, { threshold: 0.1 });
        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }
        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, page]);
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx("div", { className: "bg-[#151921]/70 backdrop-blur-xl border-b border-[#BFBCFC]/15 py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-4 md:mb-6", children: "Search Movies" }), _jsxs("div", { className: "flex gap-3 md:gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 md:w-5 h-4 md:h-5" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search movies...", className: "w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-base md:text-lg" })] }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 md:px-6 py-3 md:py-4 rounded-xl border border-[#BFBCFC]/15 transition-all flex items-center gap-2", children: [_jsx(Filter, { className: "w-4 md:w-5 h-4 md:h-5" }), _jsx("span", { className: "hidden md:inline", children: "Filters" })] })] })] }) }), _jsx("div", { className: "container mx-auto px-4 max-w-7xl py-6 md:py-8", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-4 md:gap-6", children: [showFilters && (_jsx("aside", { className: "w-full lg:w-80 flex-shrink-0", children: _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-3 md:p-4 lg:sticky lg:top-24", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-heading font-bold text-[#F8FAFC]", children: "Filters" }), _jsx("button", { onClick: () => setShowFilters(false), className: "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] mb-3 font-medium", children: "Genre" }), _jsx("div", { className: "flex flex-wrap gap-2", children: genres.map((genre) => (_jsx("button", { onClick: () => toggleGenre(genre), className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.genre.includes(genre)
                                                                ? 'bg-[#BFBCFC] text-[#0B0E14]'
                                                                : 'bg-[#0B0E14] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#BFBCFC]/15'}`, children: genre }, genre))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] mb-2 font-medium", children: "Year" }), _jsxs("select", { value: filters.year, onChange: (e) => setFilters({ ...filters, year: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]", children: [_jsx("option", { value: "", children: "All Years" }), years.map((year) => (_jsx("option", { value: year, children: year }, year)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] mb-2 font-medium", children: "Streaming Platform" }), _jsxs("select", { value: filters.platform, onChange: (e) => setFilters({ ...filters, platform: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]", children: [_jsx("option", { value: "", children: "All Platforms" }), platforms.map((platform) => (_jsx("option", { value: platform, children: platform }, platform)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] mb-2 font-medium", children: "Rating" }), _jsxs("select", { value: filters.rating, onChange: (e) => setFilters({ ...filters, rating: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]", children: [_jsx("option", { value: "", children: "All Ratings" }), _jsx("option", { value: "9+", children: "9+ Stars" }), _jsx("option", { value: "8+", children: "8+ Stars" }), _jsx("option", { value: "7+", children: "7+ Stars" }), _jsx("option", { value: "6+", children: "6+ Stars" })] })] })] })] }) })), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [_jsxs("p", { className: "text-[#94A3B8] text-sm md:text-base", children: ["Found ", _jsx("span", { className: "text-[#44FFFF] font-data font-medium", children: "234" }), " results"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(SlidersHorizontal, { className: "w-4 h-4 text-[#94A3B8]" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-[#151921] text-[#F8FAFC] px-3 md:px-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm md:text-base", children: [_jsx("option", { value: "popularity", children: "Popularity" }), _jsx("option", { value: "newest", children: "Newest" }), _jsx("option", { value: "oldest", children: "Oldest" }), _jsx("option", { value: "rating-high", children: "Highest Rating" }), _jsx("option", { value: "rating-low", children: "Lowest Rating" }), _jsx("option", { value: "alphabetical", children: "Alphabetical" })] })] })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6", children: movies.map((movie) => (_jsx(MovieCard, { movie: movie }, movie.id))) }), hasMore && (_jsx("div", { ref: observerTarget, className: "flex justify-center py-8", children: loading && (_jsxs("div", { className: "flex items-center gap-2 text-[#BFBCFC]", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin" }), _jsx("span", { className: "font-medium", children: "Loading more movies..." })] })) })), !hasMore && movies.length > 0 && (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-[#94A3B8]", children: "No more movies to load" }) })), movies.length === 0 && (_jsxs("div", { className: "text-center py-20", children: [_jsx(Search, { className: "w-24 h-24 text-[#BFBCFC]/20 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-heading font-bold text-[#F8FAFC] mb-2", children: "No results found" }), _jsx("p", { className: "text-[#94A3B8]", children: "Try adjusting your filters or search query" })] }))] })] }) })] }));
}
