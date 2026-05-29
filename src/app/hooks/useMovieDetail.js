import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";

export function useMovieDetail(id, token) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatched, setIsWatched] = useState(false);

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
            if (!res.ok) throw new Error("Fout bij laden");
            const data = await res.json();
            setMovie(data);
        } catch (error) {
            setError(true);
            toast.error("Fout bij het laden van de filmgegevens");
        } finally {
            setLoading(false);
        }
    }, [id, API_URL]);

    const fetchRecommendations = useCallback(async () => {
        if (!id) return;
        setLoadingRecommendations(true);

        try {
            const response = await fetch(RECOMMENDATIONS_URL);
            if (!response.ok) throw new Error("Recommendations ophalen mislukt");
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
                    headers: { Authorization: `Bearer ${token}` }
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
                    nextLikeState ? "Toegevoegd aan favorieten" : "Verwijderd uit favorieten"
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

    const handleToggleWatchlist = async () => {
        if (!token) {
            toast.error("Je moet ingelogd zijn.");
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
                    nextWatchlistState ? "Toegevoegd aan watchlist" : "Verwijderd uit watchlist"
                );
            } else {
                toast.error("Er is iets misgegaan.");
            }
        } catch (err) {
            toast.error("Er is een netwerkfout opgetreden.");
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
