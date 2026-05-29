import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams } from "react-router";
import { Heart, Plus, Star, Play, DollarSign, Globe, Calendar, Clock, Eye, Send, AlertCircle, Share2, } from "lucide-react";
import { MovieCarousel } from "../components/MovieCarousel";
import { WatchLogModal } from "../components/WatchLogModal";
import { ShareModal } from "../components/ShareModal";
import { toast } from "sonner";
export function MovieDetailPage() {
    const { id } = useParams();
    const [userRating, setUserRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [showWatchLogModal, setShowWatchLogModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [containsSpoilers, setContainsSpoilers] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const movie = {
        id: 1,
        title: "Inception",
        tagline: "Your mind is the scene of the crime",
        overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
        backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        poster_path: "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
        release_date: "2010-07-16",
        runtime: 148,
        genres: ["Action", "Science Fiction", "Adventure"],
        original_language: "English",
        production_countries: ["United States", "United Kingdom"],
        budget: 160000000,
        revenue: 825532764,
        status: "Released",
        vote_average: 8.4,
        vote_count: 35847,
        age_rating: "PG-13",
    };
    const cast = [
        {
            id: 1,
            name: "Leonardo DiCaprio",
            character: "Cobb",
            profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
        },
        {
            id: 2,
            name: "Joseph Gordon-Levitt",
            character: "Arthur",
            profile_path: "/z2FA8js799xqtfiFjBTicFYdfk.jpg",
        },
        {
            id: 3,
            name: "Elliot Page",
            character: "Ariadne",
            profile_path: "/eCeFgzS8Y8FZ0ARQRyUsbgCD3Vx.jpg",
        },
    ];
    const crew = [
        { id: 1, name: "Christopher Nolan", job: "Director" },
        { id: 2, name: "Christopher Nolan", job: "Writer" },
        { id: 3, name: "Emma Thomas", job: "Producer" },
    ];
    const reviews = [
        {
            id: 1,
            author: "John Doe",
            rating: 9,
            content: "An absolutely mind-bending masterpiece. Nolan outdid himself with this one.",
            spoiler: false,
            likes: 245,
        },
    ];
    const recommendations = [
        {
            id: 2,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            vote_average: 8.2,
            release_date: "1999-03-30",
        },
    ];
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("div", { className: "relative h-[300px] md:h-[400px] overflow-hidden", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`, alt: movie.title, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" }), _jsx("div", { className: "absolute bottom-0 left-0 right-0", children: _jsx("div", { className: "container mx-auto px-4 max-w-7xl pb-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 md:gap-6", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, alt: movie.title, className: "w-32 md:w-48 rounded-lg shadow-2xl border border-[#BFBCFC]/20 md:-mb-12 hidden md:block" }), _jsxs("div", { className: "flex-1 md:pt-16", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1.5", children: movie.title }), _jsx("p", { className: "text-[#BFBCFC] text-base md:text-lg italic mb-3", children: movie.tagline }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 md:gap-3 mb-4", children: [_jsx("span", { className: "text-[#94A3B8] font-data text-xs md:text-sm", children: new Date(movie.release_date).getFullYear() }), _jsx("span", { className: "text-[#94A3B8] hidden md:inline", children: "\u2022" }), _jsxs("span", { className: "text-[#94A3B8] font-data text-xs md:text-sm", children: [movie.runtime, " min"] }), _jsx("span", { className: "text-[#94A3B8] hidden md:inline", children: "\u2022" }), _jsx("span", { className: "bg-[#FF61D2]/20 text-[#FF61D2] px-2 py-0.5 rounded-lg text-xs font-medium", children: movie.age_rating })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs("button", { onClick: () => setIsWatched(!isWatched), className: `px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isWatched
                                                            ? "bg-[#44FFFF] text-[#000000] shadow-lg shadow-[#44FFFF]/30"
                                                            : "bg-[#151921]/70 backdrop-blur-xl text-[#F8FAFC] border border-[#BFBCFC]/20 hover:bg-[#151921]"}`, children: [_jsx(Eye, { className: "w-3.5 md:w-4 h-3.5 md:h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Watched" })] }), _jsxs("button", { onClick: () => setIsFavorite(!isFavorite), className: `px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isFavorite
                                                            ? "bg-[#44FFFF] text-[#000000] shadow-lg shadow-[#44FFFF]/30"
                                                            : "bg-[#151921]/70 backdrop-blur-xl text-[#F8FAFC] border border-[#BFBCFC]/20 hover:bg-[#151921]"}`, children: [_jsx(Heart, { className: `w-3.5 md:w-4 h-3.5 md:h-4 ${isFavorite ? "fill-current" : ""}` }), _jsx("span", { className: "hidden sm:inline", children: "Like" })] }), _jsxs("button", { onClick: () => setIsInWatchlist(!isInWatchlist), className: `px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isInWatchlist
                                                            ? "bg-[#44FFFF] text-[#0B0E14] shadow-lg shadow-[#44FFFF]/30"
                                                            : "bg-[#151921]/70 backdrop-blur-xl text-[#F8FAFC] border border-[#BFBCFC]/20 hover:bg-[#151921]"}`, children: [_jsx(Plus, { className: "w-3.5 md:w-4 h-3.5 md:h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Watchlist" })] }), _jsxs("button", { className: "bg-[#151921]/70 hover:bg-[#AFA9FF] text-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1.5 border border-[#BFBCFC]/20 text-xs md:text-sm", children: [_jsx(Play, { className: "w-3.5 md:w-4 h-3.5 md:h-4", fill: "currentColor" }), _jsx("span", { className: "hidden sm:inline", children: "Watch Trailer" })] }), _jsxs("button", { onClick: () => setShowShareModal(true), className: "bg-[#151921]/70 hover:bg-[#44FFFF] hover:text-[#0B0E14] text-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1.5 border border-[#BFBCFC]/20 text-xs md:text-sm", children: [_jsx(Share2, { className: "w-3.5 md:w-4 h-3.5 md:h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Share" })] })] })] })] }) }) })] }), _jsxs("div", { className: "container mx-auto px-4 max-w-7xl py-6 md:py-8 mt-6 md:mt-12", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4 md:space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-2 md:mb-3", children: "Overview" }), _jsx("p", { className: "text-[#94A3B8] leading-relaxed text-sm", children: movie.overview })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Release Date" })] }), _jsx("p", { className: "text-[#F8FAFC] font-data text-sm", children: movie.release_date })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Runtime" })] }), _jsxs("p", { className: "text-[#F8FAFC] font-data text-sm", children: [movie.runtime, " min"] })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(DollarSign, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Budget" })] }), _jsxs("p", { className: "text-[#F8FAFC] font-data text-sm", children: ["$", (movie.budget / 1000000).toFixed(0), "M"] })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(DollarSign, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Revenue" })] }), _jsxs("p", { className: "text-[#F8FAFC] font-data text-sm", children: ["$", (movie.revenue / 1000000).toFixed(0), "M"] })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(Globe, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Language" })] }), _jsx("p", { className: "text-[#F8FAFC] text-sm", children: movie.original_language })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [_jsx(Globe, { className: "w-3.5 h-3.5 text-[#44FFFF]" }), _jsx("span", { className: "text-[#94A3B8] text-xs", children: "Status" })] }), _jsx("p", { className: "text-[#F8FAFC] text-sm", children: movie.status })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-base md:text-lg font-bold font-heading text-[#F8FAFC] mb-2 md:mb-3", children: "Cast & Crew" }), _jsx("div", { className: "flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4", children: cast.map((person) => (_jsxs("div", { className: "flex-shrink-0 w-24 md:w-32 text-center", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w200${person.profile_path}`, alt: person.name, className: "w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#BFBCFC]/20 mb-2" }), _jsx("p", { className: "text-[#F8FAFC] text-xs md:text-sm font-medium", children: person.name }), _jsx("p", { className: "text-[#94A3B8] text-xs", children: person.character })] }, person.id))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4", children: "Reviews" }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-6", children: [_jsx("h4", { className: "text-base md:text-lg font-bold font-heading text-[#F8FAFC] mb-4", children: "Write a Review" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] text-sm font-medium mb-2", children: "Your Rating" }), _jsx("div", { className: "flex gap-2 flex-wrap", onMouseLeave: () => setHoverRating(0), children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => {
                                                                            const active = hoverRating
                                                                                ? rating <= hoverRating
                                                                                : rating <= reviewRating;
                                                                            return (_jsx("button", { onClick: () => setReviewRating(rating), onMouseEnter: () => setHoverRating(rating), className: "transition-all duration-200", children: _jsx(Star, { className: `w-8 h-8 transition-all duration-200 ${active
                                                                                        ? "text-[#44FFFF] fill-[#44FFFF] scale-110"
                                                                                        : "text-[#94A3B8] fill-transparent scale-100"}` }) }, rating));
                                                                        }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] text-sm font-medium mb-2", children: "Your Review" }), _jsx("textarea", { value: reviewText, onChange: (e) => setReviewText(e.target.value), placeholder: "Share your thoughts about this movie...", rows: 4, className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none placeholder:text-[#94A3B8]" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "spoilers", checked: containsSpoilers, onChange: (e) => setContainsSpoilers(e.target.checked), className: "w-4 h-4 rounded border-[#BFBCFC]/30 bg-[#0B0E14] checked:bg-[#FF61D2] focus:ring-2 focus:ring-[#FF61D2]/20" }), _jsxs("label", { htmlFor: "spoilers", className: "text-[#94A3B8] text-sm flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 text-[#FF61D2]" }), "This review contains spoilers"] })] }), _jsxs("button", { onClick: () => {
                                                                    if (reviewRating === 0) {
                                                                        toast.error("Please select a rating");
                                                                        return;
                                                                    }
                                                                    if (!reviewText.trim()) {
                                                                        toast.error("Please write a review");
                                                                        return;
                                                                    }
                                                                    toast.success("Review submitted successfully!");
                                                                    setReviewText("");
                                                                    setReviewRating(0);
                                                                    setContainsSpoilers(false);
                                                                }, className: "w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40 flex items-center justify-center gap-2", children: [_jsx(Send, { className: "w-4 h-4" }), "Submit Review"] })] })] }), reviews.map((review) => (_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 md:p-6 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-[#BFBCFC]/10 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-[#BFBCFC] font-bold", children: review.author.charAt(0) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#F8FAFC] font-medium", children: review.author }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "w-4 h-4 text-[#44FFFF]", fill: "currentColor" }), _jsxs("span", { className: "text-[#44FFFF] font-data text-sm", children: [review.rating, "/10"] })] })] })] }), _jsxs("button", { className: "text-[#94A3B8] hover:text-[#BFBCFC] transition-colors", children: ["\u2665 ", review.likes] })] }), review.spoiler && (_jsxs("div", { className: "mb-2 inline-flex items-center gap-1 bg-[#FF61D2]/10 border border-[#FF61D2]/30 text-[#FF61D2] px-2 py-1 rounded text-xs font-medium", children: [_jsx(AlertCircle, { className: "w-3 h-3" }), "Contains Spoilers"] })), _jsx("p", { className: "text-[#94A3B8] leading-relaxed text-sm md:text-base", children: review.content })] }, review.id)))] })] }), _jsxs("div", { className: "space-y-4 md:space-y-6", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-6", children: [_jsx("h3", { className: "text-xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Community Scores" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#94A3B8]", children: "TMDB" }), _jsxs("span", { className: "text-[#44FFFF] font-data font-medium", children: ["\u2605 ", movie.vote_average, "/10"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#94A3B8]", children: "IMDb" }), _jsx("span", { className: "text-[#44FFFF] font-data font-medium", children: "\u2605 8.8/10" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#94A3B8]", children: "Eigen Score" }), _jsx("span", { className: "text-[#44FFFF] font-data font-medium", children: "\u2605 8.6/10" })] }), _jsx("div", { className: "pt-3 border-t border-[#BFBCFC]/15", children: _jsxs("p", { className: "text-[#94A3B8] text-sm", children: ["Based on", " ", _jsx("span", { className: "text-[#44FFFF] font-data", children: movie.vote_count.toLocaleString() }), " ", "votes"] }) })] })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-6", children: [_jsx("h3", { className: "text-xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Watch Providers" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: ["Netflix", "Disney+", "Prime"].map((provider) => (_jsx("div", { className: "bg-[#0B0E14] rounded-lg p-3 text-center hover:bg-[#151921] transition-colors cursor-pointer", children: _jsx("p", { className: "text-[#F8FAFC] text-sm font-medium", children: provider }) }, provider))) })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-6", children: [_jsx("h3", { className: "text-xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Genres" }), _jsx("div", { className: "flex flex-wrap gap-2", children: movie.genres.map((genre) => (_jsx("span", { className: "bg-[#BFBCFC]/10 text-[#BFBCFC] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#BFBCFC]/20", children: genre }, genre))) })] })] })] }), _jsxs("div", { className: "mt-12", children: [_jsx("h2", { className: "text-2xl font-bold font-heading text-[#F8FAFC] mb-6", children: "Omdat je keek..." }), _jsx(MovieCarousel, { title: "", movies: recommendations })] })] }), _jsx(WatchLogModal, { isOpen: showWatchLogModal, onClose: () => setShowWatchLogModal(false), movieTitle: movie.title, movieYear: new Date(movie.release_date)
                    .getFullYear()
                    .toString(), moviePoster: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }), _jsx(ShareModal, { isOpen: showShareModal, onClose: () => setShowShareModal(false), movieTitle: movie.title, movieId: movie.id })] }));
}
