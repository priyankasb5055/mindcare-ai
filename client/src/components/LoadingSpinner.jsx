import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="relative w-24 h-24 flex items-center justify-center rounded-full bg-accent/10 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.15)]"
      >
        <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-accent2 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
        <Brain className="w-10 h-10 text-accent drop-shadow-[0_0_10px_rgba(30,144,255,0.8)]" />
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-xl font-heading text-textPrimary font-semibold tracking-wide"
      >
        MindCare AI
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 text-textMuted text-sm animate-pulse"
      >
        Preparing your wellness space...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
