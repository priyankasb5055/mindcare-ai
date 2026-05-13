import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ toggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="h-16 border-b border-white/10 bg-secondary/70 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-textSecondary transition-all duration-200 hover:scale-105"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-accent2 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-shadow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl text-textPrimary tracking-tight">MindCare AI</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-textPrimary">{user?.name}</p>
                <p className="text-xs text-textMuted">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-card border border-white/10 flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-accent font-medium text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
