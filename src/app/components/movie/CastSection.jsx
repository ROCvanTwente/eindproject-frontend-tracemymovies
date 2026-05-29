import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { CastCard } from "./CastCard";

export const CastSection = React.memo(({ cast }) => {
    const [showAll, setShowAll] = useState(false);

    const displayedCast = useMemo(
        () => (showAll ? cast : cast.slice(0, 10)),
        [cast, showAll]
    );

    if (!cast || cast.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC]">
                    Cast & Crew
                </h3>

                {cast.length > 10 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-[#44FFFF] text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                        {showAll ? "Toon minder" : `Toon alle ${cast.length}`}

                        <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                                showAll ? "rotate-90" : ""
                            }`}
                        />
                    </button>
                )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#BFBCFC]/20 scrollbar-track-transparent snap-x snap-proximity">
                {displayedCast.map((actor) => (
                    <CastCard
                        key={actor.cast_id || actor.id}
                        actor={actor}
                    />
                ))}
            </div>
        </div>
    );
});