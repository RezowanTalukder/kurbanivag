'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Cow {
  _id: string; cowNumber: string; tierId: string; status: string;
  filledSlots: number; totalSlots: number; photoUrl: string | null;
  tier: any; totalPerVag: number;
}

const STATUSES = [
  { v: 'open', l: 'ভাগ খোলা' },
  { v: 'full', l: 'পূর্ণ' },
  { v: 'purchased', l: 'গরু কেনা হয়েছে' },
  { v: 'health_cleared', l: 'স্বাস্থ্য পরীক্ষিত' },
  { v: 'sacrificed', l: 'কোরবানি সম্পন্ন' },
  { v: 'in_transit', l: 'ট্রানজিটে' },
  { v: 'delivered', l: 'ডেলিভারি সম্পন্ন' },
];

const TIERS = ['tier-1', 'tier-2', 'tier-3', 'tier-4', 'tier-5'];

export default function AdminPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTier, setNewTier] = useState('tier-1');
  const photoInput = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (user?.role !== 'admin') { router.push('/'); return; }
    loadCows();
  }, [isAuthenticated, user]);

  const loadCows = () => {
    api.get('/cows').then(r => setCows(r.data.data)).finally(() => setLoading(false));
  };

  const createCow = async () => {
    setCreating(true);
    try {
      await api.post('/cows', { tierId: newTier });
      toast.success('নতুন গরু তৈরি হয়েছে');
      loadCows();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ব্যর্থ হয়েছে');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id: string, status: string, extra: any = {}) => {
    try {
      await api.patch(`/cows/${id}/status`, { status, ...extra });
      toast.success('স্ট্যাটাস আপডেট হয়েছে');
      loadCows();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ব্যর্থ');
    }
  };

  const uploadPhoto = async (cowId: string, file: File) => {
    const fd = new FormData();
    fd.append('photo', file);
    try {
      await api.patch(`/cows/${cowId}/photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('ছবি আপলোড হয়েছে');
      loadCows();
    } catch {
      toast.error('ছবি আপলোড ব্যর্থ');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--green-deep)' }}>অ্যাডমিন প্যানেল</h1>
          <p className="bangla" style={{ color: 'var(--text-muted)' }}>KurbaniVag পরিচালনা কেন্দ্র</p>
        </div>
        {/* Create cow */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select className="form-input" style={{ width: 'auto' }} value={newTier} onChange={e => setNewTier(e.target.value)}>
            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={createCow} disabled={creating} className="btn-primary">
            {creating ? '...' : '+ নতুন গরু'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bangla" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>লোড হচ্ছে...</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {cows.map(cow => (
            <div key={cow._id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Info */}
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", color: 'var(--green-deep)', fontWeight: 700 }}>{cow.cowNumber}</div>
                  <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cow.tier?.name} · {cow.tier?.breed}</div>
                  <div className="bangla" style={{ fontSize: '0.8rem', marginTop: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--green-deep)' }}>{cow.filledSlots}/{cow.totalSlots}</span>
                    <span style={{ color: 'var(--text-muted)' }}> ভাগ</span>
                  </div>
                </div>

                {/* Status update */}
                <div>
                  <label className="bangla" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>স্ট্যাটাস পরিবর্তন</label>
                  <select
                    className="form-input"
                    value={cow.status}
                    onChange={e => updateStatus(cow._id, e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                  </select>
                </div>

                {/* Photo */}
                <div>
                  <label className="bangla" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>গরুর ছবি</label>
                  {cow.photoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={cow.photoUrl} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '2px solid var(--gold)' }} />
                      <button onClick={() => { setUploadTarget(cow._id); photoInput.current?.click(); }} style={{ background: 'none', border: '1px solid var(--green-mid)', borderRadius: 6, padding: '4px 10px', color: 'var(--green-mid)', cursor: 'pointer', fontFamily: "'Noto Serif Bengali', serif", fontSize: '0.78rem' }}>বদলান</button>
                    </div>
                  ) : (
                    <button onClick={() => { setUploadTarget(cow._id); photoInput.current?.click(); }} className="btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                      ছবি আপলোড
                    </button>
                  )}
                </div>

                {/* Donation URLs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input
                    className="form-input"
                    placeholder="এতিমখানা রসিদ URL"
                    style={{ fontSize: '0.78rem' }}
                    onBlur={e => e.target.value && updateStatus(cow._id, cow.status, { etimkhanaReceiptUrl: e.target.value })}
                  />
                  <input
                    className="form-input"
                    placeholder="গরিব বিতরণ ছবি URL"
                    style={{ fontSize: '0.78rem' }}
                    onBlur={e => e.target.value && updateStatus(cow._id, cow.status, { poorSharePhotoUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file && uploadTarget) uploadPhoto(uploadTarget, file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
