// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Shield, ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminContentFrame } from '../components/admin/AdminContentFrame';
import { EditGenresModal } from '../components/admin/EditGenresModal';

export function AdminPage() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [chartPeriod, setChartPeriod] = useState('month');
  const [editGenresMovie, setEditGenresMovie] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Moderator')) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  // Show a loading indicator until we are sure who the user is
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0B0E14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#BFBCFC] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there is no user, or the role is not Admin/Moderator, show the 404 page
  if (!user || (user.role !== 'Admin' && user.role !== 'Moderator')) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0B0E14] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-7xl font-black text-[#F8FAFC] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#BFBCFC] mb-4">Page Not Found</h2>
        <p className="text-[#94A3B8] max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or you don't have permission to access it.
        </p>
        <Link to="/" className="px-6 py-3 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] font-bold rounded-xl transition-all">
          Return to Home
        </Link>
      </div>
    );
  }

  const activeChartDataset = chartPeriod === 'week'
    ? (stats?.userGrowthWeek || [])
    : chartPeriod === 'month' 
    ? (stats?.userGrowthMonth || []) 
    : (stats?.userGrowthYear || []);

  const topMovies = stats?.topMovies || [];
  const movieUpdates = stats?.movieUpdates || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0E14] flex flex-col lg:flex-row relative">
      {/* Structural Components */}
      <AdminSidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Main Workspace Frame */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {loadingStats && currentView === 'dashboard' ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-[#94A3B8] gap-2">
              <div className="w-8 h-8 border-2 border-[#BFBCFC] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Loading dashboard overview...</p>
            </div>
          ) : (
            <AdminContentFrame 
              currentView={currentView}
              chartPeriod={chartPeriod}
              setChartPeriod={setChartPeriod}
              userGrowthData={activeChartDataset}
              topMovies={topMovies}
              movieUpdates={movieUpdates}
              setEditGenresMovie={setEditGenresMovie}
              totalUsers={stats?.totalUsers || 0}
              totalMovies={stats?.totalMovies || 0}
              totalWatches={stats?.totalWatches || 0}
            />
          )}
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

      {/* Floating Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] hover:from-[#AFA9FF] hover:to-[#44FFFF] text-[#0B0E14] rounded-xl shadow-lg shadow-black/40 hover:shadow-[#BFBCFC]/20 transition-all duration-300 transform active:scale-95 ${
          showScrollTop ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}