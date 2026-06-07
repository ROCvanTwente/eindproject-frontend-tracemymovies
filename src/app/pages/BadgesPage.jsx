import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BadgesSection } from "../components/BadgesSection";

export function BadgesPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwnProfile = !id;

  const [badges, setBadges] = useState([]);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useMemo(
    () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token"),
    []
  );

  useEffect(() => {
    const load = async () => {
      try {
        const url = isOwnProfile
          ? `${import.meta.env.VITE_API_BASE_URL}/Badge/me`
          : `${import.meta.env.VITE_API_BASE_URL}/Badge/${id}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        setBadges(data.badges || []);
        if (!isOwnProfile && data.username) setUsername(data.username);
      } catch {} finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token, id, isOwnProfile]);

  const earned = badges.filter(b => b.earned).length;
  const displayName = isOwnProfile ? (user?.username ?? "Your") : (username ?? "");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-[#BFBCFC]/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#BFBCFC] animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full border-t-2 border-[#BFBCFC] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#BFBCFC]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#44FFFF]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        <div className="relative container mx-auto px-4 max-w-5xl py-8 md:py-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#BFBCFC]/20 to-[#44FFFF]/8 rounded-2xl flex items-center justify-center border border-[#BFBCFC]/30 shadow-lg shadow-[#BFBCFC]/10 flex-shrink-0">
              <Shield className="w-7 h-7 text-[#BFBCFC]" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">
                {!isOwnProfile && <span className="text-[#F8FAFC]">{displayName}'s </span>}
                <span className="bg-gradient-to-r from-[#BFBCFC] via-[#d4d2fd] to-[#44FFFF] bg-clip-text text-transparent">
                  Badges
                </span>
              </h1>
            </div>
            {badges.length > 0 && (
              <div className="bg-[#BFBCFC]/10 border border-[#BFBCFC]/20 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#BFBCFC] leading-none tabular-nums">{earned}</p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">of {badges.length}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-8 md:py-10">
        {badges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-[#BFBCFC]/8 rounded-full flex items-center justify-center border border-[#BFBCFC]/15 mb-6">
              <Shield className="w-10 h-10 text-[#BFBCFC]/30" />
            </div>
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">No badges yet</h2>
            <p className="text-[#94A3B8] text-sm">
              {isOwnProfile ? "Start watching and logging films to earn badges." : `${displayName} hasn't earned any badges yet.`}
            </p>
          </div>
        ) : (
          <BadgesSection badges={badges} />
        )}
      </div>
    </div>
  );
}
