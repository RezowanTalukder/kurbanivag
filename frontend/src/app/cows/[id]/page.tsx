'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { ShieldCheck, Users, ChevronLeft, Star } from 'lucide-react';

interface Cow {
  _id: string; cowNumber: string; status: string;
  filledSlots: number; totalSlots: number; photoUrl: string | null;
  tier: any; totalPerVag: number;
}

export default function CowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  const [cow, setCow] = useState<Cow | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vagCount, setVagCount] = useState(1);
  const [meatChoice, setMeatChoice] = useState<'self' | 'donate_third'>('self');
  const [niyyatNames, setNiyyatNames] = useState('');
  const [booking, setBooking] = useState(false);

  const tierSlug = searchParams.get('tier');

  useEffect(() => {
    if (params.id) {
      api.get(`/cows/${params.id}`)
        .then(r => { setCow(r.data.data); setPartners(r.data.partners); })
        .catch(() => toast.error('গরুর তথ্য পাওয়া যায়নি'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [params.id]);

  const tier = cow?.tier;
  const remaining = cow ? cow.totalSlots - cow.filledSlots : 7;
  const maxVag = Math.min(remaining, 7);
  const totalAmount = cow ? cow.totalPerVag * vagCount : 0;

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('বুকিং করতে লগইন করুন');
      router.push(`/auth/login?redirect=/cows/${params.id}`);
      return;
    }
    if (!cow) return;

    setBooking(true);
    try {
      const bRes = await api.post('/bookings', {
        cowId: cow._id,
        vagCount,
        meatChoice,
        niyyatNames: niyyatNames.split('\n').map(n => n.trim()).filter(Boolean),
      });
      const bookingId = bRes.data.data._id;

      // Initiate payment
      const pRes = await api.post('/payments/initiate', { bookingId });
      window.location.href = pRes.data.url;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'বুকিং ব্যর্থ হয়েছে');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', fontFamily: "'Noto Serif Bengali', serif", color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🐄</div>
      লোড হচ্ছে...
    </div>
  );

  if (!cow && !tierSlug) return (
    <div style={{ textAlign: 'center', padding: '5rem', fontFamily: "'Noto Serif Bengali', serif" }}>
      <p>গরু পাওয়া যায়নি। <button onClick={() => router.push('/')} style={{ color: 'var(--green-mid)', background: 'none', border: 'none', cursor: 'pointer' }}>ফিরে যান</button></p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontFamily: "'Noto Serif Bengali', serif", fontSize: '0.9rem' }}>
        <ChevronLeft size={16} /> সব গরু দেখুন
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
        {/* LEFT */}
        <div>
          {/* Cow photo / placeholder */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.25rem' }}>
            {cow?.photoUrl ? (
              <img src={cow.photoUrl} alt="গরুর ছবি" style={{ width: '100%', height: 280, objectFit: 'cover' }} />
            ) : (
              <div style={{ background: 'var(--green-light)', height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ fontSize: 72 }}>🐄</div>
                <div className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {cow ? 'গরু ক্রয়ের পরে ছবি আপলোড করা হবে' : 'গরুর ছবি'}
                </div>
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  {cow && <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>{cow.cowNumber}</div>}
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--green-deep)' }}>
                    {tier?.name || 'কোরবানির গরু'}
                  </h1>
                  <div className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tier?.breed}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--green-deep)' }}>
                    ৳{cow?.totalPerVag.toLocaleString()}
                  </div>
                  <div className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>প্রতি ভাগ</div>
                </div>
              </div>
              <p className="bangla" style={{ color: 'var(--text-muted)', lineHeight: 1.9 }}>{tier?.description}</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h2 className="bangla" style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: '1rem', fontSize: '1.05rem' }}>মূল্য বিবরণ</h2>
            {tier && [
              { l: 'গরুর মূল্য (প্রতি ভাগ)', v: tier.cow_price_per_vag },
              { l: 'কাটাকাটি ও প্রক্রিয়াকরণ', v: tier.katakati },
              { l: 'প্যাকেজিং ও কোল্ড স্টোরেজ', v: tier.packaging },
              { l: 'ফ্রিজার ট্রাক (রংপুর→ঢাকা)', v: tier.freezer_transport },
              { l: 'হোম ডেলিভারি (ঢাকায়)', v: tier.last_mile_delivery },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0ede4', fontSize: '0.9rem' }}>
                <span className="bangla" style={{ color: 'var(--text-muted)' }}>{row.l}</span>
                <span style={{ fontWeight: 600, color: 'var(--green-deep)' }}>৳{row.v.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 4 }}>
              <span className="bangla" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--green-deep)' }}>মোট প্রতি ভাগ</span>
              <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '1.1rem' }}>৳{cow?.totalPerVag.toLocaleString()}</span>
            </div>
          </div>

          {/* Partners */}
          {cow && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <Users size={18} color="var(--green-mid)" />
                <h2 className="bangla" style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '1.05rem' }}>কোরবানি অংশীদার</h2>
              </div>
              {Array.from({ length: cow.totalSlots }).map((_, i) => {
                const p = partners[i];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0ede4' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: p ? '#1a7a58' : '#d4d4d4', flexShrink: 0 }} />
                    {p ? (
                      <span className="bangla" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.name}</span>
                    ) : (
                      <span className="bangla" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {i === (partners.length) ? '← আপনার জায়গা?' : 'খালি আছে'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — Booking panel */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="arabic-text" style={{ color: 'var(--gold)', fontSize: '1.1rem', textAlign: 'center', marginBottom: '0.25rem' }}>نِيَّة</div>
            <h2 className="bangla" style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: '1.25rem', textAlign: 'center' }}>ভাগ বুক করুন</h2>

            {/* Vag count */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>কয়টি ভাগ নিতে চান?</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Array.from({ length: maxVag }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setVagCount(n)}
                    style={{
                      width: 44, height: 44, borderRadius: 8,
                      border: vagCount === n ? '2px solid var(--green-deep)' : '1.5px solid #d4c89a',
                      background: vagCount === n ? 'var(--green-deep)' : '#fff',
                      color: vagCount === n ? '#fff' : 'var(--green-deep)',
                      fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Serif Bengali', serif",
                    }}
                  >{n}</button>
                ))}
                {maxVag === 0 && <span className="bangla" style={{ color: '#dc2626', fontSize: '0.9rem' }}>সব ভাগ পূর্ণ হয়ে গেছে</span>}
              </div>
            </div>

            {/* Meat choice */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>আপনার ১/৩ অংশের মাংস?</label>
              {[
                { v: 'self', label: 'আমার কাছে ডেলিভারি দিন', sub: 'আপনার পুরো অংশ আপনার ঠিকানায় পাঠানো হবে' },
                { v: 'donate_third', label: 'আমার ১/৩ অংশ গরিবদের দিন', sub: 'বিতরণের ছবি আপনাকে পাঠানো হবে। বাকি ২/৩ আপনার কাছে।' },
              ].map(opt => (
                <div
                  key={opt.v}
                  onClick={() => setMeatChoice(opt.v as any)}
                  style={{
                    border: meatChoice === opt.v ? '2px solid var(--green-deep)' : '1.5px solid #d4c89a',
                    borderRadius: 8, padding: '10px 12px', marginBottom: 8, cursor: 'pointer',
                    background: meatChoice === opt.v ? 'var(--green-light)' : '#fff',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${meatChoice === opt.v ? 'var(--green-deep)' : '#ccc'}`, background: meatChoice === opt.v ? 'var(--green-deep)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 }}>
                      {meatChoice === opt.v && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <div>
                      <div className="bangla" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--green-deep)' }}>{opt.label}</div>
                      <div className="bangla" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{opt.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Niyyat names */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                নিয়তের নাম (ঐচ্ছিক) — প্রতি লাইনে একটি নাম
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder={`${user?.name || 'আপনার নাম'}\nআপনার পরিবার`}
                value={niyyatNames}
                onChange={e => setNiyyatNames(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Total */}
            <div style={{ background: 'var(--green-light)', borderRadius: 8, padding: '12px 14px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="bangla" style={{ color: 'var(--green-deep)', fontWeight: 600 }}>{vagCount} ভাগ × ৳{cow?.totalPerVag.toLocaleString()}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--green-deep)' }}>৳{totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={handleBook}
              disabled={booking || maxVag === 0}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: maxVag === 0 ? 0.5 : 1 }}
            >
              {booking ? 'প্রক্রিয়া চলছে...' : isAuthenticated ? 'পেমেন্ট করুন →' : 'লগইন করে বুক করুন →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: '0.75rem' }}>
              <ShieldCheck size={14} color="var(--green-mid)" />
              <span className="bangla" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SSLCommerz নিরাপদ পেমেন্ট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
