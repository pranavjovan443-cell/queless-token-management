'use client';
import { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Zap, Users, Clock, Play, SkipForward, 
  CheckCircle, Megaphone, Bell, LayoutGrid, 
  BarChart2, Settings, Plus, Trash2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import GlassCard from '@/components/GlassCard';

export default function AdminDashboard() {
  const [tokens, setTokens] = useState([]);
  const [services, setServices] = useState([]);
  const [counter, setCounter] = useState('STATION ALPHA');
  const [branch] = useState('Main');
  const [newServiceName, setNewServiceName] = useState('');

  const fetchTokens = async () => {
    const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/tokens/live/${branch}`);
      const data = await res.json();
      setTokens([...data.waiting, data.nowServing].filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/services`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTokens();
    fetchServices();
    const interval = setInterval(fetchTokens, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (endpoint, id, body = {}) => {
    const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/tokens/${endpoint}${id ? '/' + id : ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch, ...body })
    });
    fetchTokens();
  };

  const handleAddService = async () => {
    if (!newServiceName) return;
    const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newServiceName })
    });
    setNewServiceName('');
    fetchServices();
  };

  const handleDeleteService = async (id) => {
    const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const nowServingHere = tokens.filter(t => t.status === 'serving' && t.counter === counter);

  // Analytics
  const COLORS = ['#00f2ff', '#bc13fe', '#ff0066', '#00ff88'];
  const serviceData = useMemo(() => {
    const counts = tokens.reduce((acc, t) => {
      acc[t.serviceType] = (acc[t.serviceType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tokens]);

  return (
    <main style={{ padding: '40px', minHeight: '100vh', background: '#0a0a14', color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Zap color="#00f2ff" className="pulse" />
          </div>
          <div>
            <h1 className="glow-text" style={{ fontSize: '2rem', margin: 0 }}>CORE COMMAND</h1>
            <div style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '3px' }}>ACTIVE STATION: {counter}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <select 
            value={counter} 
            onChange={(e) => setCounter(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.5)', color: '#00f2ff', border: '1px solid #00f2ff', borderRadius: '8px', padding: '8px' }}
          >
            <option value="STATION ALPHA">STATION ALPHA</option>
            <option value="STATION BETA">STATION BETA</option>
            <option value="STATION GAMMA">STATION GAMMA</option>
          </select>
          <button className="btn-primary" onClick={() => handleAction('reset')}>SYSTEM RESET</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Main Interaction Hub */}
          <GlassCard style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '12px', opacity: 0.5, marginBottom: '24px', letterSpacing: '2px' }}>// INTERACTION HUB</h3>
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '32px', fontSize: '1.5rem', marginBottom: '32px' }}
              onClick={() => handleAction('next', null, { counter })}
            >
              TRANSMIT NEXT ENTITY
            </button>

            {nowServingHere.length > 0 ? (
              nowServingHere.map(t => (
                <div key={t._id} style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '4rem', fontWeight: 900 }}>{t.tokenNumber}</div>
                    <div style={{ color: 'var(--secondary)', letterSpacing: '2px' }}>{t.serviceType.toUpperCase()}</div>
                    <div style={{ fontSize: '1.25rem', marginTop: '8px' }}>{t.guestName}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="btn-primary" onClick={() => handleAction('complete', t._id)}>COMPLETE</button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => handleAction('recall', t._id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', gap: '4px', fontSize: '12px' }}>
                        <Megaphone size={16} /> RECALL
                      </button>
                      <button onClick={() => handleAction('ping', t._id)} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', gap: '4px', fontSize: '12px' }}>
                        <Bell size={16} /> PING
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '48px', opacity: 0.2, border: '1px dashed #fff', borderRadius: '20px' }}>
                <LayoutGrid size={48} style={{ margin: '0 auto 16px' }} />
                <div>STATION IDLE</div>
              </div>
            )}
          </GlassCard>

          {/* Analytics Data Visualization */}
          <GlassCard style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '12px', opacity: 0.5, marginBottom: '24px', letterSpacing: '2px' }}>// DATA VISUALIZATION</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0a0a14', border: '1px solid var(--secondary)', borderRadius: '8px' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Module Management */}
          <GlassCard style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '12px', opacity: 0.5, marginBottom: '20px' }}>SYSTEM MODULES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {services.map(s => (
                <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px' }}>{s.name.toUpperCase()}</span>
                  <Trash2 size={14} color="#ff0066" cursor="pointer" onClick={() => handleDeleteService(s._id)} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="ADD MODULE"
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '12px' }}
              />
              <button onClick={handleAddService} style={{ background: 'var(--primary)', border: 'none', color: '#000', borderRadius: '4px', padding: '8px' }}>
                <Plus size={16} />
              </button>
            </div>
          </GlassCard>

          {/* Real-time Feed */}
          <GlassCard style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ fontSize: '12px', opacity: 0.5, marginBottom: '20px' }}>LIVE FEED</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tokens.filter(t => t.status === 'waiting').map(t => (
                <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: t.priority ? 'var(--accent)' : 'var(--primary)' }}>{t.tokenNumber}</span>
                  <span style={{ opacity: 0.5 }}>{t.guestName}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
