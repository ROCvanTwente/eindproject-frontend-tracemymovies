import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Film, Award } from 'lucide-react';
import { Link } from 'react-router';
export function TheQueuePage() {
    const defaultLists = [
        {
            id: 'top-100',
            name: 'Top 100 Films',
            description: 'The greatest films of all time, curated by critics and audiences',
            movieCount: 100,
            icon: Award,
            color: 'from-[#BFBCFC] to-[#44FFFF]',
        },
        {
            id: 'best-drama-30',
            name: 'Best 30 Drama Films',
            description: 'The most powerful and moving dramatic films ever made',
            movieCount: 30,
            icon: Film,
            color: 'from-[#FF61D2] to-[#BFBCFC]',
        },
    ];
    return (_jsx("div", { className: "min-h-screen py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsxs("div", { className: "mb-6 md:mb-8", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "Lists" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Curated collections of the best films" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", children: defaultLists.map((list) => {
                        const IconComponent = list.icon;
                        return (_jsxs(Link, { to: `/default-list/${list.id}`, className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-8 hover:border-[#BFBCFC]/30 transition-all hover:scale-105 group", children: [_jsxs("div", { className: "flex items-start gap-6 mb-6", children: [_jsx("div", { className: `w-20 h-20 bg-gradient-to-br ${list.color} rounded-2xl flex items-center justify-center shadow-lg`, children: _jsx(IconComponent, { className: "w-10 h-10 text-[#0B0E14]" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-2xl font-bold text-[#F8FAFC] mb-2 group-hover:text-[#BFBCFC] transition-colors", children: list.name }), _jsx("div", { className: "flex items-center gap-2 text-sm", children: _jsxs("span", { className: "text-[#44FFFF] font-data font-medium", children: [list.movieCount, " films"] }) })] })] }), _jsx("p", { className: "text-[#94A3B8] text-base leading-relaxed", children: list.description })] }, list.id));
                    }) })] }) }));
}
