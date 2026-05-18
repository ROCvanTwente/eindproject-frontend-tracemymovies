import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
export function HeroSection({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (movies.length === 0)
            return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(interval);
    }, [movies.length]);
    if (!movies || movies.length === 0) {
        return (_jsx("div", { className: "relative h-[500px] bg-[#151921] animate-pulse", children: _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent" }) }));
    }
    const movie = movies[currentIndex];
    const imageUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : 'https://via.placeholder.com/1920x1080/151921/BFBCFC?text=No+Image';
    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };
    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };
    const handleViewDetails = () => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        else {
            navigate(`/movie/${movie.id}`);
        }
    };
    return (_jsxs("div", { className: "relative h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden group", children: [_jsx("img", { src: imageUrl, alt: movie.title, className: "w-full h-full object-cover transition-opacity duration-1000" }, movie.id), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0B0E14]/80 via-transparent to-transparent" }), movies.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: goToPrevious, className: "absolute left-3 top-1/2 -translate-y-1/2 bg-[#151921]/80 backdrop-blur-sm hover:bg-[#BFBCFC] text-[#F8FAFC] hover:text-[#0B0E14] p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsx("button", { onClick: goToNext, className: "absolute right-3 top-1/2 -translate-y-1/2 bg-[#151921]/80 backdrop-blur-sm hover:bg-[#BFBCFC] text-[#F8FAFC] hover:text-[#0B0E14] p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110", children: _jsx(ChevronRight, { className: "w-5 h-5" }) })] })), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-3 md:p-6 lg:p-8", children: _jsxs("div", { className: "container mx-auto max-w-7xl", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 md:mb-3", children: [_jsx("span", { className: "bg-[#FF61D2] text-[#F8FAFC] px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs md:text-sm font-medium font-heading shadow-lg shadow-[#FF61D2]/30", children: "LIVE" }), _jsx("div", { className: "flex items-center gap-1", children: _jsxs("span", { className: "text-[#44FFFF] font-data font-medium text-xs md:text-sm", children: ["\u2605 ", movie.vote_average.toFixed(1)] }) })] }), _jsx("h1", { className: "text-2xl md:text-4xl lg:text-5xl font-bold text-[#F8FAFC] mb-2 md:mb-4 max-w-4xl leading-tight", children: movie.title }), _jsx("p", { className: "text-[#94A3B8] text-xs md:text-sm lg:text-base leading-relaxed mb-3 md:mb-5 max-w-2xl line-clamp-2 md:line-clamp-3", children: movie.overview }), _jsxs("div", { className: "flex flex-wrap gap-2 md:gap-3", children: [_jsxs("button", { onClick: handleViewDetails, className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-medium font-heading flex items-center gap-1.5 md:gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40 text-xs md:text-sm", children: [_jsx(Play, { className: "w-3.5 md:w-4 h-3.5 md:h-4", fill: "currentColor" }), "Watch Now"] }), _jsxs("button", { onClick: handleViewDetails, className: "bg-[#151921]/70 backdrop-blur-xl hover:bg-[#151921] text-[#F8FAFC] px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-medium font-heading flex items-center gap-1.5 md:gap-2 transition-all duration-200 hover:scale-105 border border-[#BFBCFC]/20 text-xs md:text-sm", children: [_jsx(Info, { className: "w-3.5 md:w-4 h-3.5 md:h-4" }), _jsx("span", { className: "hidden sm:inline", children: "View Details" }), _jsx("span", { className: "sm:hidden", children: "Details" })] })] }), movies.length > 1 && (_jsx("div", { className: "flex gap-1.5 mt-4", children: movies.map((_, index) => (_jsx("button", { onClick: () => setCurrentIndex(index), className: `h-1 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-6 bg-[#BFBCFC]'
                                    : 'w-3 bg-[#94A3B8]/50 hover:bg-[#94A3B8]'}` }, index))) }))] }) })] }));
}
