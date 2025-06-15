import AppLayout from "@/components/layout/app-layout";
import ErrorBoundary from "@/components/layout/error-boundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Thalamus",
  description: "Gerencie seu consultório de psicologia com Thalamus.",
};

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AppLayout>{children}</AppLayout>
    </ErrorBoundary>
  );
}
