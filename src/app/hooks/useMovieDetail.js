import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useRefresh } from "../context/RefreshContext";

export function useMovieDetail(id, token) {
    const { triggerRefresh } = useRefresh();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [hasLogEntries, setHasLogEntries] = useState(false);

    const [showWatchLogModal, setShowWatchLogModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showTrailerModal, setShowTrailerModal] = useState(false);

    const [isAnimateIn, setIsAnimateIn] = useState(false);

    const [isSavingWatch, setIsSavingWatch] = useState(false);
    const [isSavingLike, setIsSavingLike] = useState(false);
    const [isSavingWatchlist, setIsSavingWatchlist] = useState(false);

    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/GetMovieDetails`;
    const RECOMMENDATIONS_URL = `${import.meta.env.VITE_API_BASE_URL}/useractivity/recommendations?id=${id}`;
    const SAVE_WATCH_URL = `${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`;
    const REMOVE_WATCH_URL = `${import.meta.env.VITE_API_BASE_URL}/database/RemoveWatchActivity/${id}`;
    const TOGGLE_LIKE_URL = `${import.meta.env.VITE_API_BASE_URL}/database/ToggleLikeStatus`;
    const TOGGLE_WATCHLIST_URL = `${import.meta.env.VITE_API_BASE_URL}/database/ToggleWatchlistStatus`;

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
                setHasLogEntries(status.hasLogEntries || false);
            }
        } catch (err) {
            console.error("Could not fetch status", err);
        }
    }, [id, token]);

    const fetchMovieData = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const res = await fetch(`${API_URL}?id=${id}`);
            if (!res.ok) throw new Error("Error loading");
            const data = await res.json();
            setMovie(data);
        } catch (error) {
            setError(true);
            toast.error("Error loading movie details");
        } finally {
            setLoading(false);
        }
    }, [id, API_URL]);

    const fetchRecommendations = useCallback(async () => {
        if (!id) return;
        setLoadingRecommendations(true);

        try {
            const response = await fetch(RECOMMENDATIONS_URL);
            if (!response.ok) throw new Error("Fetching recommendations failed");
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
            toast.info("No trailer available");
        }
    };

    const closeTrailer = () => {
        setIsAnimateIn(false);
        setTimeout(() => setShowTrailerModal(false), 200);
    };

    const handleToggleWatch = async () => {
        if (!token) {
            toast.error("You must be logged in to add movies to your list.");
            return;
        }

        // Can't unwatch via this button if diary log entries exist
        if (isWatched && hasLogEntries) {
            toast.error(`'${movie?.title}' cannot be removed, there is activity on it.`);
            return;
        }

        setIsSavingWatch(true);

        try {
            if (isWatched) {
                const response = await fetch(REMOVE_WATCH_URL, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    setIsWatched(false);
                    triggerRefresh();
                    toast.success("Removed from watched movies");
                }
            } else {
                const response = await fetch(SAVE_WATCH_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ MovieId: parseInt(id) })
                });

                if (response.ok) {
                    setIsWatched(true);
                    triggerRefresh();
                    toast.success("Marked as watched");
                }
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setIsSavingWatch(false);
        }
    };

    const handleToggleLike = async () => {
        if (!token) {
            toast.error("You must be logged in.");
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
                triggerRefresh();
                toast.success(
                    nextLikeState ? "Added to favorites" : "Removed from favorites"
                );
            } else {
                toast.error("Something went wrong.");
            }
        } catch (err) {
            toast.error("A network error occurred.");
        } finally {
            setIsSavingLike(false);
        }
    };

    const handleToggleWatchlist = async () => {
        if (!token) {
            toast.error("You must be logged in.");
            return;
        }

        setIsSavingWatchlist(true);
        const nextWatchlistState = !isInWatchlist;

        try {
            const response = await fetch(TOGGLE_WATCHLIST_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    MovieId: parseInt(id),
                    IsInWatchlist: nextWatchlistState
                })
            });

            if (response.ok) {
                setIsInWatchlist(nextWatchlistState);
                toast.success(
                    nextWatchlistState ? "Added to watchlist" : "Removed from watchlist"
                );
            } else {
                toast.error("Something went wrong.");
            }
        } catch (err) {
            toast.error("A network error occurred.");
        } finally {
            setIsSavingWatchlist(false);
        }
    };

    return {
        movie,
        loading,
        error,
        recommendations,
        loadingRecommendations,
        isFavorite,
        isInWatchlist,
        isWatched,
        hasLogEntries,
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
        retryFetch: fetchMovieData
    };
}
