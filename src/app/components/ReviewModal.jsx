import React, { useState } from 'react';
import { X, Star, AlertTriangle } from 'lucide-react';

export function ReviewModal({ isOpen, onClose, movieTitle, existingReview }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [content, setContent] = useState(existingReview?.content || '');
  const [spoiler, setSpoiler] = useState(existingReview?.spoiler || false);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">
            {existingReview ? 'Edit Review' : 'Write Review'}
          </h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-[#94A3B8] mb-6">
          Review for <span className="text-[#BFBCFC] font-medium">{movieTitle}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#F8FAFC] mb-3 font-medium">Your Score</label>
            <div className="flex gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setRating(score)}
                  className={`w-12 h-12 rounded-lg font-medium font-data transition-all ${rating >= score ? 'bg-[#44FFFF] text-[#0B0E14] scale-110' : 'bg-[#0B0E14] text-[#94A3B8] hover:bg-[#151921]'}`}
                >
                  {score}
                </button>
              ))}
            </div>

            <p className="text-[#94A3B8] text-sm mt-2">
              {rating > 0 && (
                <span className="text-[#44FFFF] font-data">
                  <Star className="w-4 h-4 inline mr-1" fill="currentColor" /> {rating}/10
                </span>
              )}
            </p>
          </div>

          <div>
            <label className="block text-[#F8FAFC] mb-2 font-medium">Your Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Share your thoughts about this movie..."
              className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none"
              required
            />
            <p className="text-[#94A3B8] text-sm mt-2">{content.length} characters</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#FF61D2]/10 border border-[#FF61D2]/20 rounded-xl">
            <input
              type="checkbox"
              id="spoiler"
              checked={spoiler}
              onChange={(e) => setSpoiler(e.target.checked)}
              className="w-5 h-5 rounded border-[#FF61D2]/30 bg-[#0B0E14] checked:bg-[#FF61D2] focus:ring-2 focus:ring-[#FF61D2]/20"
            />
            <label htmlFor="spoiler" className="text-[#F8FAFC] flex items-center gap-2 cursor-pointer">
              <AlertTriangle className="w-5 h-5 text-[#FF61D2]" /> Contains Spoilers
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40"
            >
              {existingReview ? 'Update Review' : 'Submit Review'}
            </button>

            {existingReview && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-[#FF61D2]/10 hover:bg-[#FF61D2]/20 text-[#FF61D2] rounded-xl font-medium transition-all border border-[#FF61D2]/30"
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-[#151921] hover:bg-[#1E293B] text-[#F8FAFC] rounded-xl font-medium transition-all border border-[#BFBCFC]/15"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
