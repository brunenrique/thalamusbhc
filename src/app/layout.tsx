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
      </body>
    </html>
  );
}
