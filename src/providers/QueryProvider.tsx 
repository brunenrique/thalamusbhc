// src/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Criamos uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Definimos configurações padrão para todas as queries
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false, // Opcional: desativa o refetch ao focar na janela
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}