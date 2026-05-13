import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { MovieCarousel } from '../components/MovieCarousel';
import { getTrending, getPopular, getTopRated, getUpcoming } from '../services/tmdb';
export function HomePage() {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadMovies();
    }, []);
    async function loadMovies() {
        try {
            setLoading(true);
            const [trending, popular, topRated, upcoming] = await Promise.all([
                getTrending('week', 'NL'),
                getPopular('NL'),
                getTopRated('NL'),
                getUpcoming('NL'),
            ]);
            setTrendingMovies(trending?.slice(0, 5) || []);
            setPopularMovies(popular || []);
            setTopRatedMovies(topRated || []);
            setUpcomingMovies(upcoming || []);
        }
        catch (error) {
            console.error('Error loading movies:', error);
        }
        finally {
            setLoading(false);
        }
    }
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#BFBCFC]" }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(HeroSection, { movies: trendingMovies }), _jsxs("div", { className: "container mx-auto py-6 md:py-8 lg:py-10 px-4 max-w-7xl", children: [_jsx(MovieCarousel, { title: "Popular Now", movies: popularMovies }), _jsx(MovieCarousel, { title: "Top Rated", movies: topRatedMovies, showRanking: true }), _jsx(MovieCarousel, { title: "Coming Soon", movies: upcomingMovies, showReleaseDate: true })] })] }));
}
