// src/components/admin/AdminSidebar.jsx
import { Shield, LayoutDashboard, Users, Film, List, Flag, Activity, Settings, Award, X } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'movies', label: 'Movie Catalog', icon: Film },
  { id: 'badges', label: 'Badge Controller', icon: Award },
  { id: 'moderation', label: 'Moderation Queue', icon: Flag },
  { id: 'activity', label: 'Activity Logs', icon: Activity },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export function AdminSidebar({ currentView, setCurrentView, isOpen, onClose }) {
  const handleItemClick = (id) => {
    setCurrentView(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#151921] border-r border-[#BFBCFC]/10 flex flex-col z-50 transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:z-40 lg:w-64 lg:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[#BFBCFC]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0B0E14]" />
              </div>
              <div>
                <h1 className="text-[#F8FAFC] font-bold text-sm">TraceMyMovies</h1>
                <p className="text-[#94A3B8] text-xs">Admin Panel</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#BFBCFC]/10 text-[#BFBCFC] border border-[#BFBCFC]/20'
                    : 'text-[#94A3B8] hover:bg-[#BFBCFC]/5 hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}