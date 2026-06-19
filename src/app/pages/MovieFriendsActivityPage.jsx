import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Star, RotateCw, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function MovieFriendsActivityPage() {
  const { id } = useParams();
  const auth = useAuth();
  const [activity, setActivity] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => {
    return (
      auth?.token || auth?.user?.token || localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") || localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") || sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token")
    );
  }, [auth]);

  useEffect(() => {
    if (!token || !id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activityRes, movieRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetFriendsActivityForMovie/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/GetMovieDetails?id=${id}`),
        ]);
        if (activityRes.ok) setActivity(await activityRes.json());
        if (movieRes.ok) setMovie(await movieRes.json());
      } catch (e) {
        console.error("Error fetching friends activity:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-[#BFBCFC]/10 rounded-full" />
          <div className="absolute inset-0 border-[3px] border-transparent border-t-[#BFBCFC] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <div className="container mx-auto px-4 max-w-3xl py-8">
        <Link
          to={`/movie/${id}`}
          className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] text-sm mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {movie?.title ?? "movie"}
        </Link>

        <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC] leading-tight mb-1">
          Friends Activity
        </h1>
        {movie?.title && (
          <p className="text-[#94A3B8] text-sm mb-8">{movie.title}</p>
        )}

        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-[#BFBCFC]/8 rounded-full flex items-center justify-center border border-[#BFBCFC]/15 mb-5">
              <Users className="w-9 h-9 text-[#BFBCFC]/25" />
            </div>
            <p className="text-[#F8FAFC] font-semibold text-lg mb-1">No activity yet</p>
            <p className="text-[#94A3B8] text-sm">None of your friends have logged this film yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activity.map((f) => (
              <Link
                key={f.userId}
                to={`/log/${f.logId}`}
                className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#151921]/80 border border-transparent hover:border-[#BFBCFC]/10 transition-all group"
              >
                {f.profileImageBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${f.profileImageBase64}`}
                    alt={f.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-[#44FFFF] transition-colors flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] flex items-center justify-center border-2 border-transparent group-hover:border-[#44FFFF] transition-colors flex-shrink-0">
                    <span className="text-[#0B0E14] font-bold text-base">{f.userName?.charAt(0).toUpperCase() ?? "?"}</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#F8FAFC] group-hover:text-[#BFBCFC] transition-colors truncate">{f.userName}</p>
                  <p className="text-xs text-[#94A3B8]/60 mt-0.5">
                    {f.isRewatch ? "Rewatched" : "Watched"}{" "}
                    {new Date(f.watchedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {f.isRewatch && <RotateCw className="w-4 h-4 text-[#44FFFF]" />}
                  {f.rating > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#44FFFF] fill-[#44FFFF]" />
                      <span className="text-sm font-bold text-[#44FFFF]">{f.rating}/10</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#94A3B8]/40">No rating</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
