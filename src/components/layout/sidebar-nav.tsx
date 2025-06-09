
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
  ArchiveIcon as DataBackupIcon, 
  History as HistoryIcon, 
  BarChartBig, 
  Users2 as GroupsIcon,
  Network, 
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
  
  { href: "/patients", label: "Pacientes", icon: Users, group: "Gestão de Pacientes" },
  { href: "/groups", label: "Grupos Terapêuticos", icon: GroupsIcon, group: "Gestão de Pacientes"},
  { href: "/waiting-list", label: "Lista de Espera", icon: ListChecks, group: "Gestão de Pacientes" },
  { href: "/templates", label: "Modelos Inteligentes", icon: FileText, group: "Gestão de Pacientes" },
  
  { href: "/tasks", label: "Tarefas", icon: CheckSquare, group: "Operações da Clínica" },
  { href: "/resources", label: "Recursos da Clínica", icon: FolderArchive, group: "Operações da Clínica" },
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
      { href: "/tools/case-formulation-models", label: "Modelos de Formulação", icon: Network },
      { href: "/inventories-scales", label: "Inventários e Escalas", icon: ClipboardList },
    ]
  },
  
  { 
    href: "#", label: "Ferramentas Admin", icon: Settings, adminOnly: true, group: "Administração", // Changed href to # as it's a group
    subItems: [
        { href: "/user-approvals", label: "Aprovação de Usuários", icon: ShieldQuestion, adminOnly: true },
        { href: "/tools/backup", label: "Backup de Dados", icon: DataBackupIcon, adminOnly: true },
        { href: "/tools/audit-trail", label: "Trilha de Auditoria", icon: HistoryIcon, adminOnly: true }, 
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

  const renderNavItem = (item: NavItem, index: number, isSubItem: boolean = false): JSX.Element | null => {
    if (item.adminOnly && userRole !== "admin") {
        return null;
    }

    const IconComponent = item.icon;
    const isActive = item.href === "/dashboard" 
      ? currentPath === item.href
      : (item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href) && item.href !== "#");

    const buttonContent = (
        // Ensure buttonContent is a single element
        <span className="flex items-center gap-2">
            <IconComponent className={isSubItem ? "h-3.5 w-3.5" : "h-4 w-4"} />
            <span className={isSubItem ? "" : "group-data-[collapsible=icon]:hidden"}>{item.label}</span>
        </span>
    );
    
    let ButtonComponent;
    if (isSubItem) {
      ButtonComponent = SidebarMenuSubButton;
    } else {
      ButtonComponent = SidebarMenuButton;
    }


    if (item.subItems && item.subItems.length > 0 && state === "expanded") {
      const visibleSubItems = item.subItems.filter(sub => !sub.adminOnly || userRole === "admin");
      if (visibleSubItems.length === 0 && item.adminOnly && userRole !== "admin") return null; 

      if (item.href && item.href !== "#" && visibleSubItems.length > 0) {
         return (
            <SidebarMenuItem key={`${item.label}-${index}-group`}>
            <Link href={item.href} passHref asChild>
                <ButtonComponent
                  asChild // Added asChild here
                  isActive={isActive && !visibleSubItems.some(sub => currentPath.startsWith(sub.href))} 
                  tooltip={state === "collapsed" ? item.label : undefined}
                  className={isSubItem ? "text-xs" : ""}
                >
                {buttonContent}
                </ButtonComponent>
            </Link>
            <SidebarMenuSub>
                {visibleSubItems.map((subItem, subIndex) => renderNavItem(subItem, subIndex, true))}
            </SidebarMenuSub>
            </SidebarMenuItem>
        );
      }
       if (visibleSubItems.length > 0) { // This case is for parent items that are not links themselves but have sub-items
        return (
            <SidebarMenuItem key={`${item.label}-${index}-group`}>
                 <ButtonComponent
                    isActive={isActive} 
                    tooltip={state === "collapsed" ? item.label : undefined}
                    className={isSubItem ? "text-xs" : ""}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => { if (!item.href || item.href === "#") e.preventDefault(); }} 
                 >
                    {buttonContent}
                 </ButtonComponent>
                <SidebarMenuSub>
                    {visibleSubItems.map((subItem, subIndex) => renderNavItem(subItem, subIndex, true))}
                </SidebarMenuSub>
            </SidebarMenuItem>
        );
       }
    }
    
    // This is for items that are direct links (no sub-items or sub-items not shown due to collapsed state)
    // or for sub-items themselves
    return (
      <SidebarMenuItem key={`${item.label}-${index}`}>
        <Link href={item.href} passHref asChild>
          <ButtonComponent
            asChild // Added asChild here
            isActive={isActive}
            tooltip={state === "collapsed" ? item.label : undefined}
            className={isSubItem ? "text-xs" : ""}
          >
            {buttonContent}
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
        // Only add item if it's not adminOnly or user is admin
        // For items with subItems, check if any subItem is visible
        if (item.subItems && item.subItems.length > 0) {
            const visibleSubItems = item.subItems.filter(sub => !sub.adminOnly || userRole === "admin");
            if (visibleSubItems.length > 0) {
                acc[groupName].push(item);
            } else if (!item.href || item.href === "#") {
                // If it's a non-link group header with no visible sub-items, don't add it
            } else {
                 acc[groupName].push(item); // It's a link itself, add it
            }
        } else {
            acc[groupName].push(item);
        }
    }
    return acc;
  }, {} as Record<string, NavItem[]>);


  return (
    <div className="flex flex-col h-full justify-between">
        <SidebarMenu className="p-2 space-y-0">
            {Object.entries(groupedNavItems).map(([groupName, items]) => {
                const visibleItemsInGroup = items.filter(item => {
                    if (item.adminOnly && userRole !== "admin") return false;
                    if (item.subItems) {
                        return item.subItems.some(sub => !sub.adminOnly || userRole === "admin");
                    }
                    return true;
                });

                if (items.length === 0) return null; // if the original items array for the group is empty
                if (visibleItemsInGroup.length === 0 && groupName === "Administração" && userRole !== "admin") return null;


                return (
                    <SidebarGroup key={groupName} className="p-0 pt-1">
                        {state === "expanded" && (
                            <SidebarGroupLabel className="mb-0.5 mt-1.5">{groupName}</SidebarGroupLabel>
                        )}
                        {state === "collapsed" && items.length > 0 && <div className="h-2"/>} 
                        
                        <SidebarGroupContent className="space-y-0.5">
                        {items.map((item, index) => renderNavItem(item, index))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                );
            })}
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
            <Link href="/help" passHref asChild>
                <SidebarMenuButton asChild tooltip={state === "collapsed" ? "Ajuda e Suporte" : undefined} isActive={currentPath.startsWith("/help")}>
                    <HelpCircle />
                    <span className="group-data-[collapsible=icon]:hidden">Ajuda e Suporte</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
