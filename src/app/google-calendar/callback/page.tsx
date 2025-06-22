'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { exchangeCodeForTokens } from '@/services/googleCalendar';
import { Loader2 } from 'lucide-react';

export default function GoogleCalendarCallback() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (user && code) {
      exchangeCodeForTokens(user.uid, code).finally(() => {
        router.push('/schedule');
      });
    }
  }, [user, searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen gap-2">
      <Loader2 className="animate-spin w-4 h-4" />
      <span>Conectando ao Google...</span>
    </div>
  );
}
