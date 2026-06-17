// src/pages/AdminPage.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminContentFrame } from '../components/admin/AdminContentFrame';
import { EditGenresModal } from '../components/admin/EditGenresModal';

export function AdminPage() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartPeriod, setChartPeriod] = useState('month');
  const [editGenresMovie, setEditGenresMovie] = useState(null);

  // Growth Datasets
  const userGrowthDataMonth = [
    { month: 'Jan', users: 8400 }, { month: 'Feb', users: 9200 }, { month: 'Mar', users: 10100 },
    { month: 'Apr', users: 11200 }, { month: 'May', users: 11800 }, { month: 'Jun', users: 12847 },
  ];
  const userGrowthDataYear = [
    { month: '2021', users: 5400 }, { month: '2022', users: 7200 }, { month: '2023', users: 9600 }, { month: '2024', users: 12847 },
  ];
  const activeChartDataset = chartPeriod === 'month' ? userGrowthDataMonth : userGrowthDataYear;

  const topMovies = [
    { title: 'Inception', watches: 3421, poster: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg' },
    { title: 'The Dark Knight', watches: 3156, poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { title: 'Interstellar', watches: 2987, poster: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  ];

  const movieUpdates = [
    { id: 1, movieTitle: 'Interstellar', description: "Genre 'Adventure' added" },
    { id: 2, movieTitle: 'The Dark Knight', description: 'Release date updated to July 18, 2008' },
    { id: 3, movieTitle: 'Inception', description: 'Rating updated to 8.4/10' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0E14] flex">
      {/* Structural Components */}
      <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-[#151921] border-b border-[#BFBCFC]/10 sticky top-16 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users, movies, reports..."
                  className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-12 pr-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] text-sm"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Main Workspace Frame */}
        <main className="p-8 flex-1">
          <AdminContentFrame 
            currentView={currentView}
            chartPeriod={chartPeriod}
            setChartPeriod={setChartPeriod}
            userGrowthData={activeChartDataset}
            topMovies={topMovies}
            movieUpdates={movieUpdates}
            setEditGenresMovie={setEditGenresMovie}
          />
        </main>
      </div>

      {/* Global Managed Dialog Layers */}
      <EditGenresModal
        isOpen={editGenresMovie !== null}
        onClose={() => setEditGenresMovie(null)}
        movieTitle={editGenresMovie?.title || ''}
        currentGenres={editGenresMovie?.genres || []}
        onSave={(genres) => console.log(genres)}
      />
    </div>
  );
}