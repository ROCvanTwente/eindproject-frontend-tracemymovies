import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { List, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { CreateListModal } from '../components/CreateListModal';
export function MyListsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingList, setEditingList] = useState(null);
    const mockLists = [
        {
            id: 1,
            name: 'Christopher Nolan Filmography',
            description: 'All films directed by Christopher Nolan',
            movieCount: 12,
            isRanked: true,
            createdAt: '2024-03-15',
            movies: [],
        },
        {
            id: 2,
            name: 'Sci-Fi Masterpieces',
            description: 'The best science fiction films of all time',
            movieCount: 25,
            isRanked: false,
            createdAt: '2024-02-20',
            movies: [],
        },
        {
            id: 3,
            name: 'Top 10 Films of 2024',
            description: 'My personal favorites from this year',
            movieCount: 10,
            isRanked: true,
            createdAt: '2024-01-10',
            movies: [],
        },
    ];
    const handleEditList = (list) => {
        setEditingList(list);
        setShowCreateModal(true);
    };
    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingList(null);
    };
    return (_jsx("div", { className: "min-h-screen py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 md:mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "Custom Lists" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Create and manage your custom movie collections" })] }), _jsxs("button", { onClick: () => setShowCreateModal(true), className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#BFBCFC]/30 hover:scale-105", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { className: "hidden sm:inline", children: "Create List" })] })] }), mockLists.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: mockLists.map((list) => (_jsxs(Link, { to: `/list/${list.id}`, className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 hover:border-[#BFBCFC]/30 transition-all hover:scale-105 group", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-xl flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30", children: _jsx(List, { className: "w-6 h-6 text-[#0B0E14]" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-[#F8FAFC] mb-1 group-hover:text-[#BFBCFC] transition-colors", children: list.name }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsxs("span", { className: "text-[#44FFFF] font-data font-medium", children: [list.movieCount, " films"] }), list.isRanked && (_jsx("span", { className: "text-[#94A3B8]", children: "\u2022 Ranked" }))] })] })] }), _jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: (e) => {
                                                    e.preventDefault();
                                                    handleEditList(list);
                                                }, className: "p-2 bg-[#151921] hover:bg-[#BFBCFC]/20 rounded-lg transition-all", title: "Edit list", children: _jsx(Edit, { className: "w-4 h-4 text-[#BFBCFC]" }) }), _jsx("button", { onClick: (e) => {
                                                    e.preventDefault();
                                                    // Delete list
                                                }, className: "p-2 bg-[#151921] hover:bg-[#FF61D2]/20 rounded-lg transition-all", title: "Delete list", children: _jsx(Trash2, { className: "w-4 h-4 text-[#FF61D2]" }) })] })] }), _jsx("p", { className: "text-[#94A3B8] text-sm line-clamp-2 mb-3", children: list.description }), _jsxs("p", { className: "text-[#94A3B8] text-xs", children: ["Created ", list.createdAt] })] }, list.id))) })) : (_jsxs("div", { className: "text-center py-20", children: [_jsx(List, { className: "w-24 h-24 text-[#BFBCFC]/20 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-heading font-bold text-[#F8FAFC] mb-2", children: "No lists yet" }), _jsx("p", { className: "text-[#94A3B8] mb-6", children: "Create your first custom list to organize your favorite movies" }), _jsxs("button", { onClick: () => setShowCreateModal(true), className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all inline-flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Create Your First List"] })] })), _jsx(CreateListModal, { isOpen: showCreateModal, onClose: handleCloseModal, editList: editingList })] }) }));
}
