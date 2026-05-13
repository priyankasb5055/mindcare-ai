import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Lock, Unlock, FileText } from 'lucide-react';

const JournalCard = ({ journal, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => onClick(journal)}
      className="glass-card p-5 cursor-pointer relative group transition-all duration-300 hover:shadow-[0_0_20px_rgba(30,144,255,0.15)] h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-heading font-semibold text-textPrimary leading-tight line-clamp-2 pr-4">
          {journal.title}
        </h4>
        <div className="text-textMuted mt-1">
          {journal.isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4 text-xs text-textMuted">
        <span>{format(new Date(journal.createdAt), 'MMM d, yyyy')}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" /> {journal.wordCount} words
        </span>
        {journal.mood && (
           <>
             <span>•</span>
             <span className="text-sm">{journal.mood}</span>
           </>
        )}
      </div>
      
      <p className="text-sm text-textSecondary line-clamp-3 mt-auto flex-1">
        {journal.content}
      </p>
      
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-accent text-xs font-medium">Read more</span>
      </div>
    </motion.div>
  );
};

export default JournalCard;
