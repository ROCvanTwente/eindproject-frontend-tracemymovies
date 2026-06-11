import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Flag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getToken, getCurrentUserId } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

const REPORT_REASONS = [
  {
    id: 'spam',
    label: 'Spam or Misleading',
    description: 'Promotional content, fake reviews, or misleading information',
  },
  {
    id: 'offensive',
    label: 'Offensive or Harassment',
    description: 'Abusive language, personal attacks, or bullying',
  },
  {
    id: 'spoilers',
    label: 'Unmarked Spoilers',
    description: 'Contains spoilers without proper warning',
  },
  {
    id: 'hate',
    label: 'Hate Speech or Discrimination',
    description: 'Content promoting hatred or discrimination',
  },
  {
    id: 'offtopic',
    label: 'Off-Topic',
    description: 'Not relevant to the movie or discussion',
  },
  {
    id: 'false',
    label: 'False Information',
    description: 'Contains factually incorrect information',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Another reason not listed above',
  },
];

// Pass the 'review' object into the props to access its hidden database data dynamically
export function ReportReviewModal({ isOpen, onClose, review }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();

  if (!isOpen || !review) return null;

  const reviewAuthor = review?.user?.userName || review?.userName || "Anonymous";
  const reviewContent = review?.review ?? review?.content ?? review?.reviewText ?? review?.text ?? "";
  const reviewAuthorId = review?.userId ?? review?.user?.id ?? review?.user?.userId ?? review?.user?.userID ?? review?.authorUserId ?? null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!selectedReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);
    const token = getToken();
    const currentUserId = getCurrentUserId();

    if (!token) {
      toast.error("Je moet ingelogd zijn om een review te rapporteren.");
      setIsSubmitting(false);
      return;
    }

    const reasonObj = REPORT_REASONS.find(r => r.id === selectedReason);
    const trimmedDetails = additionalDetails.trim();
    const combinedReason = trimmedDetails ? `${reasonObj.label} - ${trimmedDetails}` : reasonObj.label;

    const reportPayload = {
      targetType: "Review",
      targetId: Number(review.id ?? review.reviewId),
      reporterUserId: String(currentUserId || auth?.user?.id || auth?.user?.userId || "Unknown"),
      authorUserId: String(reviewAuthorId || "Unknown"),
      originalText: reviewContent || "No review content provided",
      reasonLabel: combinedReason,
      status: "Pending"
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportPayload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Je bent niet ingelogd of je sessie is verlopen. Log opnieuw in.");
        }
        
        if (response.status === 403) {
          throw new Error("Je hebt geen rechten om deze review te rapporteren.");
        }

        let errorData;
        try {
          const errorText = await response.text();
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText || "Lege response van de server (400 Bad Request)" };
          }
        } catch (e) {
          errorData = { message: "Netwerk fout tijdens het inlezen van de error" };
        }
        console.error("VALIDATION ERROR FROM BACKEND:", errorData);
        
        let errorMessage = errorData.message || errorData.title || "Report submission failed due to validation.";
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join(" | ");
        }
        throw new Error(errorMessage);
      }

      toast.success("Report submitted. Thank you for helping keep our community safe.");
      onClose();
      setSelectedReason('');
      setAdditionalDetails('');
    } catch (error) {
      console.error("Report failed:", error);
      toast.error(error.message || "Could not submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedReason('');
      setAdditionalDetails('');
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 py-8 z-[99999]"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-[#151921] border border-[#BFBCFC]/20 rounded-xl shadow-2xl z-[100000] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#BFBCFC]/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FF61D2]/10 rounded-lg flex items-center justify-center">
              <Flag className="w-5 h-5 text-[#FF61D2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">Report Review</h2>
              <p className="text-[#94A3B8] text-xs">Help us maintain a safe community</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-[#FF61D2]/20 rounded-lg text-[#94A3B8] hover:text-[#FF61D2] transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Review Being Reported */}
          <div className="bg-[#0B0E14] rounded-lg p-4 border border-[#BFBCFC]/10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#44FFFF]" />
              <p className="text-[#44FFFF] text-sm font-medium">Review being reported</p>
            </div>
            <p className="text-[#F8FAFC] font-medium text-sm mb-1">
              By {reviewAuthor}
            </p>
            <p className="text-[#94A3B8] text-sm line-clamp-3">
              {reviewContent}
            </p>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-[#F8FAFC] font-medium mb-3 text-sm">
              Why are you reporting this review? <span className="text-[#FF61D2]">*</span>
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  disabled={isSubmitting}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedReason === reason.id
                      ? 'bg-[#FF61D2]/10 border-[#FF61D2]/30'
                      : 'bg-[#0B0E14] border-[#BFBCFC]/15 hover:border-[#BFBCFC]/25'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        selectedReason === reason.id
                          ? 'border-[#FF61D2] bg-[#FF61D2]'
                          : 'border-[#94A3B8]'
                      }`}
                    >
                      {selectedReason === reason.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#F8FAFC] font-medium text-sm mb-0.5">
                        {reason.label}
                      </p>
                      <p className="text-[#94A3B8] text-xs">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-[#F8FAFC] font-medium mb-2 text-sm">
              Additional Details (Optional)
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Provide any additional context that might help us review this report..."
              disabled={isSubmitting}
              rows={4}
              className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none text-sm placeholder:text-[#94A3B8] disabled:opacity-50"
              maxLength={500}
            />
            <p className="text-[#94A3B8] text-xs mt-1">
              {additionalDetails.length}/500 characters
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-[#44FFFF]/5 border border-[#44FFFF]/20 rounded-lg p-3">
            <p className="text-[#44FFFF] text-xs leading-relaxed">
              <strong>Note:</strong> All reports are reviewed by our moderation team. False or malicious reports may result in action against your account. Thank you for helping us maintain a respectful community.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-[#BFBCFC]/15">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] px-4 py-2.5 rounded-lg font-medium transition-all border border-[#BFBCFC]/15 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="flex-1 bg-[#FF61D2] hover:bg-[#FF4DBD] text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-[#FF61D2]/30 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Flag className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}