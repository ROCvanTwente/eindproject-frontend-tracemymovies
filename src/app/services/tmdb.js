// TMDB API Service
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;
// Check if API key is configured
const isApiKeyConfigured = TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_API_KEY_HERE';
const DOTNET_BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
// Export for banner component
export const isUsingMockData = !isApiKeyConfigured;
// Fetch from TMDB API
async function fetchFromTMDB(endpoint, params = {}) {
    // If API key not configured, silently return null to use mock data
    if (!isApiKeyConfigured) {
        return null;
    }
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
        if (value)
            url.searchParams.append(key, String(value));
    });
    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            // Handle specific error codes silently
            if (response.status === 401 || response.status === 404) {
                return null;
            }
            // Only log actual errors
            console.error(`TMDB API Error: ${response.status}`);
            return null;
        }
        return await response.json();
    }
    catch (error) {
        // Silently fail and use mock data
        return null;
    }
}
// Get image URL
export function getImageUrl(path, size = 'original') {
    if (!path)
        return 'https://via.placeholder.com/500x750/151921/BFBCFC?text=No+Poster';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
// Get trending movies
export async function getTrending(timeWindow = 'week', region = 'NL') {
    try {
        const response = await fetch(`${DOTNET_BACKEND_URL}/Trending`);
        if (!response.ok) return getMockMovies();
        return await response.json();
    } catch (error) {
        return getMockMovies();
    }
}

// Get popular movies
export async function getPopular(region = 'NL', page = 1) {
    try {
        const response = await fetch(`${DOTNET_BACKEND_URL}/Popular`);
        if (!response.ok) return getMockMovies();
        return await response.json();
    } catch (error) {
        return getMockMovies();
    }
}

// Get top rated movies
export async function getTopRated(region = 'NL', page = 1) {
    try {
        const response = await fetch(`${DOTNET_BACKEND_URL}/TopRated`);
        if (!response.ok) return getMockMovies();
        return await response.json();
    } catch (error) {
        return getMockMovies();
    }
}

// Get upcoming movies
export async function getUpcoming(region = 'NL', page = 1) {
    try {
        const response = await fetch(`${DOTNET_BACKEND_URL}/Upcoming`);
        if (!response.ok) return getMockMovies();
        return await response.json();
    } catch (error) {
        return getMockMovies();
    }
}
// Get now playing movies
export async function getNowPlaying(region = 'NL', page = 1) {
    const data = await fetchFromTMDB('/movie/now_playing', { region, page });
    return data?.results || getMockMovies();
}
// Get movie details
export async function getMovieDetails(movieId) {
    const data = await fetchFromTMDB(`/movie/${movieId}`, {
        append_to_response: 'credits,videos,watch/providers,keywords,release_dates,alternative_titles,similar',
    });
    return data || getMockMovieDetail();
}
// Search movies
export async function searchMovies(query, page = 1, filters = {}) {
    const params = { query, page, ...filters };
    const data = await fetchFromTMDB('/search/movie', params);
    return data?.results || getMockMovies();
}
// Discover movies with filters
export async function discoverMovies(filters = {}) {
    const params = {
        page: filters.page || 1,
        sort_by: filters.sortBy || 'popularity.desc',
        'vote_average.gte': filters.minRating,
        'vote_average.lte': filters.maxRating,
        with_genres: filters.genres?.join(','),
        with_watch_providers: filters.providers?.join('|'),
        watch_region: filters.region || 'NL',
        primary_release_year: filters.year,
        with_original_language: filters.language,
        'with_runtime.gte': filters.minRuntime,
        'with_runtime.lte': filters.maxRuntime,
    };
    const data = await fetchFromTMDB('/discover/movie', params);
    return data?.results || getMockMovies();
}
// Get similar movies
export async function getSimilarMovies(movieId, page = 1) {
    const data = await fetchFromTMDB(`/movie/${movieId}/similar`, { page });
    return data?.results || getMockMovies().slice(0, 6);
}
// Get genre list
export async function getGenres() {
    const data = await fetchFromTMDB('/genre/movie/list');
    return data?.genres || [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drama' },
        { id: 27, name: 'Horror' },
        { id: 878, name: 'Sci-Fi' },
        { id: 53, name: 'Thriller' },
        { id: 10749, name: 'Romance' },
    ];
}
// Get movie details with extra information
export async function getMovieDetailsExtended(movieId) {
    const data = await fetchFromTMDB(`/movie/${movieId}`, {
        append_to_response: 'credits,videos,recommendations,watch/providers,reviews',
    });
    if (!data) {
        return {
            movie: getMockMovies()[0],
            credits: { cast: [], crew: [] },
            videos: { results: [] },
            recommendations: { results: getMockMovies().slice(0, 6) },
            watchProviders: {},
            reviews: { results: [] },
        };
    }
    return {
        movie: data,
        credits: data.credits || { cast: [], crew: [] },
        videos: data.videos || { results: [] },
        recommendations: data.recommendations || { results: [] },
        watchProviders: data['watch/providers'] || {},
        reviews: data.reviews || { results: [] },
    };
}
// Get watch providers for a movie
export async function getWatchProviders(movieId, region = 'NL') {
    const data = await fetchFromTMDB(`/movie/${movieId}/watch/providers`);
    if (!data || !data.results || !data.results[region]) {
        return {
            flatrate: [
                { provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png' },
                { provider_id: 337, provider_name: 'Disney+', logo_path: '/disney.png' },
                { provider_id: 119, provider_name: 'Amazon Prime Video', logo_path: '/prime.png' },
            ],
            rent: [],
            buy: [],
        };
    }
    const providers = data.results[region];
    return {
        flatrate: providers.flatrate || [],
        rent: providers.rent || [],
        buy: providers.buy || [],
    };
}