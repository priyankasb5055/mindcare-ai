import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Send, Hash, Loader2, SmilePlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MoodCard from '../components/MoodCard';
import { useMood } from '../hooks/useMood';

const MoodTracker = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { moods, stats, loading, fetchMoods, fetchMoodStats, createMood, deleteMood } = useMood();
  
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMoods();
    fetchMoodStats();
  }, [fetchMoods, fetchMoodStats]);

  const moodOptions = [
    { label: 'great', emoji: '😄', color: '#22c55e' },
    { label: 'good', emoji: '🙂', color: '#2dd4bf' },
    { label: 'okay', emoji: '😐', color: '#1e90ff' },
    { label: 'bad', emoji: '😞', color: '#f59e0b' },
    { label: 'terrible', emoji: '😢', color: '#ef4444' },
  ];

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    const success = await createMood({ mood: selectedMood, note, tags });
    setIsSubmitting(false);

    if (success) {
      setSelectedMood('');
      setNote('');
      setTags([]);
      fetchMoodStats();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      await deleteMood(id);
      fetchMoodStats();
    }
  };

  // Prepare data for Donut Chart
  const pieData = stats?.moodDistribution ? Object.keys(stats.moodDistribution)
    .filter(key => stats.moodDistribution[key] > 0)
    .map(key => ({
      name: key,
      value: stats.moodDistribution[key],
      color: moodOptions.find(m => m.label === key)?.color || '#1e90ff'
    })) : [];

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <h1 className="text-3xl font-heading font-bold text-textPrimary mb-6">Mood Tracker</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Logging Form & Stats */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Log Mood Form */}
                <div className="glass-card p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Log Your Mood</h3>
                  <form onSubmit={handleSubmit}>
                    
                    <div className="flex justify-between mb-6 bg-primary/30 p-3 rounded-2xl border border-white/5">
                      {moodOptions.map((m) => (
                        <button
                          key={m.label}
                          type="button"
                          onClick={() => setSelectedMood(m.label)}
                          className={`text-3xl transition-all duration-200 p-2 rounded-xl ${selectedMood === m.label ? 'bg-white/10 scale-125 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
                          title={m.label}
                        >
                          {m.emoji}
                        </button>
                      ))}
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-textSecondary mb-1.5 ml-1">Notes (optional)</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="input-field min-h-[80px] resize-none"
                        placeholder="Why are you feeling this way?"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-medium text-textSecondary mb-1.5 ml-1">Tags (press Enter)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="w-4 h-4 text-textMuted" />
                        </div>
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          className="input-field pl-9 py-2 text-sm"
                          placeholder="Add tags..."
                        />
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-1 rounded-md bg-secondary text-textPrimary border border-white/10 flex items-center gap-1">
                              {tag}
                              <button type="button" onClick={() => removeTag(tag)} className="text-textMuted hover:text-danger">&times;</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={!selectedMood || isSubmitting}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Save Entry</>}
                    </button>
                  </form>
                </div>

                {/* Mood Distribution Chart */}
                <div className="glass-card p-6 h-64 flex flex-col">
                  <h3 className="font-heading font-semibold text-lg mb-2">Mood Distribution</h3>
                  {pieData.length > 0 ? (
                    <div className="flex-1 -mt-4">
                      <ResponsiveContainer
                        width="100%"
                        height={300}
                      >
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f2a4a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-sm text-textMuted">No data yet</div>
                  )}
                </div>

              </div>

              {/* Right Column: History List */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 min-h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-heading font-semibold text-lg">History</h3>
                    <div className="text-sm text-textMuted">
                      Total Entries: <span className="text-textPrimary font-semibold">{moods.length}</span>
                    </div>
                  </div>

                  {loading && moods.length === 0 ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
                  ) : moods.length > 0 ? (
                    <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 pb-4">
                      {moods.map((mood) => (
                        <MoodCard key={mood._id} mood={mood} onDelete={handleDelete} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-textMuted">
                      <SmilePlus className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>You haven't logged any moods yet.</p>
                      <p className="text-sm mt-1">Start tracking to see your history here.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MoodTracker;
