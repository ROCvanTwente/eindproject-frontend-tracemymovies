import { useEffect, useMemo, useState } from "react";
import { List, Plus, Film } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

function ListPosterCollage({ posters = [] }) {
  const slots = Array.from({ length: 4 }, (_, i) => posters[i] ?? null);

  return (
    <div className="flex h-32 md:h-36 gap-[2px] bg-[#0B0E14] overflow-hidden">
      {slots.map((poster, i) => (
        <div key={i} className="flex-1 min-w-0 h-full">
          {poster ? (
            <img src={poster} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-[#151921] flex items-center justify-center">
              <Film className="w-5 h-5 text-[#94A3B8]/15" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function MyListsPage() {
  const { userId } = useParams();
  const isPublic = !!userId;
  const auth = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [ownerUsername, setOwnerUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token"),
    [auth]
  );

  const fetchLists = async () => {
    try {
      setLoading(true);
      const url = isPublic
        ? `${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${userId}/Lists`
        : `${import.meta.env.VITE_API_BASE_URL}/Lists`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load lists");
      setLists(await res.json());
      if (isPublic) {
        const profRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (profRes.ok) { const d = await profRes.json(); setOwnerUsername(d.username); }
      }
    } catch {
      toast.error(isPublic ? "Could not load this user's lists" : "Could not load your lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLists();
  }, [token, userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#BFBCFC]/20 flex items-center justify-center">
              <List className="w-8 h-8 text-[#BFBCFC] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#BFBCFC] animate-spin" />
          </div>
          <p className="text-[#94A3B8] text-sm">{isPublic ? "Loading lists..." : "Loading your lists..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-black leading-none tracking-tight">
              {isPublic && <span className="text-[#F8FAFC]">{ownerUsername ?? "..."}'s </span>}
              <span className="bg-gradient-to-r from-[#BFBCFC] via-[#9b9dfc] to-[#44FFFF] bg-clip-text text-transparent">
                {isPublic ? "Lists" : "Your Lists"}
              </span>
            </h1>
          </div>
          {!isPublic && (
            <button
              onClick={() => navigate("/list/new")}
              className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 md:px-6 py-2 md:py-3 rounded-xl border-2 border-[#BFBCFC] font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#BFBCFC]/30 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Start a New List</span>
            </button>
          )}
        </div>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <Link
                key={list.listId}
                to={isPublic ? `/user/${userId}/list/${list.listId}` : `/list/${list.listId}`}
                className="group block bg-[#151921]/70 backdrop-blur-xl overflow-hidden rounded-lg transition-all hover:scale-[1.02]"
              >
                <ListPosterCollage posters={list.previewPosters} />

                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#BFBCFC] transition-colors truncate mb-1">
                    {list.listName}
                  </h3>

                  {list.listDescription && (
                    <p className="text-[#94A3B8] text-sm line-clamp-2 mb-2">
                      {list.listDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#44FFFF] font-data font-medium">
                      {list.movieCount} {list.movieCount === 1 ? "film" : "films"}
                    </span>
                    {list.isRanked && <span className="text-[#94A3B8]">• Ranked</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Film className="w-24 h-24 text-[#BFBCFC]/20 mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-[#F8FAFC] mb-2">No lists yet</h3>
            {isPublic ? (
              <p className="text-[#94A3B8] mb-6">
                {ownerUsername ?? "This user"} hasn't created any lists yet.
              </p>
            ) : (
              <>
                <p className="text-[#94A3B8] mb-6">
                  Create your first custom list to organize your favorite movies
                </p>
                <button
                  onClick={() => navigate("/list/new")}
                  className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First List
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
