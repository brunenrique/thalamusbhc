import './globals.css'; // Manter esta importação

// Removido: Toaster, usePageView, headLinks e lógica relacionada.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Removido: usePageView();
  // Removido: lógica de timeout de sessão

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Thalamus - Plataforma de Gestão para Psicólogos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Removido: headLinks.map(...) */}
      </head>
      <body className="font-body antialiased"> {/* Estas classes dependem do Tailwind */}
        {children}
        {/* Removido: <Toaster /> */}
      </body>
    </html>
  );
}
