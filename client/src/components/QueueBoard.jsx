'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Megaphone, Users } from 'lucide-react';
import Timer from './Timer';
import TokenCard from './TokenCard';

export default function QueueBoard({ servingToken, tokens, remainingTime, isPaused, onDrop }) {
  return (
    <div className="space-y-10">
      {/* Active Serving Terminal */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card p-12 relative overflow-hidden transition-all duration-500 ${
          servingToken ? 'border-primary/40' : 'border-white/5 opacity-50'
        }`}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-glow" />
        
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-xs font-bold text-primary tracking-[0.4em] mb-4 uppercase">Directives Terminal</h2>
            <h3 className="text-4xl font-black text-white tracking-tighter">
              {servingToken ? 'PROTOCOL IN PROGRESS' : 'SYSTEM IDLE'}
            </h3>
          </div>
          <div className="text-right">
            <Activity className={!isPaused && servingToken ? 'animate-pulse text-primary' : 'text-slate-700'} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-shrink-0">
            <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 ${
              servingToken ? 'border-primary shadow-glow bg-primary/5' : 'border-white/10'
            }`}>
              <div className="text-7xl font-black text-white leading-none">
                {servingToken ? servingToken.tokenNumber : '--'}
              </div>
              <div className="text-[10px] text-primary font-bold mt-2 tracking-widest uppercase">Token ID</div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="mb-8">
              <div className="text-[10px] text-slate-500 tracking-widest uppercase mb-1">Active Entity</div>
              <div className="text-3xl font-black text-white">
                {servingToken ? servingToken.guestName : 'Awaiting Sequence...'}
              </div>
            </div>
            
            <Timer remainingTime={remainingTime} />
          </div>
        </div>

        {servingToken && (
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4 text-xs font-bold text-slate-400">
            <Megaphone size={14} className="text-primary" /> 
            <span className="tracking-widest uppercase animate-pulse">Voice announcement active: Broadcasting token status...</span>
          </div>
        )}
      </motion.section>

      {/* Pending Sequences Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-bold text-slate-500 tracking-[0.3em] uppercase">Pending Sequences</h3>
          <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-400">
            TOTAL: {tokens.length} ENTITIES
          </span>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {tokens.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass-card opacity-30 border-dashed"
              >
                <Users size={48} className="mx-auto mb-4" />
                <div className="tracking-widest uppercase text-xs">No pending sequences in current node</div>
              </motion.div>
            ) : (
              tokens.map((token, index) => (
                <TokenCard 
                  key={token.id} 
                  token={token} 
                  position={index} 
                  onDrop={onDrop}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
