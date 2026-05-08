import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'KurbaniVag — রংপুর থেকে ঢাকায় হালাল কোরবানি',
  description: 'সুন্নাহসম্মত কোরবানি। রংপুর থেকে গরু ক্রয়, পশু চিকিৎসক পরীক্ষিত, ফ্রিজার ট্রাকে ঢাকায় হোম ডেলিভারি।',
  keywords: 'কোরবানি, কোরবানির গরু, ঢাকা, রংপুর, ভাগ কোরবানি, হালাল',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "'Noto Serif Bengali', serif",
              background: '#0a3d2e',
              color: '#fff',
              borderRadius: '8px',
            },
          }}
        />
      </body>
    </html>
  );
}
