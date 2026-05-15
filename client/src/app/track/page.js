'use client';
import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import GlassCard from '@/components/GlassCard';
import { Users, Clock, PlayCircle, Zap } from 'lucide-react';
import ThreeScene from '@/components/ThreeScene';

export default function DisplayBoard() {
  const [branch] = useState('Main');
  const { nowServing, waitingList } = useSocket(branch);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (nowServing) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 2000);
      return () => clearTimeout(t);
    }
  }, [nowServing?.tokenNumber]);

  return (
    <main style={{ position: 'relative', minHeight: '100vh', background: '#0a0a14', color: '#fff', overflow: 'hidden' }}>
      <ThreeScene />
      
      <div style={{ position: 'relative', zIndex: 1, padding: '40px' }}>
        <header style={{ textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '32px', border: '1px solid var(--glass-border)', marginBottom: '48px' }}>
          <h1 className="glow-text" style={{ fontSize: '5rem', textTransform: 'uppercase', letterSpacing: '12px', margin: 0 }}>Now Processing</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Main Serving Card */}
          <div className="glass-card" style={{ 
            padding: '80px 40px', 
            textAlign: 'center', 
            background: flash ? 'rgba(0, 242, 255, 0.2)' : 'rgba(10, 10, 20, 0.8)',
            border: nowServing?.priority ? '4px solid var(--accent)' : '2px solid var(--primary)',
            boxShadow: flash ? '0 0 80px rgba(0, 242, 255, 0.5)' : (nowServing?.priority ? '0 0 60px rgba(255, 0, 102, 0.3)' : 'none'),
            transition: 'all 0.3s ease'
          }}>
            <div className="glow-text" style={{ fontSize: '2rem', color: nowServing?.priority ? 'var(--accent)' : 'var(--primary)', marginBottom: '32px', fontWeight: '900', letterSpacing: '8px' }}>
              {nowServing?.counter || 'STATION ALPHA'} {nowServing?.priority && '★ PRIORITY'}
            </div>
            
            <div style={{ fontSize: '12rem', fontWeight: '900', lineHeight: 1, color: '#fff', textShadow: '0 0 60px rgba(255,255,255,0.5)', margin: '40px 0' }}>
              {nowServing ? nowServing.tokenNumber : 'SCANNING...'}
            </div>

            <div className="glow-text" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '32px' }}>
              {nowServing ? (nowServing.guestName || 'GUEST')?.toUpperCase() : 'SEARCHING FOR ENTITY'}
            </div>

            <div style={{ fontSize: '1.25rem', letterSpacing: '4px', color: 'var(--secondary)', fontWeight: '900' }}>
              MODULE: {nowServing?.serviceType?.toUpperCase() || 'GENERAL'}
            </div>
          </div>

          {/* Upcoming Sequences */}
          <div className="glass-card" style={{ padding: '48px', borderTop: '4px solid var(--secondary)' }}>
            <h2 className="glow-text" style={{ marginBottom: '40px', fontSize: '1.5rem', letterSpacing: '6px' }}>UPCOMING SEQUENCES</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
              {waitingList.slice(0, 10).map((token) => (
                <div key={token._id} style={{ 
                  background: token.priority ? 'rgba(255, 0, 102, 0.1)' : 'rgba(255,255,255,0.03)', 
                  padding: '24px', 
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: token.priority ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: token.priority ? 'var(--accent)' : 'var(--primary)', textShadow: '0 0 20px rgba(0, 242, 255, 0.3)' }}>{token.tokenNumber}</div>
                  <div style={{ fontSize: '10px', color: '#fff', opacity: 0.5, marginTop: '8px', letterSpacing: '2px' }}>{(token.guestName || 'GUEST')?.split(' ')[0].toUpperCase()}</div>
                </div>
              ))}
              {waitingList.length === 0 && (
                <div style={{ fontSize: '1.5rem', opacity: 0.2, letterSpacing: '8px', gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>NO PENDING SEQUENCES</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
