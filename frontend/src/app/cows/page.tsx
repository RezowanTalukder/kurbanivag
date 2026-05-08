'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CowsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tierSlug = searchParams.get('tier');
  const [cows, setCows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cows')
      .then(r => {
        const all = r.data.data;
        // Filter by tier slug if provided, and only open cows
        const filtered = tierSlug
          ? all.filter((c: any) => c.tierSlug === tierSlug && c.status === 'open')
          : all.filter((c: any) => c.status === 'open');
        setCows(filtered);
      })
      .catch(() => toast.error('গরু লোড করা যায়নি'))
      .finally(() => setLoading(false));
  }, [tierSlug]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', fontFamily: "'Noto Serif Bengali', serif", color: 'var(--text-muted)' }}>লোড হচ্ছে...</div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontFamily: "'Noto Serif Bengali', serif" }}>
        <ChevronLeft size={16} /> হোমে ফিরুন
      </button>

      <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--green-deep)', marginBottom: '0.5rem' }}>
        {tierSlug ? `${tierSlug.replace('-', ' ')} গরু` : 'সব গরু'}
      </h1>
      <p className="bangla" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>উপলব্ধ গরু ও ভাগ</p>

      {cows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>😔</div>
          <p className="bangla" style={{ color: 'var(--text-muted)' }}>এই টিয়ারে এখন কোনো খালি ভাগ নেই। অন্য টিয়ার চেষ্টা করুন।</p>
          <Link href="/" style={{ color: 'var(--green-mid)', fontFamily: "'Noto Serif Bengali', serif" }}>সব গরু দেখুন</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {cows.map((cow: any) => (
            <Link key={cow._id} href={`/cows/${cow._id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div>
                  <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cow.cowNumber}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", color: 'var(--green-deep)', fontSize: '1.1rem' }}>{cow.tier?.name}</div>
                  <div className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cow.tier?.breed} · {cow.tier?.weight_min}–{cow.tier?.weight_max} কেজি</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--green-deep)' }}>৳{cow.totalPerVag?.toLocaleString()}</div>
                  <div className="bangla" style={{ fontSize: '0.78rem', color: cow.filledSlots >= cow.totalSlots ? '#dc2626' : 'var(--green-mid)' }}>
                    {cow.totalSlots - cow.filledSlots} ভাগ বাকি
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
