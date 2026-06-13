import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ReviewPagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const goToPage = (page) => {
        onPageChange(page);
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#151921] border border-[#BFBCFC]/15 text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E293B] transition-colors flex items-center justify-center"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[#94A3B8] text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-[#151921] border border-[#BFBCFC]/15 text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E293B] transition-colors flex items-center justify-center"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}