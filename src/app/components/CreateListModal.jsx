import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, List, Search, Plus, GripVertical, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const MOCK_SEARCH_MOVIES = [
    { id: 1, title: 'The Shawshank Redemption', poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', vote_average: 8.7, release_date: '1994-09-23' },
    { id: 2, title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', vote_average: 8.7, release_date: '1972-03-14' },
    { id: 550, title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', vote_average: 8.4, release_date: '1999-10-15' },
    { id: 27205, title: 'Inception', poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', vote_average: 8.4, release_date: '2010-07-16' },
    { id: 157336, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', vote_average: 8.4, release_date: '2014-11-07' },
    { id: 155, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', vote_average: 8.5, release_date: '2008-07-18' },
];
function DraggableMovieItem({ movie, index, onRemove, moveMovie }) {
    const [{ isDragging }, drag] = useDrag({
        type: 'MOVIE',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const [, drop] = useDrop({
        accept: 'MOVIE',
        hover: (item) => {
            if (item.index !== index) {
                moveMovie(item.index, index);
                item.index = index;
            }
        },
    });
    return (_jsxs("div", { ref: (node) => drag(drop(node)), className: `flex items-center gap-3 bg-[#0B0E14] rounded-lg p-3 border border-[#BFBCFC]/15 cursor-move hover:border-[#BFBCFC]/30 transition-all ${isDragging ? 'opacity-50' : ''}`, children: [_jsx(GripVertical, { className: "w-5 h-5 text-[#94A3B8]" }), _jsx("img", { src: `https://image.tmdb.org/t/p/w92${movie.poster_path}`, alt: movie.title, className: "w-12 h-16 object-cover rounded" }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-[#F8FAFC] font-medium text-sm", children: movie.title }), _jsxs("p", { className: "text-[#94A3B8] text-xs", children: [new Date(movie.release_date).getFullYear(), " \u2022 \u2605 ", movie.vote_average.toFixed(1)] })] }), _jsx("button", { onClick: () => onRemove(movie.id), className: "p-2 hover:bg-[#FF61D2]/20 rounded-lg text-[#94A3B8] hover:text-[#FF61D2] transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }));
}
export function CreateListModal({ isOpen, onClose, editList = null }) {
    const [step, setStep] = useState(1);
    const [listName, setListName] = useState(editList?.name || '');
    const [description, setDescription] = useState(editList?.description || '');
    const [isRanked, setIsRanked] = useState(editList?.isRanked || false);
    const [selectedMovies, setSelectedMovies] = useState(editList?.movies || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    if (!isOpen)
        return null;
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const results = MOCK_SEARCH_MOVIES.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !selectedMovies.find((m) => m.id === movie.id));
        setSearchResults(results);
    };
    const handleAddMovie = (movie) => {
        setSelectedMovies([...selectedMovies, movie]);
        setSearchResults(searchResults.filter((m) => m.id !== movie.id));
        setSearchQuery('');
    };
    const handleRemoveMovie = (movieId) => {
        setSelectedMovies(selectedMovies.filter((m) => m.id !== movieId));
    };
    const moveMovie = (dragIndex, hoverIndex) => {
        const newMovies = [...selectedMovies];
        const draggedMovie = newMovies[dragIndex];
        newMovies.splice(dragIndex, 1);
        newMovies.splice(hoverIndex, 0, draggedMovie);
        setSelectedMovies(newMovies);
    };
    const handleNext = () => {
        if (step === 1) {
            if (!listName.trim()) {
                toast.error('Please enter a list name');
                return;
            }
            setStep(2);
        }
        else if (step === 2) {
            setStep(3);
        }
    };
    const handleSubmit = () => {
        toast.success(editList ? 'List updated successfully!' : 'List created successfully!');
        onClose();
        // Reset form
        setStep(1);
        setListName('');
        setDescription('');
        setIsRanked(false);
        setSelectedMovies([]);
    };
    const modalContent = (_jsx(DndProvider, { backend: HTML5Backend, children: _jsxs("div", { className: "fixed inset-0 flex items-center justify-center px-4 py-8 z-[99999]", onClick: onClose, children: [_jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-md" }), _jsxs("div", { className: "relative w-full max-w-4xl bg-[#151921] border border-[#BFBCFC]/20 rounded-xl shadow-2xl z-[100000] max-h-[90vh] overflow-hidden flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-[#BFBCFC]/15", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-lg flex items-center justify-center", children: _jsx(List, { className: "w-5 h-5 text-[#0B0E14]" }) }), _jsx("h2", { className: "text-xl font-bold text-[#F8FAFC]", children: editList ? 'Edit List' : 'Create New List' }), _jsxs("span", { className: "text-[#94A3B8] text-sm", children: ["- Step ", step, " of 3"] })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-[#FF61D2]/20 rounded-lg text-[#94A3B8] hover:text-[#FF61D2] transition-all", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] font-medium mb-2 text-sm", children: ["List Name ", _jsx("span", { className: "text-[#FF61D2]", children: "*" })] }), _jsx("input", { type: "text", value: listName, onChange: (e) => setListName(e.target.value), placeholder: "e.g., My Favorite Sci-Fi Films", className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm", maxLength: 100 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] font-medium mb-2 text-sm", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Tell others what this list is about...", className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all min-h-[80px] resize-none text-sm", maxLength: 500 }), _jsxs("p", { className: "text-[#94A3B8] text-xs mt-1", children: [description.length, "/500 characters"] })] }), _jsx("div", { className: "bg-[#0B0E14] p-3 rounded-lg border border-[#BFBCFC]/10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-[#F8FAFC] font-medium mb-0.5 text-sm", children: "Ranked List" }), _jsx("p", { className: "text-[#94A3B8] text-xs", children: "Enable ranking to order your films" })] }), _jsx("button", { type: "button", onClick: () => setIsRanked(!isRanked), className: `w-11 h-6 rounded-full transition-colors relative ${isRanked ? 'bg-[#44FFFF]' : 'bg-[#94A3B8]/30'}`, children: _jsx("div", { className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isRanked ? 'left-6' : 'left-1'}` }) })] }) })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] font-medium mb-2 text-sm", children: "Search & Add Movies" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), placeholder: "Search for movies...", className: "w-full bg-[#0B0E14] text-[#F8FAFC] pl-9 pr-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm" })] }), _jsx("button", { onClick: handleSearch, className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all text-sm", children: "Search" })] })] }), searchResults.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-[#94A3B8] text-sm font-medium", children: "Search Results" }), _jsx("div", { className: "grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto", children: searchResults.map((movie) => (_jsxs("button", { onClick: () => handleAddMovie(movie), className: "flex items-center gap-2 bg-[#0B0E14] rounded-lg p-2 border border-[#BFBCFC]/15 hover:border-[#BFBCFC]/30 transition-all text-left", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w92${movie.poster_path}`, alt: movie.title, className: "w-10 h-14 object-cover rounded" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h5", { className: "text-[#F8FAFC] font-medium text-xs truncate", children: movie.title }), _jsx("p", { className: "text-[#94A3B8] text-xs", children: new Date(movie.release_date).getFullYear() })] }), _jsx(Plus, { className: "w-4 h-4 text-[#44FFFF]" })] }, movie.id))) })] })), _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-[#94A3B8] text-sm font-medium", children: ["Selected Movies (", selectedMovies.length, ")"] }), selectedMovies.length > 0 ? (_jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto", children: selectedMovies.map((movie, index) => (_jsxs("div", { className: "flex items-center gap-2 bg-[#0B0E14] rounded-lg p-2 border border-[#BFBCFC]/15", children: [_jsxs("span", { className: "text-[#44FFFF] font-bold text-sm w-6", children: [index + 1, "."] }), _jsx("img", { src: `https://image.tmdb.org/t/p/w92${movie.poster_path}`, alt: movie.title, className: "w-10 h-14 object-cover rounded" }), _jsxs("div", { className: "flex-1", children: [_jsx("h5", { className: "text-[#F8FAFC] font-medium text-xs", children: movie.title }), _jsx("p", { className: "text-[#94A3B8] text-xs", children: new Date(movie.release_date).getFullYear() })] }), _jsx("button", { onClick: () => handleRemoveMovie(movie.id), className: "p-1.5 hover:bg-[#FF61D2]/20 rounded text-[#94A3B8] hover:text-[#FF61D2] transition-all", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] }, movie.id))) })) : (_jsx("p", { className: "text-[#94A3B8] text-sm text-center py-8 bg-[#0B0E14] rounded-lg border border-[#BFBCFC]/10", children: "No movies added yet. Search and add movies to your list." }))] })] })), step === 3 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-[#F8FAFC] font-medium mb-1 text-sm", children: "Arrange Your Movies" }), _jsxs("p", { className: "text-[#94A3B8] text-xs mb-4", children: ["Drag and drop to reorder your movies", isRanked ? ' from best to worst' : ''] })] }), selectedMovies.length > 0 ? (_jsx("div", { className: "space-y-2 max-h-[400px] overflow-y-auto", children: selectedMovies.map((movie, index) => (_jsx(DraggableMovieItem, { movie: movie, index: index, onRemove: handleRemoveMovie, moveMovie: moveMovie }, movie.id))) })) : (_jsx("p", { className: "text-[#94A3B8] text-sm text-center py-8 bg-[#0B0E14] rounded-lg border border-[#BFBCFC]/10", children: "No movies in your list. Go back and add some movies." }))] }))] }), _jsxs("div", { className: "flex gap-2 p-4 border-t border-[#BFBCFC]/15", children: [step > 1 && (_jsx("button", { onClick: () => setStep(step - 1), className: "bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-2 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 text-sm", children: "Back" })), _jsx("button", { onClick: onClose, className: "flex-1 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-2 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 text-sm", children: "Cancel" }), step < 3 ? (_jsx("button", { onClick: handleNext, className: "flex-1 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-[#BFBCFC]/30 text-sm", children: "Next" })) : (_jsx("button", { onClick: handleSubmit, className: "flex-1 bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-[#44FFFF]/30 text-sm", children: editList ? 'Update List' : 'Create List' }))] })] })] }) }));
    return createPortal(modalContent, document.body);
}
