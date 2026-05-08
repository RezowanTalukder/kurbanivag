'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ShieldCheck, Truck, Heart, Camera, Star, ChevronRight, MapPin } from 'lucide-react';

interface Tier {
  id: string; slug: string; name: string; name_en: string;
  breed: string; weight_min: number; weight_max: number;
  estimated_meat_min: number; estimated_meat_max: number;
  cow_price_per_vag: number; katakati: number; packaging: number;
  freezer_transport: number; last_mile_delivery: number; total_slots: number;
  description: string;
}

interface Cow {
  _id: string; tierId: string; tierSlug: string; cowNumber: string;
  filledSlots: number; totalSlots: number; status: string;
  photoUrl: string | null; tier: Tier; totalPerVag: number;
}

const TRUST_POINTS = [
  { icon: ShieldCheck, title: '১০০% হালাল নিশ্চিত', desc: 'সুন্নাহ মোতাবেক বয়স ও স্বাস্থ্য যাচাই, পশু চিকিৎসক কর্তৃক সার্টিফাইড' },
  { icon: Camera, title: 'আসল গরুর ছবি', desc: 'ক্রয়ের পরে আপনার গরুর প্রকৃত ছবি ড্যাশবোর্ডে আপলোড করা হবে' },
  { icon: Truck, title: 'ফ্রিজার ট্রাক ডেলিভারি', desc: 'ঈদের দিন রাতেই রংপুর থেকে রওনা, পরদিন ভোরে ঢাকায়' },
  { icon: Heart, title: 'চামড়া এতিমখানায়', desc: 'প্রতিটি গরুর চামড়া এতিমখানায় দান করা হবে — রসিদ আপনাকে দেওয়া হবে' },
];

const STATUS_COLOR: Record<string, string> = {
  open: '#1a7a58', full: '#dc2626', purchased: '#d97706',
  health_cleared: '#059669', sacrificed: '#7c3aed', in_transit: '#2563eb', delivered: '#065f46',
};
const STATUS_LABEL: Record<string, string> = {
  open: 'ভাগ নেওয়া যাচ্ছে', full: 'পূর্ণ হয়ে গেছে', purchased: 'গরু কেনা হয়েছে',
  health_cleared: 'স্বাস্থ্য পরীক্ষিত', sacrificed: 'কোরবানি সম্পন্ন',
  in_transit: 'ঢাকার পথে', delivered: 'ডেলিভারি সম্পন্ন',
};

export default function HomePage() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'live' | 'tiers'>('tiers');

  useEffect(() => {
    Promise.all([
      api.get('/cows').then(r => setCows(r.data.data)).catch(() => {}),
      api.get('/cows/tiers').then(r => setTiers(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const totalPerVag = (t: Tier) =>
    t.cow_price_per_vag + t.katakati + t.packaging + t.freezer_transport + t.last_mile_delivery;

  const fillPct = (filled: number, total: number) => Math.round((filled / total) * 100);

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section style={{ background: 'var(--green-deep)', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(201,162,39,0.12) 0%, transparent 60%)' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.25rem 3.5rem', position: 'relative' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="arabic-text" style={{ color: '#c9a227', fontSize: '2rem', marginBottom: '1rem', letterSpacing: '0.08em' }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontFamily: "'Noto Serif Bengali', serif", marginBottom: '1.5rem' }}>
              পরম করুণাময় আল্লাহর নামে
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
              কোরবানির ভাগ পান<br />
              <span style={{ color: '#c9a227' }}>ঘরে বসেই</span>
            </h1>

            <p className="bangla" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.9 }}>
              রংপুরের সেরা খামার থেকে সুন্নাহসম্মত গরু — পশু চিকিৎসক পরীক্ষিত, হালাল কোরবানি নিশ্চিত।
              ফ্রিজার ট্রাকে ঢাকায় আপনার দরজায় পৌঁছে দেওয়া হবে।
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '2rem' }}>
              {['সুন্নাহসম্মত ✓', 'ভেটেরিনারি সার্টিফাইড ✓', 'ফ্রিজার ট্রাক ✓', 'এতিমখানায় চামড়া ✓'].map(b => (
                <span key={b} className="trust-badge" style={{ color: '#e8f5ef', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(201,162,39,0.4)' }}>{b}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#cows" className="btn-gold" style={{ padding: '14px 32px', textDecoration: 'none', fontSize: '1rem' }}>
                ভাগ বেছে নিন →
              </a>
              <Link href="/guide" className="btn-outline" style={{ padding: '13px 28px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                নিয়ম ও শর্ত জানুন
              </Link>
            </div>
          </div>

          {/* Stat strip */}
          <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', background: 'rgba(201,162,39,0.25)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(201,162,39,0.25)', maxWidth: 700, margin: '0 auto' }}>
            {[
              { n: '৫', label: 'ধরনের গরু' },
              { n: '৭', label: 'ভাগ প্রতি গরু' },
              { n: '৩৬ ঘণ্টা', label: 'ডেলিভারি সময়' },
              { n: '১০০%', label: 'হালাল নিশ্চিত' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(10,61,46,0.6)', padding: '1rem', textAlign: 'center' }}>
                <div style={{ color: '#c9a227', fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700 }}>{s.n}</div>
                <div className="bangla" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST POINTS ═══ */}
      <section style={{ background: 'var(--gold-pale)', borderBottom: '1px solid rgba(201,162,39,0.2)', padding: '3rem 1.25rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_POINTS.map((tp, i) => (
              <div key={i} className="fade-up card" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s`, background: '#fff' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <tp.icon size={22} color="var(--green-mid)" />
                </div>
                <h3 className="bangla" style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--green-deep)', marginBottom: 6 }}>{tp.title}</h3>
                <p className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.8 }}>{tp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COW LISTING ═══ */}
      <section id="cows" style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="ornament bangla" style={{ color: 'var(--gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>আমাদের গরু</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--green-deep)', marginBottom: '0.75rem' }}>
            ৫ ধরনের কোরবানির গরু
          </h2>
          <p className="bangla" style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
            বাজেট ও পছন্দ অনুযায়ী বেছে নিন। প্রতিটি গরু ভেটেরিনারি কর্তৃক পরীক্ষিত।
          </p>

          {cows.length > 0 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: '1.5rem' }}>
              <button onClick={() => setView('tiers')} style={{ padding: '8px 20px', borderRadius: 6, border: '1.5px solid var(--green-deep)', background: view === 'tiers' ? 'var(--green-deep)' : 'transparent', color: view === 'tiers' ? '#fff' : 'var(--green-deep)', cursor: 'pointer', fontFamily: "'Noto Serif Bengali', serif", fontSize: '0.85rem' }}>
                মূল্য তালিকা
              </button>
              <button onClick={() => setView('live')} style={{ padding: '8px 20px', borderRadius: 6, border: '1.5px solid var(--green-deep)', background: view === 'live' ? 'var(--green-deep)' : 'transparent', color: view === 'live' ? '#fff' : 'var(--green-deep)', cursor: 'pointer', fontFamily: "'Noto Serif Bengali', serif", fontSize: '0.85rem' }}>
                লাইভ ভাগ
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: "'Noto Serif Bengali', serif" }}>লোড হচ্ছে...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(view === 'tiers' ? tiers : cows.map(c => c.tier)).map((tier, i) => {
              const cow = view === 'live' ? cows[i] : null;
              const filled = cow?.filledSlots ?? 0;
              const total = tier.total_slots;
              const remaining = total - filled;
              const pct = fillPct(filled, total);
              const barClass = pct >= 100 ? 'full' : pct >= 70 ? 'warn' : '';
              const perVag = totalPerVag(tier);

              return (
                <div key={tier.id} className="card fade-up" style={{ animationDelay: `${i * 0.08}s`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Tier color strip */}
                  <div style={{ height: 4, background: `linear-gradient(90deg, var(--green-deep), var(--gold))` }} />

                  <div style={{ padding: '1.5rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div className="bangla" style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>টিয়ার {i + 1}</div>
                        <h3 className="bangla" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--green-deep)' }}>{tier.name}</h3>
                        <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tier.breed}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--green-deep)' }}>
                          ৳{perVag.toLocaleString('bn-BD')}
                        </div>
                        <div className="bangla" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>প্রতি ভাগ</div>
                      </div>
                    </div>

                    <p className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>{tier.description}</p>

                    {/* Specs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                      {[
                        { label: 'ওজন', value: `${tier.weight_min}–${tier.weight_max} কেজি` },
                        { label: 'মাংস (আনু.)', value: `${tier.estimated_meat_min}–${tier.estimated_meat_max} কেজি` },
                        { label: 'সর্বমোট ভাগ', value: `${tier.total_slots} জন` },
                        { label: 'ডেলিভারি', value: 'ঢাকা' },
                      ].map(s => (
                        <div key={s.label} style={{ background: 'var(--green-light)', borderRadius: 8, padding: '8px 10px' }}>
                          <div className="bangla" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.label}</div>
                          <div className="bangla" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--green-deep)' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Live slot bar */}
                    {view === 'live' && cow && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filled}/{total} ভাগ নেওয়া হয়েছে</span>
                          <span className="bangla" style={{ fontSize: '0.8rem', fontWeight: 600, color: remaining === 0 ? '#dc2626' : 'var(--green-mid)' }}>
                            {remaining === 0 ? 'পূর্ণ' : `${remaining}টি বাকি`}
                          </span>
                        </div>
                        <div className="slot-bar">
                          <div className={`slot-bar-fill ${barClass}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 100, background: STATUS_COLOR[cow.status] + '20', color: STATUS_COLOR[cow.status], fontFamily: "'Noto Serif Bengali', serif" }}>
                            {STATUS_LABEL[cow.status] || cow.status}
                          </span>
                          <span className="bangla" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>{cow.cowNumber}</span>
                        </div>
                      </div>
                    )}

                    {/* Price breakdown */}
                    <details style={{ marginBottom: '1rem' }}>
                      <summary className="bangla" style={{ fontSize: '0.8rem', color: 'var(--green-mid)', cursor: 'pointer', userSelect: 'none' }}>মূল্য বিবরণ দেখুন</summary>
                      <div style={{ marginTop: 8, borderTop: '1px solid rgba(201,162,39,0.2)', paddingTop: 8 }}>
                        {[
                          { l: 'গরুর মূল্য (প্রতি ভাগ)', v: tier.cow_price_per_vag },
                          { l: 'কাটাকাটি ও প্রক্রিয়াকরণ', v: tier.katakati },
                          { l: 'প্যাকেজিং ও কোল্ড স্টোরেজ', v: tier.packaging },
                          { l: 'ফ্রিজার ট্রাক (রংপুর→ঢাকা)', v: tier.freezer_transport },
                          { l: 'হোম ডেলিভারি (ঢাকায়)', v: tier.last_mile_delivery },
                        ].map(row => (
                          <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid #f0ede4' }}>
                            <span className="bangla" style={{ color: 'var(--text-muted)' }}>{row.l}</span>
                            <span style={{ fontWeight: 600, color: 'var(--green-deep)' }}>৳{row.v.toLocaleString()}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', marginTop: 4 }}>
                          <span className="bangla" style={{ fontWeight: 700, color: 'var(--green-deep)' }}>মোট প্রতি ভাগ</span>
                          <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '1.05rem' }}>৳{perVag.toLocaleString()}</span>
                        </div>
                      </div>
                    </details>
                  </div>

                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <Link
                      href={view === 'live' && cow ? `/cows/${cow._id}` : `/cows?tier=${tier.slug}`}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                    >
                      এই গরুতে ভাগ নিন <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ background: 'var(--green-deep)', padding: '3.5rem 1.25rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="arabic-text" style={{ color: 'rgba(201,162,39,0.7)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>كَيْفَ يَعْمَلُ</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '2rem', marginBottom: '0.75rem' }}>কীভাবে কাজ করে</h2>
          <p className="bangla" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>সহজ ৪টি ধাপে সম্পন্ন</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '০১', title: 'গরু বেছে নিন', desc: 'বাজেট ও পছন্দ অনুযায়ী গরুর টিয়ার ও ভাগের সংখ্যা নির্বাচন করুন' },
              { n: '০২', title: 'নিবন্ধন করুন', desc: 'ঠিকানা দিন, অনলাইনে পেমেন্ট করুন। সম্পূর্ণ নিরাপদ।' },
              { n: '০৩', title: 'কোরবানি হয়', desc: 'ঈদের দিন রংপুরে কোরবানি হয়। আপনি ড্যাশবোর্ডে স্ট্যাটাস দেখতে পাবেন।' },
              { n: '০৪', title: 'ঘরে পান', desc: 'ফ্রিজার ট্রাকে ঢাকায় আসে, পরদিন আপনার দরজায় পৌঁছে যায়।' },
            ].map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid rgba(201,162,39,0.5)', background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: "'Playfair Display', serif", color: '#c9a227', fontSize: '1.1rem', fontWeight: 700 }}>
                  {step.n}
                </div>
                <h3 className="bangla" style={{ color: '#fff', fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
                <p className="bangla" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.8 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOCATION BADGE ═══ */}
      <section style={{ background: 'var(--gold-pale)', borderTop: '1px solid rgba(201,162,39,0.2)', padding: '2rem 1.25rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '0.5rem' }}>
          <MapPin size={18} color="var(--gold)" />
          <span className="bangla" style={{ color: 'var(--green-deep)', fontWeight: 600 }}>রংপুর থেকে সরাসরি, ঢাকায় ডেলিভারি</span>
        </div>
        <p className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          রংপুরের হাটে সর্বনিম্ন মূল্যে গরু কেনা হয়। মাঝখানে কোনো দালাল নেই।
        </p>
      </section>

      {/* Footer */}
      <footer style={{ background: '#061f17', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '1.5rem', fontFamily: "'Noto Serif Bengali', serif", fontSize: '0.85rem' }}>
        <div className="arabic-text" style={{ color: 'rgba(201,162,39,0.6)', fontSize: '1rem', marginBottom: 6 }}>اللَّهُ أَكْبَرُ</div>
        <div>© ২০২৫ KurbaniVag · আল্লাহর নামে শুরু, তাঁরই সন্তুষ্টিতে শেষ</div>
      </footer>
    </div>
  );
}
