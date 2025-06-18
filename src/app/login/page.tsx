// src/app/login/page.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/routes';

export default function LoginPageDisabled() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o dashboard, já que o login está desabilitado
    router.replace(APP_ROUTES.dashboard);
  }, [router]);

  return null; // Renderiza nada enquanto redireciona
}
