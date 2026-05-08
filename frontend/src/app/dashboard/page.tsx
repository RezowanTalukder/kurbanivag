'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  CheckCircle, Clock, Truck, Package, Home, Camera,
  Heart, Star, AlertCircle, ExternalLink, MapPin
} from 'lucide-react';

interface Booking {
  _id: string;
  bookingRef: string;
  vagCount: number;
  meatChoice: string;
  paymentStatus: string;
  priceSnapshot: {
    totalAmount: number;
    totalPerVag: number;
  };
  cow: {
    _id: string;
    cowNumber: string;
    tierId: string;
    status: string;
    photoUrl: string | null;
    etimkhanaReceiptUrl: string | null;
    poorSharePhotoUrl: string | null;
    tier?: any;
  };
  deliveryAddress: {
    name: string;
    street: string;
    thana: string;
    district: string;
  };
  niyyatNames: string[];
  createdAt: string;
}

const COW_STEPS = [
  { key: 'open',           label: 'ভাগ পূর্ণের অপেক্ষা',       icon: Clock,       desc: 'সকল অংশীদার নির্বাচিত হওয়ার পর গরু কেনা হবে' },
  { key: 'full',           label: 'সব ভাগ পূর্ণ হয়েছে',         icon: CheckCircle, desc: 'আপনার গ্রুপ সম্পূর্ণ! গরু কেনার প্রক্রিয়া শুরু।' },
  { key: 'purchased',      label: 'গরু কেনা হয়েছে',             icon: Camera,      desc: 'রংপুরের হাট থেকে গরু কেনা হয়েছে। ছবি আপলোড করা হয়েছে।' },
  { key: 'health_cleared', label: 'পশু চিকিৎসক পরীক্ষিত',      icon: CheckCircle, desc: 'ভেটেরিনারি কর্তৃক স্বাস্থ্য সার্টিফাইড। হালাল নিশ্চিত।' },
  { key: 'sacrificed',     label: 'কোরবানি সম্পন্ন',            icon: Star,        desc: 'আল্লাহর নামে কোরবানি সম্পন্ন হয়েছে। মাংস প্রক্রিয়াকরণ চলছে।' },
  { key: 'in_transit',     label: 'ঢাকার পথে ফ্রিজার ট্রাকে',  icon: Truck,       desc: 'ফ্রিজার ট্রাক রংপুর থেকে রওনা হয়েছে।' },
  { key: 'delivered',      label: 'ডেলিভারি সম্পন্ন',          icon: Home,        desc: 'আপনার ঠিকানায় মাংস পৌঁছে গেছে। কোরবানি কবুল হোক।' },
];

const STATUS_ORDER = ['open', 'full', 'purchased', 'health_cleared', 'sacrificed', 'in_transit', 'delivered'];

function getStepIndex(status: string) {
  return STATUS_ORDER.indexOf(status);
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }
    api.get('/bookings/my')
      .then(r => {
        setBookings(r.data.data);
        if (r.data.data.length > 0) setSelected(r.data.data[0]._id);
      })
      .catch(() => toast.error('অর্ডার লোড করা যায়নি'))
      .finally(() => setLoading(false));

    // Show success toast if redirected from payment
    if (searchParams.get('payment') === 'success') {
      toast.success('পেমেন্ট সফল হয়েছে! কোরবানি কবুল হোক। 🤲');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const activeBooking = bookings.find(b => b._id === selected);
  const currentStepIdx = activeBooking ? getStepIndex(activeBooking.cow.status) : 0;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="arabic-text" style={{ color: 'var(--gold)', fontSize: '1.1rem', marginBottom: 4 }}>أَهْلًا</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--green-deep)', marginBottom: 4 }}>
          আস-সালামু আলাইকুম, {user?.name}
        </h1>
        <p className="bangla" style={{ color: 'var(--text-muted)' }}>আপনার কোরবানির বুকিং ও ডেলিভারি ট্র্যাক করুন</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Noto Serif Bengali', serif", color: 'var(--text-muted)' }}>
          লোড হচ্ছে...
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: 56, marginBottom: '1rem' }}>🐄</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--green-deep)', marginBottom: 8 }}>এখনো কোনো বুকিং নেই</h2>
          <p className="bangla" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>আপনার প্রথম কোরবানির ভাগ বুক করুন</p>
          <button onClick={() => router.push('/')} className="btn-primary">গরু দেখুন →</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: bookings.length > 1 ? '260px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* Booking list sidebar (if multiple) */}
          {bookings.length > 1 && (
            <div>
              <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>আপনার বুকিংসমূহ</div>
              {bookings.map(b => (
                <div
                  key={b._id}
                  onClick={() => setSelected(b._id)}
                  className="card"
                  style={{
                    padding: '1rem', marginBottom: 8, cursor: 'pointer',
                    borderColor: selected === b._id ? 'var(--green-deep)' : 'rgba(201,162,39,0.2)',
                    borderWidth: selected === b._id ? 2 : 1,
                  }}
                >
                  <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.bookingRef}</div>
                  <div className="bangla" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--green-deep)' }}>
                    {b.vagCount} ভাগ · ৳{b.priceSnapshot.totalAmount.toLocaleString()}
                  </div>
                  <div className="bangla" style={{ fontSize: '0.78rem', color: b.paymentStatus === 'paid' ? 'var(--green-mid)' : '#dc2626' }}>
                    {b.paymentStatus === 'paid' ? '✓ পেমেন্ট সম্পন্ন' : '⚠ পেমেন্ট বাকি'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main detail panel */}
          {activeBooking && (
            <div>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
                {[
                  { label: 'বুকিং রেফারেন্স', value: activeBooking.bookingRef },
                  { label: 'ভাগের সংখ্যা', value: `${activeBooking.vagCount} ভাগ` },
                  { label: 'মোট পরিশোধ', value: `৳${activeBooking.priceSnapshot.totalAmount.toLocaleString()}` },
                  { label: 'পেমেন্ট', value: activeBooking.paymentStatus === 'paid' ? '✓ সম্পন্ন' : '⚠ বাকি' },
                ].map(c => (
                  <div key={c.label} style={{ background: 'var(--green-light)', borderRadius: 10, padding: '12px 14px' }}>
                    <div className="bangla" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{c.label}</div>
                    <div className="bangla" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--green-deep)' }}>{c.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>
                {/* Timeline */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h2 className="bangla" style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    কোরবানির যাত্রা
                  </h2>
                  <div>
                    {COW_STEPS.map((step, idx) => {
                      const done = idx < currentStepIdx;
                      const active = idx === currentStepIdx;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} style={{ display: 'flex', gap: 12, paddingBottom: idx < COW_STEPS.length - 1 ? 24 : 0, position: 'relative' }}>
                          {/* Vertical line */}
                          {idx < COW_STEPS.length - 1 && (
                            <div style={{ position: 'absolute', left: 15, top: 32, bottom: 0, width: 2, background: done ? 'var(--green-bright)' : '#e8e8e8' }} />
                          )}
                          {/* Dot */}
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                            background: done ? 'var(--green-deep)' : active ? 'var(--gold)' : '#f0f0f0',
                            border: `2px solid ${done ? 'var(--green-deep)' : active ? 'var(--gold)' : '#ddd'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon size={14} color={done || active ? '#fff' : '#aaa'} />
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, paddingTop: 4 }}>
                            <div className="bangla" style={{ fontWeight: active ? 700 : done ? 600 : 400, color: done || active ? 'var(--green-deep)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                              {step.label}
                            </div>
                            {(done || active) && (
                              <div className="bangla" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.6 }}>{step.desc}</div>
                            )}
                            {/* Cow photo at purchased step */}
                            {step.key === 'purchased' && done && activeBooking.cow.photoUrl && (
                              <img src={activeBooking.cow.photoUrl} alt="আপনার গরু" style={{ width: '100%', maxWidth: 240, borderRadius: 8, marginTop: 8, border: '2px solid var(--gold)' }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right panel */}
                <div>
                  {/* Cow info */}
                  <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                    <div className="bangla" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>আপনার গরু</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'var(--green-deep)', marginBottom: 4 }}>
                      {activeBooking.cow.cowNumber}
                    </div>
                    <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      মাংস: {activeBooking.meatChoice === 'donate_third' ? '১/৩ গরিবদের দান, বাকি ডেলিভারি' : 'সম্পূর্ণ অংশ ডেলিভারি'}
                    </div>

                    {/* Niyyat names */}
                    {activeBooking.niyyatNames.length > 0 && (
                      <div style={{ background: 'var(--gold-pale)', borderRadius: 8, padding: '10px 12px' }}>
                        <div className="arabic-text" style={{ color: 'var(--gold)', fontSize: '0.9rem', marginBottom: 4 }}>نِيَّة</div>
                        <div className="bangla" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>নিয়তের নাম:</div>
                        {activeBooking.niyyatNames.map((n, i) => (
                          <div key={i} className="bangla" style={{ fontSize: '0.85rem', color: 'var(--green-deep)', fontWeight: 600 }}>{n}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delivery address */}
                  <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
                      <MapPin size={15} color="var(--green-mid)" />
                      <span className="bangla" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--green-deep)' }}>ডেলিভারি ঠিকানা</span>
                    </div>
                    <div className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                      {activeBooking.deliveryAddress.name}<br />
                      {activeBooking.deliveryAddress.street}<br />
                      {activeBooking.deliveryAddress.thana}, {activeBooking.deliveryAddress.district}
                    </div>
                  </div>

                  {/* Donations proof */}
                  <div className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
                      <Heart size={15} color="#dc2626" />
                      <span className="bangla" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--green-deep)' }}>দান ও প্রমাণ</span>
                    </div>

                    {[
                      {
                        label: 'চামড়া — এতিমখানা রসিদ',
                        url: activeBooking.cow.etimkhanaReceiptUrl,
                        pending: 'কোরবানির পরে আপলোড করা হবে',
                      },
                      ...(activeBooking.meatChoice === 'donate_third' ? [{
                        label: '১/৩ মাংস বিতরণ ছবি',
                        url: activeBooking.cow.poorSharePhotoUrl,
                        pending: 'বিতরণের পরে ছবি আসবে',
                      }] : []),
                    ].map((item, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div className="bangla" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--green-mid)', fontSize: '0.82rem', fontFamily: "'Noto Serif Bengali', serif" }}>
                            <ExternalLink size={12} /> প্রমাণ দেখুন
                          </a>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} color="var(--text-muted)" />
                            <span className="bangla" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{item.pending}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
