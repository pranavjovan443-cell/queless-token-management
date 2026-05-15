'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function Modal({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-cyber/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative glass-card max-w-md w-full p-8 border-accent/30 shadow-[0_0_50px_rgba(255,0,102,0.2)]"
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-xl ${type === 'warning' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
              <AlertTriangle size={24} />
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={onConfirm}
              className="flex-1 btn-cyber bg-accent hover:shadow-[0_0_20px_rgba(255,0,102,0.4)] border-none"
              style={{ background: type === 'warning' ? 'var(--accent)' : 'var(--primary)', color: '#000' }}
            >
              CONFIRM PROTOCOL
            </button>
            <button 
              onClick={onClose}
              className="flex-1 btn-outline-cyber border-white/10 text-white hover:bg-white/5"
            >
              ABORT
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
