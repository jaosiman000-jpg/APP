'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/storage';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session?.email) {
      router.replace('/inicio');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
    </div>
  );
}
