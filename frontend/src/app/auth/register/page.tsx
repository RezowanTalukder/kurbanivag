'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

const DIVISIONS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];
const DHAKA_THANAS = [
  'মিরপুর', 'উত্তরা', 'গুলশান', 'বনানী', 'ধানমন্ডি', 'মোহাম্মদপুর', 'লালবাগ',
  'হাজারীবাগ', 'শ্যামলী', 'আগারগাঁও', 'তেজগাঁও', 'রামপুরা', 'বাড্ডা',
  'খিলগাঁও', 'মতিঝিল', 'পল্টন', 'শাহবাগ', 'নিউমার্কেট', 'আজিমপুর',
  'কামরাঙ্গীরচর', 'কেরানীগঞ্জ', 'সাভার', 'আশুলিয়া', 'অন্যান্য'
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    street: '', thana: '', district: 'ঢাকা', division: 'ঢাকা', landmark: '',
  });

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('পাসওয়ার্ড মিলছে না');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: {
          street: form.street,
          thana: form.thana,
          district: form.district,
          division: form.division,
          landmark: form.landmark,
        },
      });
      toast.success('নিবন্ধন সম্পন্ন! স্বাগতম।');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'নিবন্ধন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="arabic-text" style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: 4 }}>مَرْحَبًا</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--green-deep)', marginBottom: 4 }}>নিবন্ধন করুন</h1>
          <p className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>একবার নিবন্ধন করুন, সহজে কোরবানি দিন</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '1.5rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step >= s ? 'var(--green-deep)' : '#e0e0e0',
                color: step >= s ? '#fff' : '#999',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700,
              }}>{s}</div>
              {s < 2 && <div style={{ width: 40, height: 2, background: step >= 2 ? 'var(--green-deep)' : '#e0e0e0' }} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem' }}>
          <span className="bangla" style={{ fontSize: '0.8rem', color: step === 1 ? 'var(--green-deep)' : 'var(--text-muted)', fontWeight: step === 1 ? 600 : 400 }}>ব্যক্তিগত তথ্য</span>
          <span className="bangla" style={{ fontSize: '0.8rem', color: step === 2 ? 'var(--green-deep)' : 'var(--text-muted)', fontWeight: step === 2 ? 600 : 400 }}>ডেলিভারি ঠিকানা</span>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {step === 1 ? (
            <form onSubmit={nextStep}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>পুরো নাম *</label>
                <input type="text" required className="form-input" placeholder="মোঃ রফিকুল ইসলাম"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>ইমেইল *</label>
                <input type="email" required className="form-input" placeholder="example@gmail.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>মোবাইল নম্বর *</label>
                <input type="tel" required className="form-input" placeholder="01XXXXXXXXX"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>পাসওয়ার্ড *</label>
                  <input type="password" required minLength={6} className="form-input" placeholder="কমপক্ষে ৬ অক্ষর"
                    value={form.password} onChange={e => set('password', e.target.value)} />
                </div>
                <div>
                  <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>পুনরায় পাসওয়ার্ড *</label>
                  <input type="password" required className="form-input" placeholder="আবার লিখুন"
                    value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                পরবর্তী ধাপ →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ background: 'var(--green-light)', borderRadius: 8, padding: '10px 14px', marginBottom: '1.25rem' }}>
                <p className="bangla" style={{ fontSize: '0.82rem', color: 'var(--green-mid)', lineHeight: 1.7 }}>
                  📦 এই ঠিকানায় আপনার কোরবানির মাংস ডেলিভারি দেওয়া হবে। সঠিকভাবে পূরণ করুন।
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>বিভাগ *</label>
                  <select required className="form-input" value={form.division} onChange={e => set('division', e.target.value)}>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>জেলা *</label>
                  <input type="text" required className="form-input" placeholder="ঢাকা"
                    value={form.district} onChange={e => set('district', e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>থানা / এলাকা *</label>
                <select required className="form-input" value={form.thana} onChange={e => set('thana', e.target.value)}>
                  <option value="">থানা বেছে নিন</option>
                  {DHAKA_THANAS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>বাড়ি / রাস্তা / ফ্ল্যাট *</label>
                <textarea required className="form-input" rows={2} placeholder="বাড়ি নং ১২, রোড ৫, ব্লক ক, মিরপুর-১০"
                  value={form.street} onChange={e => set('street', e.target.value)} style={{ resize: 'none' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="bangla" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>কাছের পরিচিত স্থান (ঐচ্ছিক)</label>
                <input type="text" className="form-input" placeholder="যেমন: মিরপুর ১০ নম্বর গোলচত্বরের পাশে"
                  value={form.landmark} onChange={e => set('landmark', e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1 }}>← পেছনে</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  {loading ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <span className="bangla" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ইতোমধ্যে অ্যাকাউন্ট আছে? </span>
            <Link href="/auth/login" style={{ color: 'var(--green-mid)', textDecoration: 'none', fontFamily: "'Noto Serif Bengali', serif", fontSize: '0.85rem', fontWeight: 600 }}>
              লগইন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
