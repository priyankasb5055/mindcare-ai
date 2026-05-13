import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const MoodCard = ({ mood, onDelete }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-5 relative group transition-all duration-300 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{mood.emoji}</div>
          <div>
            <h4 className="text-lg font-heading font-semibold text-textPrimary capitalize">{mood.mood}</h4>
            <p className="text-xs text-textMuted">{format(new Date(mood.date), 'MMM d, yyyy • h:mm a')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent/20 text-accent border border-accent/30">
            {mood.moodScore}/5
          </span>
          <button 
            onClick={() => onDelete(mood._id)}
            className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {mood.note && (
        <p className="text-sm text-textSecondary mt-2 italic bg-primary/30 p-3 rounded-xl border border-white/5">
          "{mood.note}"
        </p>
      )}
      
      {mood.tags && mood.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {mood.tags.map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-secondary text-textMuted border border-white/5 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MoodCard;
