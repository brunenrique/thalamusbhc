// src/app/page.tsx (Simplified for debugging Turbopack)
import { Button } from "@/components/ui/button";
// Import of next/link is removed as it's no longer used directly here for this test.

export default function LandingPageSimplified() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Thalamus (Simplified)</h1>
      <p className="text-muted-foreground mb-6">
        This landing page has been temporarily simplified for debugging.
      </p>
      <Button> {/* Removed asChild prop */}
        <span>Access Dashboard Span</span>
      </Button>
    </div>
  );
}
