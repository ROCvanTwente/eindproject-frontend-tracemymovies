import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Flag, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { getToken } from "../../services/auth";

export function ReportReviewModal({ isOpen, onClose, reviewId }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error("Geef een reden op.");
      return;
    }

    setIsSubmitting(true);

    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId,
          reason: trimmedReason,
        }),
      });

      if (!response.ok) throw new Error("report failed");

      toast.success("Review gerapporteerd.");
      onClose();
      setReason("");
    } catch (e) {
      console.error("Report failed:", e);
      toast.error("Kon review niet rapporteren.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setReason("");
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 py-8 z-[99999]"
      onClick={handleClose}
    >
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg bg-[#151921] border border-[#BFBCFC]/15 rounded-xl shadow-2xl z-[100000] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#BFBCFC]/10 to-[#BFBCFC]/5 border-b border-[#BFBCFC]/15 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#BFBCFC]/10 rounded-full flex items-center justify-center">
                <Flag className="w-5 h-5 text-[#BFBCFC]" />
              </div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">Report Review</h2>
            </div>
            <button onClick={handleClose} disabled={isSubmitting} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors disabled:opacity-50">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-lg p-4">
             <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#FF61D2] flex-shrink-0 mt-0.5" />
                <div>
                   <p className="text-[#F8FAFC] font-bold text-sm mb-1">Why are you reporting this?</p>
                   <p className="text-[#94A3B8] text-sm leading-relaxed">
                     Please provide a detailed reason so our moderation team can investigate properly.
                   </p>
                </div>
             </div>
          </div>

          <div>
            <label className="block text-[#F8FAFC] font-medium mb-2 text-sm">
              Reason <span className="text-[#FF61D2]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context..."
              disabled={isSubmitting}
              rows={4}
              className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm placeholder:text-[#94A3B8] disabled:opacity-50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} disabled={isSubmitting} className="flex-1 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-3 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 text-sm disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={!reason.trim() || isSubmitting} className="flex-1 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#BFBCFC]/30 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              <Flag className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}