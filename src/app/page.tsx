
"use client";

import { Brain } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";

export default function LandingPageSimplified() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Brain className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold mb-2">Thalamus (Simplified)</h1>
      <p className="text-lg text-muted-foreground mb-6">
        This landing page has been temporarily simplified for debugging.
      </p>
      <Link
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        href={APP_ROUTES.dashboard}
      >
        Access Dashboard
      </Link>
    </div>
  );
}
