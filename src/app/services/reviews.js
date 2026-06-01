const API_BASE_URL = "https://localhost:7245/api/Review";

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

export const deleteReview = async (reviewId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/DeleteReview?id=${reviewId}`, {
            method: "DELETE",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
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

export const getReviewById = async (reviewId, token) => {
    const candidates = [
        `${API_BASE_URL}/GetReview?id=${reviewId}`,
        `${API_BASE_URL}/GetReviewById?id=${reviewId}`,
        `${API_BASE_URL}/Get?id=${reviewId}`,
        `${API_BASE_URL}/GetReview?reviewId=${reviewId}`,
        `${API_BASE_URL}/Get?reviewId=${reviewId}`,
    ];

    for (const url of candidates) {
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                // try next candidate on 404 or other non-ok
                continue;
            }

            try {
                return await response.json();
            } catch (e) {
                try {
                    const text = await response.text();
                    return text;
                } catch (_) {
                    return null;
                }
            }
        } catch (err) {
            continue;
        }
    }

    console.error("Fout bij ophalen review: geen endpoint reageerde met succes");
    return null;
};

export const toggleLikeReview = async (reviewId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ToggleLike`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ reviewId }),
        });
        let payload = null;
        try {
            payload = await response.json();
        } catch (e) {
            // non-json response
            try {
                payload = await response.text();
            } catch (_) {
                payload = null;
            }
        }

        

        if (!response.ok) {
            throw new Error("Kon like niet togglen");
        }

        return payload;
    } catch (error) {
        console.error("Fout bij togglen like:", error);
        return null;
    }
};

export const addLikeReview = async (reviewId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/AddLike?reviewId=${reviewId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        let payload = null;
        try {
            payload = await response.json();
        } catch (e) {
            try {
                payload = await response.text();
            } catch (_) {
                payload = null;
            }
        }

        

        if (!response.ok) {
            throw new Error("Kon like niet toevoegen");
        }

        return payload;
    } catch (error) {
        console.error("Fout bij toevoegen like:", error);
        return null;
    }
};

export const removeLikeReview = async (reviewId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/RemoveLike?reviewId=${reviewId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        let payload = null;
        try {
            payload = await response.json();
        } catch (e) {
            try {
                payload = await response.text();
            } catch (_) {
                payload = null;
            }
        }

        if (!response.ok) {
            throw new Error("Kon like niet verwijderen");
        }

        return payload;
    } catch (error) {
        console.error("Fout bij verwijderen like:", error);
        return null;
    }
};

export const reportReview = async (reviewId, reason, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ReportReview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ reviewId, reason }),
        });

        if (!response.ok) {
            throw new Error("Kon review niet rapporteren");
        }

        try {
            return await response.json();
        } catch {
            return true;
        }
    } catch (error) {
        console.error("Fout bij rapporteren review:", error);
        return null;
    }
};

export const updateReview = async (reviewId, reviewData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/EditReview?id=${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error("Could not update review");
        }

        try {
            return await response.json();
        } catch (e) {
            try {
                return await response.text();
            } catch (_) {
                return true;
            }
        }
    } catch (error) {
        console.error("Error updating review:", error);
        return null;
    }
};