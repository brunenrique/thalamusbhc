'use client';

import React, { useEffect, useState } from 'react';
import ErrorBoundary from '@/components/layout/error-boundary';
import { useRouter, usePathname } from 'next/navigation';
import { checkUserRole } from '@/services/authRole';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkUserRole(['Admin', 'Psychologist', 'Secretary']).then((ok) => {
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
    </div>
  );
}
