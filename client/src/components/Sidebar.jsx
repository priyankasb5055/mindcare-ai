import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, SmilePlus, BookOpen, MessageSquare, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mood Tracker', path: '/mood', icon: SmilePlus },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'AI Companion', path: '/ai', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary/80 backdrop-blur-xl border-r border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
          <div className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 px-3">Menu</div>
          
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) closeSidebar();
              }}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-accent/15 text-accent border border-accent/30 shadow-[0_0_20px_rgba(30,144,255,0.15)]' 
                    : 'text-textSecondary hover:bg-white/10 hover:text-textPrimary hover:translate-x-1 border-l-2 border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-danger/80 hover:bg-danger/15 hover:translate-x-1 hover:text-danger w-full transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
