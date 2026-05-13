import React from 'react';
import { motion } from 'framer-motion';
import { Brain, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

const ChatBubble = ({ message }) => {
  const isAI = message.role === 'assistant';
  const { user } = useAuth();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
        scale: 0.98
      }}

      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}

      transition={{
        duration: 0.35,
        ease: 'easeOut'
      }}
      className={`flex w-full mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] sm:max-w-[75%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 mt-1 ${isAI ? 'mr-3' : 'ml-3'}`}>
          {isAI ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent2 to-accent flex items-center justify-center shadow-[0_0_10px_rgba(45,212,191,0.4)]">
              <Brain className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-textSecondary" />
              )}
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
          <div 
            className={`px-4 py-3 rounded-2xl ${
              isAI 
                ? 'bg-card/90 backdrop-blur-md border border-accent2/20 text-textPrimary rounded-tl-sm shadow-[0_4px_20px_rgba(168,85,247,0.08)]' 
                : 'bg-accent text-white rounded-tr-sm shadow-[0_4px_15px_rgba(30,144,255,0.3)]'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-2 mt-1 px-1">
            <span className="text-[10px] text-textMuted">
              {format(new Date(message.timestamp || Date.now()), 'h:mm a')}
            </span>
            {isAI && message.usage && (
              <span className="text-[9px] text-textMuted/50 border border-white/5 rounded px-1">
                {message.usage.input_tokens + message.usage.output_tokens} tokens
              </span>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ChatBubble;
