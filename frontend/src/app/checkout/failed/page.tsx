import Link from 'next/link';

export default function CheckoutFailedPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 64, marginBottom: '1rem' }}>😔</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--green-deep)', marginBottom: 8 }}>পেমেন্ট ব্যর্থ হয়েছে</h1>
        <p className="bangla" style={{ color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
          পেমেন্ট প্রক্রিয়া সম্পন্ন হয়নি। আপনার ভাগ সংরক্ষিত নেই। আবার চেষ্টা করুন।
        </p>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>ফিরে যান →</Link>
      </div>
    </div>
  );
}
