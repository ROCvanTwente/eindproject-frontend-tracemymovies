export function MovieSidebar({ movie }) {
    return (
        <div className="space-y-6">
            {/* Score */}
            <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6">
                <h3 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">
                    Scores
                </h3>

                <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">TMDB Score</span>

                    <span className="text-[#44FFFF] font-data font-medium">
                        ★ {movie.vote_average?.toFixed(1)}/10
                    </span>
                </div>
            </div>

            {/* Genres */}
            <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6">
                <h3 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">
                    Genres
                </h3>

                <div className="flex flex-wrap gap-2">
                    {movie.genres?.map((genre) => (
                        <span
                            key={genre.id}
                            className="bg-[#BFBCFC]/10 text-[#BFBCFC] px-3 py-1 rounded-lg text-sm border border-[#BFBCFC]/20"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}