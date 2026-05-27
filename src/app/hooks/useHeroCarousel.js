import { useState, useEffect } from 'react';

export function useHeroCarousel(movies) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [offsetX, setOffsetX] = useState(0); // Tracks drag offset in pixels
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!movies || movies.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [movies?.length, currentIndex]);

    const goToPrevious = () => {
        if (!movies || movies.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

    const goToNext = () => {
        if (!movies || movies.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const handleDragStart = (clientX, target) => {
        // Prevent sliding animations if the user clicks interactive layout buttons
        if (target.closest('button') || target.closest('a')) return;
        setStartX(clientX);
        setIsDragging(true);
        setOffsetX(0);
    };

    const handleDragMove = (clientX) => {
        if (!isDragging) return;
        setOffsetX(clientX - startX);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        
        const swipeThreshold = 100; // Pixels required to lock onto a new slide change
        if (offsetX < -swipeThreshold) {
            goToNext();
        } else if (offsetX > swipeThreshold) {
            goToPrevious();
        }
        
        setIsDragging(false);
        setOffsetX(0);
    };

    return {
        currentIndex,
        setCurrentIndex,
        offsetX,
        isDragging,
        goToPrevious,
        goToNext,
        handleDragStart,
        handleDragMove,
        handleDragEnd
    };
}