"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-4">
      <h1 className="text-4xl font-headline font-bold">404 - Página Não Encontrada</h1>
      <p className="text-muted-foreground">Não conseguimos encontrar a página que você procurava.</p>
      <Button onClick={() => router.push("/")}>Voltar para a página inicial</Button>
    </div>
  );
}
