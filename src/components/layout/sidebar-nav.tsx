
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
  Wrench,
  BookOpen,
  BrainCog,
  ArchiveIcon as DataBackupIcon,
  History as HistoryIcon,
  BarChartBig,
  Users2 as GroupsIcon,
  Network,
  LineChart
} from "lucide-react";
import { APP_ROUTES } from "@/lib/routes";
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
import type { UserRole } from "@/services/authRole"; // Import UserRole type

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
  adminOnly?: boolean;
  group?: string;
}

const navStructure: NavItem[] = [
  { href: APP_ROUTES.dashboard, label: "Painel", icon: LayoutDashboard, group: "Visão Geral" },
  { href: APP_ROUTES.schedule, label: "Agenda", icon: CalendarDays, group: "Visão Geral" },

  { href: APP_ROUTES.patients, label: "Pacientes", icon: Users, group: "Gestão de Pacientes" },
  { href: APP_ROUTES.groups, label: "Grupos Terapêuticos", icon: GroupsIcon, group: "Gestão de Pacientes"},
  { href: APP_ROUTES.waitingList, label: "Lista de Espera", icon: ListChecks, group: "Gestão de Pacientes" },
  { href: APP_ROUTES.templates, label: "Modelos Inteligentes", icon: FileText, group: "Gestão de Pacientes" },

  { href: APP_ROUTES.tasks, label: "Tarefas", icon: CheckSquare, group: "Operações da Clínica" },
  { href: APP_ROUTES.resources, label: "Recursos da Clínica", icon: FolderArchive, group: "Operações da Clínica" },
  {
    href: APP_ROUTES.analytics, label: "Relatórios e Análises", icon: BarChartBig, group: "Operações da Clínica",
  },

  {
    href: APP_ROUTES.tools, label: "Ferramentas Clínicas", icon: Wrench, group: "Utilidades",
    subItems: [
      { href: APP_ROUTES.toolsPsychopharmacology, label: "Psicofarmacologia", icon: BookOpen },
      { href: APP_ROUTES.toolsKnowledgeBase, label: "Base de Conhecimento", icon: BrainCog },
      { href: APP_ROUTES.toolsCaseFormulationModels, label: "Modelos de Formulação", icon: Network },
      { href: APP_ROUTES.inventoriesScales, label: "Inventários e Escalas", icon: ClipboardList },
    ]
  },

  {
    href: "#", label: "Ferramentas Admin", icon: Settings, adminOnly: true, group: "Administração",
    subItems: [
        { href: APP_ROUTES.toolsBackup, label: "Backup de Dados", icon: DataBackupIcon, adminOnly: true },
        { href: APP_ROUTES.toolsAuditTrail, label: "Trilha de Auditoria", icon: HistoryIcon, adminOnly: true },
        { href: APP_ROUTES.adminMetrics, label: "Métricas da Clínica", icon: LineChart, adminOnly: true },
    ]
  },
  { href: APP_ROUTES.settings, label: "Configurações", icon: Settings, group: "Configuração" },
];


interface SidebarNavProps {
  currentPath: string;
  userRole?: UserRole; // Use the imported UserRole type
}

export default function SidebarNav({ currentPath, userRole = "Admin" }: SidebarNavProps) { // Default to Admin for dev
  const { state } = useSidebar();

  const renderNavItem = (item: NavItem, index: number, isSubItem: boolean = false): JSX.Element | null => {
    if (item.adminOnly && userRole !== "Admin") { // Corrected: Check against "Admin" (capital 'A')
        return null;
    }

    const IconComponent = item.icon;
    const isActive = item.href === "/dashboard"
      ? currentPath === item.href
      : (item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href) && item.href !== "#");

    const buttonContent = (
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
      const visibleSubItems = item.subItems.filter(sub => !sub.adminOnly || userRole === "Admin"); // Corrected
      if (visibleSubItems.length === 0 && item.adminOnly && userRole !== "Admin") return null; // Corrected

      if (item.href && item.href !== "#" && visibleSubItems.length > 0) {
         return (
            <SidebarMenuItem key={`${item.label}-${index}-group`}>
              <ButtonComponent
                asChild
                isActive={
                  isActive &&
                  !visibleSubItems.some((sub) =>
                    currentPath.startsWith(sub.href)
                  )
                }
                tooltip={(state as string) === "collapsed" ? item.label : undefined}
                className={isSubItem ? "text-xs" : ""}
              >
                <Link href={item.href}>{buttonContent}</Link>
              </ButtonComponent>
            <SidebarMenuSub>
                {visibleSubItems.map((subItem, subIndex) => renderNavItem(subItem, subIndex, true))}
            </SidebarMenuSub>
            </SidebarMenuItem>
        );
      }
       if (visibleSubItems.length > 0) {
        return (
            <SidebarMenuItem key={`${item.label}-${index}-group`}>
                 <ButtonComponent
                    isActive={isActive}
                    tooltip={(state as string) === "collapsed" ? item.label : undefined}
                    className={isSubItem ? "text-xs" : ""}
                    onClick={(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => { if (!item.href || item.href === "#") e.preventDefault(); }}
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

    if (!item.href || item.href === "#") {
         return (
            <SidebarMenuItem key={`${item.label}-${index}`}>
                <ButtonComponent
                    isActive={isActive}
                    tooltip={state === "collapsed" ? item.label : undefined}
                    className={isSubItem ? "text-xs" : ""}
                    onClick={(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => e.preventDefault()}
                    aria-disabled="true"
                 >
                {buttonContent}
                </ButtonComponent>
            </SidebarMenuItem>
        );
    }

    return (
      <SidebarMenuItem key={`${item.label}-${index}`}>
        <ButtonComponent
          asChild
          isActive={isActive}
          tooltip={state === "collapsed" ? item.label : undefined}
          className={isSubItem ? "text-xs" : ""}
        >
          <Link href={item.href}>{buttonContent}</Link>
        </ButtonComponent>
      </SidebarMenuItem>
    );
  };

  const groupedNavItems = navStructure.reduce((acc, item) => {
    const groupName = item.group || "Geral";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    if (!item.adminOnly || userRole === "Admin") { // Corrected
        if (item.subItems && item.subItems.length > 0) {
            const visibleSubItems = item.subItems.filter(sub => !sub.adminOnly || userRole === "Admin"); // Corrected
            if (visibleSubItems.length > 0) {
                acc[groupName].push(item);
            } else if (item.href && item.href !== "#") { // Ensure parent item is added if it has a link, even if all subitems are filtered out
                 acc[groupName].push(item);
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
                if (items.length === 0) return null;

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
                onClick={() => { /* Logout logic would be here if auth was enabled */ }}
            >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath.startsWith("/help")}
              tooltip={state === "collapsed" ? "Ajuda e Suporte" : undefined}
            >
              <Link href="/help" passHref>
                <HelpCircle />
                <span className="group-data-[collapsible=icon]:hidden">Ajuda e Suporte</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
