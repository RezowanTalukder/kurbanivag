'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setOpen(false);
  };

  const links = [
    { href: '/', label: 'গরু বেছে নিন' },
    { href: '/guide', label: 'নিয়ম ও গাইড' },
    { href: '/dashboard', label: 'আমার অর্ডার', auth: true },
  ];

  return (
    <nav className="navbar">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: "'Scheherazade New', serif", color: '#c9a227', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
            بِسْمِ اللَّهِ
          </span>
          <span style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            KurbaniVag
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
          {links.map(link => {
            if (link.auth && !isAuthenticated) return null;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: pathname === link.href ? '#c9a227' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontFamily: "'Noto Serif Bengali', serif",
                  fontSize: '0.9rem',
                  borderBottom: pathname === link.href ? '2px solid #c9a227' : '2px solid transparent',
                  paddingBottom: 2,
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontFamily: "'Noto Serif Bengali', serif" }}>
                আস-সালামু আলাইকুম, {user?.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(201,162,39,0.4)', borderRadius: 6, padding: '6px 14px', color: '#c9a227', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'Noto Serif Bengali', serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                <LogOut size={14} /> লগআউট
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/auth/login" className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: 6, textDecoration: 'none' }}>
                লগইন
              </Link>
              <Link href="/auth/register" className="btn-gold" style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: 6, textDecoration: 'none' }}>
                নিবন্ধন
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} className="md:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#0a3d2e', borderTop: '1px solid rgba(201,162,39,0.3)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {links.map(link => {
            if (link.auth && !isAuthenticated) return null;
            return (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontFamily: "'Noto Serif Bengali', serif" }}>
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#c9a227', cursor: 'pointer', textAlign: 'left', fontFamily: "'Noto Serif Bengali', serif" }}>লগআউট</button>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontFamily: "'Noto Serif Bengali', serif" }}>লগইন</Link>
              <Link href="/auth/register" onClick={() => setOpen(false)} style={{ color: '#c9a227', textDecoration: 'none', fontFamily: "'Noto Serif Bengali', serif" }}>নিবন্ধন করুন</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
