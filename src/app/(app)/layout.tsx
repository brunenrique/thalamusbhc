"use client";

import { AppLayout } from "@/layouts/AppLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
