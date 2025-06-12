"use client";

import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/services/firebase';

const TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function useSessionTimeout() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        await signOut(auth);
        router.push('/login');
      }, TIMEOUT);
    };

    reset();
    const events = ['mousemove', 'keydown', 'click'];
    events.forEach(e => window.addEventListener(e, reset));
    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);
}
