import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnalyticsEvent } from '@/types/analytics';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function usePageView(eventName: AnalyticsEvent = AnalyticsEvent.PAGE_VIEW) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        page_path: pathname,
      });
    }
  }, [pathname, eventName]);
}
