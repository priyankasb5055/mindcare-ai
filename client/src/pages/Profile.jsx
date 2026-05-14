import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Save, Loader2, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ totalMoods: 0, totalJournals: 0, memberSince: null });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setProfilePicture(user.profilePicture || '');
      setStats(prev => ({ ...prev, memberSince: user.createdAt }));
      
      const fetchStats = async () => {
        try {
          const moodRes = await api.get('/api/moods');
          const journalRes = await api.get('/api/journals');
          setStats(prev => ({
            ...prev,
            totalMoods: moodRes.data.success ? moodRes.data.data.totalEntries : 0,
            totalJournals: journalRes.data.success ? journalRes.data.data.length : 0
          }));
        } catch (error) {
          console.error("Failed to load user stats");
        }
      };
      
      fetchStats();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await api.put('/auth/profile', { name, bio, profilePicture });
      if (res.data.success) {
        toast.success('Profile updated successfully');
        setUser(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <h1 className="text-3xl font-heading font-bold text-textPrimary mb-6">Profile Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Avatar & Quick Info */}
              <div className="md:col-span-1 space-y-6">
                <div className="glass-card p-6 flex flex-col items-center text-center">
                  <div className="relative mb-4 group cursor-pointer">
                    <div className="w-32 h-32 rounded-full border-4 border-card bg-secondary flex items-center justify-center overflow-hidden shadow-xl">
                      {profilePicture ? (
                        <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-textMuted" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-primary/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-heading font-bold text-textPrimary">{user?.name}</h2>
                  <p className="text-sm text-textSecondary">{user?.email}</p>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Account Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className="text-textSecondary text-sm">Total Moods Logged</span>
                      <span className="font-semibold text-accent">{stats.totalMoods}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className="text-textSecondary text-sm">Journal Entries</span>
                      <span className="font-semibold text-accent2">{stats.totalJournals}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-textSecondary text-sm">Member Since</span>
                      <span className="text-sm text-textPrimary">
                        {stats.memberSince ? format(new Date(stats.memberSince), 'MMM yyyy') : '...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Edit Form */}
              <div className="md:col-span-2">
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-heading font-semibold text-lg mb-6">Edit Profile</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1.5 ml-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-textMuted" />
                        </div>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-field pl-11" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1.5 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-textMuted" />
                        </div>
                        <input 
                          type="email" 
                          disabled
                          value={user?.email || ''}
                          className="input-field pl-11 opacity-50 cursor-not-allowed" 
                        />
                      </div>
                      <p className="text-xs text-textMuted mt-1 ml-1">Email cannot be changed.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1.5 ml-1">Profile Picture URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Camera className="w-5 h-5 text-textMuted" />
                        </div>
                        <input 
                          type="url" 
                          value={profilePicture}
                          onChange={(e) => setProfilePicture(e.target.value)}
                          className="input-field pl-11" 
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1.5 ml-1">Bio</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="input-field min-h-[120px] resize-none" 
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-primary py-2.5 px-6 flex items-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
