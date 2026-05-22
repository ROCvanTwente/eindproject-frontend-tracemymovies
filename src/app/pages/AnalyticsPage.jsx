import { useEffect, useState } from "react";

import {
  Film,
  Star,
  TrendingUp,
  Sparkles,
  Clock,
  Heart,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AnalyticsPage() {
  const yearlyData = [
    { year: "2020", movies: 45 },
    { year: "2021", movies: 62 },
    { year: "2022", movies: 58 },
    { year: "2023", movies: 71 },
    { year: "2024", movies: 38 },
  ];

  const genreData = [
    { genre: "Sci-Fi", count: 78, color: "#BFBCFC" },
    { genre: "Action", count: 65, color: "#BFBCFC" },
    { genre: "Drama", count: 52, color: "#BFBCFC" },
    { genre: "Thriller", count: 41, color: "#BFBCFC" },
    { genre: "Comedy", count: 38, color: "#BFBCFC" },
  ];

  const favoriteMovies = [
    {
      id: 1,
      title: "Inception",
      poster: "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
      rating: 9,
      year: "2010",
    },
    {
      id: 2,
      title: "The Matrix",
      poster: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      rating: 8,
      year: "1999",
    },
    {
      id: 3,
      title: "Interstellar",
      poster: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      rating: 9,
      year: "2014",
    },
    {
      id: 4,
      title: "The Dark Knight",
      poster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      rating: 10,
      year: "2008",
    },
  ];

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/UserActivity/Recent`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          console.error("Unauthorized - token invalid or expired");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }

        const data = await response.json();

        setRecentActivity(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    fetchRecentActivity();
  }, []);

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 bg-[#44FFFF]/10 rounded-xl mb-2 md:mb-3">
            <Sparkles className="w-6 md:w-7 h-6 md:h-7 text-[#44FFFF]" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1 md:mb-2">
            Movie DNA
          </h1>

          <p className="text-[#94A3B8] text-sm md:text-base">
            Your personal cinematic analytics and insights
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">

          {/* Total Watched */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Film className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Total Watched
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                274
              </p>

              <div className="flex items-center gap-1">
                <span className="text-[#44FFFF] text-xs font-data font-medium">
                  +18 this month
                </span>

                <TrendingUp className="w-3 h-3 text-[#44FFFF]" />
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Star
                    className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]"
                    fill="#BFBCFC"
                  />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Average Score
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                7.8
              </p>

              <p className="text-[#44FFFF] text-xs font-data font-medium">
                out of 10 ★
              </p>
            </div>
          </div>

          {/* Watch Streak */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Watch Streak
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                12
              </p>

              <p className="text-[#44FFFF] text-xs font-data font-medium">
                days in a row
              </p>
            </div>
          </div>

          {/* Total Hours */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Total Hours
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                548
              </p>

              <p className="text-[#44FFFF] text-xs font-data font-medium">
                ≈ 22.8 days
              </p>
            </div>
          </div>
        </div>

        {/* Favorite Films */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#FF61D2]" fill="#FF61D2" />
            Favorite Films
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {favoriteMovies.map((movie) => (
              <div key={movie.id} className="relative group">
                <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg overflow-hidden hover:border-[#FF61D2]/50 transition-all hover:scale-105">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />

                  <div className="p-2">
                    <h3 className="text-[#F8FAFC] font-medium text-xs mb-1 truncate">
                      {movie.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-[#94A3B8] text-xs">
                        {movie.year}
                      </span>

                      <span className="text-[#44FFFF] font-data text-xs font-bold">
                        ★ {movie.rating}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#44FFFF]" />
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
            <p className="text-[#94A3B8] text-sm md:text-base">
              No recent activity found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3 hover:border-[#BFBCFC]/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[#F8FAFC] font-medium text-sm">
                      {activity.movieTitle}
                    </h4>

                    <span className="text-[#44FFFF] font-data text-xs font-bold">
                      ★ {Number(activity.tmdbRating).toFixed(1)}/10
                    </span>
                  </div>

                  <p className="text-[#94A3B8] text-xs mb-1.5 line-clamp-2">
                    {activity.overview}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-[#94A3B8] text-xs">
                      {new Date(activity.watchedDate).toLocaleDateString()}
                    </p>

                    <p className="text-[#44FFFF] text-xs font-data">
                      Watched {activity.amountWatched}x
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">

          {/* Favorite Genre */}
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Favorite Genre
            </h2>

            <div className="space-y-3">
              {genreData.map((item) => (
                <div key={item.genre}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#F8FAFC] text-sm">
                      {item.genre}
                    </span>

                    <span className="text-[#44FFFF] text-sm font-bold">
                      {item.count}
                    </span>
                  </div>

                  <div className="h-2 bg-[#0B0E14] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.count / 78) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Actor */}
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Favorite Actor
            </h2>

            <div className="space-y-2">
              {[
                { name: "Leonardo DiCaprio", movies: 12 },
                { name: "Tom Hanks", movies: 10 },
                { name: "Christian Bale", movies: 9 },
                { name: "Scarlett Johansson", movies: 8 },
              ].map((actor, index) => (
                <div
                  key={actor.name}
                  className="flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-[#F8FAFC] text-sm">
                      {actor.name}
                    </p>

                    <p className="text-[#44FFFF] text-xs">
                      {actor.movies} movies
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Director */}
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Favorite Director
            </h2>

            <div className="space-y-2">
              {[
                { name: "Christopher Nolan", movies: 8 },
                { name: "Quentin Tarantino", movies: 7 },
                { name: "Martin Scorsese", movies: 6 },
                { name: "Steven Spielberg", movies: 5 },
              ].map((director, index) => (
                <div
                  key={director.name}
                  className="flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-[#F8FAFC] text-sm">
                      {director.name}
                    </p>

                    <p className="text-[#44FFFF] text-xs">
                      {director.movies} movies
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Watched Per Year */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">

            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Movies Watched Per Year
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yearlyData}>
                <defs>
                  <linearGradient
                    id="yearlyBarGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#BFBCFC" stopOpacity={1} />
                    <stop offset="100%" stopColor="#44FFFF" stopOpacity={0.6} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#151921"
                  opacity={0.3}
                />

                <XAxis dataKey="year" stroke="#94A3B8" />

                <YAxis stroke="#94A3B8" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151921",
                    border: "1px solid rgba(191, 188, 252, 0.3)",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                  }}
                />

                <Bar
                  dataKey="movies"
                  fill="url(#yearlyBarGradient)"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}