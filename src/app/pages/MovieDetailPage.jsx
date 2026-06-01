import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { MovieOverview } from "../components/movie/MovieOverview";
import { CastSection } from "../components/movie/CastSection";
import { MovieHero } from "../components/movie/MovieHero";
import { MovieSidebar } from "../components/movie/MovieSidebar";
import { InfoCards } from "../components/movie/InfoCards";
import { RecommendationsSection } from "../components/movie/RecommendationsSection";

import { toast } from "sonner";
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

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] =
        useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatched, setIsWatched] = useState(false);

    const [showWatchLogModal, setShowWatchLogModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showTrailerModal, setShowTrailerModal] = useState(false);

    const [isAnimateIn, setIsAnimateIn] = useState(false);

    const [isSavingWatch, setIsSavingWatch] = useState(false);
    const [isSavingLike, setIsSavingLike] = useState(false);

    const API_URL =
        `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/GetMovieDetails`;

    const RECOMMENDATIONS_URL =
        `${import.meta.env.VITE_API_BASE_URL}/useractivity/recommendations?id=${id}`;

    const SAVE_WATCH_URL =
        `${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`;

    const REMOVE_WATCH_URL =
        `${import.meta.env.VITE_API_BASE_URL}/database/RemoveWatchActivity/${id}`;

    const TOGGLE_LIKE_URL =
        `${import.meta.env.VITE_API_BASE_URL}/database/ToggleLikeStatus`;

    const fetchUserStatus = useCallback(async () => {
        if (!token || !id) return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/database/GetMovieStatus/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.ok) {
                const status = await res.json();

                setIsWatched(status.isWatched || false);
                setIsFavorite(status.isFavorite || false);
                setIsInWatchlist(status.isInWatchlist || false);
            }
        } catch (err) {
            console.error("Kon status niet ophalen", err);
        }
    }, [id, token]);

    const fetchMovieData = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const res = await fetch(`${API_URL}?id=${id}`);

            if (!res.ok) {
                throw new Error("Fout bij laden");
            }

            const data = await res.json();

            setMovie(data);
        } catch (error) {
            setError(true);

            toast.error("Fout bij het laden van de filmgegevens");
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchRecommendations = useCallback(async () => {
        if (!id) return;

        setLoadingRecommendations(true);

        try {
            const response = await fetch(RECOMMENDATIONS_URL);

            if (!response.ok) {
                throw new Error("Recommendations ophalen mislukt");
            }

            const data = await response.json();

            setRecommendations(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingRecommendations(false);
        }
    }, [id, RECOMMENDATIONS_URL]);

    useEffect(() => {
        if (id) {
            fetchMovieData();
            fetchRecommendations();
        }
    }, [id, fetchMovieData, fetchRecommendations]);

    useEffect(() => {
        if (token && id) {
            fetchUserStatus();
        }
    }, [token, id, fetchUserStatus]);

    const trailerVideo = useMemo(() => {
        return (
            movie?.videos?.results?.find(
                (v) => v.type === "Trailer" && v.site === "YouTube"
            ) || movie?.videos?.results?.[0]
        );
    }, [movie]);

    const openTrailer = () => {
        if (trailerVideo?.key) {
            setShowTrailerModal(true);

            setTimeout(() => setIsAnimateIn(true), 10);
        } else {
            toast.info("Geen trailer beschikbaar");
        }
    };

    const closeTrailer = () => {
        setIsAnimateIn(false);

        setTimeout(() => setShowTrailerModal(false), 200);
    };

    const handleToggleWatch = async () => {
        if (!token) {
            toast.error("Je moet ingelogd zijn om films toe te voegen aan je lijst.");
            return;
        }

        setIsSavingWatch(true);

        try {
            if (isWatched) {
                const response = await fetch(REMOVE_WATCH_URL, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsWatched(false);

                    toast.success("Verwijderd van bekeken films");
                }
            } else {
                const response = await fetch(SAVE_WATCH_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        MovieId: parseInt(id),
                        AmountWatched: 1
                    })
                });

                if (response.ok) {
                    setIsWatched(true);

                    toast.success("Gemarkeerd als bekeken");
                }
            }
        } catch (err) {
            toast.error("Er is iets misgegaan.");
        } finally {
            setIsSavingWatch(false);
        }
    };

    const handleToggleLike = async () => {
        if (!token) {
            toast.error("Je moet ingelogd zijn.");
            return;
        }

        setIsSavingLike(true);

        const nextLikeState = !isFavorite;

        try {
            const response = await fetch(TOGGLE_LIKE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    MovieId: parseInt(id),
                    IsLiked: nextLikeState
                })
            });

            if (response.ok) {
                setIsFavorite(nextLikeState);

                toast.success(
                    nextLikeState
                        ? "Toegevoegd aan favorieten"
                        : "Verwijderd uit favorieten"
                );
            } else {
                toast.error("Er is iets misgegaan.");
            }
        } catch (err) {
            toast.error("Er is een netwerkfout opgetreden.");
        } finally {
            setIsSavingLike(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E14]">
                <Loader2 className="w-8 h-8 text-[#44FFFF] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0E14] px-4">
                <div className="bg-[#151921] border border-[#BFBCFC]/15 p-8 rounded-2xl max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />

                    <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">
                        Fout bij laden
                    </h2>

                    <button
                        onClick={fetchMovieData}
                        className="w-full flex items-center justify-center gap-2 bg-[#44FFFF] text-[#0B0E14] py-3 rounded-xl font-bold mt-4"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Probeer opnieuw
                    </button>
                </div>
            </div>
        );
    }

    if (!movie) return null;

    return (
        <div className="min-h-screen bg-[#0B0E14]">
            {/* Hero Section */}
            <MovieHero
                movie={movie}
                isWatched={isWatched}
                isFavorite={isFavorite}
                isInWatchlist={isInWatchlist}
                isSavingWatch={isSavingWatch}
                isSavingLike={isSavingLike}
                onToggleWatch={handleToggleWatch}
                onToggleLike={handleToggleLike}
                onToggleWatchlist={() => setIsInWatchlist(!isInWatchlist)}
                onOpenTrailer={openTrailer}
                onOpenShare={() => setShowShareModal(true)}
            />

            {/* Content */}
            <div className="container mx-auto px-4 max-w-7xl py-8 mt-6 md:mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Overview */}

                        <MovieOverview overview={movie.overview} />

                        {/* Cast */}
                        <CastSection cast={movie.credits?.cast || []} />

                        {/* Info Cards */}
                        <InfoCards movie={movie} />

                        {/* Recommendations */}
                        <div>
                            <h2 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">
                                Recommendations
                            </h2>

                            <RecommendationsSection
                                loading={loadingRecommendations}
                                recommendations={recommendations}
                            />
                        </div>

                        <ReviewSection movieId={movie.id} movieTitle={movie.title} />
                    </div>

                    {/* Sidebar */}
                    <MovieSidebar movie={movie} />
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailerModal && trailerVideo?.key && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md transition-opacity duration-200 ${isAnimateIn ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={closeTrailer}
                >
                    <div
                        className={`relative w-full max-w-5xl bg-[#151921] rounded-2xl overflow-hidden border border-[#BFBCFC]/20 shadow-2xl aspect-video transition-all duration-200 ${isAnimateIn ? "scale-100" : "scale-95"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeTrailer}
                            className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2.5 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <iframe
                            src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&rel=0`}
                            title="Trailer"
                            className="w-full h-full border-0"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

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

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
            {icon}

            <span className="text-[#94A3B8] text-xs">{label}</span>
        </div>

        <p className="text-[#F8FAFC] font-data text-sm">{value}</p>
    </div>
);