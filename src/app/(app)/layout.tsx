'use client';

import React, { useEffect, useState } from 'react';
import ErrorBoundary from '@/components/layout/error-boundary';
import { useRouter, usePathname } from 'next/navigation';
import { checkUserRole } from '@/services/authRole';
import { USER_ROLES } from '@/constants/roles';
import { useFirstLoginStatus } from '@/hooks/use-first-login-status';
import { WelcomeModal } from '@/components/onboarding/welcome-modal';
import CommandPalette from '@/components/command-palette';
import { useCommandPalette } from '@/stores/commandPaletteStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const { isFirstLogin, markOnboardingAsCompleted } = useFirstLoginStatus();
  const { toggle } = useCommandPalette();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggle]);

  useEffect(() => {
    checkUserRole([USER_ROLES.ADMIN, USER_ROLES.PSYCHOLOGIST, 'Secretary']).then((ok) => {
      if (!ok) {
        router.replace('/');
      } else {
        setAuthorized(true);
      }
    });
  }, [router, pathname]);

  if (!authorized) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <WelcomeModal
        isOpen={isFirstLogin}
        onClose={markOnboardingAsCompleted}
      />
      <CommandPalette />
    </div>
  );
}
