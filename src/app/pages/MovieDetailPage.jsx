import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { 
    Heart, Plus, Star, DollarSign, Globe, Calendar, 
    Clock, Eye, Share2, Loader2, User, ChevronRight, AlertCircle, RefreshCw,
    Play, X
} from "lucide-react";
import { WatchLogModal } from "../components/WatchLogModal";
import { ShareModal } from "../components/ShareModal";
import { toast } from "sonner";

const CastSection = React.memo(({ cast }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedCast = useMemo(() => showAll ? cast : cast.slice(0, 10), [cast, showAll]);

    if (!cast || cast.length === 0) return null;

    return (
        _jsxs("div", { className: "space-y-4", children: [
            _jsxs("div", { className: "flex items-center justify-between", children: [
                _jsx("h3", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC]", children: "Cast & Crew" }),
                cast.length > 10 && _jsxs("button", { 
                    onClick: () => setShowAll(!showAll),
                    className: "text-[#44FFFF] text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1",
                    children: [
                        showAll ? "Toon minder" : `Toon alle ${cast.length}`,
                        _jsx(ChevronRight, { className: `w-4 h-4 transition-transform ${showAll ? "rotate-90" : ""}` })
                    ]
                })
            ] }),
            _jsxs("div", { 
                className: "flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#BFBCFC]/20 scrollbar-track-transparent snap-x snap-proximity", 
                children: [
                    displayedCast.map((actor) => (
                        _jsxs("div", { 
                            className: "flex-none w-[120px] md:w-[140px] bg-[#151921] border border-[#BFBCFC]/10 rounded-xl overflow-hidden shadow-lg snap-start", 
                            children: [
                                actor.profile_path ? (
                                    _jsx("img", { src: `https://image.tmdb.org/t/p/w185${actor.profile_path}`, alt: actor.name, loading: "lazy", className: "w-full h-[150px] md:h-[185px] object-cover" })
                                ) : (
                                    _jsx("div", { className: "w-full h-[150px] md:h-[185px] bg-[#1c222d] flex items-center justify-center border-b border-[#BFBCFC]/10", children: _jsx(User, { className: "w-10 h-10 text-[#94A3B8]/50" }) })
                                ),
                                _jsxs("div", { className: "p-2 space-y-0.5", children: [
                                    _jsx("p", { className: "text-[#F8FAFC] font-semibold text-xs md:text-sm truncate", title: actor.name, children: actor.name }),
                                    _jsx("p", { className: "text-[#94A3B8] text-[11px] md:text-xs truncate", title: actor.character, children: actor.character })
                                ] })
                            ] 
                        }, actor.cast_id || actor.id)
                    ))
                ] 
            })
        ] })
    );
});

export function MovieDetailPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [showWatchLogModal, setShowWatchLogModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    
    // States voor de geanimeerde popup
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    const API_URL = 'https://localhost:7245/api/tmdbmovie/GetMovieDetails';

    const fetchMovieData = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`${API_URL}?id=${id}`);
            if (!res.ok) throw new Error("Netwerk respons was niet ok");
            const data = await res.json();
            setMovie(data);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(true);
            toast.error("Fout bij het laden van de filmgegevens");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchMovieData();
    }, [id]);

    // Luister naar ESC-toets om popup te sluiten
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeTrailer();
        };
        if (showTrailerModal) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showTrailerModal]);

    const trailerVideo = useMemo(() => {
        return movie?.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube") || movie?.videos?.results?.[0];
    }, [movie]);

    const openTrailer = () => {
        if (trailerVideo?.key) {
            setShowTrailerModal(true);
            setTimeout(() => setIsAnimateIn(true), 10);
        } else {
            toast.info("Geen trailer beschikbaar voor deze film");
        }
    };

    const closeTrailer = () => {
        setIsAnimateIn(false);
        setTimeout(() => setShowTrailerModal(false), 200);
    };

    if (loading) return <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E14]"><Loader2 className="w-8 h-8 text-[#44FFFF] animate-spin" /></div>;
    if (error) return <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0E14] px-4"><div className="bg-[#151921] border border-[#BFBCFC]/15 p-8 rounded-2xl max-w-md w-full text-center"><AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" /><h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Fout bij laden</h2><button onClick={fetchMovieData} className="w-full flex items-center justify-center gap-2 bg-[#44FFFF] text-[#0B0E14] py-3 rounded-xl font-bold mt-4"><RefreshCw className="w-4 h-4" /> Probeer opnieuw</button></div></div>;
    if (!movie) return null;

    const cast = movie.credits?.cast || [];

    return (_jsxs("div", { className: "min-h-screen bg-[#0B0E14]", children: [
        _jsxs("div", { className: "relative h-[300px] md:h-[400px] overflow-hidden", children: [
            _jsx("img", { src: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`, alt: movie.title, className: "w-full h-full object-cover" }),
            _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" }),
            _jsx("div", { className: "absolute bottom-0 left-0 right-0", children: _jsx("div", { className: "container mx-auto px-4 max-w-7xl pb-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 md:gap-6", children: [
                _jsx("img", { src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, alt: movie.title, className: "w-32 md:w-48 rounded-lg shadow-2xl border border-[#BFBCFC]/20 md:-mb-12 hidden md:block" }),
                _jsxs("div", { className: "flex-1 md:pt-16", children: [
                    _jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1.5", children: movie.title }),
                    movie.tagline && _jsx("p", { className: "text-[#BFBCFC] text-base md:text-lg italic mb-3", children: movie.tagline }),
                    _jsxs("div", { className: "flex flex-wrap items-center gap-2 md:gap-3 mb-4", children: [
                        _jsx("span", { className: "text-[#94A3B8] font-data text-xs md:text-sm", children: new Date(movie.release_date).getFullYear() }),
                        _jsx("span", { className: "text-[#94A3B8] hidden md:inline", children: "•" }),
                        _jsxs("span", { className: "text-[#94A3B8] font-data text-xs md:text-sm", children: [movie.runtime, " min"] }),
                        _jsx("span", { className: "text-[#94A3B8] hidden md:inline", children: "•" }),
                        movie.age_rating && _jsx("span", { className: "bg-[#FF61D2]/20 text-[#FF61D2] px-2 py-0.5 rounded-lg text-xs font-medium", children: movie.age_rating })
                    ] }),
                    _jsxs("div", { className: "flex flex-wrap gap-2", children: [
                        _jsxs("button", { onClick: () => setIsWatched(!isWatched), className: `px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isWatched ? "bg-[#44FFFF] text-[#000000]" : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"}`, children: [_jsx(Eye, { className: "w-3.5 md:w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Watched" })] }),
                        _jsxs("button", { onClick: () => setIsFavorite(!isFavorite), className: `px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isFavorite ? "bg-[#44FFFF] text-[#000000]" : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"}`, children: [_jsx(Heart, { className: `w-3.5 md:w-4 ${isFavorite ? "fill-current" : ""}` }), _jsx("span", { className: "hidden sm:inline", children: "Like" })] }),
                        _jsxs("button", { onClick: () => setIsInWatchlist(!isInWatchlist), className: `px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isInWatchlist ? "bg-[#44FFFF] text-[#0B0E14]" : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"}`, children: [_jsx(Plus, { className: "w-3.5 md:w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Watchlist" })] }),
                        
                        /* ROZE TRAILER KNOP */
                        _jsxs("button", { 
                            onClick: openTrailer, 
                            className: "bg-[#FF61D2]/10 hover:bg-[#FF61D2] text-[#FF61D2] hover:text-[#0B0E14] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 border border-[#FF61D2]/30 text-xs md:text-sm", 
                            children: [_jsx(Play, { className: "w-3.5 md:w-4 fill-current" }), _jsx("span", { className: "hidden sm:inline", children: "Trailer" })] 
                        }),

                        _jsxs("button", { onClick: () => setShowShareModal(true), className: "bg-[#151921]/70 hover:bg-[#44FFFF] hover:text-[#0B0E14] text-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 border border-[#BFBCFC]/20 text-xs md:text-sm", children: [_jsx(Share2, { className: "w-3.5 md:w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Share" })] })
                    ] })
                ] })
            ] }) }) })
        ] }),

        _jsxs("div", { className: "container mx-auto px-4 max-w-7xl py-8 mt-6 md:mt-12", children: [
            _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
                _jsxs("div", { className: "lg:col-span-2 space-y-10", children: [
                    _jsxs("div", { children: [
                        _jsx("h2", { className: "text-xl font-bold font-heading text-[#F8FAFC] mb-3", children: "Overview" }),
                        _jsx("p", { className: "text-[#94A3B8] leading-relaxed text-sm", children: movie.overview })
                    ] }),
                    _jsx(CastSection, { cast: cast }),
                    _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [
                        _jsxs("div", { className: "bg-[#151921] border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Release Date" })] }), _jsx("p", { className: "text-[#F8FAFC] font-data text-sm", children: movie.release_date })] }),
                        _jsxs("div", { className: "bg-[#151921] border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Runtime" })] }), _jsxs("p", { className: "text-[#F8FAFC] font-data text-sm", children: [movie.runtime, " min"] })] }),
                        _jsxs("div", { className: "bg-[#151921] border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(DollarSign, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Budget" })] }), _jsx("p", { className: "text-[#F8FAFC] font-data text-sm", children: movie.budget > 0 ? ["$", (movie.budget / 1000000).toFixed(0), "M"] : "N/A" })] })
                    ] })
                ] }),
                _jsxs("div", { className: "space-y-6", children: [
                    _jsxs("div", { className: "bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6", children: [
                        _jsx("h3", { className: "text-xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Scores" }),
                        _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#94A3B8]", children: "TMDB Score" }), _jsxs("span", { className: "text-[#44FFFF] font-data font-medium", children: ["★ ", movie.vote_average?.toFixed(1), "/10"] })] })
                    ] }),
                    _jsxs("div", { className: "bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6", children: [
                        _jsx("h3", { className: "text-xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Genres" }),
                        _jsx("div", { className: "flex flex-wrap gap-2", children: movie.genres?.map((genre) => (
                            _jsx("span", { className: "bg-[#BFBCFC]/10 text-[#BFBCFC] px-3 py-1 rounded-lg text-sm border border-[#BFBCFC]/20", children: genre.name }, genre.id)
                        )) })
                    ] })
                ] })
            ] })
        ] }),

        /* GEANIMEERDE EMBEDDED MODAL (GROTER SPELERFORMAAT) */
        showTrailerModal && trailerVideo?.key && (
            _jsxs("div", { 
                className: `fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md transition-opacity duration-200 ease-out ${isAnimateIn ? "opacity-100" : "opacity-0"}`,
                onClick: closeTrailer,
                children: [
                    _jsxs("div", { 
                        className: `relative w-full max-w-5xl bg-[#151921] rounded-2xl overflow-hidden border border-[#BFBCFC]/20 shadow-2xl aspect-video transition-all duration-200 ease-out ${isAnimateIn ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`,
                        onClick: (e) => e.stopPropagation(),
                        children: [
                            /* Kruisje rechtsboven */
                            _jsx("button", { 
                                onClick: closeTrailer,
                                className: "absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition-colors",
                                children: _jsx(X, { className: "w-5 h-5" })
                            }),
                            /* Iframe */
                            _jsx("iframe", { 
                                src: `https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&rel=0&modestbranding=1`, 
                                title: `${movie.title} Official Trailer`,
                                className: "w-full h-full border-0",
                                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                                allowFullScreen: true 
                            })
                        ]
                    })
                ]
            })
        ),

        _jsx(WatchLogModal, { isOpen: showWatchLogModal, onClose: () => setShowWatchLogModal(false), movieTitle: movie.title, movieYear: new Date(movie.release_date).getFullYear().toString(), moviePoster: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }),
        _jsx(ShareModal, { isOpen: showShareModal, onClose: () => setShowShareModal(false), movieTitle: movie.title, movieId: movie.id })
    ] }));
}