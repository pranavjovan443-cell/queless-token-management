'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import { Clock, Users, ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

export default function UserDashboard() {
  const [userToken, setUserToken] = useState(null);
  const { nowServing, waitingList } = useSocket('Main');

  useEffect(() => {
    // Mock user token from localStorage if exists
    const saved = localStorage.getItem('last_booked_token');
    if (saved) setUserToken(JSON.parse(saved));
  }, []);

  const peopleAhead = userToken ? waitingList.findIndex(t => t.tokenNumber === userToken.tokenNumber) : -1;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '310px', padding: '48px', width: '100%', maxWidth: '1200px' }}>
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8' }}>Here's your real-time queue status</p>
        </header>

        {userToken ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            {/* Status Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <GlassCard style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '16px' }}>YOUR TOKEN</div>
                <div style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '8px' }} className="glow-text">{userToken.tokenNumber}</div>
                <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Branch: {userToken.branch}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Position</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{peopleAhead === -1 ? 'Unknown' : peopleAhead + 1}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>People Ahead</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{peopleAhead === -1 ? '0' : peopleAhead}</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    <Clock color="#06b6d4" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Est. Time of Service</div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Based on current throughput</div>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{peopleAhead * 8} mins</div>
              </GlassCard>
            </div>

            {/* Side Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <GlassCard>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={20} color="#f59e0b" /> Alerts
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  {peopleAhead <= 2 ? "You're next! Please head to the counter." : "You have plenty of time. We'll notify you when you're 2nd in line."}
                </p>
              </GlassCard>

              <GlassCard style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={20} color="#10b981" /> Verified Booking
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '16px' }}>Your booking is secured. Present your QR code upon arrival.</p>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  View QR Code <ArrowRight size={18} />
                </button>
              </GlassCard>
            </div>
          </div>
        ) : (
          <GlassCard style={{ padding: '80px', textAlign: 'center' }}>
            <Users size={64} color="#6366f1" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>No Active Tokens</h2>
            <p style={{ color: '#94a3b8', marginBottom: '32px' }}>You don't have any active bookings at the moment.</p>
            <button className="btn-primary" onClick={() => window.location.href = '/book'}>
              Book a New Token
            </button>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
