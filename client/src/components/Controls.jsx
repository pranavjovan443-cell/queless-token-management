'use client';
import { Play, SkipForward, Pause, RotateCcw, Plus, Zap } from 'lucide-react';

export default function Controls({ 
  onJoin, 
  onNext, 
  onToggleTimer, 
  onDropServing,
  onReset, 
  isPaused, 
  hasTokens,
  hasServing 
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={onJoin}
        className="btn-cyber col-span-2 py-5"
      >
        <Plus size={24} /> JOIN SYSTEM SEQUENCE
      </button>

      <button 
        onClick={onNext}
        disabled={!hasTokens}
        className={`btn-outline-cyber ${!hasTokens ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        <SkipForward size={20} /> NEXT ENTITY
      </button>

      <button 
        onClick={onToggleTimer}
        disabled={!hasTokens}
        className={`btn-outline-cyber ${!hasTokens ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        {isPaused ? <Play size={20} /> : <Pause size={20} />}
        {isPaused ? 'RESUME' : 'PAUSE'}
      </button>

      <button 
        onClick={onDropServing}
        disabled={!hasServing}
        className={`btn-outline-cyber border-accent/50 text-accent hover:bg-accent/10 ${!hasServing ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        <RotateCcw size={20} /> DROP CURRENT
      </button>

      <button 
        onClick={onReset}
        className="col-span-2 mt-4 text-[10px] text-slate-500 hover:text-accent transition-colors flex items-center justify-center gap-2 tracking-widest"
      >
        <RotateCcw size={12} /> INITIALIZE SYSTEM RESET
      </button>
    </div>
  );
}
