import React, { useMemo } from "react";
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
        showWatchLogModal,
        setShowWatchLogModal,
        showShareModal,
        setShowShareModal,
        showTrailerModal,
        isAnimateIn,
        isSavingWatch,
        isSavingLike,
        isSavingWatchlist,
        trailerVideo,
        openTrailer,
        closeTrailer,
        handleToggleWatch,
        handleToggleLike,
        handleToggleWatchlist,
        retryFetch
    } = useMovieDetail(id, token);

    if (loading) return <MovieDetailLoading />;
    if (error) return <MovieDetailError onRetry={retryFetch} />;
    if (!movie) return null;

    return (
        <div className="min-h-screen bg-[#0B0E14]">
            <MovieHero
                movie={movie}
                isWatched={isWatched}
                isFavorite={isFavorite}
                isInWatchlist={isInWatchlist}
                isSavingWatch={isSavingWatch}
                isSavingLike={isSavingLike}
                isSavingWatchlist={isSavingWatchlist}
                onToggleWatch={handleToggleWatch}
                onToggleLike={handleToggleLike}
                onToggleWatchlist={handleToggleWatchlist}
                onOpenTrailer={openTrailer}
                onOpenShare={() => setShowShareModal(true)}
            />

            <MovieDetailContent
                movie={movie}
                loadingRecommendations={loadingRecommendations}
                recommendations={recommendations}
            />

            <TrailerModal
                isOpen={showTrailerModal}
                isAnimateIn={isAnimateIn}
                onClose={closeTrailer}
                videoKey={trailerVideo?.key}
            />

            <WatchLogModal
                isOpen={showWatchLogModal}
                onClose={() => setShowWatchLogModal(false)}
                movieTitle={movie.title}
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