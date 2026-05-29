import { User } from "lucide-react";

export function CastCard({ actor }) {
    return (
        <div className="flex-none w-[120px] md:w-[140px] bg-[#151921] border border-[#BFBCFC]/10 rounded-xl overflow-hidden shadow-lg snap-start">
            {actor.profile_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    loading="lazy"
                    className="w-full h-[150px] md:h-[185px] object-cover"
                />
            ) : (
                <div className="w-full h-[150px] md:h-[185px] bg-[#1c222d] flex items-center justify-center border-b border-[#BFBCFC]/10">
                    <User className="w-10 h-10 text-[#94A3B8]/50" />
                </div>
            )}

            <div className="p-2 space-y-0.5">
                <p
                    className="text-[#F8FAFC] font-semibold text-xs md:text-sm truncate"
                    title={actor.name}
                >
                    {actor.name}
                </p>

                <p
                    className="text-[#94A3B8] text-[11px] md:text-xs truncate"
                    title={actor.character}
                >
                    {actor.character}
                </p>
            </div>
        </div>
    );
}