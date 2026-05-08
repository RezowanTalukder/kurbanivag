'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('আস-সালামু আলাইকুম! স্বাগতম।');
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="arabic-text" style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: 4 }}>أَهْلًا وَسَهْلًا</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--green-deep)', marginBottom: 4 }}>লগইন করুন</h1>
          <p className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>ইমেইল</label>
              <input type="email" required className="form-input" placeholder="আপনার ইমেইল"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>পাসওয়ার্ড</label>
              <input type="password" required className="form-input" placeholder="পাসওয়ার্ড"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'যাচাই হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <span className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>অ্যাকাউন্ট নেই? </span>
            <Link href="/auth/register" style={{ color: 'var(--green-mid)', textDecoration: 'none', fontFamily: "'Noto Serif Bengali', serif", fontSize: '0.85rem', fontWeight: 600 }}>
              নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
