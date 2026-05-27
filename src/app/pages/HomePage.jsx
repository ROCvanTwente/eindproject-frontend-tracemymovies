import { useHomeMovies } from '../hooks/useHomeMovies';
import { HeroSection } from '../components/HeroSection';
import { HomeLoading } from '../components/home/HomeLoading';
import { HomeError } from '../components/home/HomeError';
import { HomeMovieLists } from '../components/home/HomeMovieLists';

export function HomePage() {
    const { movies, loading, error } = useHomeMovies();

    if (loading) return <HomeLoading />;
    if (error) return <HomeError message={error} />;

    return (
        <>
            <HeroSection movies={movies.trending} />
            <HomeMovieLists 
                popularMovies={movies.popular}
                topRatedMovies={movies.topRated}
                upcomingMovies={movies.upcoming}
            />
        </>
    );
}