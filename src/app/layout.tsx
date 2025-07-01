<<<<<<< HEAD
import './globals.css'; // Manter esta importação
import ErrorBoundary from '@/components/layout/error-boundary';
import { ThemeProvider } from '@/components/layout/theme-provider';

// Removido: Toaster, usePageView, headLinks e lógica relacionada.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Removido: usePageView();
  // Removido: lógica de timeout de sessão

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Thalamus - Plataforma de Gestão para Psicólogos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://placehold.co" />
        {/* Removido: headLinks.map(...) */}
      </head>
      <body className="font-body antialiased"> {/* Estas classes dependem do Tailwind */}
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        {/* Removido: <Toaster /> */}
=======
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Thalamus',
  description: 'Uma plataforma moderna para profissionais de psicologia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
      </body>
    </html>
  );
}
