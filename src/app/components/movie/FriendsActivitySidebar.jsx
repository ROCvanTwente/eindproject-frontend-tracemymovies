import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function FriendsActivitySidebar({ movieId }) {
  const auth = useAuth();
  const [activity, setActivity] = useState([]);
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
    if (!token || !movieId) { setLoading(false); return; }
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friend/GetFriendsActivityForMovie/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setActivity(await res.json());
      } catch (e) {
        console.error("Error fetching friends activity:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [movieId, token]);

  if (loading || activity.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] ml-4">
          Your Friends
        </h2>
        <Link
          to={`/movie/${movieId}/friends-activity`}
          className="text-[11px] text-[#94A3B8] hover:text-[#BFBCFC] transition-colors font-bold uppercase tracking-widest"
        >
          All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {activity.slice(0, 4).map((f) => (
          <Link
            key={f.userId}
            to={`/log/${f.logId}`}
            className="group flex flex-col items-center gap-1.5 text-center"
          >
            {f.profileImageBase64 ? (
              <img
                src={`data:image/jpeg;base64,${f.profileImageBase64}`}
                alt={f.userName}
                className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-[#44FFFF] transition-colors"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] flex items-center justify-center border-2 border-transparent group-hover:border-[#44FFFF] transition-colors">
                <span className="text-[#0B0E14] font-bold text-base">{f.userName?.charAt(0).toUpperCase() ?? "?"}</span>
              </div>
            )}
            {f.rating > 0 ? (
              <div className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`w-2.5 h-2.5 ${
                        n <= f.rating
                          ? "text-[#44FFFF] fill-[#44FFFF]"
                          : "text-[#94A3B8]/20"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  {[6, 7, 8, 9, 10].map((n) => (
                    <Star
                      key={n}
                      className={`w-2.5 h-2.5 ${
                        n <= f.rating
                          ? "text-[#44FFFF] fill-[#44FFFF]"
                          : "text-[#94A3B8]/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-[10px] text-[#94A3B8]/40">No rating</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
