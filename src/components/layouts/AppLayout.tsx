"use client";

import Link from "next/link";
import {
  Bell,
  BrainCircuit,
  Calendar,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  ChevronDown
} from "lucide-react";
import * as React from "react";

// Importações de componentes...
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/atoms/sidebar";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  // ...outros imports do dropdown
} from "@/components/atoms/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { ThalamusLogo } from "@/components/atoms/logo";
import { usePathname } from "next/navigation";
import { QueryProvider } from "@/providers/QueryProvider"; // 1. Importe o provider

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    title: "Pacientes",
    href: "/patients",
    icon: Users,
    label: "Pacientes",
  },
  {
    title: "Agenda",
    href: "/schedule",
    icon: Calendar,
    label: "Agenda",
  },
  {
    title: "Insights de IA",
    href: "/ai-insights",
    icon: BrainCircuit,
    label: "Insights de IA",
  },
  {
    title: "Modelos",
    href: "/templates",
    icon: FileText,
    label: "Modelos",
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    label: "Configurações",
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <QueryProvider> {/* 2. Adicione o provider aqui */}
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar collapsible="none" className="border border-red-500">
            <SidebarHeader>
              <Link href="/">
                <ThalamusLogo className="size-10" />
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} className="w-full">
                        <SidebarMenuButton
                          isActive={pathname === item.href}
                          tooltip={item.label}
                        >
                          <Icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <Button variant="ghost" className="w-full">
                <Bell />
                <span>Notificações</span>
              </Button>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
              {/* ... Conteúdo do Header ... */}
            </header>
            <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </QueryProvider>
  );
}