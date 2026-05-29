import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as ReactSlick from 'react-slick';
import { ChevronLeft, ChevronRight, Star, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
const SliderComponent = (ReactSlick.default?.default ??
    ReactSlick.default ??
    ReactSlick);
function NextArrow(props) {
    const { onClick } = props;
    if (!onClick)
        return null;
    return (_jsx("button", { type: "button", onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        }, className: "absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-[#151921]/90 backdrop-blur-sm hover:bg-[#BFBCFC] hover:text-[#0B0E14] text-[#F8FAFC] p-3 rounded-xl transition-all duration-200 hover:scale-110 border border-[#BFBCFC]/20 hover:shadow-lg hover:shadow-[#BFBCFC]/30 cursor-pointer", style: { pointerEvents: 'auto' }, children: _jsx(ChevronRight, { className: "w-6 h-6" }) }));
}
function PrevArrow(props) {
    const { onClick } = props;
    if (!onClick)
        return null;
    return (_jsx("button", { type: "button", onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        }, className: "absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-[#151921]/90 backdrop-blur-sm hover:bg-[#BFBCFC] hover:text-[#0B0E14] text-[#F8FAFC] p-3 rounded-xl transition-all duration-200 hover:scale-110 border border-[#BFBCFC]/20 hover:shadow-lg hover:shadow-[#BFBCFC]/30 cursor-pointer", style: { pointerEvents: 'auto' }, children: _jsx(ChevronLeft, { className: "w-6 h-6" }) }));
}
export function MovieCarousel({ title, movies, showRanking = false, showReleaseDate = false }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const handleLike = (e, movieId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Like movie:', movieId);
    };
    const handleLog = (e, movieId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Log movie:', movieId);
    };
    const handleMovieClick = (e, movieId) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login');
        }
        else {
            navigate(`/movie/${movieId}`);
        }
    };
    const getRankingBadge = (index) => {
        if (!showRanking || index > 2)
            return null;
        const badges = [
            { color: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-500/50', number: '1' },
            { color: 'from-gray-300 to-gray-500', glow: 'shadow-gray-400/50', number: '2' },
            { color: 'from-orange-400 to-orange-600', glow: 'shadow-orange-500/50', number: '3' },
        ];
        const badge = badges[index];
        return (_jsx("div", { className: `absolute top-2 left-2 z-10 bg-gradient-to-br ${badge.color} rounded-lg w-8 h-8 shadow-lg ${badge.glow} animate-pulse flex items-center justify-center`, children: _jsx("span", { className: "text-white font-bold text-lg", children: badge.number }) }));
    };
    const settings = {
        dots: false,
        infinite: movies.length > 5,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        nextArrow: _jsx(NextArrow, {}),
        prevArrow: _jsx(PrevArrow, {}),
        responsive: [
            {
                breakpoint: 1536,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
        ],
    };
    if (movies.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: "mb-6 md:mb-8", children: [_jsx("h2", { className: "text-lg md:text-xl font-heading text-[#F8FAFC] mb-3 md:mb-4 px-2 md:px-4", children: title }), _jsx("div", { className: "relative px-4 md:px-8", children: _jsx(SliderComponent, { ...settings, children: movies.map((movie, index) => {
                        const imageUrl = movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : 'https://via.placeholder.com/500x750/151921/BFBCFC?text=No+Poster';
                        return (_jsx("div", { className: "px-2", children: _jsx("div", { className: "group cursor-pointer", onClick: (e) => handleMovieClick(e, movie.id), children: _jsxs("div", { className: "relative overflow-hidden rounded-xl aspect-[2/3] bg-[#151921] border border-[#BFBCFC]/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#BFBCFC]/30 hover:border-[#BFBCFC]/40", children: [getRankingBadge(index), showReleaseDate && movie.release_date && (_jsx("div", { className: "absolute top-2 right-2 z-10 bg-[#44FFFF]/90 backdrop-blur-sm text-[#0B0E14] px-2 py-1 rounded-lg text-xs font-bold", children: new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })), _jsx("img", { src: imageUrl, alt: movie.title, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[#44FFFF] text-sm mb-2 font-data font-medium", children: [_jsx(Star, { className: "w-4 h-4", fill: "currentColor" }), _jsx("span", { children: movie.vote_average.toFixed(1) })] }), _jsx("h3", { className: "text-[#F8FAFC] font-heading font-medium text-sm line-clamp-2 leading-tight mb-2", children: movie.title }), movie.release_date && (_jsx("p", { className: "text-[#94A3B8] text-xs mb-3 font-data", children: new Date(movie.release_date).getFullYear() })), _jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsx("button", { onClick: (e) => handleLike(e, movie.id), className: "text-[#F8FAFC] hover:text-[#FF61D2] transition-all duration-200 hover:scale-125", children: _jsx(Heart, { className: "w-6 h-6 hover:fill-current" }) }), _jsx("button", { onClick: (e) => handleLog(e, movie.id), className: "text-[#F8FAFC] hover:text-[#44FFFF] transition-all duration-200 hover:scale-125", children: _jsx(Eye, { className: "w-6 h-6" }) })] })] }) })] }) }) }, movie.id));
                    }) }) })] }));
}
