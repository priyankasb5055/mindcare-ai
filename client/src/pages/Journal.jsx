import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Sparkles, Save, Loader2, Trash2, BookOpen, Mic } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import JournalCard from '../components/JournalCard';
import { useJournal } from '../hooks/useJournal';
import api from '../services/api';
import toast from 'react-hot-toast';

const Journal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { journals, loading, fetchJournals, createJournal, updateJournal, deleteJournal } = useJournal();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [generatingPrompt, setGeneratingPrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJournals(searchQuery);
  };

  const openNewModal = () => {
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setMood('');
    setIsPrivate(true);
    setIsModalOpen(true);
  };

  const openEditModal = (journal) => {
    setCurrentEntry(journal);
    setTitle(journal.title);
    setContent(journal.content);
    setMood(journal.mood || '');
    setIsPrivate(journal.isPrivate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setCurrentEntry(null);
    }, 200);
  };

  const handleGetPrompt = async () => {
    setIsPromptLoading(true);
    try {
      const res = await api.post('/api/ai/journal-prompt', { currentMood: mood });
      if (res.data.success) {
        if (!content) {
          setContent(res.data.data.prompt + '\n\n');
        } else {
          setContent(prev => prev + '\n\nAI Prompt: ' + res.data.data.prompt + '\n');
        }
      }
    } catch (error) {
      toast.error('Failed to get prompt');
    } finally {
      setIsPromptLoading(false);
    }
  };

  const handleGeneratePrompt = async () => {
    try {
      setGeneratingPrompt(true);

      const res = await api.post('/api/ai/journal-prompt', {
        currentMood: mood || 'neutral',
      });

      if (res.data.success) {
        setContent(res.data.data.prompt);
      }

    } catch (error) {
      console.error(error);
      toast.error('Failed to generate prompt');
    } finally {
      setGeneratingPrompt(false);
    }
  };

  const handleVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setContent((prev) =>
        prev ? prev + ' ' + transcript : transcript
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (currentEntry) {
      success = await updateJournal(currentEntry._id, { title, content, mood, isPrivate });
    } else {
      success = await createJournal({ title, content, mood, isPrivate });
    }

    setIsSubmitting(false);

    if (success) {
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this journal entry?')) {
      const success = await deleteJournal(currentEntry._id);
      if (success) {
        closeModal();
      }
    }
  };

  const moodEmojis = ['😄', '🙂', '😐', '😞', '😢'];

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-3xl font-heading font-bold text-textPrimary">My Journal</h1>
              <button onClick={openNewModal} className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" /> New Entry
              </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-textMuted" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 bg-secondary/50 border-white/5"
                placeholder="Search journals..."
              />
              <button type="submit" className="hidden">Search</button>
            </form>

            {/* Journals Grid */}
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
            ) : journals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journals.map(journal => (
                  <JournalCard key={journal._id} journal={journal} onClick={openEditModal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-card border border-dashed border-white/10">

                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                  <BookOpen className="w-10 h-10 text-accent" />
                </div>

                <h3 className="text-2xl font-bold text-textPrimary mb-3">
                  Your journal is waiting ✨
                </h3>

                <p className="text-textSecondary mb-8 max-w-md mx-auto leading-relaxed">
                  Start documenting your thoughts, emotions, and daily reflections to better understand your mental wellness journey.
                </p>

                <button
                  onClick={openNewModal}
                  className="btn-primary"
                >
                  Write Your First Entry
                </button>

              </div>
            )}
          </div>
        </main>
      </div>

      {/* Journal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-3xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-heading font-semibold">
                  {currentEntry ? 'Edit Entry' : 'New Entry'}
                </h2>
                <button onClick={closeModal} className="text-textMuted hover:text-textPrimary p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title your thoughts..."
                  className="w-full bg-transparent border-none text-2xl font-heading font-bold text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-0 px-0"
                />

                <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-textSecondary mr-2">Mood:</span>
                    {moodEmojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setMood(emoji)}
                        className={`text-xl transition-transform ${mood === emoji ? 'scale-125' : 'opacity-50 hover:opacity-100'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 ml-auto">
                    <label className="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isPrivate} 
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="rounded border-white/20 bg-primary text-accent focus:ring-accent focus:ring-offset-primary"
                      />
                      Private
                    </label>

                    <button
                      type="button"
                      onClick={handleGeneratePrompt}
                      disabled={generatingPrompt}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                      {generatingPrompt ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          AI Prompt
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end mb-3">

                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isListening
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <Mic className="w-4 h-4" />

                    {isListening
                      ? 'Listening...'
                      : 'Start Voice Journal'}
                  </button>

                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing..."
                  className="w-full min-h-[300px] bg-transparent border-none text-textPrimary leading-relaxed focus:outline-none focus:ring-0 px-0 resize-none"
                ></textarea>
              </div>

              <div className="p-4 border-t border-white/10 flex justify-between bg-secondary/30">
                {currentEntry ? (
                  <button type="button" onClick={handleDelete} className="flex items-center gap-2 text-danger hover:text-danger/80 text-sm font-medium px-3 py-2 rounded-lg hover:bg-danger/10 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || !title || !content}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Journal;
