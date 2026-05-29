// TMDB API Service
const TMDB_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key from https://www.themoviedb.org/settings/api
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
// Check if API key is configured
const isApiKeyConfigured = TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_API_KEY_HERE';
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
    const data = await fetchFromTMDB(`/trending/movie/${timeWindow}`, { region });
    return data?.results || getMockMovies();
}
// Get popular movies
export async function getPopular(region = 'NL', page = 1) {
    const data = await fetchFromTMDB('/movie/popular', { region, page });
    return data?.results || getMockMovies();
}
// Get top rated movies
export async function getTopRated(region = 'NL', page = 1) {
    const data = await fetchFromTMDB('/movie/top_rated', { region, page });
    return data?.results || getMockMovies();
}
// Get upcoming movies
export async function getUpcoming(region = 'NL', page = 1) {
    const data = await fetchFromTMDB('/movie/upcoming', { region, page });
    return data?.results || getMockMovies();
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
// Mock data
function getMockMovies() {
    return [
        {
            id: 1,
            title: 'The Shawshank Redemption',
            original_title: 'The Shawshank Redemption',
            overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
            vote_average: 8.7,
            vote_count: 25000,
            release_date: '1994-09-23',
            genre_ids: [18, 80],
            popularity: 95.5,
        },
        {
            id: 2,
            title: 'The Godfather',
            original_title: 'The Godfather',
            overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
            backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
            vote_average: 8.7,
            vote_count: 18500,
            release_date: '1972-03-14',
            genre_ids: [18, 80],
            popularity: 92.3,
        },
        {
            id: 3,
            title: 'The Dark Knight',
            original_title: 'The Dark Knight',
            overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
            poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            backdrop_path: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
            vote_average: 8.5,
            vote_count: 30000,
            release_date: '2008-07-16',
            genre_ids: [28, 80, 18],
            popularity: 98.7,
        },
        {
            id: 4,
            title: 'Inception',
            original_title: 'Inception',
            overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
            poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
            backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
            vote_average: 8.4,
            vote_count: 32000,
            release_date: '2010-07-15',
            genre_ids: [28, 878, 53],
            popularity: 94.2,
        },
        {
            id: 5,
            title: 'The Matrix',
            original_title: 'The Matrix',
            overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
            poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            backdrop_path: '/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
            vote_average: 8.2,
            vote_count: 24000,
            release_date: '1999-03-30',
            genre_ids: [28, 878],
            popularity: 91.1,
        },
        {
            id: 6,
            title: 'Pulp Fiction',
            original_title: 'Pulp Fiction',
            overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
            poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
            backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
            vote_average: 8.5,
            vote_count: 27000,
            release_date: '1994-09-10',
            genre_ids: [80, 53],
            popularity: 88.4,
        },
        {
            id: 7,
            title: 'Forrest Gump',
            original_title: 'Forrest Gump',
            overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
            poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
            backdrop_path: '/7c9UVPPiTPltouxRVY6N9uUaHwS.jpg',
            vote_average: 8.4,
            vote_count: 26000,
            release_date: '1994-06-23',
            genre_ids: [18, 10749],
            popularity: 87.6,
        },
        {
            id: 8,
            title: 'Goodfellas',
            original_title: 'Goodfellas',
            overview: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
            poster_path: '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
            backdrop_path: '/sw7mordbZxgITU877yTpZCud90M.jpg',
            vote_average: 8.5,
            vote_count: 12000,
            release_date: '1990-09-12',
            genre_ids: [18, 80],
            popularity: 85.3,
        },
    ];
}
function getMockMovieDetail() {
    return {
        id: 1,
        title: 'Inception',
        original_title: 'Inception',
        tagline: 'Your mind is the scene of the crime',
        overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
        poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        release_date: '2010-07-15',
        runtime: 148,
        vote_average: 8.4,
        vote_count: 32000,
        budget: 160000000,
        revenue: 825532764,
        status: 'Released',
        genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
        original_language: 'en',
        production_countries: [{ name: 'United States' }, { name: 'United Kingdom' }],
        credits: {
            cast: [
                { id: 1, name: 'Leonardo DiCaprio', character: 'Cobb', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
                { id: 2, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: '/z2FA8js799xqtfiFjBTicFYdfk.jpg' },
            ],
            crew: [
                { id: 1, name: 'Christopher Nolan', job: 'Director' },
                { id: 2, name: 'Christopher Nolan', job: 'Writer' },
            ],
        },
    };
}
