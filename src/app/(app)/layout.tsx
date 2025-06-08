import AppLayout from "@/components/layout/app-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel PsiGuard",
  description: "Gerencie seu consultório de psicologia com PsiGuard.",
};

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
