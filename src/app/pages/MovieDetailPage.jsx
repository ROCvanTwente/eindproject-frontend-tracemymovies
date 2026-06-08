import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import {
    Heart, Plus, DollarSign, Globe, Calendar,
    Clock, Eye, Share2, Loader2, User, ChevronRight, AlertCircle, RefreshCw,
    Play, X
} from "lucide-react";
import { MovieCarousel } from "../components/MovieCarousel";
import { ReviewSection } from "../components/review/ReviewSection";
import { WatchLogModal } from "../components/WatchLogModal";
import { ShareModal } from "../components/ShareModal";
import { MovieHero } from "../components/movie/MovieHero";
import { TrailerModal } from "../components/movie/TrailerModal";
import { MovieDetailLoading } from "../components/movie/MovieDetailLoading";
import { MovieDetailError } from "../components/movie/MovieDetailError";
import { MovieDetailContent } from "../components/movie/MovieDetailContent";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { useAuth } from "../context/AuthContext";

export function MovieDetailPage() {
    const { id } = useParams();
    const auth = useAuth();

    const token = useMemo(() => {
        return (
            auth?.token ||
            auth?.user?.token ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("auth_token") ||
            localStorage.getItem("token") ||
            sessionStorage.getItem("authToken") ||
            sessionStorage.getItem("auth_token") ||
            sessionStorage.getItem("token")
        );
    }, [auth]);

    const {
        movie,
        loading,
        error,
        recommendations,
        loadingRecommendations,
        isFavorite,
        isInWatchlist,
        isWatched,
        filmRating,
        watchCount,
        latestLogId,
        latestReviewText,
        latestWatchedDate,
        showWatchLogModal,
        setShowWatchLogModal,
        showShareModal,
        setShowShareModal,
        showTrailerModal,
        isAnimateIn,
        trailerVideo,
        openTrailer,
        closeTrailer,
        handleToggleWatch,
        handleToggleLike,
        handleToggleWatchlist,
        handleSetRating,
        retryFetch
    } = useMovieDetail(id, token);

    const [showEditLogModal, setShowEditLogModal] = useState(false);

    const preSelectedMovie = movie ? {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
    } : null;

    if (loading) return <MovieDetailLoading />;
    if (error) return <MovieDetailError onRetry={retryFetch} />;
    if (!movie) return null;

    return (
        <div className="min-h-screen bg-[#0B0E14]">
            <MovieHero movie={movie} />

            <MovieDetailContent
                movie={movie}
                loadingRecommendations={loadingRecommendations}
                recommendations={recommendations}
                isWatched={isWatched}
                isFavorite={isFavorite}
                filmRating={filmRating}
                watchCount={watchCount}
                onToggleWatch={handleToggleWatch}
                onToggleLike={handleToggleLike}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSetRating={handleSetRating}
                onOpenLog={() => setShowWatchLogModal(true)}
                onOpenEditLog={() => setShowEditLogModal(true)}
                onOpenTrailer={openTrailer}
                onOpenShare={() => setShowShareModal(true)}
                hasReview={!!latestReviewText}
                hasLog={!!latestLogId}
            />

            <TrailerModal
                isOpen={showTrailerModal}
                isAnimateIn={isAnimateIn}
                onClose={closeTrailer}
                videoKey={trailerVideo?.key}
            />

            {/* Log again modal */}
            <WatchLogModal
                isOpen={showWatchLogModal}
                onClose={() => setShowWatchLogModal(false)}
                preSelectedMovie={preSelectedMovie}
                preIsLiked={isFavorite}
                preRating={filmRating}
                preIsRewatch={watchCount > 0}
                preHasWatchedBefore={watchCount > 0}
                onSuccess={retryFetch}
            />

            {/* Edit / Add review modal */}
            <WatchLogModal
                isOpen={showEditLogModal}
                onClose={() => setShowEditLogModal(false)}
                preSelectedMovie={preSelectedMovie}
                preLogId={latestLogId}
                preReviewText={latestReviewText}
                preDate={latestWatchedDate || new Date().toISOString().split("T")[0]}
                preIsLiked={isFavorite}
                preRating={latestLogId ? filmRating : 0}
                onSuccess={retryFetch}
            />

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                movieTitle={movie.title}
                movieId={movie.id}
            />
        </div>
    );
}