import Link from 'next/link';

export default function GuidePage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--green-deep)', padding: '3rem 1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div style={{ position: 'relative' }}>
          <div className="arabic-text" style={{ color: 'rgba(201,162,39,0.8)', fontSize: '2rem', marginBottom: '0.5rem' }}>
            إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '0.75rem' }}>
            কোরবানির নিয়ম ও গাইড
          </h1>
          <p className="bangla" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto', lineHeight: 1.9 }}>
            সুন্নাহ অনুযায়ী কোরবানির বিধান, আমাদের পদ্ধতি এবং আপনার যা জানা দরকার
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '3rem 1.25rem' }}>

        {/* ═══ ISLAMIC RULES ═══ */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{ width: 4, height: 32, background: 'var(--gold)', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--green-deep)' }}>কোরবানির ইসলামিক বিধান</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                ayat: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
                translation: 'অতএব তোমার রবের উদ্দেশ্যে নামায পড় এবং কোরবানি কর।',
                ref: 'সূরা আল-কাওসার, আয়াত ২',
              },
            ].map((a, i) => (
              <div key={i} style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,162,39,0.3)', borderLeft: '4px solid var(--gold)', borderRadius: 10, padding: '1.25rem' }}>
                <div className="arabic-text" style={{ fontSize: '1.4rem', color: 'var(--green-deep)', marginBottom: 8, lineHeight: 1.8 }}>{a.ayat}</div>
                <p className="bangla" style={{ color: 'var(--text-primary)', lineHeight: 1.9, marginBottom: 4 }}>"{a.translation}"</p>
                <div className="bangla" style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600 }}>— {a.ref}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '1.5rem', marginTop: '1.25rem' }}>
            {[
              { title: 'কোরবানি কার উপর ওয়াজিব?', body: 'যে মুসলিম ব্যক্তি ঈদুল আযহার দিন নিসাব পরিমাণ সম্পদের মালিক (সাড়ে সাত তোলা স্বর্ণ বা সাড়ে বায়ান্ন তোলা রুপার সমপরিমাণ), তার উপর কোরবানি ওয়াজিব।' },
              { title: 'গরুতে কতজন অংশীদার হতে পারবে?', body: 'একটি গরু, মহিষ বা উট সর্বোচ্চ সাতজনের পক্ষ থেকে কোরবানি দেওয়া যাবে। প্রতিজনের নিয়ত খাঁটি থাকতে হবে — কেবল আল্লাহর সন্তুষ্টির জন্য।' },
              { title: 'কোরবানির পশুর বয়স', body: 'গরু ও মহিষের বয়স কমপক্ষে দুই বছর হতে হবে। ছাগলের এক বছর এবং উটের পাঁচ বছর। আমরা সবসময় বয়স যাচাই করে গরু কিনি।' },
              { title: 'মাংস বণ্টনের নিয়ম', body: 'কোরবানির মাংস তিন ভাগে ভাগ করা মুস্তাহাব: এক ভাগ নিজের জন্য, এক ভাগ আত্মীয়-স্বজনের জন্য, এক ভাগ গরিব-মিসকিনদের জন্য। আমাদের সিস্টেমে আপনি চাইলে আপনার ১/৩ অংশ সরাসরি গরিবদের দান করতে পারবেন।' },
              { title: 'চামড়ার বিধান', body: 'কোরবানির পশুর চামড়া বিক্রি করা যাবে, তবে সেই অর্থ সদকা করতে হবে। আমরা প্রতিটি গরুর চামড়া সরাসরি এতিমখানায় দান করি এবং আপনাকে রসিদ পাঠাই।' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 4 ? '1.25rem' : 0, paddingBottom: i < 4 ? '1.25rem' : 0, borderBottom: i < 4 ? '1px solid #f0ede4' : 'none' }}>
                <h3 className="bangla" style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 6, fontSize: '0.95rem' }}>🕌 {item.title}</h3>
                <p className="bangla" style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '0.9rem' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ OUR SYSTEM ═══ */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{ width: 4, height: 32, background: 'var(--green-bright)', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--green-deep)' }}>আমাদের পদ্ধতি</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                step: '০১',
                title: 'গরু নির্বাচন — রংপুরে',
                body: 'ঈদের আগে রংপুরের হাট থেকে প্রতিটি গ্রুপের জন্য আলাদা গরু কেনা হয়। রংপুরে গরুর দাম ঢাকার তুলনায় উল্লেখযোগ্যভাবে কম হওয়ায় আপনি সাশ্রয়ী মূল্যে সেরা গরু পাচ্ছেন।'
              },
              {
                step: '০২',
                title: 'ভেটেরিনারি পরীক্ষা',
                body: 'প্রতিটি গরু পশু চিকিৎসক কর্তৃক পরীক্ষা করা হয়। সুন্নাহ অনুযায়ী বয়স, স্বাস্থ্য এবং শরীরের সুস্থতা নিশ্চিত করা হয়। অসুস্থ বা ত্রুটিপূর্ণ পশু কোনো অবস্থায়ই গ্রহণ করা হবে না।'
              },
              {
                step: '০৩',
                title: 'গরুর ছবি আপলোড',
                body: 'গরু কেনার পরে আপনার ড্যাশবোর্ডে সেই নির্দিষ্ট গরুর প্রকৃত ছবি আপলোড করা হবে। আপনি দেখতে পাবেন আপনার কোরবানি কোন গরুতে হচ্ছে।'
              },
              {
                step: '০৪',
                title: 'ঈদের দিন কোরবানি',
                body: 'ঈদুল আযহার দিন ১০ই জিলহজ্জ নামাযের পরে রংপুরে কোরবানি সম্পন্ন হবে। বিসমিল্লাহি আল্লাহু আকবার বলে জবাই করা হবে। সকল অংশীদারের নাম নিয়তে পড়া হবে।'
              },
              {
                step: '০৫',
                title: 'ফ্রিজার ট্রাকে ঢাকায়',
                body: 'কোরবানি সম্পন্ন হওয়ার পরেই মাংস কাটাকাটি, ধোয়া এবং প্যাকেজিং করা হবে। ফ্রিজার ট্রাকে সঠিক তাপমাত্রায় (০-৪°C) রেখে ঈদের রাতেই রংপুর থেকে রওনা দেওয়া হবে।'
              },
              {
                step: '০৬',
                title: 'হোম ডেলিভারি',
                body: 'পরদিন ভোরে ঢাকায় পৌঁছে থানাওয়ারী ডেলিভারি শুরু হবে। আপনার নিবন্ধিত ঠিকানায় মাংস পৌঁছে দেওয়া হবে। প্রতিটি প্যাকেটে আপনার নাম ও ঠিকানা লেখা থাকবে।'
              },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--green-deep)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>
                  {s.step}
                </div>
                <div>
                  <h3 className="bangla" style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 6 }}>{s.title}</h3>
                  <p className="bangla" style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '0.9rem' }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ HALAL GUARANTEE ═══ */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ background: 'var(--green-deep)', borderRadius: 16, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="pattern-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
            <div style={{ position: 'relative' }}>
              <div className="arabic-text" style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>حَلَال ١٠٠٪</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>
                ১০০% হালাল কোরবানির প্রতিশ্রুতি
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'left' }}>
                {[
                  'সুন্নাহ মোতাবেক বয়স ও স্বাস্থ্য নিশ্চিত',
                  'ভেটেরিনারি সার্টিফিকেট প্রতিটি গরুর জন্য',
                  'মুসলিম জবাইকারী দ্বারা বিসমিল্লাহসহ জবাই',
                  'অংশীদারদের নাম নিয়তে পড়া হয়',
                  'চামড়া এতিমখানায় দান, রসিদ আপনাকে দেওয়া হয়',
                  'গরিবদের মাংস বিতরণের ছবি প্রমাণসহ',
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span className="bangla" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: 1.7 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{ width: 4, height: 32, background: 'var(--gold)', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--green-deep)' }}>সাধারণ প্রশ্নোত্তর</h2>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { q: 'আমি কি দেখতে পাবো আমার গরু কোনটি?', a: 'হ্যাঁ। গরু কেনার পরেই আপনার ড্যাশবোর্ডে সেই গরুর আসল ছবি আপলোড করা হবে।' },
              { q: 'আমার গ্রুপের বাকি অংশীদাররা কারা?', a: 'গরুর বিবরণ পেজে অংশীদারদের নাম দেখা যাবে। সবার নাম তাদের অনুমতিক্রমে প্রদর্শিত হয়।' },
              { q: 'যদি ৭ জন পূর্ণ না হয়?', a: 'ভাগ পূর্ণ না হলে কোরবানি হবে না এবং আপনার সম্পূর্ণ অর্থ ফেরত দেওয়া হবে।' },
              { q: 'মাংস কতটুকু পাবো?', a: 'প্রতিটি টিয়ারে আনুমানিক মাংসের পরিমাণ উল্লেখ আছে। কোরবানির পরে প্রকৃত ওজন আপনাকে জানানো হবে।' },
              { q: 'ডেলিভারি কতক্ষণ লাগবে?', a: 'ঈদের দিন রাতে রওনা দিয়ে পরদিন সকালে ঢাকায় পৌঁছে দুপুরের মধ্যে আপনার এলাকায় ডেলিভারি সম্পন্ন হবে।' },
              { q: 'মাংস কি ফ্রেশ থাকবে?', a: 'ফ্রিজার ট্রাকে ০-৪°C তাপমাত্রায় পরিবহন করা হয়। পৌঁছানোর পরে আপনার ফ্রিজে রাখুন — টাটকা ও হালাল।' },
            ].map((item, i) => (
              <details key={i} className="card" style={{ padding: '1rem 1.25rem' }}>
                <summary className="bangla" style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--green-deep)', fontSize: '0.9rem', userSelect: 'none' }}>
                  {item.q}
                </summary>
                <p className="bangla" style={{ color: 'var(--text-muted)', lineHeight: 1.9, marginTop: 10, fontSize: '0.88rem' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'var(--gold-pale)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 16, padding: '2.5rem' }}>
          <div className="arabic-text" style={{ color: 'var(--gold)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>تَقَبَّلَ اللَّهُ مِنَّا وَمِنكُم</div>
          <div className="bangla" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>আল্লাহ আমাদের ও আপনার কোরবানি কবুল করুন</div>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            এখনই ভাগ বুক করুন →
          </Link>
        </div>
      </div>
    </div>
  );
}
