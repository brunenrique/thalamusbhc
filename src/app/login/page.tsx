// This page has been intentionally disabled and redirects to the dashboard.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/routes';

export default function LoginPageDisabled() {
  const router = useRouter();

  useEffect(() => {
    router.replace(APP_ROUTES.dashboard);
  }, [router]);

  return null; // Render nothing while redirecting
}
