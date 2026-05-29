import { Loader2 } from "lucide-react";

export function RecommendationsSection({ loading, recommendations }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-[#44FFFF] animate-spin" />
            </div>
        );
    }

    if (!recommendations || recommendations.length === 0) {
        return (
            <p className="text-[#94A3B8] text-sm">
                Geen recommendations gevonden.
            </p>
        );
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#BFBCFC]/20 scrollbar-track-transparent snap-x snap-proximity">
            {recommendations.map((recMovie) => (
                <a
                    key={recMovie.id}
                    href={`/movie/${recMovie.id}`}
                    className="flex-none w-[140px] group snap-start"
                >
                    <div className="relative overflow-hidden rounded-xl border border-[#BFBCFC]/10 bg-[#151921] transition-all duration-300 group-hover:border-[#44FFFF]/50 group-hover:scale-105">
                        {recMovie.poster_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${recMovie.poster_path}`}
                                alt={recMovie.title}
                                loading="lazy"
                                className="w-full h-[210px] object-cover"
                            />
                        ) : (
                            <div className="w-full h-[210px] bg-[#1c222d] flex items-center justify-center">
                                <span className="text-[#94A3B8] text-sm">
                                    No Image
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-2">
                        <p className="text-[#F8FAFC] text-sm font-medium truncate group-hover:text-[#44FFFF] transition-colors">
                            {recMovie.title}
                        </p>

                        <p className="text-[#94A3B8] text-xs">
                            {recMovie.release_date
                                ? new Date(recMovie.release_date).getFullYear()
                                : "Unknown"}
                        </p>
                    </div>
                </a>
            ))}
        </div>
    );
}