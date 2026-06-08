// src/components/admin/PaginationControls.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationControls({ currentPage, setCurrentPage, totalPages, itemsPerPage, totalEntries }) {
  const startIndex = ((currentPage - 1) * itemsPerPage) + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalEntries);

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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}
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