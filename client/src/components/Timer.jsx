'use client';
import { motion } from 'framer-motion';

export default function Timer({ remainingTime, totalTime = 300 }) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const progress = (remainingTime / totalTime) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4">
        <div className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase">Processing Phase</div>
        <div className="text-4xl font-black font-mono text-white">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "linear" }}
          className={`h-full rounded-full shadow-glow ${
            remainingTime < 60 ? 'bg-accent' : 'bg-primary'
          }`}
        />
      </div>
    </div>
  );
}
