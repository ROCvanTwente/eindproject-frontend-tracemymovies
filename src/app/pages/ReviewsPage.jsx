import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { AlignLeft, Film, Heart, Star, ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ProfilePosterCard } from "../components/ProfilePosterCard";
import { ReviewTextBlock } from "../components/profile/ReviewTextBlock";
import { FilterDropdown, RATING_OPTIONS } from "../components/MovieFilters";

const PAGE_SIZE = 10;

export function ReviewsPage() {
  const { userId } = useParams();
  const isPublic = !!userId;
  const auth = useAuth();
  const [reviews, setReviews] = useState([]);
  const [ownerUsername, setOwnerUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [ratingFilter, setRatingFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const [yearOpen, setYearOpen] = useState(false);

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token"),
    [auth]
  );

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const fetchReviews = async () => {
      try {
        const url = isPublic
          ? `${import.meta.env.VITE_API_BASE_URL}/Log/AllReviews/${userId}`
          : `${import.meta.env.VITE_API_BASE_URL}/Log/MyAllReviews`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        setReviews(await res.json());

        if (isPublic) {
          const profRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profRes.ok) { const d = await profRes.json(); setOwnerUsername(d.username); }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token, userId]);

  // Available filter options
  const availableYears = useMemo(() => {
    const set = new Set(reviews.map(r => new Date(r.watchedDate).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [reviews]);

  const filtered = useMemo(() => {
    let result = reviews;
    if (ratingFilter !== null) {
      if (ratingFilter === "No Rating") {
        result = result.filter(r => !r.rating || r.rating === 0);
      } else {
        const [min, max] = ratingFilter.split("-").map(Number);
        result = result.filter(r => {
          const rt = r.rating ?? 0;
          return rt >= min && rt <= max;
        });
      }
    }
    if (yearFilter !== null) result = result.filter(r => new Date(r.watchedDate).getFullYear() === yearFilter);
    return result;
  }, [reviews, ratingFilter, yearFilter]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [ratingFilter, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-[#FF61D2]/20 flex items-center justify-center">
            <AlignLeft className="w-8 h-8 text-[#FF61D2] animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full border-t-2 border-[#FF61D2] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#FF61D2]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFBCFC]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        <div className="relative container mx-auto px-4 max-w-4xl py-6 md:py-8">
          <Link
            to={isPublic ? `/user/${userId}` : "/my-profile"}
            className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FF61D2]/25 to-[#BFBCFC]/10 rounded-2xl flex items-center justify-center border border-[#FF61D2]/30 shadow-lg shadow-[#FF61D2]/10 flex-shrink-0">
              <AlignLeft className="w-6 h-6 md:w-7 md:h-7 text-[#FF61D2]" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">
                {isPublic && ownerUsername && (
                  <span className="text-[#F8FAFC]">{ownerUsername}'s </span>
                )}
                <span className="bg-gradient-to-r from-[#FF61D2] via-[#cc7be0] to-[#BFBCFC] bg-clip-text text-transparent">
                  Reviews
                </span>
              </h1>
            </div>

            {reviews.length > 0 && (
              <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/20 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#FF61D2] leading-none tabular-nums">{reviews.length}</p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">{reviews.length === 1 ? "review" : "reviews"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {reviews.length > 0 && (
        <div className="sticky top-16 z-30 bg-[#0B0E14]/92 backdrop-blur-xl border-b border-[#BFBCFC]/8">
          <div className="container mx-auto px-4 max-w-4xl py-2.5 flex items-center justify-end gap-2">

            {(ratingFilter !== null || yearFilter !== null) && (
              <button
                onClick={() => { setRatingFilter(null); setYearFilter(null); }}
                className="px-3 py-2 rounded-lg text-xs font-medium text-[#FF61D2] hover:bg-[#FF61D2]/10 transition-colors border border-[#FF61D2]/20 hover:border-[#FF61D2]/40 mr-auto"
              >
                Reset
              </button>
            )}

            {/* Rating filter */}
            <FilterDropdown
              label="Rating"
              value={ratingFilter}
              options={RATING_OPTIONS}
              onChange={setRatingFilter}
              topOption="No Rating"
            />

            {/* Year filter */}
            <div className="relative">
              <button
                onClick={() => setYearOpen(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  yearFilter !== null
                    ? "bg-[#BFBCFC]/15 border-[#BFBCFC]/40 text-[#BFBCFC]"
                    : "bg-transparent border-[#BFBCFC]/12 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/20"
                }`}
              >
                {yearFilter !== null ? `${yearFilter}` : "Diary Year"}
                <ChevronDown className={`w-3 h-3 transition-transform ${yearOpen ? "rotate-180" : ""}`} />
              </button>
              {yearOpen && (
                <div className="absolute top-full mt-2 right-0 z-50 bg-[#1A2030] border border-[#BFBCFC]/20 rounded-xl shadow-2xl shadow-black/50 min-w-[110px] overflow-hidden">
                  <div className="max-h-72 overflow-y-auto py-1.5">
                    <button
                      onClick={() => { setYearFilter(null); setYearOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${yearFilter === null ? "text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"}`}
                    >
                      All years
                    </button>
                    <hr className="border-[#BFBCFC]/10 mx-2 my-1" />
                    {availableYears.map(y => (
                      <button
                        key={y}
                        onClick={() => { setYearFilter(y); setYearOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${yearFilter === y ? "text-[#BFBCFC] bg-[#BFBCFC]/12 font-semibold" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-6 md:py-8">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-[#FF61D2]/8 rounded-full flex items-center justify-center border border-[#FF61D2]/15 mb-6">
              <AlignLeft className="w-10 h-10 text-[#FF61D2]/30" />
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">No reviews yet</h2>
            <p className="text-[#94A3B8] text-sm max-w-xs">Log films and add a review to see them here.</p>
            {!isPublic && (
              <Link
                to="/search"
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#FF61D2] to-[#BFBCFC] text-[#0B0E14] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                <Film className="w-4 h-4" />
                Discover Movies
              </Link>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlignLeft className="w-10 h-10 text-[#FF61D2]/20 mb-4" />
            <p className="text-[#94A3B8] text-sm">No reviews match the selected filters.</p>
            <button
              onClick={() => { setRatingFilter(null); setYearFilter(null); }}
              className="mt-3 text-xs text-[#FF61D2]/70 hover:text-[#FF61D2] transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div>
              {paginated.map((review, idx) => (
                <div
                  key={review.logId}
                  className={`flex gap-5 py-6 ${idx < paginated.length - 1 ? "border-b border-[#BFBCFC]/8" : ""}`}
                >
                  {/* Poster */}
                  <div className="w-28 md:w-36 flex-none">
                    <ProfilePosterCard
                      movieId={review.movieId}
                      poster={review.poster}
                      title={review.title}
                      to={`/log/${review.logId}`}
                      isWatchedProp={true}
                      isLikedProp={review.filmIsLiked}
                      hasActivityProp={true}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pt-1">
                    <Link to={`/log/${review.logId}`} className="group/title">
                      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                        <span className="text-[#F8FAFC] font-bold text-lg leading-snug group-hover/title:text-[#BFBCFC] transition-colors">
                          {review.title}
                        </span>
                        <span className="text-[#94A3B8] text-sm">{review.releaseYear}</span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {review.rating > 0 && (
                        <div className="flex gap-[2px]">
                          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                            <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/15"}`} />
                          ))}
                        </div>
                      )}
                      {review.isLiked && (
                        <Heart className="w-3.5 h-3.5 text-[#FF61D2] fill-[#FF61D2]" />
                      )}
                      <span className="text-[#94A3B8]/70 text-xs">
                        {review.isRewatch ? "Rewatched" : "Watched"}{" "}
                        {new Date(review.watchedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <ReviewTextBlock text={review.reviewText} containsSpoilers={review.containsSpoilers} />

                    <div className="mt-3 flex items-center gap-2 text-[#94A3B8]/60 text-sm">
                      <Heart className={`w-4 h-4 ${(review.likes ?? 0) > 0 ? "fill-current text-[#FF61D2]/70" : ""}`} />
                      <span>{(review.likes ?? 0) > 0 ? `${review.likes} like${review.likes !== 1 ? "s" : ""}` : "No likes yet"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#BFBCFC]/15 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[#FF61D2]/20 border border-[#FF61D2]/40 text-[#FF61D2]"
                        : "border border-[#BFBCFC]/15 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/30"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#BFBCFC]/15 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

