import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Save, Star, MessageSquare, Calendar, Heart, RotateCw, Trash2, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { useNavigate } from "react-router";
import { DatePicker } from "./WatchLogModal";

const MAX_REVIEW_LENGTH = 5000;

export function EditLogModal({ isOpen, onClose, logData, onSaved }) {
  const auth = useAuth();
  const { triggerRefresh } = useRefresh();
  const navigate = useNavigate();

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token"),
    [auth]
  );

  const [watchDate, setWatchDate] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen && logData) {
      setWatchDate(new Date(logData.watchedDate).toISOString().split("T")[0]);
      setIsLiked(logData.isLiked ?? false);
      setRating(logData.rating ?? 0);
      setReviewText(logData.reviewText ?? "");
      setContainsSpoilers(logData.containsSpoilers ?? false);
      setConfirmDelete(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, logData]);

  if (!isOpen || !logData) return null;

  const displayRating = hoverRating || rating;

  const handleSave = async () => {
    if (reviewText.trim().length > MAX_REVIEW_LENGTH) {
      toast.error(`Maximum ${MAX_REVIEW_LENGTH} characters allowed.`);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Log/Update/${logData.logId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            movieId: logData.movieId,
            watchDate: new Date(watchDate).toISOString(),
            isRewatch: false,
            isLiked,
            rating: rating > 0 ? rating : null,
            reviewText: reviewText.trim() || null,
            containsSpoilers,
          }),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Log updated!");
      triggerRefresh();
      onSaved?.();
      onClose();
    } catch {
      toast.error("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Log/Delete/${logData.logId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      toast.success("Log deleted.");
      triggerRefresh();
      onClose();
      navigate(-1);
    } catch {
      toast.error("Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4" style={{ zIndex: 99999 }}>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#151921] border border-[#BFBCFC]/20 rounded-2xl overflow-hidden shadow-2xl z-[100000]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#BFBCFC]/10">
          <div>
            <h3 className="text-[#F8FAFC] font-bold text-base">{logData.title}</h3>
            <p className="text-[#94A3B8] text-xs mt-0.5">Edit log</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#BFBCFC]/10 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Date + Like */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#BFBCFC]/10 flex items-center justify-between">
              <span className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Date
              </span>
              <DatePicker value={watchDate} onChange={setWatchDate} />
            </div>
            <button
              onClick={() => setIsLiked(v => !v)}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${isLiked ? "bg-[#FF61D2]/10 border-[#FF61D2]/40" : "bg-[#0B0E14] border-[#BFBCFC]/10 hover:border-[#FF61D2]/25"}`}
            >
              <span className={`text-xs flex items-center gap-1.5 ${isLiked ? "text-[#FF61D2]" : "text-[#94A3B8]"}`}>
                <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-[#FF61D2]" : ""}`} />
                Liked
              </span>
              <div className={`w-9 h-5 rounded-full relative ${isLiked ? "bg-[#FF61D2]" : "bg-[#94A3B8]/30"}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isLiked ? "left-5" : "left-1"}`} />
              </div>
            </button>
          </div>

          {/* Stars */}
          <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#BFBCFC]/10">
            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-3">
              <Star className="w-3.5 h-3.5" />
              Score {rating > 0 && <span className="text-[#44FFFF] font-bold">{rating}/10</span>}
            </p>
            <div className="flex gap-1 flex-wrap">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n === rating ? 0 : n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-7 h-7 transition-colors ${n <= displayRating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/40"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#BFBCFC]/10">
            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Review
            </p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you think?"
              rows={3}
              maxLength={MAX_REVIEW_LENGTH}
              className="w-full bg-transparent text-[#F8FAFC] text-sm placeholder-[#94A3B8]/50 outline-none resize-none break-words"
            />
            <div className="text-right text-xs text-[#94A3B8] mt-1">
              {reviewText.length} / {MAX_REVIEW_LENGTH} characters
            </div>
            {reviewText.length > 0 && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#BFBCFC]/10">
                <button onClick={() => setContainsSpoilers(v => !v)} className={`w-4 h-4 rounded border flex items-center justify-center ${containsSpoilers ? "bg-[#FF61D2] border-[#FF61D2]" : "border-[#94A3B8]/40"}`}>
                  {containsSpoilers && <span className="text-white text-[8px] font-bold">✓</span>}
                </button>
                <span className="text-xs text-[#94A3B8]">Contains spoilers</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-[#BFBCFC] to-[#44FFFF] text-[#0B0E14] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.99]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all disabled:opacity-50 ${confirmDelete ? "bg-red-500 text-white" : "bg-[#0B0E14] border border-[#94A3B8]/20 text-[#94A3B8] hover:border-red-500/40 hover:text-red-400"}`}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" />{confirmDelete ? "Are you sure?" : "Delete log"}</>}
          </button>
          {confirmDelete && (
            <button onClick={() => setConfirmDelete(false)} className="w-full text-[#94A3B8] text-xs hover:text-[#F8FAFC] transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
