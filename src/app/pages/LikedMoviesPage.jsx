import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";

const LikedMoviesPage = () => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  const token = useMemo(() => {
    return (
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token")
    );
  }, [auth]);

  useEffect(() => {
    const fetchAllLikedMovies = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/GetLikedMovies`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Kon gelikete films niet ophalen");
        }

        const data = await response.json();
        setLikedMovies(data);
      } catch (error) {
        console.error(error);
        toast.error("Fout bij het laden van je likes");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllLikedMovies();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#BFBCFC]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      
      {/* Header */}
      <div className="bg-[#151921]/70 backdrop-blur-xl border-b border-[#BFBCFC]/15 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">
            Your Liked Movies
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-7xl py-6 md:py-8">
        {likedMovies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#94A3B8]">
              You don't have any liked movies yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {likedMovies.map((movie) => (
              <Link
                key={movie._id}
                to={`/movie/${movie.movieId}`}
                className="group transition-all duration-300 hover:scale-105"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover rounded-2xl shadow-xl border border-white/5"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedMoviesPage;