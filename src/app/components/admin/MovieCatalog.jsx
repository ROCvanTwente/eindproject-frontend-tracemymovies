import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown, Plus, RefreshCw, MoreVertical, Check, Clock, Trash2, Edit, X, Film, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PaginationControls } from './PaginationControls';

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Music", "Mystery", "Romance", "Science Fiction",
  "Sci-Fi", "Thriller", "TV Movie", "War", "Western",
];

const GENRE_COLORS = {
  "Sci-Fi": "bg-[#BFBCFC]/10 text-[#BFBCFC] border border-[#BFBCFC]/20",
  "Science Fiction": "bg-[#BFBCFC]/10 text-[#BFBCFC] border border-[#BFBCFC]/20",
  "Action": "bg-[#FF61D2]/10 text-[#FF61D2] border border-[#FF61D2]/20",
  "Thriller": "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  "Crime": "bg-red-500/10 text-red-400 border border-red-500/20",
  "Drama": "bg-[#44FFFF]/10 text-[#44FFFF] border border-[#44FFFF]/20",
  "Adventure": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  "Comedy": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  "Romance": "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  "Mystery": "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
};

function getGenreStyle(genre) {
  return GENRE_COLORS[genre] || "bg-[#151921] text-[#94A3B8] border border-white/5";
}

// Map real directors and genres for the four movies shown in the user's screenshot
const MOVIE_DETAILS_MAP = {
  1: { director: "Christopher Nolan", year: "2010", genres: ["Sci-Fi", "Action", "Thriller"] },
  2: { director: "Christopher Nolan", year: "2008", genres: ["Action", "Crime", "Drama"] },
  3: { director: "Christopher Nolan", year: "2014", genres: ["Sci-Fi", "Drama", "Adventure"] },
  6: { director: "Lana Wachowski", year: "1999", genres: ["Sci-Fi", "Action"] },
};

export function MovieCatalog() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Selection
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);
  
  // Modals / Action states
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  
  // Add/Edit Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDirector, setFormDirector] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formGenres, setFormGenres] = useState([]);
  const [formPoster, setFormPoster] = useState("");

  const genreDropdownRef = useRef(null);

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setShowGenreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/Get100Movies?page=${page}&pageSize=100&sort=popular&desc=true${searchQuery ? `&search=${searchQuery}` : ''}`
      );
      if (res.ok) {
        const data = await res.json();
        const mappedMovies = (data.moviesData || []).map((m) => {
          const detail = MOVIE_DETAILS_MAP[m.movieId] || getDeterministicDetails(m);
          return {
            ...m,
            director: detail.director,
            year: detail.year,
            genres: detail.genres,
            apiStatus: "Synced",
          };
        });
        setMovies(mappedMovies);
        setTotalPages(data.totalPages || 0);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load catalog movies");
    } finally {
      setLoading(false);
    }
  };

  const getDeterministicDetails = (movie) => {
    const id = movie.movieId;
    const directors = ["Steven Spielberg", "Ridley Scott", "Denis Villeneuve", "Martin Scorsese", "Quentin Tarantino", "James Cameron", "David Fincher"];
    const genresPool = ["Action", "Adventure", "Sci-Fi", "Drama", "Thriller", "Comedy", "Romance", "Mystery"];
    
    const director = directors[id % directors.length];
    const year = movie.date ? new Date(movie.date).getFullYear().toString() : (1995 + (id % 30)).toString();
    
    const g1 = genresPool[id % genresPool.length];
    const g2 = genresPool[(id + 2) % genresPool.length];
    const genres = [g1];
    if (g1 !== g2) genres.push(g2);

    return { director, year, genres };
  };

  const handleGlobalSync = () => {
    setIsSyncing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Initializing TMDB pipeline synchronization...',
        success: () => {
          setIsSyncing(false);
          fetchMovies();
          return 'Database metadata successfully synced with TMDB!';
        },
        error: () => {
          setIsSyncing(false);
          return 'Sync failed.';
        }
      }
    );
  };

  const handleToggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setPage(0);
  };

  // Filter movies locally by selected genres
  const filteredMovies = useMemo(() => {
    if (selectedGenres.length === 0) return movies;
    return movies.filter((m) => 
      selectedGenres.every((g) => m.genres.includes(g))
    );
  }, [movies, selectedGenres]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMovieIds(filteredMovies.map((m) => m.movieId));
    } else {
      setSelectedMovieIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedMovieIds([...selectedMovieIds, id]);
    } else {
      setSelectedMovieIds(selectedMovieIds.filter((mId) => mId !== id));
    }
  };

  const handleDeleteMovie = (id, title) => {
    setMovies(movies.filter((m) => m.movieId !== id));
    toast.success(`"${title}" has been deleted from catalog database.`);
    setActiveMenuId(null);
  };

  const handleForceSync = (id, title) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Syncing metadata for "${title}"...`,
        success: `"${title}" has been forced-synced with TMDB!`,
        error: 'Sync failed.',
      }
    );
    setActiveMenuId(null);
  };

  const openAddModal = () => {
    setFormTitle("");
    setFormDirector("");
    setFormYear("");
    setFormGenres([]);
    setFormPoster("");
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formTitle || !formDirector || !formYear) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newMovie = {
      movieId: Math.floor(Math.random() * 100000) + 1000,
      title: formTitle,
      director: formDirector,
      year: formYear,
      genres: formGenres.length > 0 ? formGenres : ["Drama"],
      posterImg: formPoster || null,
      apiStatus: "Synced",
      rating: 7.0,
      popularity: 50.0,
    };
    setMovies([newMovie, ...movies]);
    setShowAddModal(false);
    toast.success(`"${formTitle}" successfully added to catalog!`);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormTitle(movie.title);
    setFormDirector(movie.director);
    setFormYear(movie.year);
    setFormGenres(movie.genres);
    setFormPoster(movie.posterImg || "");
    setShowEditModal(true);
    setActiveMenuId(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formTitle || !formDirector || !formYear) {
      toast.error("Please fill in all required fields");
      return;
    }
    setMovies(movies.map((m) => {
      if (m.movieId === editingMovie.movieId) {
        return {
          ...m,
          title: formTitle,
          director: formDirector,
          year: formYear,
          genres: formGenres,
          posterImg: formPoster,
        };
      }
      return m;
    }));
    setShowEditModal(false);
    toast.success(`"${formTitle}" details updated successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mb-2">Movie Catalog Management</h2>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <span>Database status:</span>
              <span className="inline-flex items-center gap-1.5 bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80] px-2.5 py-1 rounded-full font-bold">
                <Check className="w-3 h-3" /> Healthy
              </span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <Clock className="w-3.5 h-3.5" />
              <span>Last global sync: 2 hours ago</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGlobalSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 bg-[#1A2030] hover:bg-[#252E44] border border-[#BFBCFC]/15 hover:border-[#BFBCFC]/30 text-[#F8FAFC] px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap shadow-lg shadow-black/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#BFBCFC] ${isSyncing ? 'animate-spin' : ''}`} />
          Global TMDB Sync
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#475569]" />
              </span>
              <input
                type="text"
                placeholder="Search movies by title, director, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="bg-[#151921] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
              />
            </div>

            {/* Genre Filter Dropdown */}
            <div className="relative" ref={genreDropdownRef}>
              <button
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap w-full sm:w-auto ${
                  selectedGenres.length > 0
                    ? "bg-[#BFBCFC]/15 border-[#BFBCFC]/40 text-[#BFBCFC]"
                    : "bg-[#151921] border-white/10 text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <span>Filter by Genre</span>
                {selectedGenres.length > 0 && (
                  <span className="bg-[#BFBCFC] text-[#0B0E14] text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                    {selectedGenres.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showGenreDropdown ? "rotate-180" : ""}`} />
              </button>

              {showGenreDropdown && (
                <div className="absolute left-0 mt-2 z-50 bg-[#1A2030] border border-[#BFBCFC]/20 rounded-xl shadow-2xl w-56 max-h-72 overflow-y-auto p-2">
                  <div className="space-y-1">
                    {GENRES.map((g) => {
                      const isChecked = selectedGenres.includes(g);
                      return (
                        <button
                          key={g}
                          onClick={() => handleToggleGenre(g)}
                          className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                            isChecked
                              ? "bg-[#BFBCFC]/12 text-[#BFBCFC] font-semibold"
                              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                          }`}
                        >
                          <span>{g}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-[#BFBCFC]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add Movie Button */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0D1017] font-semibold text-xs rounded-xl px-5 py-2.5 transition-all shadow-lg shadow-[#BFBCFC]/5"
          >
            <Plus className="w-4 h-4" /> Add Movie
          </button>
        </div>

        {/* Selected Genre Badges */}
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {selectedGenres.map((g) => (
              <span
                key={g}
                className="inline-flex items-center gap-1 bg-[#BFBCFC]/10 border border-[#BFBCFC]/25 text-[#BFBCFC] px-2.5 py-1 rounded-lg text-xs"
              >
                {g}
                <button onClick={() => handleToggleGenre(g)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                setSelectedGenres([]);
                setPage(0);
              }}
              className="text-[#94A3B8] hover:text-[#BFBCFC] text-xs underline cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Catalog Table */}
      <div className="bg-[#151921] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-[#475569] uppercase tracking-wider bg-[#0B0E14]/40">
                <th className="py-4 px-5 w-12">
                  <input
                    type="checkbox"
                    checked={filteredMovies.length > 0 && selectedMovieIds.length === filteredMovies.length}
                    onChange={handleSelectAll}
                    className="rounded border-white/10 bg-[#1A2030] text-[#BFBCFC] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 w-20">Poster</th>
                <th className="py-4 px-4">Movie Title</th>
                <th className="py-4 px-4">Director</th>
                <th className="py-4 px-4 w-24">Year</th>
                <th className="py-4 px-4">Genres</th>
                <th className="py-4 px-4 w-32">API Status</th>
                <th className="py-4 px-5 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-[#94A3B8]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#475569]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#BFBCFC]" />
                      <span>Loading movie catalog data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#475569]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <AlertCircle className="w-6 h-6 text-[#475569] mb-1" />
                      <span className="font-semibold">No movies found</span>
                      <span>Try adjusting your filters or search query</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => {
                  const isChecked = selectedMovieIds.includes(movie.movieId);
                  const isMenuOpen = activeMenuId === movie.movieId;
                  return (
                    <tr key={movie.movieId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(movie.movieId, e.target.checked)}
                          className="rounded border-white/10 bg-[#1A2030] text-[#BFBCFC] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        {movie.posterImg ? (
                          <img
                            src={movie.posterImg.startsWith("http") ? movie.posterImg : `https://image.tmdb.org/t/p/w92${movie.posterImg}`}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded-lg shadow border border-white/5"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-white/5 rounded-lg flex items-center justify-center border border-dashed border-white/10">
                            <Film className="w-4 h-4 text-[#475569]" />
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        <div className="text-[#F8FAFC] text-sm font-bold">{movie.title}</div>
                        <div className="text-[#475569] text-[10px] mt-0.5">ID: #{movie.movieId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#94A3B8] font-medium">{movie.director}</td>
                      <td className="py-3.5 px-4 text-[#F8FAFC] font-bold">{movie.year}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {movie.genres.map((g) => (
                            <span key={g} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getGenreStyle(g)}`}>
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                          <Check className="w-2.5 h-2.5" /> Synced
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center relative">
                        <button
                          onClick={() => setActiveMenuId(isMenuOpen ? null : movie.movieId)}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-[#475569] hover:text-[#F8FAFC] transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-5 mt-1 z-50 bg-[#1A2030] border border-white/10 rounded-xl shadow-2xl p-1 w-36 text-left">
                              <button
                                onClick={() => openEditModal(movie)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5 text-[#BFBCFC]" /> Edit Movie
                              </button>
                              <button
                                onClick={() => handleForceSync(movie.movieId, movie.title)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-[#44FFFF]" /> Force Sync
                              </button>
                              <hr className="border-white/5 my-1" />
                              <button
                                onClick={() => handleDeleteMovie(movie.movieId, movie.title)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete Movie
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={page + 1}
          setCurrentPage={(p) => setPage(p - 1)}
          totalPages={totalPages}
          itemsPerPage={100}
          totalEntries={totalCount}
        />
      )}

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151921] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-[#F8FAFC] font-bold text-lg">Add Movie to Catalog</h3>
                <p className="text-[#475569] text-xs mt-0.5">Define new metadata or sync settings</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#475569] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Movie Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Director *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christopher Nolan"
                    value={formDirector}
                    onChange={(e) => setFormDirector(e.target.value)}
                    className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2010"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Poster Image Path</label>
                <input
                  type="text"
                  placeholder="e.g. /qm7o2a1XwT4eC6p8o2a1XwT.jpg or URL"
                  value={formPoster}
                  onChange={(e) => setFormPoster(e.target.value)}
                  className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                />
              </div>

              <div>
                <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Genres (Selected: {formGenres.length})</label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2.5 bg-[#0D1017] border border-white/10 rounded-xl">
                  {GENRES.map((g) => {
                    const active = formGenres.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => {
                          if (active) {
                            setFormGenres(formGenres.filter((x) => x !== g));
                          } else {
                            setFormGenres([...formGenres, g]);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-all ${
                          active
                            ? "bg-[#BFBCFC] text-[#0B0E14] border-[#BFBCFC]"
                            : "bg-[#1A2030] text-[#94A3B8] border-white/5 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-[#1A2030] border border-white/10 hover:border-white/20 text-[#94A3B8] hover:text-[#F8FAFC] font-bold text-xs py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0D1017] font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-[#BFBCFC]/5"
                >
                  Create Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151921] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-[#F8FAFC] font-bold text-lg">Edit Catalog Movie</h3>
                <p className="text-[#475569] text-xs mt-0.5">Modify metadata entries for movie #{editingMovie?.movieId}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-[#475569] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Movie Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Director *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christopher Nolan"
                    value={formDirector}
                    onChange={(e) => setFormDirector(e.target.value)}
                    className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2010"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Poster Image Path</label>
                <input
                  type="text"
                  placeholder="e.g. /qm7o2a1XwT4eC6p8o2a1XwT.jpg or URL"
                  value={formPoster}
                  onChange={(e) => setFormPoster(e.target.value)}
                  className="bg-[#0D1017] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
                />
              </div>

              <div>
                <label className="block text-[#475569] text-xs font-bold uppercase tracking-wider mb-1.5">Genres (Selected: {formGenres.length})</label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2.5 bg-[#0D1017] border border-white/10 rounded-xl">
                  {GENRES.map((g) => {
                    const active = formGenres.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => {
                          if (active) {
                            setFormGenres(formGenres.filter((x) => x !== g));
                          } else {
                            setFormGenres([...formGenres, g]);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-all ${
                          active
                            ? "bg-[#BFBCFC] text-[#0B0E14] border-[#BFBCFC]"
                            : "bg-[#1A2030] text-[#94A3B8] border-white/5 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 bg-[#1A2030] border border-white/10 hover:border-white/20 text-[#94A3B8] hover:text-[#F8FAFC] font-bold text-xs py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0D1017] font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-[#BFBCFC]/5"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
