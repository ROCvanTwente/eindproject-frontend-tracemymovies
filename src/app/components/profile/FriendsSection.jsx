import { Link } from "react-router";
import { useSignalR } from "../../context/SignalRContext";

export function FriendsSection({ friends }) {
  const { isUserOnline } = useSignalR();
  if (!friends.length) return null;
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFBCFC]">Friends</span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#BFBCFC]/30 to-transparent" />
        <span className="text-[#94A3B8]/50 text-xs">{friends.length}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {friends.map((f) => (
          <Link key={f.userId} to={`/user/${f.userId}`} title={f.userName} className="group relative flex-shrink-0">
            {f.profileImageBase64 ? (
              <img
                src={`data:image/jpeg;base64,${f.profileImageBase64}`}
                alt={f.userName}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#BFBCFC]/20 group-hover:border-[#BFBCFC]/60 transition-all duration-200 group-hover:scale-105 shadow-md"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] flex items-center justify-center border-2 border-transparent group-hover:border-[#BFBCFC]/60 transition-all duration-200 group-hover:scale-105 shadow-md">
                <span className="text-[#0B0E14] font-bold text-sm">{f.userName?.charAt(0).toUpperCase() ?? "?"}</span>
              </div>
            )}
            {isUserOnline(f.userId, f.isOnline) && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#44FFFF] rounded-full border-2 border-[#0B0E14]" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
