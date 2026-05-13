import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Sparkles, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBubble from '../components/ChatBubble';
import api from '../services/api';
import toast from 'react-hot-toast';

const AICompanion = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm MindCare AI, your personal wellness companion. How are you feeling today?",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: text,
        conversationHistory: messages
      });

      if (res.data.success) {
        setMessages([
          ...newHistory,
          {
            role: 'assistant',
            content: res.data.data.reply,
            usage: res.data.data.usage,
            timestamp: Date.now()
          }
        ]);
      }
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starterPrompts = [
    "I'm feeling anxious",
    "Help me relax",
    "Give me a motivational quote",
    "I need to vent"
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 flex flex-col overflow-hidden relative max-w-4xl mx-auto w-full">
          
          {/* Header */}
          <div className="p-4 lg:p-6 pb-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-accent2 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-textPrimary leading-tight">MindCare AI</h1>
                <p className="text-xs text-accent2 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
                  </span>
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:px-6 scroll-smooth">
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex items-center gap-2 max-w-[75%] px-5 py-4 rounded-2xl bg-card border border-accent2/20 rounded-tl-sm text-textPrimary">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-accent2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-accent2 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-accent2 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap justify-center gap-2 shrink-0">
              {starterPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-secondary hover:bg-card border border-white/5 hover:border-accent/30 text-textSecondary hover:text-textPrimary px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-accent2" /> {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 pt-2 shrink-0 border-t border-white/5 bg-primary/80 backdrop-blur-md">
            <div className="relative flex items-end gap-2 bg-secondary/50 rounded-2xl border border-white/10 p-1 pr-2 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 text-textPrimary placeholder:text-textMuted resize-none py-3 px-4"
                rows="1"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="mb-1 p-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-textMuted">AI can make mistakes. Consider verifying important information.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AICompanion;
