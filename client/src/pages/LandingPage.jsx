import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Sparkles, SmilePlus, BookOpen, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Mood Tracking',
      description: 'Log your daily emotions and discover patterns in your mental well-being over time.',
      icon: SmilePlus,
      color: 'text-accent'
    },
    {
      title: 'AI Companion',
      description: 'Chat with an empathetic AI that offers support, mindfulness tips, and a listening ear.',
      icon: MessageSquare,
      color: 'text-accent2'
    },
    {
      title: 'Daily Journal',
      description: 'Express your thoughts securely. Let AI guide you with personalized reflection prompts.',
      icon: BookOpen,
      color: 'text-success'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzE1MzE1ZiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBhMTYyOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0wLDQwMCBMMDAsMjAwIEMxMDAsMzAwIDIwMCwxMDAgNDAwLDIwMCBMNDAwLDQwMCBaIiBmaWxsPSJ1cmwoI2dyYWQpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-20 animate-wave mix-blend-screen" style={{ backgroundSize: '50% 50%' }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent2/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-accent2 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(45,212,191,0.6)] transition-shadow duration-300">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-white">MindCare AI</span>
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary hidden sm:block">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto mt-10 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Mental Wellness</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-tight mb-6 text-white tracking-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Mental Wellness Companion
            </span>
          </h1>

          <p className="text-lg md:text-xl text-textSecondary/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            Track your moods, write guided daily journals, and get personalized emotional support from our advanced AI, all in one secure place.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 w-full sm:w-auto"
              >
                Start Your Journey
              </Link>

              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto"
              >
                Welcome Back
              </Link>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 mb-16 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="glass-card p-6 text-left hover:-translate-y-3 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(59,130,246,0.08)] group-hover:scale-110 transition-all duration-300 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-heading font-semibold mb-2">
                {feature.title}
              </h3>

              <p className="text-textSecondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-textMuted text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-4 h-4 opacity-50" />
          <span className="font-heading font-medium tracking-wide opacity-75">MindCare AI</span>
        </div>
        <p>Your Personal Mental Wellness Companion</p>
        <p className="mt-4 opacity-50">© {new Date().getFullYear()} MindCare AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
