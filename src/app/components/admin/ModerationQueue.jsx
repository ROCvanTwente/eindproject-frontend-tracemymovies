import React, { useState, useEffect } from 'react';
import { Shield, Search, AlertTriangle, Trash2, XCircle, Film } from 'lucide-react';
import { toast } from 'sonner';
import { deleteReview } from '../../services/reviews';

export function ModerationQueue() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modSearch, setModSearch] = useState('');

  const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setReports(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDismiss = async (reportId) => {
    try {
      const token = getToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/reports/${reportId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Report dismissed');
      } else {
        toast.info('Report removed from view');
      }
      setReports((prev) => prev.filter((r) => r.reportId !== reportId));
    } catch (err) {
      console.error(err);
      toast.info('Report removed from view');
      setReports((prev) => prev.filter((r) => r.reportId !== reportId));
    }
  };

  const handleRemoveReview = async (reviewId, reportId) => {
    if (!reviewId) {
      toast.error('Cannot find Review ID');
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to delete this review permanently?");
    if (!confirmDelete) return;

    try {
      const token = getToken();
      const success = await deleteReview(reviewId, token);
      if (success) {
        toast.success('Review deleted successfully');
        // Also clear the report from the UI
        handleDismiss(reportId);
      } else {
        toast.error('Failed to delete review');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete review');
    }
  };

  const filtered = reports.filter((r) => {
    if (!modSearch.trim()) return true;
    const q = modSearch.toLowerCase();
    const text = r.originalText?.toLowerCase() || '';
    const authorName = r.author?.userName?.toLowerCase() || '';
    const reasonLabels = r.reasons?.map(rs => rs.label).join(", ").toLowerCase() || '';
    return text.includes(q) || authorName.includes(q) || reasonLabels.includes(q);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#4B5563]">
        <div className="w-8 h-8 border-2 border-[#BFBCFC] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm">Loading moderation queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Top Control Bar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Title + counter */}
        <div className="flex items-center gap-3 mr-auto">
          <h2 className="text-xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Content Moderation Queue
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-orange-400/15 text-orange-300 border border-orange-400/25">
            {reports.length} Pending Items
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
          <input
            value={modSearch}
            onChange={(e) => setModSearch(e.target.value)}
            placeholder="Search reports..."
            className="pl-9 pr-4 py-2 bg-[#151921] border border-[#BFBCFC]/15 rounded-lg text-sm text-[#F8FAFC] placeholder-[#4B5563] focus:outline-none focus:border-[#BFBCFC]/40 w-72 transition-all"
          />
        </div>
      </div>

      {/* ── Card Stack ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#4B5563]">
          <Shield className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No items match your current filters or queue is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report, index) => {
            const reportId = report.reportId;
            const reviewId = report.targetId;
            const reviewText = report.originalText || 'No review content available.';
            const author = report.author?.userName || 'Unknown User';
            const reasonList = report.reasons && report.reasons.length > 0 
              ? report.reasons.map(r => `${r.label} (${r.count}x)`).join(', ') 
              : 'No reason provided';
            const targetTypeTitle = report.targetType || 'Unknown';
            const poster = null; // Backend currently doesn't send movie info in report object

            return (
              <div key={reportId ? `report-${reportId}-${index}` : `fallback-${index}`} className="relative bg-[#151921] border-l-4 border-l-orange-400 border border-[#BFBCFC]/10 rounded-r-xl overflow-hidden transition-all duration-200">
                <div className="pl-6 pr-6 pt-5 pb-5 space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-16 rounded-lg overflow-hidden bg-[#0F1219] shrink-0 shadow-md">
                      {poster ? (
                        <img src={`https://image.tmdb.org/t/p/w92${poster}`} alt={targetTypeTitle} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1C2232]"><Film className="w-5 h-5 text-[#4B5563]" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-[#F8FAFC]">{targetTypeTitle}</span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border bg-orange-400/15 text-orange-300 border-orange-400/30">Reported</span>
                      </div>
                      <p className="text-sm text-[#94A3B8]">Review by <span className="text-[#BFBCFC] font-semibold">@{author}</span></p>
                    </div>
                  </div>
                  {/* Threat Panel */}
                  <div className="bg-[#0F1219] border border-[#BFBCFC]/10 rounded-xl px-4 py-3 flex flex-wrap gap-4 items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#4B5563] uppercase tracking-widest font-mono mb-2">Report Reason</p>
                      <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md border border-red-500/30 text-red-400 bg-red-500/8"><AlertTriangle className="w-2.5 h-2.5" />{reasonList}</span>
                    </div>
                  </div>
                  {/* Review Content */}
                  <div className="bg-[#0B0E14] border border-[#BFBCFC]/10 rounded-xl p-4"><p className="text-[10px] text-[#4B5563] uppercase tracking-widest font-mono mb-2.5">Review Content</p><p className="text-sm text-[#94A3B8] leading-relaxed">{reviewText}</p></div>
                  {/* Action Row */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button onClick={() => handleDismiss(reportId)} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#94A3B8] border border-[#2A3042] rounded-lg hover:border-[#3D4A5C] hover:text-[#F8FAFC] transition-all"><XCircle className="w-3.5 h-3.5" />Dismiss Flag</button>
                    <button onClick={() => handleRemoveReview(reviewId, reportId)} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 transition-all shadow-lg shadow-red-900/30"><Trash2 className="w-3.5 h-3.5" />Remove Review</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}