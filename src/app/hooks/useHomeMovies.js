import { useState, useEffect } from 'react';
import { getTrending, getPopular, getTopRated, getUpcoming } from '../services/tmdb';

export function useHomeMovies() {
    const [movies, setMovies] = useState({
        trending: [],
        popular: [],
        topRated: [],
        upcoming: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadMovies() {
            try {
                setLoading(true);
                setError(null);
                
                const [trending, popular, topRated, upcoming] = await Promise.all([
                    getTrending('week', 'NL'),
                    getPopular('NL'),
                    getTopRated('NL'),
                    getUpcoming('NL'),
                ]);

                if (isMounted) {
                    setMovies({
                        trending: trending?.slice(0, 5) || [],
                        popular: popular || [],
                        topRated: topRated || [],
                        upcoming: upcoming || [],
                    });
                }
            } catch (err) {
                console.error('Error loading movies:', err);
                if (isMounted) {
                    setError('Failed to fetch the latest movie data.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadMovies();

        return () => {
            isMounted = false;
        };
    }, []);

    return { movies, loading, error };
}