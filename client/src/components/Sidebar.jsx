'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Ticket, Activity, Settings, LogOut, Users } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'User Dashboard', href: '/dashboard/user', icon: LayoutDashboard },
  { name: 'Admin Panel', href: '/dashboard/admin', icon: Users },
  { name: 'Book Token', href: '/book', icon: Ticket },
  { name: 'Live Tracking', href: '/track', icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-card" style={{ 
      width: '260px', 
      height: 'calc(100vh - 48px)', 
      margin: '24px',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 className="glow-text" style={{ fontSize: '1.5rem' }}>QueueLess</h2>
      </div>

      <nav style={{ flex: 1, padding: '20px 10px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '12px',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}>
                <Icon size={20} style={{ marginRight: '12px' }} />
                <span style={{ fontWeight: 500 }}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', cursor: 'pointer' }}>
          <LogOut size={20} style={{ marginRight: '12px' }} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}
