export function BottomInsights({ genreData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
      {/* Favorite Genre */}
      <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
        <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">Favorite Genre</h2>
        <div className="space-y-3">
          {genreData.map((item) => (
            <div key={item.genre}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#F8FAFC] text-sm">{item.genre}</span>
                <span className="text-[#44FFFF] text-sm font-bold">{item.count}</span>
              </div>
              <div className="h-2 bg-[#0B0E14] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.count / 78) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Actor */}
      <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
        <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">Favorite Actor</h2>
        <div className="space-y-2">
          {[
            { name: "Leonardo DiCaprio", movies: 12 },
            { name: "Tom Hanks", movies: 10 },
            { name: "Christian Bale", movies: 9 },
            { name: "Scarlett Johansson", movies: 8 },
          ].map((actor, index) => (
            <div key={actor.name} className="flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold">
                {index + 1}
              </div>
              <div>
                <p className="text-[#F8FAFC] text-sm">{actor.name}</p>
                <p className="text-[#44FFFF] text-xs">{actor.movies} movies</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Director */}
      <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
        <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">Favorite Director</h2>
        <div className="space-y-2">
          {[
            { name: "Christopher Nolan", movies: 8 },
            { name: "Quentin Tarantino", movies: 7 },
            { name: "Martin Scorsese", movies: 6 },
            { name: "Steven Spielberg", movies: 5 },
          ].map((director, index) => (
            <div key={director.name} className="flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold">
                {index + 1}
              </div>
              <div>
                <p className="text-[#F8FAFC] text-sm">{director.name}</p>
                <p className="text-[#44FFFF] text-xs">{director.movies} movies</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}