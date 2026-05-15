'use client';
import { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Ticket, MapPin, CheckCircle, Info, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function BookTokenPage() {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('Main');
  const [serviceType, setServiceType] = useState('General Consultation');
  const [priority, setPriority] = useState(false);
  const [bookedToken, setBookedToken] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/services`)
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    const sessionId = localStorage.getItem('queless_session_id');
    const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/tokens/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: name, branch, priority, serviceType, sessionId })
      });
      const data = await res.json();
      setBookedToken(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (bookedToken) {
    return (
      <main style={{ padding: '48px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14' }}>
        <GlassCard style={{ maxWidth: '400px', width: '100%', textAlign: 'center', border: '2px solid var(--primary)' }}>
          <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 24px' }} className="pulse" />
          <h2 className="glow-text" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>SEQUENCE SECURED</h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '0.9rem' }}>Your digital entity has been registered.</p>
          
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', display: 'inline-block', marginBottom: '32px' }}>
            <QRCodeSVG value={`token:${bookedToken.tokenNumber}`} size={180} />
          </div>
          
          <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '8px', color: '#fff' }}>{bookedToken?.tokenNumber || '---'}</div>
          <div style={{ color: 'var(--secondary)', marginBottom: '32px', fontWeight: 700, letterSpacing: '2px' }}>{(bookedToken?.serviceType || 'General').toUpperCase()}</div>
          
          <button className="btn-primary" onClick={() => window.location.href = '/track'} style={{ width: '100%', padding: '16px' }}>
            FOLLOW LIVE SEQUENCE
          </button>
        </GlassCard>
      </main>
    );
  }

  return (
    <main style={{ padding: '48px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14' }}>
      <GlassCard style={{ maxWidth: '480px', width: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Zap size={32} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2 className="glow-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>JOIN SEQUENCE</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Initialize your position in the digital queue.</p>
        </div>

        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', letterSpacing: '1px' }}>ENTITY IDENTITY</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER YOUR NAME"
              style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '12px', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', letterSpacing: '1px' }}>BRANCH</label>
              <select 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
              >
                <option value="Main">MAIN CORE</option>
                <option value="North">NORTH NODE</option>
                <option value="East">EAST HUB</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', letterSpacing: '1px' }}>MODULE</label>
              <select 
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
              >
                {services.map(s => <option key={s._id} value={s.name}>{(s.name || 'UNNAMED').toUpperCase()}</option>)}
                <option value="General Consultation">GENERAL</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255, 0, 102, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 0, 102, 0.2)' }}>
            <input 
              type="checkbox" 
              id="priority"
              checked={priority}
              onChange={(e) => setPriority(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
            <label htmlFor="priority" style={{ fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600, color: 'var(--accent)' }}>
              PRIORITY ACCESS (STRICT PROTOCOL)
            </label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', marginTop: '12px' }}>
            <Ticket size={20} /> GENERATE SEQUENCE KEY
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
