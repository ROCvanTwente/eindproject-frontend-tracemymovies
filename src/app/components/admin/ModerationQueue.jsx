import React, { useState, useEffect } from 'react';
import { Shield, Search, AlertTriangle, Trash2, XCircle, Film, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { deleteReview } from '../../services/reviews';
import { DeleteReviewModal } from '../review/DeleteReviewModal';

export function ModerationQueue() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modSearch, setModSearch] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${baseUrl}/admin/reports`, {
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
      const res = await fetch(`${baseUrl}/admin/reports/${reportId}`, {
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

  const openDeleteModal = (reviewId, authorName, reviewContent, reportId) => {
    setDeleteTarget({ reviewId, authorName, reviewContent, reportId });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const onReviewDeleted = () => {
    if (deleteTarget) {
      // Update visueel ALLE rapporten die bij de verwijderde review horen
      setReports((prev) => prev.map((r) => r.targetId === deleteTarget.reviewId ? { ...r, status: 'Deleted' } : r));
    }
    closeDeleteModal();
  };

  const filtered = reports.filter((r) => {
    if (!modSearch.trim()) return true;
    const q = modSearch.toLowerCase();
    const text = r.originalText?.toLowerCase() || '';
    const searchTargetNames = ( r.reporterUserId || r.ReporterUserId || '').toLowerCase();
    const reasonLabels = r.reasons?.map(rs => rs.label).join(", ").toLowerCase() || '';
    return text.includes(q) || searchTargetNames.includes(q) || reasonLabels.includes(q);
  });

  const activeReports = filtered.filter(r => r.status !== 'Deleted' && r.status !== 'Archived');
  const deletedReports = filtered.filter(r => r.status === 'Deleted' || r.status === 'Archived');

  const renderReportCard = (report, index, isDeleted = false) => {
    const reportId = report.reportId;
    const reviewId = report.targetId;
    const reviewText = report.originalText || 'No review content available.';
    
    const reporterId = report.reporter?.id || report.reporterUserId || report.ReporterUserId;
    const reporterName = report.reporter?.userName || report.reporterName || report.ReporterName || report.userName;
    const displayReporter = reporterName 
      ? `@${reporterName} (ID: ${reporterId})` 
      : (reporterId ? `ID: ${reporterId}` : 'Unknown User');

    const authorId = report.author?.id || report.authorUserId || report.AuthorUserId;
    const authorName = report.author?.userName || report.authorName || report.AuthorName;
    const displayAuthor = authorName 
      ? `@${authorName} (ID: ${authorId})` 
      : (authorId ? `ID: ${authorId}` : 'Unknown Author');
      
    const reasonList = report.reasons && report.reasons.length > 0 
      ? report.reasons.map(r => `${r.label} (${r.count}x)`).join(', ') 
      : 'No reason provided';
    const targetTypeTitle = report.targetType || 'Unknown';
    const poster = null; // Backend currently doesn't send movie info in report object

    const reportDateValue = report.date_created || report.createdAt || report.reportedAt || report.dateCreated || report.dateReported || report.date;
    const reportDateString = reportDateValue 
      ? new Date(reportDateValue).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) 
      : 'Date unknown';

    return (
      <div key={reportId ? `report-${reportId}-${index}` : `fallback-${index}`} className={`relative bg-[#151921] border-l-4 ${isDeleted ? 'border-l-red-500/70 opacity-80' : 'border-l-orange-400'} border border-[#BFBCFC]/10 rounded-r-xl overflow-hidden transition-all duration-200`}>
        <div className="pl-6 pr-6 pt-5 pb-5 space-y-4">
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
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${isDeleted ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-400/15 text-orange-300 border-orange-400/30'}`}>
                  {isDeleted ? (report.status || 'Deleted') : 'Reported'}
                </span>
                <span className="text-xs text-[#94A3B8] ml-1">• {reportDateString}</span>
              </div>
              <p className="text-sm text-[#94A3B8] mb-0.5">Reported by: <span className="text-[#BFBCFC] font-semibold">{displayReporter}</span></p>
              <p className="text-sm text-[#94A3B8]">Author of review: <span className="text-[#BFBCFC] font-semibold">{displayAuthor}</span></p>
            </div>
          </div>
          <div className="bg-[#0F1219] border border-[#BFBCFC]/10 rounded-xl px-4 py-3 flex flex-wrap gap-4 items-start">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-widest font-mono mb-2">Report Reason</p>
              <div className="flex items-start gap-1 text-xs font-mono px-2 py-0.5 rounded-md border border-red-500/30 text-red-400 bg-red-500/8"><AlertTriangle className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" /><span>{reasonList}</span></div>
            </div>
          </div>
          <div className="bg-[#0B0E14] border border-[#BFBCFC]/10 rounded-xl p-4"><p className="text-[10px] text-[#4B5563] uppercase tracking-widest font-mono mb-2.5">Review Content</p><p className="text-sm text-[#94A3B8] leading-relaxed break-words">{reviewText}</p></div>
          {!isDeleted && (<div className="flex items-center justify-end gap-2 pt-1"><button onClick={() => handleDismiss(reportId)} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#94A3B8] border border-[#2A3042] rounded-lg hover:border-[#3D4A5C] hover:text-[#F8FAFC] transition-all"><XCircle className="w-3.5 h-3.5" />Dismiss Flag</button><button onClick={() => openDeleteModal(reviewId, authorName, reviewText, reportId)} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 transition-all shadow-lg shadow-red-900/30"><Trash2 className="w-3.5 h-3.5" />Remove Review</button></div>)}
        </div>
      </div>
    );
  };

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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mr-auto">
          <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Content Moderation Queue
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-orange-400/15 text-orange-300 border border-orange-400/25">
            {activeReports.length} Pending Items
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

      <DeleteReviewModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        reviewAuthor={deleteTarget?.authorName || 'Anonymous'}
        reviewContent={deleteTarget?.reviewContent || ''}
        reviewId={deleteTarget?.reviewId}
        isAdminDelete={true}
        onDeleted={onReviewDeleted}
      />

      {/* ── Card Stack ── */}
      {activeReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#4B5563]">
          <Shield className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No pending items match your current filters or queue is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeReports.map((report, index) => renderReportCard(report, index, false))}
        </div>
      )}

      {/* ── Deleted / Archived Reviews Dropdown ── */}
      <div className="mt-8 pt-6 border-t border-[#BFBCFC]/15">
        <button
          onClick={() => setShowDeleted(!showDeleted)}
          className="w-full flex items-center justify-between bg-[#151921] border border-[#BFBCFC]/15 p-4 rounded-xl hover:bg-[#1E2230] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-[#94A3B8]" />
            <span className="font-bold text-[#F8FAFC]">Deleted & Archived Reviews</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#0B0E14] text-[#94A3B8] border border-[#BFBCFC]/20">
              {deletedReports.length}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-[#94A3B8] transition-transform ${showDeleted ? 'rotate-180' : ''}`} />
        </button>

        {showDeleted && (
          <div className="mt-4 space-y-4">
            {deletedReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-[#4B5563]">
                <p className="text-sm">No deleted reviews found.</p>
              </div>
            ) : (
              deletedReports.map((report, index) => renderReportCard(report, index, true))
            )}
          </div>
        )}
      </div>
    </div>
  );
}