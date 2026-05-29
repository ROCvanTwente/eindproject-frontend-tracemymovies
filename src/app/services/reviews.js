const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getReviewsVoorFilm = async (movieId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/GetReviews?movieId=${movieId}`);
        if (!response.ok) {
            throw new Error("Kon reviews niet ophalen");
        }
        return await response.json();
    } catch (error) {
        console.error("Fout bij ophalen reviews:", error);
        return [];
    }
};

export const addReview = async (reviewData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/AddReview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error("Kon review niet plaatsen");
        }

        return await response.json();
    } catch (error) {
        console.error("Fout bij plaatsen review:", error);
        return null;
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/DeleteReview?id=${reviewId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Kon review niet verwijderen");
        }

        return true;
    } catch (error) {
        console.error("Fout bij verwijderen review:", error);
        return false;
    }
};