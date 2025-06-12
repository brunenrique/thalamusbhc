import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function usePageView() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: router.pathname,
      });
    }
  }, [router.pathname]);
}
