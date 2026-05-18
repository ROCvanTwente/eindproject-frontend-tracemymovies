import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Belangrijk voor de fix
import { X, Calendar, RotateCw, Save, Star, MessageSquare, Search, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { searchMovies } from '../services/tmdb';
export function WatchLogModal({ isOpen, onClose, movieTitle, movieYear, moviePoster }) {
    const [step, setStep] = useState('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [watchDate, setWatchDate] = useState(new Date().toISOString().split('T')[0]);
    const [includeDateWatched, setIncludeDateWatched] = useState(true);
    const [isRewatch, setIsRewatch] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    // Reset form bij openen
    useEffect(() => {
        if (isOpen) {
            setStep('search');
            setSearchQuery('');
            setSearchResults([]);
            setSelectedMovie(null);
            // Voorkom scrollen van de achtergrond
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim())
            return;
        setIsSearching(true);
        try {
            const results = await searchMovies(searchQuery);
            setSearchResults(results.slice(0, 5));
        }
        catch (error) {
            toast.error('Search failed.');
        }
        finally {
            setIsSearching(false);
        }
    };
    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        setStep('log');
    };
    const handleSubmit = () => {
        if (rating === 0 || !reviewText.trim()) {
            toast.error('Vul alle verplichte velden in');
            return;
        }
        toast.success('Gereden in je logboek!');
        onClose();
    };
    // De Modal Content
    const modalContent = (_jsxs("div", { className: "fixed inset-0 flex items-start justify-center px-4 py-8 sm:items-center overflow-y-auto", style: { zIndex: 99999 }, children: [_jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-md", onClick: onClose }), _jsx("div", { className: "relative w-full max-w-3xl z-[100000] animate-in fade-in zoom-in-95 duration-200", children: step === 'search' ? (_jsxs("div", { className: "w-full", children: [_jsxs("form", { onSubmit: handleSearch, className: "relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-5 h-5" }), _jsx("input", { type: "text", autoFocus: true, value: searchQuery, onChange: (e) => {
                                        setSearchQuery(e.target.value);
                                        setSearchResults([]);
                                    }, placeholder: "Type de volledige filmtitel...", className: "w-full bg-[#151921] text-[#F8FAFC] pl-12 pr-28 py-4 rounded-xl border-2 border-[#BFBCFC]/30 focus:border-[#BFBCFC] focus:outline-none shadow-2xl" }), _jsx("button", { type: "submit", className: "absolute right-2 top-1/2 -translate-y-1/2 bg-[#BFBCFC] text-[#0B0E14] px-4 py-2 rounded-lg font-bold text-sm", children: isSearching ? '...' : 'Zoek' })] }), searchResults.length > 0 && (_jsx("div", { className: "mt-4 bg-[#151921] border border-[#BFBCFC]/20 rounded-xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto", children: searchResults.map((movie) => (_jsxs("button", { onClick: () => handleSelectMovie(movie), className: "w-full flex items-center gap-4 p-3 hover:bg-[#BFBCFC]/10 transition-colors border-b border-[#BFBCFC]/5 text-left", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w92${movie.poster_path}`, className: "w-12 h-16 object-cover rounded-md", alt: "" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-[#F8FAFC] font-bold", children: movie.title }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: movie.release_date?.split('-')[0] })] }), _jsx(ChevronRight, { className: "w-5 h-5 text-[#94A3B8]" })] }, movie.id))) }))] })) : (_jsxs("div", { className: "bg-[#151921] border border-[#BFBCFC]/20 rounded-2xl overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "relative h-40 overflow-hidden", children: [_jsx("img", { src: selectedMovie?.poster_path
                                        ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
                                        : moviePoster, className: "w-full h-full object-cover object-center opacity-50", alt: "" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#151921] to-transparent" }), _jsxs("button", { onClick: () => setStep("search"), className: "absolute top-4 left-4 p-2 bg-black/50 hover:bg-black rounded-lg text-white text-xs flex items-center gap-1", children: [_jsx(ChevronRight, { className: "w-4 h-4 rotate-180" }), " Terug"] }), _jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 rounded-lg text-white", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 sm:p-8 -mt-10 relative", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: selectedMovie?.title }), _jsxs("div", { className: "mt-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-[#0B0E14] p-4 rounded-xl border border-[#BFBCFC]/10 flex justify-between items-center", children: [_jsxs("span", { className: "text-sm text-gray-400 flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), " Datum"] }), _jsx("input", { type: "date", value: watchDate, onChange: (e) => setWatchDate(e.target.value), className: "bg-transparent text-sm text-white outline-none cursor-pointer" })] }), _jsxs("div", { className: "bg-[#0B0E14] p-4 rounded-xl border border-[#BFBCFC]/10 flex justify-between items-center", children: [_jsxs("span", { className: "text-sm text-gray-400 flex items-center gap-2", children: [_jsx(RotateCw, { className: "w-4 h-4" }), " Rewatch"] }), _jsx("button", { onClick: () => setIsRewatch(!isRewatch), className: `w-10 h-5 rounded-full transition-colors relative ${isRewatch ? 'bg-cyan-400' : 'bg-gray-700'}`, children: _jsx("div", { className: `absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isRewatch ? 'left-6' : 'left-1'}` }) })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "text-sm text-gray-400 flex items-center gap-2", children: [_jsx(Star, { className: "w-4 h-4 text-pink-500" }), " Score"] }), _jsx("div", { className: "flex gap-1.5 overflow-x-auto pb-2", children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => {
                                                        const active = hoverRating
                                                            ? rating <= hoverRating
                                                            : rating <= rating;
                                                        return (_jsx("button", { onClick: () => setRating(rating), onMouseEnter: () => setHoverRating(rating), className: "transition-all duration-200", children: _jsx(Star, { className: `w-8 h-8 transition-all duration-200 ${active
                                                                    ? "text-[#44FFFF] fill-[#44FFFF] scale-110"
                                                                    : "text-[#94A3B8] fill-transparent scale-100"}` }) }, rating));
                                                    }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "text-sm text-gray-400 flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-4 h-4 text-pink-500" }), " Recensie"] }), _jsx("textarea", { value: reviewText, onChange: (e) => setReviewText(e.target.value), placeholder: "Wat vond je ervan?", className: "w-full bg-[#0B0E14] border border-[#BFBCFC]/10 rounded-xl p-4 text-white min-h-[120px] focus:border-pink-500 outline-none" })] }), _jsxs("button", { onClick: handleSubmit, className: "w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95", children: [_jsx(Save, { className: "w-5 h-5" }), " Log opslaan"] })] })] })] })) })] }));
    // Gebruik createPortal om de modal naar het einde van de body te verplaatsen
    return createPortal(modalContent, document.body);
}
