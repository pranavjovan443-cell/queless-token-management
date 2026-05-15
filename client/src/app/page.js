'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, Zap, Shield, Megaphone, 
  Activity, BarChart3, AlertCircle 
} from 'lucide-react';
import Timer from '@/components/Timer';
import TokenCard from '@/components/TokenCard';
import Controls from '@/components/Controls';
import QueueBoard from '@/components/QueueBoard';
import Modal from '@/components/Modal';
import ThreeScene from '@/components/ThreeScene';
import { playChime, announceToken } from '@/utils/sound';

export default function QlessApp() {
  // State
  const [tokens, setTokens] = useState([]);
  const [servingToken, setServingToken] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {} 
  });

  // Refs for logic
  const timerRef = useRef(null);
  const voiceAnnouncedRef = useRef(null);

  // 1. Initial Load from Local Storage & Hydration Fix
  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem('queless_state');
    if (saved) {
      const state = JSON.parse(saved);
      setTokens(state.tokens || []);
      setServingToken(state.servingToken || null);
      setCompletedCount(state.completedCount || 0);
      setRemainingTime(state.remainingTime || 300);
    }
  }, []);

  // 2. Persist State
  useEffect(() => {
    const state = { tokens, servingToken, completedCount, remainingTime };
    localStorage.setItem('queless_state', JSON.stringify(state));
  }, [tokens, servingToken, completedCount, remainingTime]);

  // 3. Current Time Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 4. Timer & Auto-Serving Logic
  useEffect(() => {
    if (servingToken && !isPaused && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && servingToken) {
      handleNext(); // Auto-move to next when timer ends
    }

    return () => clearInterval(timerRef.current);
  }, [servingToken, isPaused, remainingTime]);

  // 5. Automatic Serving Initialization
  useEffect(() => {
    if (tokens.length > 0 && !servingToken) {
      startServing(tokens[0]);
    }
  }, [tokens, servingToken]);

  // 6. Voice Announcement Trigger
  useEffect(() => {
    if (servingToken && voiceAnnouncedRef.current !== servingToken.tokenNumber) {
      playChime();
      const announcement = `Token ${servingToken.tokenNumber} for ${servingToken.guestName} is now being served.`;
      const msg = new SpeechSynthesisUtterance(announcement);
      window.speechSynthesis.speak(msg);
      voiceAnnouncedRef.current = servingToken.tokenNumber;
    }
  }, [servingToken]);

  // Handlers
  const handleJoinQueue = (e) => {
    if (e) e.preventDefault();
    if (!userName.trim()) {
      setError('Identity required for registration');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const nextNumber = (tokens.length + (servingToken ? 1 : 0) + completedCount + 1);
    const newToken = {
      id: Date.now(),
      tokenNumber: nextNumber,
      guestName: userName,
      bookedAt: new Date(),
      isPriority: false,
    };

    setTokens(prev => [...prev, newToken]);
    setUserName('');
  };

  const startServing = (token) => {
    setServingToken(token);
    setTokens(prev => prev.filter(t => t.id !== token.id));
    setRemainingTime(300); // Reset to 5m
    setIsPaused(false);
  };

  const handleNext = () => {
    if (servingToken) {
      setCompletedCount(prev => prev + 1);
      setServingToken(null);
    }
    
    if (tokens.length > 0) {
      startServing(tokens[0]);
    }
  };

  const handleDropServing = () => {
    setModalConfig({
      isOpen: true,
      title: 'Terminate Session',
      message: 'Are you sure you want to terminate the active session? This token will be purged from the current processing sequence.',
      onConfirm: () => {
        setServingToken(null);
        if (tokens.length > 0) {
          startServing(tokens[0]);
        }
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDropToken = (tokenId) => {
    setModalConfig({
      isOpen: true,
      title: 'Remove Entity',
      message: 'Do you want to permanently remove this entity from the waiting sequence?',
      onConfirm: () => {
        setTokens(prev => prev.filter(t => t.id !== tokenId));
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleReset = () => {
    setModalConfig({
      isOpen: true,
      title: 'System Reset',
      message: 'CRITICAL: This will purge ALL sequence data, reset token numbering, and clear local storage. Proceed with caution.',
      onConfirm: () => {
        setTokens([]);
        setServingToken(null);
        setCompletedCount(0);
        setRemainingTime(300);
        localStorage.removeItem('queless_state');
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <main className="min-h-screen relative p-4 md:p-10 lg:p-16">
      <ThreeScene />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg animate-pulse-glow">
                <Zap className="text-primary" size={20} />
              </div>
              <span className="text-[10px] tracking-[0.4em] text-primary font-bold uppercase">System Operational</span>
            </div>
            <h1 className="text-5xl font-black glow-text tracking-tighter">QUEUELESS CORE</h1>
          </div>
          
          <div className="flex items-center gap-6 glass-card px-8 py-4">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 tracking-widest uppercase">Temporal Sync</div>
              <div className="text-xl font-mono font-bold text-white">
                {hasMounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
              </div>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-right">
              <div className="text-[10px] text-slate-500 tracking-widest uppercase">Node Status</div>
              <div className="text-xl font-bold text-green-400">ACTIVE</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Registration & Controls */}
          <div className="lg:col-span-4 space-y-10">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8"
            >
              <h3 className="text-xs font-bold text-slate-500 tracking-[0.3em] mb-8 uppercase flex items-center gap-2">
                <Shield size={14} className="text-primary" /> Entity Registration
              </h3>
              
              <form onSubmit={handleJoinQueue} className="space-y-6">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-3 tracking-widest uppercase font-bold">Identity Descriptor</label>
                  <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter full name..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:border-primary/50 transition-all focus:bg-white/10"
                  />
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-accent text-xs font-bold"
                    >
                      <AlertCircle size={14} /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Controls 
                  onJoin={handleJoinQueue}
                  onNext={handleNext}
                  onToggleTimer={() => setIsPaused(!isPaused)}
                  onDropServing={handleDropServing}
                  onReset={handleReset}
                  isPaused={isPaused}
                  hasTokens={servingToken || tokens.length > 0}
                  hasServing={!!servingToken}
                />
              </form>
            </motion.section>

            {/* Dashboard Stats */}
            <section className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <Users className="text-secondary mb-3" size={24} />
                <div className="text-2xl font-black text-white">{tokens.length}</div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Waiting</div>
              </div>
              <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <BarChart3 className="text-accent mb-3" size={24} />
                <div className="text-2xl font-black text-white">{completedCount}</div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Processed</div>
              </div>
            </section>
          </div>

          {/* Right Column: Display Board & Queue List */}
          <div className="lg:col-span-8">
            <QueueBoard 
              servingToken={servingToken}
              tokens={tokens}
              remainingTime={remainingTime}
              isPaused={isPaused}
              onDrop={handleDropToken}
            />
          </div>
        </div>
      </div>

      <Modal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}
