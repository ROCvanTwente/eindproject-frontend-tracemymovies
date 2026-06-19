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
    <div className="flex items-center justify-between mt-6 px-6 py-4 bg-[#0B0E14] rounded-lg border border-[#BFBCFC]/10">
      <div className="text-[#94A3B8] text-sm">
        Showing {startIndex} to {endIndex} of {totalEntries} entries
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#151921] hover:bg-[#BFBCFC]/10 text-[#F8FAFC] rounded-lg border border-[#BFBCFC]/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <div className="flex gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-10 h-10 flex items-center justify-center text-[#475569] font-medium select-none"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
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
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#151921] hover:bg-[#BFBCFC]/10 text-[#F8FAFC] rounded-lg border border-[#BFBCFC]/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}