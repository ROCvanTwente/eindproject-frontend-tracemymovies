import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Search, Plus, Trash2, GripVertical, Edit } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { searchMovies } from '../services/tmdb';
import { toast } from 'sonner';
export function ListDetailPage() {
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    // Mock list data
    const list = {
        id: 1,
        name: 'Christopher Nolan Filmography',
        description: 'All films directed by Christopher Nolan',
        isRanked: true,
        createdAt: '2024-03-15',
    };
    const mockMovies = [
        {
            id: 1,
            title: 'Inception',
            poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
            vote_average: 8.4,
            release_date: '2010-07-15',
            rank: 1,
        },
        {
            id: 2,
            title: 'The Dark Knight',
            poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            vote_average: 8.5,
            release_date: '2008-07-16',
            rank: 2,
        },
        {
            id: 3,
            title: 'Interstellar',
            poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            vote_average: 8.6,
            release_date: '2014-11-05',
            rank: 3,
        },
    ];
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim())
            return;
        setIsSearching(true);
        try {
            const results = await searchMovies(searchQuery);
            setSearchResults(results.slice(0, 8));
        }
        catch (error) {
            toast.error('Search failed');
        }
        finally {
            setIsSearching(false);
        }
    };
    const handleAddMovie = (movie) => {
        toast.success(`Added ${movie.title} to list`);
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
    };
    return (_jsx("div", { className: "min-h-screen py-8 md:py-12", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsxs(Link, { to: "/my-lists", className: "inline-flex items-center gap-2 text-[#BFBCFC] hover:text-[#AFA9FF] mb-6 transition-colors", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), "Back to Lists"] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 md:p-8 mb-8", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold font-heading text-[#F8FAFC] mb-2", children: list.name }), _jsx("p", { className: "text-[#94A3B8] mb-4", children: list.description }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("span", { className: "text-[#44FFFF] font-data font-medium", children: [mockMovies.length, " films"] }), list.isRanked && (_jsx("span", { className: "text-[#94A3B8]", children: "\u2022 Ranked" })), _jsxs("span", { className: "text-[#94A3B8]", children: ["\u2022 Created ", list.createdAt] })] })] }), _jsx("button", { className: "p-2 hover:bg-[#BFBCFC]/20 rounded-lg transition-all", children: _jsx(Edit, { className: "w-5 h-5 text-[#BFBCFC]" }) })] }), _jsxs("button", { onClick: () => setShowSearch(!showSearch), className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#BFBCFC]/30", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add Movies"] })] }), showSearch && (_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 mb-8", children: [_jsx("h3", { className: "text-xl font-bold text-[#F8FAFC] mb-4", children: "Search Movies" }), _jsxs("form", { onSubmit: handleSearch, className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-5 h-5" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search for a movie to add...", className: "w-full bg-[#0B0E14] text-[#F8FAFC] pl-12 pr-28 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20" }), _jsx("button", { type: "submit", className: "absolute right-2 top-1/2 -translate-y-1/2 bg-[#BFBCFC] text-[#0B0E14] px-4 py-2 rounded-lg font-bold text-sm", children: isSearching ? 'Searching...' : 'Search' })] }), searchResults.length > 0 && (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4", children: searchResults.map((movie) => (_jsxs("div", { className: "relative group", children: [_jsxs("div", { className: "bg-[#0B0E14] rounded-xl overflow-hidden border border-[#BFBCFC]/10", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, alt: movie.title, className: "w-full aspect-[2/3] object-cover" }), _jsxs("div", { className: "p-3", children: [_jsx("h4", { className: "text-[#F8FAFC] text-sm font-medium truncate mb-1", children: movie.title }), _jsx("p", { className: "text-[#94A3B8] text-xs", children: movie.release_date?.split('-')[0] })] })] }), _jsx("button", { onClick: () => handleAddMovie(movie), className: "absolute top-2 right-2 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all", children: _jsx(Plus, { className: "w-4 h-4" }) })] }, movie.id))) }))] })), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6", children: mockMovies.map((movie) => (_jsxs("div", { className: "relative group", children: [list.isRanked && (_jsx("div", { className: "absolute top-2 left-2 z-10", children: _jsx("div", { className: "w-10 h-10 bg-[#BFBCFC] rounded-lg flex items-center justify-center shadow-lg", children: _jsx("span", { className: "text-[#0B0E14] font-bold font-heading text-lg", children: movie.rank }) }) })), _jsx(MovieCard, { movie: movie }), _jsxs("div", { className: "absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [list.isRanked && (_jsx("button", { className: "bg-[#151921]/90 backdrop-blur-sm hover:bg-[#BFBCFC]/20 text-[#BFBCFC] p-2 rounded-lg transition-all shadow-lg cursor-move", title: "Drag to reorder", children: _jsx(GripVertical, { className: "w-4 h-4" }) })), _jsx("button", { className: "bg-[#FF61D2]/90 backdrop-blur-sm hover:bg-[#FF61D2] text-white p-2 rounded-lg transition-all shadow-lg", title: "Remove from list", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, movie.id))) }), mockMovies.length === 0 && (_jsxs("div", { className: "text-center py-20", children: [_jsx(Search, { className: "w-24 h-24 text-[#BFBCFC]/20 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-heading font-bold text-[#F8FAFC] mb-2", children: "No movies yet" }), _jsx("p", { className: "text-[#94A3B8] mb-6", children: "Start adding movies to your list" }), _jsxs("button", { onClick: () => setShowSearch(true), className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all inline-flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add Your First Movie"] })] }))] }) }));
}
