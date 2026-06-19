// src/components/admin/AdminContentFrame.jsx
import { Users, Film, Eye, ArrowUp, RefreshCw, Calendar, Tag, Star, Image, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { ModerationQueue } from './ModerationQueue';
import { UserManagement } from './UserManagement';
import { SystemSettingsPage } from './SystemSettingsPage';
import { MovieCatalog } from './MovieCatalog';
import { ActivityLogs } from './ActivityLogs';
import { BadgeController } from './BadgeController';

export function AdminContentFrame({ 
  currentView, 
  chartPeriod, 
  setChartPeriod, 
  userGrowthData, 
  topMovies, 
  movieUpdates, 
  setEditGenresMovie,
  totalUsers = 0,
  totalMovies = 0,
  totalWatches = 0
}) {
  if (currentView === 'moderation') {
    return <ModerationQueue />;
  }

  if (currentView === 'users') {
    return <UserManagement />;
  }

  if (currentView === 'settings') {
    return <SystemSettingsPage />;
  }

  if (currentView === 'movies') {
    return <MovieCatalog />;
  }

  if (currentView === 'badges') {
    return <BadgeController />;
  }

  if (currentView === 'activity') {
    return <ActivityLogs />;
  }

  if (currentView !== 'dashboard') {
    return (
      <div className="text-[#94A3B8] p-8 text-center bg-[#151921] border border-[#BFBCFC]/15 rounded-xl">
        The full interface for <span className="text-[#BFBCFC] font-bold">"{currentView}"</span> view rendering goes here.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2">Dashboard Overview</h2>
        <p className="text-[#94A3B8]">Monitor your platform's key metrics and activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="group relative bg-gradient-to-br from-[#151921] to-[#0B0E14] border border-[#BFBCFC]/20 rounded-2xl p-6 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#BFBCFC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#BFBCFC] to-[#AFA9FF] rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-[#0B0E14]" />
                </div>
              </div>
              <div className="space-y-1 mb-2">
                <p className="text-4xl font-bold text-[#F8FAFC]">{totalUsers.toLocaleString()}</p>
                <p className="text-[#94A3B8] text-sm font-medium">Total Users</p>
              </div>
            </div>
          </div>

          {/* Dummy shortcuts for other two metrics blocks to minimize vertical length */}
          <div className="bg-[#151921] border border-[#44FFFF]/20 rounded-2xl p-6 shadow-xl">
            <Film className="w-7 h-7 text-[#44FFFF] mb-4" />
            <p className="text-3xl font-bold text-[#F8FAFC]">{totalMovies.toLocaleString()}</p>
            <p className="text-[#94A3B8] text-xs mt-1">Movies in Database</p>
          </div>
          <div className="bg-[#151921] border border-[#FF61D2]/20 rounded-2xl p-6 shadow-xl">
            <Eye className="w-7 h-7 text-[#FF61D2] mb-4" />
            <p className="text-3xl font-bold text-[#F8FAFC]">{totalWatches.toLocaleString()}</p>
            <p className="text-[#94A3B8] text-xs mt-1">Total Watches</p>
          </div>
        </div>

        {/* TMDB API Updates Feed */}
        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl shadow-lg overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Latest API Pipeline Updates</h3>
            <RefreshCw className="w-4 h-4 text-[#44FFFF]" />
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {movieUpdates.slice(0, 3).map((update) => (
              <div key={update.id} className="text-xs flex gap-2 items-center p-2 bg-[#0B0E14] rounded-lg border border-[#BFBCFC]/5">
                <span className="text-[#BFBCFC] font-semibold truncate max-w-[100px]">{update.movieTitle}</span>
                <span className="text-[#94A3B8] truncate flex-1">{update.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charting Framework Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#151921] to-[#0B0E14] border border-[#BFBCFC]/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#F8FAFC]">User Growth Trends</h3>
            <div className="flex gap-1 bg-[#0B0E14] p-1 rounded-xl border border-[#BFBCFC]/15">
              <button onClick={() => setChartPeriod('month')} className={`px-3 py-1 rounded-lg text-xs ${chartPeriod === 'month' ? 'bg-[#BFBCFC] text-[#0B0E14] font-semibold' : 'text-[#94A3B8]'}`}>Month</button>
              <button onClick={() => setChartPeriod('year')} className={`px-3 py-1 rounded-lg text-xs ${chartPeriod === 'year' ? 'bg-[#BFBCFC] text-[#0B0E14] font-semibold' : 'text-[#94A3B8]'}`}>Year</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" stroke="#94A3B8" style={{ fontSize: '10px' }} />
              <YAxis stroke="#94A3B8" style={{ fontSize: '10px' }} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#BFBCFC" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Watched Ranking */}
        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">Most Watched This Week</h3>
          <div className="space-y-3">
            {topMovies.slice(0, 3).map((movie, idx) => {
              const posterUrl = movie.poster 
                ? (movie.poster.startsWith('http') ? movie.poster : `https://image.tmdb.org/t/p/w92${movie.poster}`)
                : 'https://via.placeholder.com/92x138/151921/BFBCFC?text=No+Poster';
              return (
                <div key={idx} className="flex items-center gap-3 p-2.5 bg-[#0B0E14] rounded-lg text-sm border border-[#BFBCFC]/5">
                  <span className="text-xs font-bold text-[#94A3B8] w-4">{idx + 1}.</span>
                  <div className="w-8 h-12 rounded overflow-hidden bg-[#151921] border border-[#BFBCFC]/10 flex-shrink-0">
                    <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F8FAFC] font-semibold truncate" title={movie.title}>{movie.title}</p>
                    <p className="text-[#44FFFF] font-mono text-[10px] mt-0.5">{movie.watches.toLocaleString()} hits</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}