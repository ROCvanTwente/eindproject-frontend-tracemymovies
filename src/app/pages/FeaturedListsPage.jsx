import { useEffect, useMemo, useState } from "react";
import { 
  Award, TrendingUp, Clapperboard, Heart, Orbit, Flame, Star, ChevronRight, ArrowLeft, Film 
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { ProfilePosterCard } from "../components/ProfilePosterCard";

// Visual lookups paired with humanized fallback details for our premium editorial sets
const THEME_MAP = {
  acclaimed: { 
    icon: Award, 
    color: "#44FFFF", 
    glow: "rgba(68,255,255,0.15)", 
    border: "border-[#44FFFF]/30",
    humanTitle: "Critically Acclaimed Masterpieces",
    humanDesc: "The pinnacle of cinema history. Explore landmark storytelling, exceptional directing, and powerful performances that have left an absolute impact on global movie culture."
  },
  trending: { 
    icon: TrendingUp, 
    color: "#44FFFF", 
    glow: "rgba(68,255,255,0.15)", 
    border: "border-[#44FFFF]/30",
    humanTitle: "Trending Worldwide",
    humanDesc: "The cinematic releases capturing our attention right now. Discover what cinephiles around the globe are watching, logging, and discussing this week."
  },
  hits2025: { 
    icon: Clapperboard, 
    color: "#44FFFF", 
    glow: "rgba(68,255,255,0.15)", 
    border: "border-[#44FFFF]/30",
    humanTitle: "2025's Top 10 Blockbusters",
    humanDesc: "A complete look back at the definitive box office milestones, cultural events, and cinematic marvels that shaped the screen in 2025."
  },
  drama: { 
    icon: Heart, 
    color: "#44FFFF", 
    glow: "rgba(68,255,255,0.15)", 
    border: "border-[#44FFFF]/30",
    humanTitle: "All-Time Best Drama",
    humanDesc: "Moving character studies, profound relationships, and beautifully human dilemmas. These emotional journeys left a permanent mark on moviegoers."
  },
  scifi: { 
    icon: Orbit, 
    color: "#44FFFF", 
    glow: "rgba(68,255,255,0.15)", 
    border: "border-[#44FFFF]/30",
    humanTitle: "Sci-Fi & Cyberpunk Essentials",
    humanDesc: "Challenging futures, cosmic exploration, and cutting-edge worlds. Venture into standard-setting titles that redefine science fiction."
  },
  action: { 
    icon: Flame, 
    color: "#44FFFF", 
    glow: "rgba(68,255,255,0.15)", 
    border: "border-[#44FFFF]/30",
    humanTitle: "Adrenaline Rush Action Hits",
    humanDesc: "High-velocity stunt coordination, precise blockbusters, and intense suspense sequences built to keep your eyes glued to the screen."
  }
};

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

export function FeaturedListsPage() {
  const auth = useAuth();
  const [featuredLists, setFeaturedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Syncing with routing system query params to ensure browser navigation steps back gracefully
  const activeListKey = searchParams.get("list");
  const activeFeaturedList = useMemo(() => {
    return featuredLists.find((list) => list.key === activeListKey) || null;
  }, [featuredLists, activeListKey]);

  const fetchFeaturedLists = async () => {
    try {
      setLoading(true);
      const featuredUrl = `${import.meta.env.VITE_API_BASE_URL}/Lists/featured`;
      const featRes = await fetch(featuredUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (featRes.ok) {
        setFeaturedLists(await featRes.json());
      }
    } catch (err) {
      toast.error("Could not load the featured movie lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchFeaturedLists();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#44FFFF]/20 flex items-center justify-center">
              <Star className="w-8 h-8 text-[#44FFFF] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#44FFFF] animate-spin" />
          </div>
          <p className="text-[#94A3B8] text-sm">Loading featured selections...</p>
        </div>
      </div>
    );
  }

  // SINGLE LIST CONTENT SCREEN
  if (activeFeaturedList) {
    const theme = THEME_MAP[activeFeaturedList.key] || THEME_MAP.acclaimed;
    const ListIcon = theme.icon;
    const title = activeFeaturedList.listName || theme.humanTitle;
    const description = activeFeaturedList.listDescription || theme.humanDesc;

    return (
      <div className="min-h-screen py-6 md:py-8 bg-[#0B0E14] text-[#F8FAFC]">
        <div className="container mx-auto px-4 max-w-7xl">
          <button
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors mb-6 group bg-[#151921]/60 px-4 py-2 rounded-xl border border-white/5 cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          <div className="relative rounded-2xl p-6 md:p-8 overflow-hidden bg-[#151921]/40 border border-white/5 mb-8">
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at top left, ${theme.glow}, transparent 70%)` }}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${theme.color}20`, border: `1px solid ${theme.color}40` }}
                >
                  <ListIcon className="w-6 h-6" style={{ color: theme.color }} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h1>
                  <p className="text-[#94A3B8] text-sm mt-2 leading-relaxed max-w-3xl">{description}</p>
                </div>
              </div>
              <span className="self-start sm:self-center text-xs font-bold uppercase tracking-widest px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[#44FFFF]">
                {activeFeaturedList.movieCount} {activeFeaturedList.movieCount === 1 ? "movie" : "movies"}
              </span>
            </div>
          </div>

          {/* Premium Grid layout adapting logic from ListDetailPage.jsx */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
            {activeFeaturedList.movies?.map((movie, index) => (
              <div key={movie.movieId} className="flex flex-col gap-1.5 group">
                <ProfilePosterCard
                  movieId={movie.movieId}
                  poster={movie.poster}
                  title={movie.title}
                  to={`/movie/${movie.movieId}`}
                />
                <div className="flex items-center justify-between px-1 mt-0.5">
                  <span className="font-data text-xs font-bold text-[#64748B] group-hover:text-[#44FFFF] transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-0.5 bg-[#0B0E14]/60 px-1.5 py-0.5 rounded border border-white/5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold font-data text-amber-200">
                      {movie.voteAverage > 0 ? movie.voteAverage.toFixed(1) : "0.0"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // OVERVIEW HUB SCREEN
  return (
    <div className="min-h-screen py-8 md:py-12 bg-[#0B0E14]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black leading-none tracking-tight">
            <span className="bg-gradient-to-r from-[#BFBCFC] via-[#9b9dfc] to-[#44FFFF] bg-clip-text text-transparent">
              Featured Collections
            </span>
          </h1>
          <p className="text-sm md:text-base text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            Explore premium lists curated exclusively by our editorial team. Dive deep into tailored sets across distinct cinematic universes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredLists.map((list) => {
            const theme = THEME_MAP[list.key] || THEME_MAP.acclaimed;
            const CardIcon = theme.icon;
            const title = list.listName || theme.humanTitle;
            const description = list.listDescription || theme.humanDesc;

            return (
              <div
                key={list.key}
                onClick={() => setSearchParams({ list: list.key })}
                className="group block bg-[#151921]/40 hover:bg-[#151921]/90 overflow-hidden rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative shadow-xl shadow-black/20"
              >
                <div 
                  className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${theme.glow}, transparent 70%)` }}
                />
                <ListPosterCollage posters={list.previewPosters} />
                <div className="p-5 relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center border"
                      style={{ background: `${theme.color}10`, borderColor: `${theme.color}30` }}
                    >
                      <CardIcon className="w-4 h-4" style={{ color: theme.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#44FFFF] transition-colors truncate flex-1">
                      {title}
                    </h3>
                  </div>
                  <p className="text-[#64748B] text-xs leading-relaxed line-clamp-2 mb-4 min-h-[36px]">
                    {description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                    <span className="text-[#44FFFF] font-data font-semibold bg-[#44FFFF]/5 border border-[#44FFFF]/10 px-2 py-0.5 rounded-md">
                      {list.movieCount} {list.movieCount === 1 ? "movie" : "movies"}
                    </span>
                    <span className="text-[#64748B] font-medium group-hover:text-white flex items-center gap-1 transition-colors">
                      Browse List <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}