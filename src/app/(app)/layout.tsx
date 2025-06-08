import AppLayout from "@/components/layout/app-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PsiGuard Dashboard",
  description: "Manage your psychology practice with PsiGuard.",
};

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
