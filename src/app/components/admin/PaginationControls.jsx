// src/components/admin/PaginationControls.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationControls({ currentPage, setCurrentPage, totalPages, itemsPerPage, totalEntries }) {
  const startIndex = totalEntries === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalEntries);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show before and after current page
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    let range = [];
    let rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-6 px-4 py-4 bg-[#0B0E14] rounded-xl border border-[#BFBCFC]/10 sm:flex-row sm:justify-between sm:px-6">
      {/* Label */}
      <div className="text-[#94A3B8] text-xs sm:text-sm text-center sm:text-left">
        Showing <span className="text-[#F8FAFC] font-semibold">{startIndex}</span> to <span className="text-[#F8FAFC] font-semibold">{endIndex}</span> of <span className="text-[#F8FAFC] font-semibold">{totalEntries}</span> entries
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-[#151921] hover:bg-[#BFBCFC]/10 text-[#F8FAFC] rounded-lg border border-[#BFBCFC]/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs sm:text-sm sm:px-4"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Prev</span>
        </button>

        {/* Page numbers - Desktop only */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[#475569] font-medium select-none"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium text-xs md:text-sm transition-all ${
                  currentPage === page
                    ? 'bg-[#BFBCFC] text-[#0B0E14]'
                    : 'bg-[#151921] text-[#F8FAFC] hover:bg-[#BFBCFC]/10 border border-[#BFBCFC]/15'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Mobile Page indicator - Mobile only */}
        <div className="sm:hidden text-xs text-[#94A3B8] font-mono px-3 py-2 bg-[#151921] border border-[#BFBCFC]/15 rounded-lg select-none">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-[#151921] hover:bg-[#BFBCFC]/10 text-[#F8FAFC] rounded-lg border border-[#BFBCFC]/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs sm:text-sm sm:px-4"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}