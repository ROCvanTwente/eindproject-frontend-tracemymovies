import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Globe, TrendingUp, Users, Film, Award } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, } from 'recharts';
import { MovieCard } from '../components/MovieCard';
export function GlobalMovieDNAPage() {
    const globalGenreData = [
        { genre: 'Action', count: 2847, percentage: 28, color: '#BFBCFC' },
        { genre: 'Drama', count: 2156, percentage: 21, color: '#44FFFF' },
        { genre: 'Comedy', count: 1843, percentage: 18, color: '#FF61D2' },
        { genre: 'Thriller', count: 1432, percentage: 14, color: '#BFBCFC' },
        { genre: 'Sci-Fi', count: 982, percentage: 10, color: '#44FFFF' },
        { genre: 'Romance', count: 904, percentage: 9, color: '#FF61D2' },
    ];
    const regionData = [
        { region: 'North America', users: 45230, color: '#BFBCFC' },
        { region: 'Europe', users: 38745, color: '#44FFFF' },
        { region: 'Asia', users: 52104, color: '#FF61D2' },
        { region: 'South America', users: 12489, color: '#BFBCFC' },
        { region: 'Africa', users: 8763, color: '#44FFFF' },
        { region: 'Oceania', users: 6234, color: '#FF61D2' },
    ];
    const monthlyTrendData = [
        { month: 'Jan', watches: 45000 },
        { month: 'Feb', watches: 52000 },
        { month: 'Mar', watches: 48000 },
        { month: 'Apr', watches: 61000 },
        { month: 'May', watches: 58000 },
        { month: 'Jun', watches: 69000 },
        { month: 'Jul', watches: 75000 },
        { month: 'Aug', watches: 71000 },
    ];
    const topMoviesGlobal = [
        {
            id: 27205,
            title: 'Inception',
            poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
            vote_average: 8.4,
            release_date: '2010-07-16',
        },
        {
            id: 155,
            title: 'The Dark Knight',
            poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            vote_average: 8.5,
            release_date: '2008-07-18',
        },
        {
            id: 157336,
            title: 'Interstellar',
            poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            vote_average: 8.4,
            release_date: '2014-11-07',
        },
        {
            id: 550,
            title: 'Fight Club',
            poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            vote_average: 8.4,
            release_date: '1999-10-15',
        },
    ];
    return (_jsx("div", { className: "min-h-screen py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsxs("div", { className: "mb-6 md:mb-8 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 bg-[#44FFFF]/10 rounded-2xl mb-4", children: _jsx(Globe, { className: "w-8 md:w-10 h-8 md:h-10 text-[#44FFFF]" }) }), _jsx("h1", { className: "text-2xl md:text-3xl lg:text-5xl font-bold font-heading text-[#F8FAFC] mb-3", children: "Global Movie DNA" }), _jsx("p", { className: "text-[#94A3B8] text-base md:text-lg", children: "Worldwide viewing patterns and trends" })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 text-center", children: [_jsx(Users, { className: "w-6 h-6 text-[#BFBCFC] mx-auto mb-3" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "163K" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Active Users" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#44FFFF]/15 rounded-lg md:rounded-xl p-3 md:p-4 text-center", children: [_jsx(Film, { className: "w-6 h-6 text-[#44FFFF] mx-auto mb-3" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "2.4M" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Total Watches" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#FF61D2]/15 rounded-lg md:rounded-xl p-3 md:p-4 text-center", children: [_jsx(Award, { className: "w-6 h-6 text-[#FF61D2] mx-auto mb-3" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "8.6" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Avg Rating" })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4 text-center", children: [_jsx(TrendingUp, { className: "w-6 h-6 text-[#44FFFF] mx-auto mb-3" }), _jsx("p", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "+24%" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Growth" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4", children: [_jsxs("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-6 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-8 bg-[#BFBCFC] rounded-full" }), "Global Genre Preferences"] }), _jsx("div", { className: "space-y-4", children: globalGenreData.map((item) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-[#F8FAFC] font-medium", children: item.genre }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-[#44FFFF] font-data text-sm", children: item.count.toLocaleString() }), _jsxs("span", { className: "text-[#94A3B8] text-sm", children: [item.percentage, "%"] })] })] }), _jsx("div", { className: "h-3 bg-[#0B0E14] rounded-full overflow-hidden border border-white/5", children: _jsx("div", { className: "h-full rounded-full transition-all duration-500", style: {
                                                        width: `${item.percentage}%`,
                                                        backgroundColor: item.color,
                                                        boxShadow: `0 0 20px ${item.color}40`,
                                                    } }) })] }, item.genre))) })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#44FFFF]/15 rounded-lg md:rounded-xl p-3 md:p-4", children: [_jsxs("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-6 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-8 bg-[#44FFFF] rounded-full" }), "Users by Region"] }), _jsx(ResponsiveContainer, { width: "100%", height: 280, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: regionData, cx: "50%", cy: "50%", labelLine: false, label: ({ region, percentage }) => `${region}`, outerRadius: 80, fill: "#8884d8", dataKey: "users", children: regionData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                    backgroundColor: '#151921',
                                                    border: '1px solid rgba(191, 188, 252, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#F8FAFC',
                                                } })] }) })] })] }), _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-6 flex items-center gap-3", children: [_jsx(Award, { className: "w-6 h-6 text-[#BFBCFC]" }), "Most Watched Worldwide"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6", children: topMoviesGlobal.map((movie, index) => (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "absolute -top-2 -left-2 z-10 w-10 h-10 bg-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold font-heading shadow-lg shadow-[#44FFFF]/50", children: ["#", index + 1] }), _jsx(MovieCard, { movie: movie })] }, movie.id))) })] })] }) }));
}
