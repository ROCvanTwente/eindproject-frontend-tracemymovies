// src/components/admin/AdminSidebar.jsx
import { useRef, useState, useEffect } from 'react';
import { Shield, LayoutDashboard, Users, Film, Flag, Activity, Settings, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', shortLabel: 'Users', icon: Users },
  { id: 'movies', label: 'Movie Catalog', shortLabel: 'Movies', icon: Film },
  { id: 'badges', label: 'Badge Controller', shortLabel: 'Badges', icon: Award },
  { id: 'moderation', label: 'Moderation Queue', shortLabel: 'Moderation', icon: Flag },
  { id: 'activity', label: 'Activity Logs', shortLabel: 'Logs', icon: Activity },
  { id: 'settings', label: 'System Settings', shortLabel: 'Settings', icon: Settings },
];

export function AdminSidebar({ currentView, setCurrentView }) {
  const navRef = useRef(null);
  const currentIndex = navigationItems.findIndex((item) => item.id === currentView);

  const handlePrevTab = () => {
    if (currentIndex > 0) {
      setCurrentView(navigationItems[currentIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    if (currentIndex < navigationItems.length - 1) {
      setCurrentView(navigationItems[currentIndex + 1].id);
    }
  };

  // Automatically scroll the active tab into center view on mobile when view changes
  useEffect(() => {
    if (navRef.current) {
      const activeEl = navRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentView]);

  return (
    <aside className="
      w-full bg-[#151921] border-b border-[#BFBCFC]/10 flex flex-col z-40 sticky top-[76px]
      lg:w-64 lg:h-[calc(100vh-4rem)] lg:border-r lg:border-b-0 lg:sticky lg:top-16 lg:flex-shrink-0
    ">
      {/* Brand title - hidden on mobile, shown on desktop */}
      <div className="hidden lg:block p-6 border-b border-[#BFBCFC]/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#0B0E14]" />
          </div>
          <div>
            <h1 className="text-[#F8FAFC] font-bold text-sm">TraceMyMovies</h1>
            <p className="text-[#94A3B8] text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav List - Horizontal scrolling on mobile with cycling arrows, Vertical on desktop */}
      <div className="relative w-full flex items-center px-2 lg:block lg:px-0 lg:static">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrevTab}
          disabled={currentIndex === 0}
          className="lg:hidden shrink-0 w-8 h-8 rounded-lg bg-[#1E2330] border border-[#BFBCFC]/15 flex items-center justify-center text-[#BFBCFC] disabled:opacity-20 disabled:pointer-events-none hover:bg-[#BFBCFC]/10 active:scale-95 transition-all duration-150"
          aria-label="Previous view"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <nav 
          ref={navRef}
          className="
            flex-1 flex flex-row overflow-x-auto whitespace-nowrap py-3 px-1 gap-2
            lg:flex-col lg:overflow-y-auto lg:p-4 lg:space-y-1 lg:gap-0 lg:whitespace-normal
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          "
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                data-active={isActive}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-xs font-semibold shrink-0 border border-transparent
                  lg:w-full lg:gap-3 lg:px-4 lg:py-3 lg:rounded-lg lg:text-sm lg:font-medium
                  ${
                    isActive
                      ? 'bg-[#BFBCFC]/15 text-[#BFBCFC] border-[#BFBCFC]/20'
                      : 'text-[#94A3B8] hover:bg-[#BFBCFC]/5 hover:text-[#F8FAFC]'
                  }
                `}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="lg:hidden">{item.shortLabel}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Arrow Button */}
        <button
          onClick={handleNextTab}
          disabled={currentIndex === navigationItems.length - 1}
          className="lg:hidden shrink-0 w-8 h-8 rounded-lg bg-[#1E2330] border border-[#BFBCFC]/15 flex items-center justify-center text-[#BFBCFC] disabled:opacity-20 disabled:pointer-events-none hover:bg-[#BFBCFC]/10 active:scale-95 transition-all duration-150"
          aria-label="Next view"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}