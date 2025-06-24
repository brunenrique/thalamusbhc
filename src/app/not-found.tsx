'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { buttonVariants } from '@/components/ui/button';

export default function NotFoundPage() {
  useEffect(() => {
    Sentry.captureMessage('404 - Página não encontrada', 'warning');
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-4">
      <h1 className="text-4xl font-headline font-bold">404 - Página Não Encontrada</h1>
      <p className="text-muted-foreground">
        Não conseguimos encontrar a página que você procurava.
      </p>
      <Link href="/" className={buttonVariants()}>
        <span>Voltar para a página inicial</span>
      </Link>
    </div>
  );
}
