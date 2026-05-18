import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Film, Star, TrendingUp, Sparkles, Clock, Heart, } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
export function AnalyticsPage() {
    const yearlyData = [
        { year: "2020", movies: 45 },
        { year: "2021", movies: 62 },
        { year: "2022", movies: 58 },
        { year: "2023", movies: 71 },
        { year: "2024", movies: 38 },
    ];
    const genreData = [
        { genre: "Sci-Fi", count: 78, color: "#BFBCFC" },
        { genre: "Action", count: 65, color: "#BFBCFC" },
        { genre: "Drama", count: 52, color: "#BFBCFC" },
        { genre: "Thriller", count: 41, color: "#BFBCFC" },
        { genre: "Comedy", count: 38, color: "#BFBCFC" },
    ];
    const favoriteMovies = [
        {
            id: 1,
            title: 'Inception',
            poster: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
            rating: 9,
            year: '2010',
        },
        {
            id: 2,
            title: 'The Matrix',
            poster: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            rating: 8,
            year: '1999',
        },
        {
            id: 3,
            title: 'Interstellar',
            poster: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            rating: 9,
            year: '2014',
        },
        {
            id: 4,
            title: 'The Dark Knight',
            poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            rating: 10,
            year: '2008',
        },
    ];
    const recentActivity = [
        {
            id: 1,
            movieTitle: 'Oppenheimer',
            rating: 9,
            content: 'Absolute masterpiece. Nolan at his best.',
            date: '2024-04-20',
        },
        {
            id: 2,
            movieTitle: 'Dune: Part Two',
            rating: 8,
            content: 'Visually stunning and epic in scale.',
            date: '2024-04-18',
        },
        {
            id: 3,
            movieTitle: 'Poor Things',
            rating: 7,
            content: 'Weird, wonderful, and beautifully crafted.',
            date: '2024-04-15',
        },
        {
            id: 4,
            movieTitle: 'The Zone of Interest',
            rating: 8,
            content: 'Haunting and thought-provoking.',
            date: '2024-04-12',
        },
    ];
    return (_jsx("div", { className: "min-h-screen py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsxs("div", { className: "mb-6 md:mb-8 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 bg-[#44FFFF]/10 rounded-xl mb-2 md:mb-3", children: _jsx(Sparkles, { className: "w-6 md:w-7 h-6 md:h-7 text-[#44FFFF]" }) }), _jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1 md:mb-2", children: "Movie DNA" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Your personal cinematic analytics and insights" })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8", children: [_jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300", children: [_jsx("div", { className: "absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 md:mb-3", children: [_jsx("div", { className: "w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm", children: _jsx(Film, { className: "w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" }) }), _jsx("h3", { className: "text-[#94A3B8] font-medium text-xs md:text-sm", children: "Total Watched" })] }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1", children: "274" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-[#44FFFF] text-xs font-data font-medium", children: "+18 this month" }), _jsx(TrendingUp, { className: "w-3 h-3 text-[#44FFFF]" })] })] })] }), _jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300", children: [_jsx("div", { className: "absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 md:mb-3", children: [_jsx("div", { className: "w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm", children: _jsx(Star, { className: "w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]", fill: "#BFBCFC" }) }), _jsx("h3", { className: "text-[#94A3B8] font-medium text-xs md:text-sm", children: "Average Score" })] }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1", children: "7.8" }), _jsx("p", { className: "text-[#44FFFF] text-xs font-data font-medium", children: "out of 10 \u2605" })] })] }), _jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300", children: [_jsx("div", { className: "absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 md:mb-3", children: [_jsx("div", { className: "w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm", children: _jsx(TrendingUp, { className: "w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" }) }), _jsx("h3", { className: "text-[#94A3B8] font-medium text-xs md:text-sm", children: "Watch Streak" })] }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1", children: "12" }), _jsx("p", { className: "text-[#44FFFF] text-xs font-data font-medium", children: "days in a row" })] })] }), _jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300", children: [_jsx("div", { className: "absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 md:mb-3", children: [_jsx("div", { className: "w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm", children: _jsx(Clock, { className: "w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" }) }), _jsx("h3", { className: "text-[#94A3B8] font-medium text-xs md:text-sm", children: "Total Hours" })] }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1", children: "548" }), _jsx("p", { className: "text-[#44FFFF] text-xs font-data font-medium", children: "\u2248 22.8 days" })] })] })] }), _jsxs("div", { className: "mb-6 md:mb-8", children: [_jsxs("h2", { className: "text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2", children: [_jsx(Heart, { className: "w-6 h-6 text-[#FF61D2]", fill: "#FF61D2" }), "Favorite Films"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4", children: favoriteMovies.map((movie) => (_jsx("div", { className: "relative group", children: _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg overflow-hidden hover:border-[#FF61D2]/50 transition-all hover:scale-105", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w500${movie.poster}`, alt: movie.title, className: "w-full aspect-[2/3] object-cover" }), _jsxs("div", { className: "p-2", children: [_jsx("h3", { className: "text-[#F8FAFC] font-medium text-xs mb-1 truncate", children: movie.title }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#94A3B8] text-xs", children: movie.year }), _jsxs("span", { className: "text-[#44FFFF] font-data text-xs font-bold", children: ["\u2605 ", movie.rating, "/10"] })] })] })] }) }, movie.id))) })] }), _jsxs("div", { className: "mb-6 md:mb-8", children: [_jsxs("h2", { className: "text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "w-6 h-6 text-[#44FFFF]" }), "Recent Activity"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: recentActivity.map((activity) => (_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3 hover:border-[#BFBCFC]/30 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [_jsx("h4", { className: "text-[#F8FAFC] font-medium text-sm", children: activity.movieTitle }), _jsxs("span", { className: "text-[#44FFFF] font-data text-xs font-bold", children: ["\u2605 ", activity.rating, "/10"] })] }), _jsx("p", { className: "text-[#94A3B8] text-xs mb-1.5 line-clamp-2", children: activity.content }), _jsx("p", { className: "text-[#94A3B8] text-xs", children: activity.date })] }, activity.id))) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-[#BFBCFC]/30 transition-colors", children: [_jsxs("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4 flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-6 bg-[#BFBCFC] rounded-full" }), "Favorite Genre"] }), _jsx("div", { className: "space-y-3", children: genreData.map((item) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [_jsx("span", { className: "text-[#F8FAFC] font-medium font-heading text-sm", children: item.genre }), _jsx("span", { className: "text-[#44FFFF] font-data font-bold text-sm", children: item.count })] }), _jsx("div", { className: "h-2 bg-[#0B0E14] rounded-full overflow-hidden border border-white/5", children: _jsx("div", { className: "h-full rounded-full transition-all duration-500 shadow-lg", style: {
                                                        width: `${(item.count / 78) * 100}%`,
                                                        backgroundColor: item.color,
                                                        boxShadow: `0 0 20px ${item.color}40`,
                                                    } }) })] }, item.genre))) })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-[#BFBCFC]/30 transition-colors", children: [_jsxs("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4 flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-6 bg-[#BFBCFC] rounded-full" }), "Favorite Actor"] }), _jsx("div", { className: "space-y-2", children: [
                                        { name: "Leonardo DiCaprio", movies: 12 },
                                        { name: "Tom Hanks", movies: 10 },
                                        { name: "Christian Bale", movies: 9 },
                                        { name: "Scarlett Johansson", movies: 8 },
                                    ].map((actor, index) => (_jsxs("div", { className: "flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5 border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 transition-all hover:scale-105", children: [_jsx("div", { className: "w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold font-heading text-sm shadow-lg shadow-[#44FFFF]/30", children: index + 1 }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-[#F8FAFC] font-medium font-heading text-sm", children: actor.name }), _jsxs("p", { className: "text-[#44FFFF] text-xs font-data font-medium", children: [actor.movies, " movies"] })] })] }, actor.name))) })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-[#BFBCFC]/30 transition-colors", children: [_jsxs("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4 flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-6 bg-[#BFBCFC] rounded-full" }), "Favorite Director"] }), _jsx("div", { className: "space-y-2", children: [
                                        { name: "Christopher Nolan", movies: 8 },
                                        { name: "Quentin Tarantino", movies: 7 },
                                        { name: "Martin Scorsese", movies: 6 },
                                        { name: "Steven Spielberg", movies: 5 },
                                    ].map((director, index) => (_jsxs("div", { className: "flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5 border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 transition-all hover:scale-105", children: [_jsx("div", { className: "w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold font-heading text-sm shadow-lg shadow-[#BFBCFC]/30", children: index + 1 }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-[#F8FAFC] font-medium font-heading text-sm", children: director.name }), _jsxs("p", { className: "text-[#44FFFF] text-xs font-data font-medium", children: [director.movies, " movies"] })] })] }, director.name))) })] })] }), _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4", children: [_jsxs("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4 flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-6 bg-gradient-to-b from-[#BFBCFC] to-[#44FFFF] rounded-full" }), "Movies Watched Per Year"] }), _jsx(ResponsiveContainer, { width: "100%", height: 200, className: "md:!h-[250px]", children: _jsxs(BarChart, { data: yearlyData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "yearlyBarGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#BFBCFC", stopOpacity: 1 }), _jsx("stop", { offset: "100%", stopColor: "#44FFFF", stopOpacity: 0.6 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#151921", opacity: 0.3 }), _jsx(XAxis, { dataKey: "year", stroke: "#94A3B8", style: { fontFamily: "Roboto Mono" } }), _jsx(YAxis, { stroke: "#94A3B8", style: { fontFamily: "Roboto Mono" } }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: "#151921",
                                                border: "1px solid rgba(191, 188, 252, 0.3)",
                                                borderRadius: "12px",
                                                color: "#F8FAFC",
                                                fontFamily: "Roboto Mono",
                                            }, cursor: { fill: "rgba(191, 188, 252, 0.1)" } }), _jsx(Bar, { dataKey: "movies", fill: "url(#yearlyBarGradient)", radius: [12, 12, 0, 0] })] }) }, "yearly-chart")] }) })] }) }));
}
