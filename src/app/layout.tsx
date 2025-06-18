"use client";

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import usePageView from "@/hooks/use-page-view";
import useSessionTimeout from "@/hooks/use-session-timeout";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const headLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com", itemKey: "google-fonts-preconnect" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous", itemKey: "google-fonts-gstatic" },
  { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap", rel: "stylesheet", itemKey: "google-fonts-inter" },
  { href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap", rel: "stylesheet", itemKey: "google-fonts-space-grotesk" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  usePageView();
  const router = useRouter();

  useSessionTimeout(async () => {
    await signOut(auth);
    await fetch('/api/logout', { method: 'POST' });
    router.push("/login");
  });

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {headLinks.map(link => {
          const { itemKey, ...rest } = link;
          return <link key={itemKey} {...rest} />;
        })}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
