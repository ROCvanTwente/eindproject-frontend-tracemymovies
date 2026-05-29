import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star, Heart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
export function MovieCard({ movie }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750/151921/BFBCFC?text=No+Poster';
    const handleClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login');
        }
    };
    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Like movie:', movie.id);
    };
    const handleLog = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Log movie:', movie.id);
    };
    return (_jsx(Link, { to: `/movie/${movie.id}`, onClick: handleClick, className: "group cursor-pointer", children: _jsxs("div", { className: "relative overflow-hidden rounded-xl aspect-[2/3] bg-[#151921] border border-[#BFBCFC]/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#BFBCFC]/30 hover:border-[#BFBCFC]/40", children: [_jsx("img", { src: imageUrl, alt: movie.title, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[#44FFFF] text-sm mb-2 font-data font-medium", children: [_jsx(Star, { className: "w-4 h-4", fill: "currentColor" }), _jsx("span", { children: movie.vote_average.toFixed(1) })] }), _jsx("h3", { className: "text-[#F8FAFC] font-heading font-medium text-sm line-clamp-2 leading-tight mb-3", children: movie.title }), movie.release_date && (_jsx("p", { className: "text-[#94A3B8] text-xs mb-3 font-data", children: new Date(movie.release_date).getFullYear() })), _jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsx("button", { onClick: handleLike, className: "text-[#F8FAFC] hover:text-[#FF61D2] transition-all duration-200 hover:scale-125", children: _jsx(Heart, { className: "w-6 h-6 hover:fill-current" }) }), _jsx("button", { onClick: handleLog, className: "text-[#F8FAFC] hover:text-[#44FFFF] transition-all duration-200 hover:scale-125", children: _jsx(Eye, { className: "w-6 h-6" }) })] })] }) })] }) }));
}
