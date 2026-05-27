import { MovieCarousel } from '../MovieCarousel';

export function HomeMovieLists({ popularMovies, topRatedMovies, upcomingMovies }) {
    return (
        <div className="container mx-auto py-6 md:py-8 lg:py-10 px-4 max-w-7xl">
            <MovieCarousel 
                title="Popular Now" 
                movies={popularMovies} 
            />
            <MovieCarousel 
                title="Top Rated" 
                movies={topRatedMovies} 
                showRanking={true} 
            />
            <MovieCarousel 
                title="Coming Soon" 
                movies={upcomingMovies} 
                showReleaseDate={true} 
            />
        </div>
    );
}