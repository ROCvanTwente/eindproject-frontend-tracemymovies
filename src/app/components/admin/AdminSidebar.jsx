// src/components/admin/AdminSidebar.jsx
import { Shield, LayoutDashboard, Users, Film, List, Flag, Activity, Settings } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'movies', label: 'Movie Catalog', icon: Film },
  { id: 'lists', label: 'User Lists', icon: List },
  { id: 'moderation', label: 'Moderation Queue', icon: Flag },
  { id: 'activity', label: 'Activity Logs', icon: Activity },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export function AdminSidebar({ currentView, setCurrentView }) {
  return (
    <aside className="w-64 bg-[#151921] border-r border-[#BFBCFC]/10 fixed left-0 top-0 bottom-0 flex flex-col z-40">
      <div className="p-6 border-b border-[#BFBCFC]/10">
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

      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
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

      <div className="p-4 border-t border-[#BFBCFC]/10">
        <div className="flex items-center gap-3 p-3 bg-[#0B0E14] rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center">
            <span className="text-[#0B0E14] font-bold text-sm">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-[#F8FAFC] font-medium text-sm">Admin</p>
            <p className="text-[#44FFFF] text-xs">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}