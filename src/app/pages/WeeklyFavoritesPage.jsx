import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Equal, Plus } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { getNowPlaying } from '../services/tmdb';
export function WeeklyFavoritesPage() {
    const [newlyAdded, setNewlyAdded] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        loadNewlyAdded();
    }, []);
    async function loadNewlyAdded() {
        try {
            setLoading(true);
            const nowPlaying = await getNowPlaying('NL');
            setNewlyAdded(nowPlaying || []);
        }
        catch (error) {
            console.error('Error loading newly added movies:', error);
        }
        finally {
            setLoading(false);
        }
    }
    const lastWeekMovies = [
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
    ];
    const thisWeekMovies = [
        {
            id: 2,
            title: 'The Godfather',
            poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
            vote_average: 8.7,
            release_date: '1972-03-14',
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
    ];
    const getTrendIcon = (movieId) => {
        const wasLastWeek = lastWeekMovies.some((m) => m.id === movieId);
        const isThisWeek = thisWeekMovies.some((m) => m.id === movieId);
        if (isThisWeek && !wasLastWeek) {
            return _jsx(TrendingUp, { className: "w-5 h-5 text-[#44FFFF]" });
        }
        if (isThisWeek && wasLastWeek) {
            return _jsx(Equal, { className: "w-5 h-5 text-[#BFBCFC]" });
        }
        return _jsx(TrendingDown, { className: "w-5 h-5 text-[#FF61D2]" });
    };
    return (_jsx("div", { className: "min-h-screen py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsxs("div", { className: "mb-6 md:mb-8 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-2xl mb-4", children: _jsx(Calendar, { className: "w-8 md:w-10 h-8 md:h-10 text-[#BFBCFC]" }) }), _jsx("h1", { className: "text-2xl md:text-3xl lg:text-5xl font-bold font-heading text-[#F8FAFC] mb-3", children: "Weekly Favorites" }), _jsx("p", { className: "text-[#94A3B8] text-base md:text-lg", children: "Track how your favorite movies change week by week" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-[#44FFFF]" }), _jsx("h3", { className: "text-[#94A3B8] font-medium text-sm md:text-base", children: "New Entries" })] }), _jsx("p", { className: "text-4xl md:text-5xl font-bold font-heading text-[#44FFFF]", children: "2" }), _jsx("p", { className: "text-[#94A3B8] text-xs md:text-sm mt-2", children: "movies added this week" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [_jsx(Equal, { className: "w-5 h-5 text-[#BFBCFC]" }), _jsx("h3", { className: "text-[#94A3B8] font-medium text-sm md:text-base", children: "Staying Power" })] }), _jsx("p", { className: "text-4xl md:text-5xl font-bold font-heading text-[#BFBCFC]", children: "1" }), _jsx("p", { className: "text-[#94A3B8] text-xs md:text-sm mt-2", children: "movies from last week" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [_jsx(TrendingDown, { className: "w-5 h-5 text-[#FF61D2]" }), _jsx("h3", { className: "text-[#94A3B8] font-medium text-sm md:text-base", children: "Dropped Out" })] }), _jsx("p", { className: "text-4xl md:text-5xl font-bold font-heading text-[#FF61D2]", children: "2" }), _jsx("p", { className: "text-[#94A3B8] text-xs md:text-sm mt-2", children: "movies no longer favorites" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-1 h-8 bg-[#94A3B8] rounded-full" }), _jsx("h2", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC]", children: "Vorige Week" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6", children: lastWeekMovies.map((movie) => (_jsxs("div", { className: "relative", children: [_jsx(MovieCard, { movie: movie }), _jsx("div", { className: "absolute top-2 left-2 bg-[#0B0E14]/90 backdrop-blur-sm px-2 py-1 rounded-lg", children: getTrendIcon(movie.id) })] }, movie.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-1 h-8 bg-[#BFBCFC] rounded-full" }), _jsx("h2", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC]", children: "Deze Week" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6", children: thisWeekMovies.map((movie) => (_jsxs("div", { className: "relative", children: [_jsx(MovieCard, { movie: movie }), _jsx("div", { className: "absolute top-2 left-2 bg-[#0B0E14]/90 backdrop-blur-sm px-2 py-1 rounded-lg", children: getTrendIcon(movie.id) })] }, movie.id))) })] })] }), _jsxs("div", { className: "mt-12 bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4", children: [_jsx("h3", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Legend" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-[#44FFFF]" }), _jsxs("div", { children: [_jsx("p", { className: "text-[#F8FAFC] font-medium text-sm md:text-base", children: "New Entry" }), _jsx("p", { className: "text-[#94A3B8] text-xs md:text-sm", children: "Added this week" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Equal, { className: "w-5 h-5 text-[#BFBCFC]" }), _jsxs("div", { children: [_jsx("p", { className: "text-[#F8FAFC] font-medium text-sm md:text-base", children: "Consistent" }), _jsx("p", { className: "text-[#94A3B8] text-xs md:text-sm", children: "Still a favorite" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TrendingDown, { className: "w-5 h-5 text-[#FF61D2]" }), _jsxs("div", { children: [_jsx("p", { className: "text-[#F8FAFC] font-medium text-sm md:text-base", children: "Dropped" }), _jsx("p", { className: "text-[#94A3B8] text-xs md:text-sm", children: "No longer in top favorites" })] })] })] })] }), _jsxs("div", { className: "mt-12", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-1 h-8 bg-[#44FFFF] rounded-full" }), _jsx("h2", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC]", children: "Nieuw toegevoegd" })] }), loading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#BFBCFC]" }) })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6", children: newlyAdded.slice(0, 10).map((movie) => (_jsxs("div", { className: "relative group", children: [_jsx(MovieCard, { movie: movie }), _jsxs("div", { className: "absolute top-2 left-2 bg-[#44FFFF]/90 backdrop-blur-sm text-[#0B0E14] px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium shadow-lg", children: [_jsx(Plus, { className: "w-3 h-3" }), "NEW"] })] }, movie.id))) }))] })] }) }));
}
