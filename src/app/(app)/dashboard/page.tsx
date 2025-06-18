
"use client"; 

import React from "react";
import { LayoutDashboard } from "lucide-react"; 

export default function DashboardPageSimplified() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Painel (Simplificado para Debug)</h1>
      </div>
      <p className="text-muted-foreground">
        Esta página do painel foi temporariamente simplificada para ajudar a diagnosticar um erro do Turbopack.
      </p>
      <div className="p-4 border rounded-md bg-card">
        Conteúdo estático de exemplo.
      </div>
    </div>
  );
}
