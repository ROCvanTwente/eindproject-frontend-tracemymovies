import { Link } from "react-router";
import { useSignalR } from "../../context/SignalRContext";

export function FriendsSection({ friends, linkTo }) {
  const { isUserOnline } = useSignalR();
  if (!friends.length && !linkTo) return null;

  const sortedFriends = [...friends].sort((a, b) => {
    const aOnline = isUserOnline(a.userId, a.isOnline) ? 1 : 0;
    const bOnline = isUserOnline(b.userId, b.isOnline) ? 1 : 0;
    return bOnline - aOnline;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
          Friends
        </h2>
        {linkTo && (
          <Link to={linkTo} className="text-xs text-[#94A3B8] hover:text-[#BFBCFC] transition-colors font-medium uppercase tracking-widest">All</Link>
        )}
      </div>
      <div className="flex flex-nowrap gap-4 overflow-hidden p-1">
        {sortedFriends.map((f) => (
          <Link key={f.userId} to={`/user/${f.userId}`} title={f.userName} className="relative flex-shrink-0">
            {f.profileImageBase64 ? (
              <img
                src={`data:image/jpeg;base64,${f.profileImageBase64}`}
                alt={f.userName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#BFBCFC]/20 shadow-md hover:border-[#44FFFF] transition-colors"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] flex items-center justify-center border-2 border-transparent shadow-md hover:border-[#44FFFF] transition-colors">
                <span className="text-[#0B0E14] font-bold text-base">{f.userName?.charAt(0).toUpperCase() ?? "?"}</span>
              </div>
            )}
            {isUserOnline(f.userId, f.isOnline) && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#44FFFF] rounded-full border-2 border-[#0B0E14]" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
