'use client';
import { motion } from 'framer-motion';
import { Clock, User as UserIcon, Zap, RotateCcw } from 'lucide-react';

export default function TokenCard({ token, position, onDrop }) {
  const isPriority = token.priority || token.isPriority;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-5 glass-card mb-4 flex justify-between items-center group hover:border-primary/50 transition-colors ${
        isPriority ? 'border-accent/40 bg-accent/5' : ''
      }`}
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-glow ${
          isPriority ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
        }`}>
          {token.tokenNumber}
        </div>
        <div>
          <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
            {token.guestName || token.displayName}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} /> {position * 5}m wait
            </span>
            {isPriority && (
              <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold tracking-tighter">
                PRIORITY
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Position</div>
          <div className="text-xl font-black text-slate-300">#{position + 1}</div>
        </div>
        <button 
          onClick={() => onDrop && onDrop(token.id)}
          className="p-2 rounded-lg hover:bg-accent/20 text-slate-600 hover:text-accent transition-all"
          title="Drop Sequence"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </motion.div>
  );
}
