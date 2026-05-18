import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router';
import { Heart, Star, List, Calendar, Eye, MessageCircle, UserPlus, MapPin } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
export function UserProfilePage() {
    const { id } = useParams();
    // Mock user data based on ID
    const users = {
        '1': {
            id: 1,
            name: 'Sarah Williams',
            username: '@sarahwilliams',
            avatar: 'SW',
            bio: 'Film enthusiast | Christopher Nolan fanatic | Currently watching everything A24',
            location: 'Amsterdam, Netherlands',
            joinedDate: 'January 2024',
            stats: {
                watched: 342,
                favorites: 58,
                lists: 12,
                reviews: 89,
            },
            online: true,
        },
        '2': {
            id: 2,
            name: 'John Doe',
            username: '@johndoe',
            avatar: 'JD',
            bio: 'Horror movie collector | Criterion enthusiast | Letterboxd addict',
            location: 'Rotterdam, Netherlands',
            joinedDate: 'March 2023',
            stats: {
                watched: 521,
                favorites: 73,
                lists: 24,
                reviews: 156,
            },
            online: true,
        },
        '3': {
            id: 3,
            name: 'Alex Johnson',
            username: '@alexjohnson',
            avatar: 'AJ',
            bio: 'Indie film lover | Documentary fanatic',
            location: 'Utrecht, Netherlands',
            joinedDate: 'June 2023',
            stats: {
                watched: 267,
                favorites: 42,
                lists: 8,
                reviews: 54,
            },
            online: false,
        },
    };
    const user = users[id || '1'] || users['1'];
    const favoriteMovies = [
        {
            id: 1,
            title: 'Inception',
            poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
            vote_average: 8.4,
            release_date: '2010-07-16',
        },
        {
            id: 2,
            title: 'The Dark Knight',
            poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            vote_average: 8.5,
            release_date: '2008-07-18',
        },
        {
            id: 3,
            title: 'Interstellar',
            poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            vote_average: 8.4,
            release_date: '2014-11-07',
        },
        {
            id: 4,
            title: 'The Matrix',
            poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            vote_average: 8.2,
            release_date: '1999-03-30',
        },
    ];
    const recentActivity = [
        {
            id: 1,
            type: 'watched',
            movie: 'Oppenheimer',
            rating: 9,
            date: '2 days ago',
        },
        {
            id: 2,
            type: 'review',
            movie: 'Dune: Part Two',
            rating: 8,
            date: '1 week ago',
        },
        {
            id: 3,
            type: 'list',
            title: 'Best Sci-Fi of 2024',
            count: 15,
            date: '2 weeks ago',
        },
    ];
    return (_jsx("div", { className: "min-h-screen py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsx("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 mb-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-start md:items-center", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30", children: _jsx("span", { className: "text-[#0B0E14] font-bold text-3xl md:text-5xl", children: user.avatar }) }), user.online && (_jsx("div", { className: "absolute bottom-2 right-2 w-5 h-5 bg-[#44FFFF] rounded-full border-4 border-[#151921]" }))] }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1", children: user.name }), _jsx("p", { className: "text-[#BFBCFC] text-sm md:text-base mb-3", children: user.username }), _jsx("p", { className: "text-[#94A3B8] text-sm leading-relaxed mb-3", children: user.bio }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-[#94A3B8] text-sm", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4" }), user.location] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-4 h-4" }), "Joined ", user.joinedDate] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Link, { to: "/messages", className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#BFBCFC]/30", children: [_jsx(MessageCircle, { className: "w-4 h-4" }), "Message"] }), _jsxs("button", { className: "bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-2 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 flex items-center gap-2", children: [_jsx(UserPlus, { className: "w-4 h-4" }), "Follow"] })] })] }) }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 text-center", children: [_jsx(Eye, { className: "w-6 h-6 text-[#44FFFF] mx-auto mb-2" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-data text-[#F8FAFC] mb-1", children: user.stats.watched }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Watched" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 text-center", children: [_jsx(Heart, { className: "w-6 h-6 text-[#FF61D2] mx-auto mb-2" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-data text-[#F8FAFC] mb-1", children: user.stats.favorites }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Favorites" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 text-center", children: [_jsx(List, { className: "w-6 h-6 text-[#BFBCFC] mx-auto mb-2" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-data text-[#F8FAFC] mb-1", children: user.stats.lists }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Lists" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl p-4 text-center", children: [_jsx(Star, { className: "w-6 h-6 text-[#44FFFF] mx-auto mb-2" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-data text-[#F8FAFC] mb-1", children: user.stats.reviews }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Reviews" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6", children: [_jsxs("h2", { className: "text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2", children: [_jsx(Heart, { className: "w-6 h-6 text-[#FF61D2]" }), "Favorite Movies"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: favoriteMovies.map((movie) => (_jsx(MovieCard, { movie: movie }, movie.id))) })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6", children: [_jsx("h2", { className: "text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Recent Activity" }), _jsx("div", { className: "space-y-3", children: recentActivity.map((activity) => (_jsxs("div", { className: "bg-[#0B0E14] rounded-lg p-4 border border-[#BFBCFC]/10", children: [activity.type === 'watched' && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Eye, { className: "w-5 h-5 text-[#44FFFF]" }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-[#F8FAFC] text-sm", children: ["Watched ", _jsx("span", { className: "font-medium", children: activity.movie })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-[#94A3B8] mt-1", children: [_jsx(Star, { className: "w-3 h-3 text-[#44FFFF]", fill: "currentColor" }), activity.rating, "/10 \u2022 ", activity.date] })] })] })), activity.type === 'review' && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Star, { className: "w-5 h-5 text-[#44FFFF]" }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-[#F8FAFC] text-sm", children: ["Reviewed ", _jsx("span", { className: "font-medium", children: activity.movie })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-[#94A3B8] mt-1", children: [_jsx(Star, { className: "w-3 h-3 text-[#44FFFF]", fill: "currentColor" }), activity.rating, "/10 \u2022 ", activity.date] })] })] })), activity.type === 'list' && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(List, { className: "w-5 h-5 text-[#BFBCFC]" }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-[#F8FAFC] text-sm", children: ["Created list ", _jsx("span", { className: "font-medium", children: activity.title })] }), _jsxs("p", { className: "text-xs text-[#94A3B8] mt-1", children: [activity.count, " movies \u2022 ", activity.date] })] })] }))] }, activity.id))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6", children: [_jsx("h3", { className: "text-lg font-bold font-heading text-[#F8FAFC] mb-4", children: "Top Genres" }), _jsx("div", { className: "space-y-2", children: [
                                                { genre: 'Science Fiction', count: 89 },
                                                { genre: 'Action', count: 67 },
                                                { genre: 'Drama', count: 54 },
                                                { genre: 'Thriller', count: 42 },
                                            ].map((item) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-[#F8FAFC]", children: item.genre }), _jsx("span", { className: "text-[#44FFFF] font-data", children: item.count })] }, item.genre))) })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6", children: [_jsx("h3", { className: "text-lg font-bold font-heading text-[#F8FAFC] mb-4", children: "Public Lists" }), _jsx("div", { className: "space-y-2", children: [
                                                { name: 'Nolan Masterpieces', count: 12 },
                                                { name: 'Best of 2024', count: 18 },
                                                { name: 'Underrated Gems', count: 25 },
                                            ].map((list) => (_jsxs("div", { className: "bg-[#0B0E14] rounded-lg p-3 hover:bg-[#151921] transition-colors cursor-pointer", children: [_jsx("p", { className: "text-[#F8FAFC] text-sm font-medium mb-1", children: list.name }), _jsxs("p", { className: "text-[#94A3B8] text-xs", children: [list.count, " movies"] })] }, list.name))) })] })] })] })] }) }));
}
