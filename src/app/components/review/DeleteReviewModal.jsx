import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { deleteReview, adminDeleteReview } from "../../services/reviews";
import { getToken } from "../../services/auth";

export function DeleteReviewModal({ isOpen, onClose, reviewAuthor, reviewContent, reviewId, onDeleted, isAdminDelete = false }) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);

    const token = getToken();
    try {
      const ok = isAdminDelete
        ? await adminDeleteReview(reviewId, token)
        : await deleteReview(reviewId, token);
      if (!ok) throw new Error("delete failed");

      toast.success("Review deleted successfully");
      if (typeof onDeleted === "function") onDeleted();
      onClose();
    } catch (e) {
      console.error("Delete failed:", e);
      toast.error("Could not delete review.");
    } finally {
      setConfirmText("");
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
      setConfirmText("");
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 py-8 z-[99999]"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#151921] border-2 border-[#FF61D2]/40 rounded-xl shadow-2xl shadow-[#FF61D2]/20 z-[100000] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-[#FF61D2]/20 to-[#FF4DBD]/20 border-b-2 border-[#FF61D2]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF61D2]/20 rounded-full flex items-center justify-center border-2 border-[#FF61D2]">
              <AlertTriangle className="w-6 h-6 text-[#FF61D2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">Delete Review</h2>
              <p className="text-[#FF61D2] text-sm font-medium">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Warning Message */}
          <div className="bg-[#FF61D2]/10 border-2 border-[#FF61D2]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-[#FF61D2] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F8FAFC] font-bold text-sm mb-1">Are you absolutely sure?</p>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  This will permanently delete your review. This action is irreversible and cannot be recovered.
                </p>
              </div>
            </div>
          </div>

          {/* Review Being Deleted */}
          <div className="bg-[#0B0E14] rounded-lg p-4 border border-[#BFBCFC]/15">
            <p className="text-[#44FFFF] text-xs font-medium mb-2 uppercase tracking-wide">Review to be deleted</p>
            <p className="text-[#F8FAFC] font-medium text-sm mb-2">By {reviewAuthor}</p>
            <p className="text-[#94A3B8] text-sm line-clamp-4">{reviewContent}</p>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-[#F8FAFC] font-medium mb-2 text-sm">
              Type <span className="text-[#FF61D2] font-bold">DELETE</span> to confirm
              <span className="text-[#FF61D2] ml-1">*</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              disabled={isDeleting}
              className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-lg border-2 border-[#BFBCFC]/15 focus:outline-none focus:border-[#FF61D2] focus:ring-2 focus:ring-[#FF61D2]/20 transition-all text-sm placeholder:text-[#94A3B8] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-[#94A3B8] text-xs mt-2">This confirmation helps prevent accidental deletions</p>
          </div>

          {/* Consequences List */}
          <div className="bg-[#0B0E14]/50 rounded-lg p-4 border border-[#BFBCFC]/10">
            <p className="text-[#F8FAFC] font-medium text-sm mb-2">What happens when you delete:</p>
            <ul className="space-y-1.5 text-[#94A3B8] text-xs">
              <li className="flex items-start gap-2"><span className="text-[#FF61D2] mt-0.5">•</span>Your review will be permanently removed</li>
              <li className="flex items-start gap-2"><span className="text-[#FF61D2] mt-0.5">•</span>All likes and interactions will be lost</li>
              <li className="flex items-start gap-2"><span className="text-[#FF61D2] mt-0.5">•</span>This cannot be undone or recovered</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[#BFBCFC]/15 bg-[#0B0E14]/30">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-3 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmText.toLowerCase() !== 'delete' || isDeleting}
            className="flex-1 bg-[#FF61D2] hover:bg-[#FF4DBD] text-white px-4 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#FF61D2]/30 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF61D2]"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete Review'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
