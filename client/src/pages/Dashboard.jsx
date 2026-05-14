import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Flame, Activity, FileText, Sparkles, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MoodChart from '../components/MoodChart';
import JournalCard from '../components/JournalCard';
import { useAuth } from '../hooks/useAuth';
import { useMood } from '../hooks/useMood';
import { useJournal } from '../hooks/useJournal';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import MoodCalendar from '../components/MoodCalendar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const { user } = useAuth();
  const { moods, stats, fetchMoods, fetchMoodStats, createMood } = useMood();
  const { journals, fetchJournals } = useJournal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isCrisis, setIsCrisis] = useState(false);
  const [stressScore, setStressScore] = useState(5);
  const [happinessScore, setHappinessScore] = useState(5);
  const [balanceScore, setBalanceScore] = useState(5);
  const [loadingInsight, setLoadingInsight] = useState(true);
  const navigate = useNavigate();
  const [showBreathing, setShowBreathing] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');
  useEffect(() => {
    if (!showBreathing) return;

    const sequence = [
      {
        text: 'Inhale...',
        scale: 'scale-125',
        duration: 4000,
      },
      {
        text: 'Hold...',
        scale: 'scale-125',
        duration: 4000,
      },
      {
        text: 'Exhale...',
        scale: 'scale-100',
        duration: 6000,
      },
    ];

    let index = 0;

    const runSequence = () => {
      const current = sequence[index];

      setBreathingText(current.text);
      setBreathingScale(current.scale);

      index = (index + 1) % sequence.length;

      timeout = setTimeout(runSequence, current.duration);
    };

    let timeout = setTimeout(runSequence, 0);

    return () => clearTimeout(timeout);

  }, [showBreathing]);

  useEffect(() => {

  if (!('Notification' in window)) return;

  Notification.requestPermission();
  const reminders = [
    '💙 Take a moment to breathe slowly today.',
    '🌸 Your feelings are valid. Be kind to yourself.',
    '🧠 Pause and check in with your emotions.',
    '✨ Small progress is still progress.',
    '🌿 Drink some water and relax your mind.',
    '💤 Rest is productive too.',
    '📖 Try journaling your thoughts for clarity.',
    '😊 You’ve handled difficult days before.',
  ];
  const reminder = setInterval(() => {

    const now = new Date();

    const hour = now.getHours();
    const minute = now.getMinutes();

    if (Notification.permission === 'granted') {

      // Morning Reminder → 9:00 AM
      if (hour === 9 && minute === 0) {

        new Notification('🌅 Good Morning', {
          body: 'Take a moment to check in with yourself today 💙',
          icon: '/favicon.ico',
        });

      }

      // Evening Reminder → 8:00 PM
      if (hour === 20 && minute === 0) {

        new Notification('🌙 Evening Reflection', {
          body: 'Reflect on your emotions before resting tonight 🌸',
          icon: '/favicon.ico',
        });

      }

    }

  }, 60000);

  return () => clearInterval(reminder);

}, []);

  const [breathingText, setBreathingText] = useState('Inhale...');
  const [breathingScale, setBreathingScale] = useState('scale-100');

  useEffect(() => {

    const quotes = [
      '🌿 Healing is not linear, and that’s okay.',
      '💙 You survived 100% of your hardest days.',
      '✨ Small progress is still progress.',
      '🌸 Resting is productive too.',
      '🧠 Your feelings deserve kindness, not judgment.',
      '🌈 Better days are coming.',
      '💫 Take things one breath at a time.',
      '🌻 You are doing better than you think.',
    ];

    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];

    setDailyQuote(randomQuote);

  }, []);

  useEffect(() => {
    fetchMoods(7); // Get last 7 days
    fetchMoodStats();
    fetchJournals();
  }, [fetchMoods, fetchMoodStats, fetchJournals]);

  useEffect(() => {
    const getInsight = async () => {
      if (moods.length > 0 || journals.length > 0) {
        try {
          const res = await api.post('/api/ai/analyze-mood', {
            recentMoods: moods.slice(0, 5),
            recentJournals: journals.slice(0, 2)
          });
          if (res.data.success) {
            setAiInsight(res.data.data.insight);
            setStressScore(res.data.data.stressScore);
            setHappinessScore(res.data.data.happinessScore);
            setBalanceScore(res.data.data.balanceScore);
            setIsCrisis(res.data.data.isCrisis);
          }
        } catch (error) {
          console.error("Failed to load AI insight");
          setAiInsight("Keep tracking your moods and journaling to get personalized insights.");
        } finally {
          setLoadingInsight(false);
        }
      } else {
        setAiInsight("Start logging your moods and journals to receive personalized AI wellness insights.");
        setLoadingInsight(false);
      }
    };

    if (moods.length > 0 || journals.length > 0) {
       getInsight();
    } else {
       setLoadingInsight(false);
       setAiInsight("Start logging your moods and journals to receive personalized AI wellness insights.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moods.length, journals.length]);

  const handleQuickMood = async (mood) => {
    await createMood({ mood });
    fetchMoods(7);
    fetchMoodStats();
  };

  const today = format(new Date(), 'EEEE, MMMM do');

  const downloadReport = async () => {

    const input =
      document.getElementById('wellness-report');

    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#071426',
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      'PNG',
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save('MindCare-Wellness-Report.pdf');
  };

  const moodEmojis = [
    { label: 'great', emoji: '😄' },
    { label: 'good', emoji: '🙂' },
    { label: 'okay', emoji: '😐' },
    { label: 'bad', emoji: '😞' },
    { label: 'terrible', emoji: '😢' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
          <motion.div

            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-textPrimary">
                  Good morning, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-textMuted mt-1">{today}</p>
              </div>
              <button
                onClick={downloadReport}
                className="btn-primary"
              >
                📄 Download Wellness Report
              </button>
            </div>

            <div className="glass-card p-5 border border-white/10">

              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                🌤 Daily Wellness Quote
              </h3>

              <p className="text-textSecondary italic leading-relaxed">
                {dailyQuote}
              </p>

            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-textMuted">Current Streak</p>
                  <p className="text-2xl font-bold text-textPrimary">{stats?.streakCount || 0} Days</p>
                </div>
              </div>
              
              <div className="glass-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-textMuted">Weekly Avg Mood</p>
                  <p className="text-2xl font-bold text-textPrimary">{stats?.weeklyAverage || 0}/5</p>
                </div>
              </div>

              <div className="glass-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-textMuted">Total Journals</p>
                  <p className="text-2xl font-bold text-textPrimary">{journals.length || 0}</p>
                </div>
              </div>
            </div>

            <div
              id="wellness-report"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: AI Insight & Quick Log */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* AI Insight */}
                {isCrisis && (
                  <div className="glass-card p-6 border border-red-500/40 bg-red-500/10 mb-6">

                    <h2 className="text-xl font-semibold text-red-400 mb-3">
                      🚨 Emotional Support Alert
                    </h2>

                    <p className="text-textSecondary leading-relaxed">
                      We noticed signs of emotional distress in your recent moods or journals.
                      Please remember that you are not alone. Consider reaching out to someone
                      you trust, practicing calming techniques, or seeking professional support.
                    </p>

                    <div className="mt-4 flex gap-3 flex-wrap">
                      <button
                        className="btn-primary"
                        onClick={() => setShowBreathing(true)}
                      >
                        💙 Take a Breathing Break
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() =>
                          window.open('https://findahelpline.com/', '_blank')
                        }
                      >
                        📞 Reach Out to Support
                      </button>
                    </div>

                  </div>
                )}
                <div className="glass-card p-6 border-accent/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[50px] -mr-10 -mt-10"></div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-accent2" />
                    <h3 className="font-heading font-semibold text-lg text-textPrimary">AI Insight</h3>
                  </div>
                  {loadingInsight ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-4 bg-white/10 rounded w-full"></div>
                      <div className="h-4 bg-white/10 rounded w-5/6"></div>
                      <div className="h-4 bg-white/10 rounded w-4/6"></div>
                    </div>
                  ) : (
                    <div className="relative z-10">

                      <p className="text-sm text-textSecondary leading-relaxed">
                        {aiInsight}
                      </p>

                      <div className="mt-6 space-y-4">

                        {/* Stress */}
                        <div>
                          <div className="flex justify-between items-center text-sm mb-2 text-textPrimary font-medium">
                            <span className="flex items-center gap-2">
                              🧠 Stress Level
                            </span>
                            <span>{stressScore}/10</span>
                          </div>

                          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-red-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${stressScore * 10}%` }}
                            />
                          </div>
                        </div>

                        {/* Happiness */}
                        <div>
                          <div className="flex justify-between items-center text-sm mb-2 text-textPrimary font-medium">
                            <span className="flex items-center gap-2">
                              😊 Happiness
                            </span>
                            <span>{happinessScore}/10</span>
                          </div>

                          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-green-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${happinessScore * 10}%` }}
                            />
                          </div>
                        </div>

                        {/* Emotional Balance */}
                        <div>
                          <div className="flex justify-between items-center text-sm mb-2 text-textPrimary font-medium">
                            <span className="flex items-center gap-2">
                              ⚖️ Emotional Balance
                            </span>
                            <span>{balanceScore}/10</span>
                          </div>

                          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${balanceScore * 10}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Log Mood */}
                <div className="glass-card p-6">
                  <h3 className="font-heading font-semibold text-lg text-textPrimary mb-4">How are you feeling right now?</h3>
                  <div className="flex justify-between items-center">
                    {moodEmojis.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => handleQuickMood(m.label)}
                        className="text-3xl hover:scale-125 transition-transform duration-200 focus:outline-none"
                        title={`Log ${m.label}`}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Chart & Recent Journals */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Mood Chart */}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-semibold text-lg text-textPrimary">Mood Trends (Last 7 Days)</h3>
                  </div>
                  <MoodChart data={moods.slice(0, 7)} />
                </div>
                <MoodCalendar moods={moods} />
                {/* Recent Journals */}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-semibold text-lg text-textPrimary">Recent Journals</h3>
                    <button 
                      onClick={() => navigate('/journal')}
                      className="text-sm text-accent hover:text-accent2 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> View All
                    </button>
                  </div>
                  
                  {journals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {journals.slice(0, 2).map(journal => (
                        <JournalCard 
                          key={journal._id} 
                          journal={journal} 
                          onClick={() => navigate('/journal')} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-white/5 border-dashed rounded-xl">
                      <p className="text-textMuted text-sm">No journal entries yet.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </motion.div>
        </main>
      </div>
      {showBreathing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="glass-card p-10 max-w-md w-full text-center relative animate-fadeIn">

            <button
              onClick={() => setShowBreathing(false)}
              className="absolute top-4 right-4 text-textSecondary hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">
              🌬 Breathing Exercise
            </h2>

            <div className="flex justify-center mb-6">

              <div
                className={`w-40 h-40 rounded-full bg-blue-500/30 flex items-center justify-center transition-all duration-[4000ms] ${breathingScale}`}
              >
                <div className="w-24 h-24 rounded-full bg-blue-400/50 flex items-center justify-center text-xl font-semibold">
                  {breathingText}
                </div>

              </div>

            </div>

            <p className="text-textSecondary leading-relaxed text-lg">
              Follow the breathing rhythm slowly 💙
            </p>

          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
