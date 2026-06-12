import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const currentDecade = Math.floor(new Date().getFullYear() / 10) * 10;
const ALL_DECADES = [];
for (let d = 1870; d <= currentDecade; d += 10) ALL_DECADES.push(`${d}s`);

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Music", "Mystery", "Romance", "Science Fiction",
  "Thriller", "TV Movie", "War", "Western",
];

function FilterDropdown({ label, value, options, onChange, topOption }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = value !== null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
          active
            ? "bg-[#BFBCFC]/15 border-[#BFBCFC]/40 text-[#BFBCFC]"
            : "bg-transparent border-[#BFBCFC]/12 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/20"
        }`}
      >
        {active ? value : label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-[#1A2030] border border-[#BFBCFC]/20 rounded-xl shadow-2xl shadow-black/50 min-w-[160px] overflow-hidden">
          <div className="max-h-72 overflow-y-auto py-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#BFBCFC]/25 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#BFBCFC]/50">
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${
              !active ? "text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"
            }`}
          >
            Any {label.toLowerCase()}
          </button>

          {topOption && (
            <>
              <hr className="border-[#BFBCFC]/10 mx-2 my-1" />
              <button
                onClick={() => { onChange(topOption); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === topOption
                    ? "text-[#BFBCFC] bg-[#BFBCFC]/12 font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"
                }`}
              >
                {topOption}
              </button>
              <hr className="border-[#BFBCFC]/10 mx-2 my-1" />
            </>
          )}

          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === opt
                  ? "text-[#BFBCFC] bg-[#BFBCFC]/12 font-semibold"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"
              }`}
            >
              {opt}
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

const SORT_GROUPS = [
  { category: "List Order", label: "List Order",      options: ["List Order"] },
  { category: "List Order", label: "Reverse Order",   options: ["Reverse Order"] },
  { category: "List Order", label: "Film Name",       options: ["A - Z", "Z - A"] },
  { category: "List Order", label: "Film Popularity", options: ["Highest First", "Lowest First"] },
  { category: "List Order", label: "Shuffle",         options: ["Shuffle"] },
  { category: "Dates", label: "When Added",      options: ["Newest First", "Earliest First"] },
  { category: "Dates", label: "Release Date",    options: ["Newest First", "Earliest First"] },
  { category: "Dates", label: "Your Diary Date", options: ["Newest First", "Earliest First"] },
  { category: "Ratings", label: "Average Rating", options: ["Highest First", "Lowest First"] },
  { category: "Ratings", label: "Your Rating",    options: ["Highest First", "Lowest First"] },
  { category: "Other", label: "Film Length", options: ["Shortest First", "Longest First"] },
];

export function SortDropdown({ value, onChange, excludeGroups = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visibleGroups = SORT_GROUPS.filter(g => !excludeGroups.includes(g.label));
  const active = value !== null;
  const label = active
    ? (value.group === value.option ? value.group : `${value.group}: ${value.option}`)
    : "Sort by";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
          active
            ? "bg-[#BFBCFC]/15 border-[#BFBCFC]/40 text-[#BFBCFC]"
            : "bg-transparent border-[#BFBCFC]/12 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/20"
        }`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-[#1A2030] border border-[#BFBCFC]/20 rounded-xl shadow-2xl shadow-black/50 min-w-[200px] overflow-hidden">
          <div className="max-h-80 overflow-y-auto py-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#BFBCFC]/25 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#BFBCFC]/50">
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${!active ? "text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"}`}
            >
              Default
            </button>
            <hr className="border-[#BFBCFC]/10 mx-2 my-1" />
            {visibleGroups.map((group, gi) => {
              const prevCategory = gi > 0 ? visibleGroups[gi - 1].category : null;
              const showCategory = group.category !== prevCategory;
              const isSingle = group.options.length === 1 && group.options[0] === group.label;
              return (
                <div key={group.label}>
                  {showCategory && (
                    <>
                      {gi > 0 && <hr className="border-[#BFBCFC]/8 mx-2 my-0.5" />}
                      <p className="px-4 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#BFBCFC]/50">
                        {group.category}
                      </p>
                    </>
                  )}
                  {!isSingle && (
                    <p className="px-4 pt-1 pb-0.5 text-xs font-semibold text-[#94A3B8]">
                      {group.label}
                    </p>
                  )}
                  {group.options.map((opt) => {
                    const isActive = value?.group === group.label && value?.option === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => { onChange({ group: group.label, option: opt }); setOpen(false); }}
                        className={`w-full text-left py-1.5 text-sm transition-colors ${isSingle ? "px-4" : "pl-6 pr-4"} ${
                          isActive
                            ? "text-[#BFBCFC] bg-[#BFBCFC]/12 font-semibold"
                            : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function applySort(movies, sortValue) {
  if (!sortValue) return movies;
  const { group, option } = sortValue;
  const arr = [...movies];

  if (group === "List Order") return arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  if (group === "Reverse Order") return arr.sort((a, b) => (b.position ?? 0) - (a.position ?? 0));
  if (group === "Film Name") return arr.sort((a, b) => option === "A - Z" ? (a.title || "").localeCompare(b.title || "") : (b.title || "").localeCompare(a.title || ""));
  if (group === "Film Popularity") return arr.sort((a, b) => option === "Highest First" ? (b.popularity ?? 0) - (a.popularity ?? 0) : (a.popularity ?? 0) - (b.popularity ?? 0));
  if (group === "Shuffle") return arr.sort(() => Math.random() - 0.5);
  if (group === "When Added") {
    const dateOf = (m) => new Date(m.loggedDate ?? m.addedDate);
    return arr.sort((a, b) => option === "Newest First" ? dateOf(b) - dateOf(a) : dateOf(a) - dateOf(b));
  }
  if (group === "Release Date") return arr.sort((a, b) => option === "Newest First" ? (Number(b.year) || 0) - (Number(a.year) || 0) : (Number(a.year) || 0) - (Number(b.year) || 0));
  if (group === "Your Diary Date") return arr.sort((a, b) => option === "Newest First" ? new Date(b.watchedDate ?? 0) - new Date(a.watchedDate ?? 0) : new Date(a.watchedDate ?? 0) - new Date(b.watchedDate ?? 0));
  if (group === "Average Rating") return arr.sort((a, b) => option === "Highest First" ? (b.voteAverage ?? 0) - (a.voteAverage ?? 0) : (a.voteAverage ?? 0) - (b.voteAverage ?? 0));
  if (group === "Your Rating") return arr.sort((a, b) => option === "Highest First" ? (b.userRating ?? 0) - (a.userRating ?? 0) : (a.userRating ?? 0) - (b.userRating ?? 0));
  if (group === "Film Length") return arr.sort((a, b) => option === "Shortest First" ? (a.runtime ?? 0) - (b.runtime ?? 0) : (b.runtime ?? 0) - (a.runtime ?? 0));
  return arr;
}

export function useMovieFilters(movies) {
  const [genre, setGenre] = useState(null);
  const [decade, setDecade] = useState(null);
  const [year, setYear] = useState(null);
  const [rating, setRating] = useState(null);

  const availableGenres = GENRES;
  const availableDecades = ALL_DECADES;
  const ratingOptions = ["1-2", "3-4", "5-6", "7-8", "9-10"];

  // When decade changes, reset specific year
  const handleSetDecade = (d) => { setDecade(d); setYear(null); };

  const filtered = movies.filter((m) => {
    if (genre && !(m.genres ?? []).includes(genre)) return false;
    if (year) {
      if (Number(m.year) !== year) return false;
    } else if (decade) {
      const decadeStart = parseInt(decade);
      const yr = Number(m.year);
      if (!yr || yr < decadeStart || yr >= decadeStart + 10) return false;
    }
    if (rating) {
      if (rating === "No Rating") {
        if (m.userRating > 0) return false;
      } else {
        const [min, max] = rating.split("-").map(Number);
        const r = m.userRating ?? 0;
        if (r < min || r > max) return false;
      }
    }
    return true;
  });

  const hasActiveFilters = genre !== null || decade !== null || year !== null || rating !== null;
  const reset = () => { setGenre(null); setDecade(null); setYear(null); setRating(null); };

  return { genre, setGenre, decade, setDecade: handleSetDecade, year, setYear, rating, setRating, filtered, availableGenres, availableDecades, ratingOptions, hasActiveFilters, reset };
}

function YearRow({ decade, year, setYear, setDecade }) {
  const decadeStart = parseInt(decade);
  const years = Array.from({ length: 10 }, (_, i) => decadeStart + i)
    .filter((y) => y <= new Date().getFullYear());

  const prevDecade = decadeStart - 10;
  const nextDecade = decadeStart + 10;
  const canPrev = prevDecade >= 1870;
  const canNext = nextDecade <= Math.floor(new Date().getFullYear() / 10) * 10;

  return (
    <div className="flex items-center gap-1 mt-2 bg-[#151921]/60 border border-[#BFBCFC]/10 rounded-xl px-2 py-1.5 w-fit">
      <button
        onClick={() => canPrev && setDecade(`${prevDecade}s`)}
        disabled={!canPrev}
        className={`p-1 rounded-md transition-colors ${canPrev ? "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/10" : "text-[#94A3B8]/20 cursor-not-allowed"}`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Decade label */}
      <button
        onClick={() => setYear(null)}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all mr-1 ${
          year === null ? "bg-[#BFBCFC] text-[#0B0E14]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
        }`}
      >
        {decade}
      </button>

      {/* Individual years */}
      {years.map((y) => (
        <button
          key={y}
          onClick={() => setYear(year === y ? null : y)}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
            year === y
              ? "bg-[#44FFFF]/20 text-[#44FFFF] border border-[#44FFFF]/40"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/8"
          }`}
        >
          {y}
        </button>
      ))}

      <button
        onClick={() => canNext && setDecade(`${nextDecade}s`)}
        disabled={!canNext}
        className={`p-1 rounded-md transition-colors ml-1 ${canNext ? "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#BFBCFC]/10" : "text-[#94A3B8]/20 cursor-not-allowed"}`}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function MovieFilters({ genre, setGenre, decade, setDecade, year, setYear, rating, setRating, availableGenres, availableDecades, ratingOptions, hasActiveFilters, reset, hideYearRow, yearRowOnly, hideRating, hideGenre, hideDecade }) {
  if (yearRowOnly) {
    return decade ? <YearRow decade={decade} year={year} setYear={setYear} setDecade={setDecade} /> : null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!hideGenre && (
        <FilterDropdown
          label="Genre"
          value={genre}
          options={availableGenres}
          onChange={setGenre}
        />
      )}
      {!hideDecade && (
        <FilterDropdown
          label="Decade"
          value={decade}
          options={availableDecades}
          onChange={setDecade}
        />
      )}
      {!hideRating && (
        <FilterDropdown
          label="Rating"
          value={rating}
          options={ratingOptions}
          onChange={setRating}
          topOption="No Rating"
        />
      )}
      {hasActiveFilters && (
        <button
          onClick={reset}
          className="px-3 py-2 rounded-lg text-xs font-medium text-[#FF61D2] hover:bg-[#FF61D2]/10 transition-colors border border-[#FF61D2]/20 hover:border-[#FF61D2]/40"
        >
          Reset
        </button>
      )}
    </div>
  );
}
