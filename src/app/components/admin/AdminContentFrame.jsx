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
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">Dashboard Overview</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Monitor your platform's key metrics and activities</p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Stats and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {/* Total Users */}
            <div className="group relative bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-3 md:p-5 shadow-lg transition-all duration-300 hover:border-[#BFBCFC]/30">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#BFBCFC]/10 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#BFBCFC]" />
                </div>
                <div>
                  <p className="text-base sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">{totalUsers.toLocaleString()}</p>
                  <p className="text-[#94A3B8] text-[9px] sm:text-xs font-medium">Total Users</p>
                </div>
              </div>
            </div>

            {/* Total Movies */}
            <div className="group relative bg-[#151921] border border-[#44FFFF]/15 rounded-xl p-3 md:p-5 shadow-lg transition-all duration-300 hover:border-[#44FFFF]/30">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#44FFFF]/10 rounded-lg flex items-center justify-center shrink-0">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 text-[#44FFFF]" />
                </div>
                <div>
                  <p className="text-base sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">{totalMovies.toLocaleString()}</p>
                  <p className="text-[#94A3B8] text-[9px] sm:text-xs font-medium">Movies</p>
                </div>
              </div>
            </div>

            {/* Total Watches */}
            <div className="group relative bg-[#151921] border border-[#FF61D2]/15 rounded-xl p-3 md:p-5 shadow-lg transition-all duration-300 hover:border-[#FF61D2]/30">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF61D2]/10 rounded-lg flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF61D2]" />
                </div>
                <div>
                  <p className="text-base sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">{totalWatches.toLocaleString()}</p>
                  <p className="text-[#94A3B8] text-[9px] sm:text-xs font-medium">Watches</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Growth Trend Chart */}
          <div className="bg-gradient-to-br from-[#151921] to-[#0B0E14] border border-[#BFBCFC]/15 rounded-xl p-4 sm:p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC]">User Growth Trends</h3>
                <p className="text-[10px] sm:text-xs text-[#94A3B8] mt-0.5">Platform growth trajectory</p>
              </div>
              <div className="flex gap-1 bg-[#0B0E14] p-1 rounded-lg border border-[#BFBCFC]/10 shrink-0">
                <button onClick={() => setChartPeriod('week')} className={`px-2 py-1 rounded text-[10px] transition-all ${chartPeriod === 'week' ? 'bg-[#BFBCFC] text-[#0B0E14] font-semibold' : 'text-[#94A3B8]'}`}>Week</button>
                <button onClick={() => setChartPeriod('month')} className={`px-2 py-1 rounded text-[10px] transition-all ${chartPeriod === 'month' ? 'bg-[#BFBCFC] text-[#0B0E14] font-semibold' : 'text-[#94A3B8]'}`}>Month</button>
                <button onClick={() => setChartPeriod('year')} className={`px-2 py-1 rounded text-[10px] transition-all ${chartPeriod === 'year' ? 'bg-[#BFBCFC] text-[#0B0E14] font-semibold' : 'text-[#94A3B8]'}`}>Year</button>
              </div>
            </div>
            <div className="w-full h-[180px] sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94A3B8" style={{ fontSize: '9px' }} tickLine={false} />
                  <YAxis stroke="#94A3B8" style={{ fontSize: '9px' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#151921', 
                      borderColor: 'rgba(191,188,252,0.15)', 
                      borderRadius: '8px', 
                      color: '#F8FAFC',
                      fontSize: '11px'
                    }} 
                  />
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#BFBCFC" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#BFBCFC" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="users" stroke="#BFBCFC" strokeWidth={2} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Top Watched Ranking & API Pipeline Updates */}
        <div className="space-y-6">
          {/* Top Watched Ranking */}
          <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 sm:p-6 shadow-xl">
            <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] mb-4">Most Watched This Week</h3>
            <div className="space-y-3">
              {topMovies.slice(0, 3).map((movie, idx) => {
                const posterUrl = movie.poster 
                  ? (movie.poster.startsWith('http') ? movie.poster : `https://image.tmdb.org/t/p/w92${movie.poster}`)
                  : 'https://via.placeholder.com/92x138/151921/BFBCFC?text=No+Poster';
                return (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-[#0B0E14] rounded-lg text-sm border border-[#BFBCFC]/5">
                    <span className="text-xs font-bold text-[#94A3B8] w-4">{idx + 1}.</span>
                    <div className="w-8 h-12 rounded overflow-hidden bg-[#151921] border border-[#BFBCFC]/10 flex-shrink-0">
                      <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover animate-fade-in" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#F8FAFC] font-semibold truncate" title={movie.title}>{movie.title}</p>
                      <p className="text-[#44FFFF] font-mono text-[9px] mt-0.5">{movie.watches.toLocaleString()} hits</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TMDB API Updates Feed */}
          <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC]">API Pipeline Updates</h3>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">Live content imports</p>
              </div>
              <RefreshCw className="w-3.5 h-3.5 text-[#44FFFF] animate-pulse" />
            </div>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {movieUpdates.slice(0, 3).map((update) => (
                <div key={update.id} className="text-[11px] flex flex-col gap-1 p-2 bg-[#0B0E14] rounded-lg border border-[#BFBCFC]/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#BFBCFC] font-semibold truncate max-w-[150px]">{update.movieTitle}</span>
                    <span className="text-[9px] text-[#4B5563]">Just now</span>
                  </div>
                  <span className="text-[#94A3B8] leading-normal">{update.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}