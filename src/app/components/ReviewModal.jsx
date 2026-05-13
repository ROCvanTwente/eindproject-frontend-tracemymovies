import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Star, AlertTriangle } from 'lucide-react';
export function ReviewModal({ isOpen, onClose, movieTitle, existingReview }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [content, setContent] = useState(existingReview?.content || '');
    const [spoiler, setSpoiler] = useState(existingReview?.spoiler || false);
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Review submitted:', { rating, content, spoiler });
        onClose();
    };
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this review?')) {
            console.log('Review deleted');
            onClose();
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-[#151921] border border-[#BFBCFC]/15 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold font-heading text-[#F8FAFC]", children: existingReview ? 'Edit Review' : 'Write Review' }), _jsx("button", { onClick: onClose, className: "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("p", { className: "text-[#94A3B8] mb-6", children: ["Review for ", _jsx("span", { className: "text-[#BFBCFC] font-medium", children: movieTitle })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] mb-3 font-medium", children: "Your Score" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (_jsx("button", { type: "button", onClick: () => setRating(score), className: `w-12 h-12 rounded-lg font-medium font-data transition-all ${rating >= score
                                            ? 'bg-[#44FFFF] text-[#0B0E14] scale-110'
                                            : 'bg-[#0B0E14] text-[#94A3B8] hover:bg-[#151921]'}`, children: score }, score))) }), _jsx("p", { className: "text-[#94A3B8] text-sm mt-2", children: rating > 0 && (_jsxs("span", { className: "text-[#44FFFF] font-data", children: [_jsx(Star, { className: "w-4 h-4 inline mr-1", fill: "currentColor" }), rating, "/10"] })) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#F8FAFC] mb-2 font-medium", children: "Your Review" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), rows: 8, placeholder: "Share your thoughts about this movie...", className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none", required: true }), _jsxs("p", { className: "text-[#94A3B8] text-sm mt-2", children: [content.length, " characters"] })] }), _jsxs("div", { className: "flex items-center gap-3 p-4 bg-[#FF61D2]/10 border border-[#FF61D2]/20 rounded-xl", children: [_jsx("input", { type: "checkbox", id: "spoiler", checked: spoiler, onChange: (e) => setSpoiler(e.target.checked), className: "w-5 h-5 rounded border-[#FF61D2]/30 bg-[#0B0E14] checked:bg-[#FF61D2] focus:ring-2 focus:ring-[#FF61D2]/20" }), _jsxs("label", { htmlFor: "spoiler", className: "text-[#F8FAFC] flex items-center gap-2 cursor-pointer", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-[#FF61D2]" }), "Contains Spoilers"] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", className: "flex-1 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40", children: existingReview ? 'Update Review' : 'Submit Review' }), existingReview && (_jsx("button", { type: "button", onClick: handleDelete, className: "px-6 py-3 bg-[#FF61D2]/10 hover:bg-[#FF61D2]/20 text-[#FF61D2] rounded-xl font-medium transition-all border border-[#FF61D2]/30", children: "Delete" })), _jsx("button", { type: "button", onClick: onClose, className: "px-6 py-3 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] rounded-xl font-medium transition-all border border-[#BFBCFC]/15", children: "Cancel" })] })] })] }) }));
}
