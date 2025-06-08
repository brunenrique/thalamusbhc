
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListChecks,
  ClipboardList,
  CheckSquare,
  FolderArchive,
  FileText,
  Settings,
  Bell,
  LucideIcon,
  LogOut,
  HelpCircle,
  ShieldQuestion, 
  Wrench, 
  BookOpen, 
  BrainCog, 
  HeartPulse, 
  ArchiveIcon as DataBackupIcon, 
  GitFork, 
  History as HistoryIcon, 
  BarChartBig, 
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar"; 

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
  adminOnly?: boolean; 
  group?: string; 
}

const navStructure: NavItem[] = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, group: "Visão Geral" },
  { href: "/schedule", label: "Agenda", icon: CalendarDays, group: "Visão Geral" },
  { href: "/notifications", label: "Notificações", icon: Bell, group: "Visão Geral" },
  
  { href: "/patients", label: "Pacientes", icon: Users, group: "Gestão de Pacientes" },
  { href: "/waiting-list", label: "Lista de Espera", icon: ListChecks, group: "Gestão de Pacientes" },
  { href: "/assessments", label: "Avaliações", icon: ClipboardList, group: "Gestão de Pacientes" },
  { href: "/templates", label: "Modelos", icon: FileText, group: "Gestão de Pacientes" },
  
  { href: "/tasks", label: "Tarefas", icon: CheckSquare, group: "Operações da Clínica" },
  { href: "/resources", label: "Recursos", icon: FolderArchive, group: "Operações da Clínica" },
  { 
    href: "/analytics", label: "Análises", icon: BarChartBig, group: "Operações da Clínica",
    subItems: [
      { href: "/analytics/clinic-occupancy", label: "Ocupação da Clínica", icon: BarChartBig },
    ]
  },

  { 
    href: "/tools", label: "Ferramentas Clínicas", icon: Wrench, group: "Utilidades",
    subItems: [
      { href: "/tools/psychopharmacology", label: "Psicofarmacologia", icon: BookOpen },
      { href: "/tools/knowledge-base", label: "Base de Conhecimento", icon: BrainCog },
      { href: "/tools/self-care", label: "Autocuidado", icon: HeartPulse },
      { href: "/tools/session-formulation-tree", label: "Árvore de Formulação", icon: GitFork },
    ]
  },
  
  { href: "/user-approvals", label: "Aprovação de Usuários", icon: ShieldQuestion, adminOnly: true, group: "Administração" },
  { 
    href: "/admin/tools", label: "Ferramentas Admin", icon: Settings, adminOnly: true, group: "Administração",
    subItems: [
        { href: "/tools/backup", label: "Backup de Dados", icon: DataBackupIcon },
        { href: "/tools/audit-trail", label: "Trilha de Auditoria", icon: HistoryIcon },
    ]
  },
  { href: "/settings", label: "Configurações", icon: Settings, group: "Configuração" },
];


interface SidebarNavProps {
  currentPath: string;
  userRole?: "admin" | "psychologist" | "secretary"; 
}

export default function SidebarNav({ currentPath, userRole = "admin" }: SidebarNavProps) {
  const { state } = useSidebar(); 

  const renderNavItem = (item: NavItem, index: number, isSubItem: boolean = false) => {
    if (item.adminOnly && userRole !== "admin") {
        return null;
    }

    const ButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;
    const IconComponent = item.icon;
    
    const isActive = item.href === "/dashboard" 
      ? currentPath === item.href
      : currentPath.startsWith(item.href) && (item.href !== "/" || currentPath === "/");


    if (item.subItems && item.subItems.length > 0) {
       return (
        <SidebarMenuItem key={`${item.label}-${index}-group`}>
            <Link href={item.href} passHref>
              <ButtonComponent
                  isActive={isActive}
                  tooltip={state === "collapsed" ? item.label : undefined}
                  className={isSubItem ? "text-xs" : ""}
                  asChild={!isSubItem} 
              >
              <>
                <IconComponent className={isSubItem ? "h-3.5 w-3.5" : "h-4 w-4"} />
                <span className={isSubItem ? "" : "group-data-[collapsible=icon]:hidden"}>{item.label}</span>
              </>
              </ButtonComponent>
            </Link>
            {state === "expanded" && ( 
                <SidebarMenuSub>
                    {item.subItems.filter(sub => !sub.adminOnly || userRole === "admin").map((subItem, subIndex) => renderNavItem(subItem, subIndex, true))}
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
       )
    }

    return (
      <SidebarMenuItem key={`${item.label}-${index}`}>
        <Link href={item.href} passHref>
          <ButtonComponent
            isActive={isActive}
            tooltip={state === "collapsed" ? item.label : undefined}
            className={isSubItem ? "text-xs" : ""}
          >
            <IconComponent className={isSubItem ? "h-3.5 w-3.5" : "h-4 w-4"} />
            <span className={isSubItem ? "" : "group-data-[collapsible=icon]:hidden"}>{item.label}</span>
          </ButtonComponent>
        </Link>
      </SidebarMenuItem>
    );
  };
  
  const groupedNavItems = navStructure.reduce((acc, item) => {
    const groupName = item.group || "Geral";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    if (!item.adminOnly || userRole === "admin") {
        acc[groupName].push(item);
    }
    return acc;
  }, {} as Record<string, NavItem[]>);


  return (
    <div className="flex flex-col h-full justify-between">
        <SidebarMenu className="p-2 space-y-0">
            {Object.entries(groupedNavItems).map(([groupName, items]) => (
            <SidebarGroup key={groupName} className="p-0 pt-1">
                {state === "expanded" && (
                    <SidebarGroupLabel className="mb-0.5 mt-1.5">{groupName}</SidebarGroupLabel>
                )}
                {state === "collapsed" && items.length > 0 && <div className="h-2"/>} 
                
                <SidebarGroupContent className="space-y-0.5">
                 {items.map((item, index) => renderNavItem(item, index))}
                </SidebarGroupContent>
            </SidebarGroup>
            ))}
        </SidebarMenu>
      
      <SidebarMenu className="mt-auto p-2 border-t border-sidebar-border">
         <SidebarMenuItem>
            <SidebarMenuButton
                tooltip={state === "collapsed" ? "Sair" : undefined}
                onClick={() => console.log("Logout action")} 
            >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/help" passHref>
                <SidebarMenuButton tooltip={state === "collapsed" ? "Ajuda e Suporte" : undefined} isActive={currentPath.startsWith("/help")}>
                    <HelpCircle />
                    <span className="group-data-[collapsible=icon]:hidden">Ajuda e Suporte</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
