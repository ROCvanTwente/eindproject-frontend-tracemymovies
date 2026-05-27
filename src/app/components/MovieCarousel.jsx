import * as ReactSlick from 'react-slick';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { NextArrow, PrevArrow } from './carousel/CarouselArrows';
import { MovieCarouselCard } from './carousel/MovieCarouselCard';

// Safely handle different module bundles for react-slick
const SliderComponent = ReactSlick.default?.default ?? ReactSlick.default ?? ReactSlick;

export function MovieCarousel({ title, movies, showRanking = false, showReleaseDate = false }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLike = (e, movieId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Like movie:', movieId);
    };

    const handleLog = (e, movieId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Log movie:', movieId);
    };

    const handleMovieClick = (e, movieId) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login');
        } else {
            navigate(`/movie/${movieId}`);
        }
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1536, settings: { slidesToShow: 5, slidesToScroll: 2 } },
            { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 2 } },
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
        ],
    };

    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-heading text-[#F8FAFC] mb-3 md:mb-4 px-2 md:px-4">
                {title}
            </h2>
            <div className="relative px-4 md:px-8">
                <SliderComponent {...settings}>
                    {movies.map((movie, index) => (
                        <MovieCarouselCard 
                            key={movie.id}
                            movie={movie}
                            index={index}
                            showRanking={showRanking}
                            showReleaseDate={showReleaseDate}
                            onMovieClick={handleMovieClick}
                            onLike={handleLike}
                            onLog={handleLog}
                        />
                    ))}
                </SliderComponent>
            </div>
        </div>
    );
}