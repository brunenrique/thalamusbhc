
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
  Users2 as GroupsIcon,
  Network, // Ícone para Modelos de Formulação
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
  { href: "/assessments", label: "Avaliações", icon: ClipboardList, group: "Gestão de Pacientes" },
  { href: "/templates", label: "Modelos de Anotação", icon: FileText, group: "Gestão de Pacientes" },
  
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
      { href: "/tools/session-formulation-tree", label: "Árvore de Formulação", icon: GitFork },
      { href: "/tools/self-care", label: "Autocuidado", icon: HeartPulse },
    ]
  },
  
  { 
    href: "/admin/tools", label: "Ferramentas Admin", icon: Settings, adminOnly: true, group: "Administração",
    subItems: [
        { href: "/user-approvals", label: "Aprovação de Usuários", icon: ShieldQuestion, adminOnly: true },
        { href: "/tools/backup", label: "Backup de Dados", icon: DataBackupIcon },
        { href: "/tools/audit-trail", label: "Trilha de Auditoria", icon: HistoryIcon, adminOnly: true }, // Movido e mantido adminOnly
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
      : (item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href));

    const buttonContent = (
        <>
            <IconComponent className={isSubItem ? "h-3.5 w-3.5" : "h-4 w-4"} />
            <span className={isSubItem ? "" : "group-data-[collapsible=icon]:hidden"}>{item.label}</span>
        </>
    );
    
    const ButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;

    if (item.subItems && item.subItems.length > 0 && state === "expanded") {
      // Filtrar subItens baseado no userRole ANTES de decidir se renderiza como SubMenu
      const visibleSubItems = item.subItems.filter(sub => !sub.adminOnly || userRole === "admin");
      if (visibleSubItems.length === 0 && item.adminOnly && userRole !== "admin") return null; // Se todos subitens são adminOnly e user não é admin

      // Se o item principal tem um link próprio E subitens visíveis, renderize o botão principal e depois o submenu
      if (item.href && item.href !== "#" && visibleSubItems.length > 0) {
         return (
            <SidebarMenuItem key={`${item.label}-${index}-group`}>
            <Link href={item.href} asChild>
                <ButtonComponent
                isActive={isActive && !visibleSubItems.some(sub => currentPath.startsWith(sub.href))} // Ativo se for a página exata E não um subitem ativo
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
      // Se o item principal NÃO tem link próprio (ou é '#') OU não há subitens visíveis (pouco provável com filtro acima)
      // mas ainda tem subItens na definição original E estamos expandidos, renderiza como grupo de subitens.
      // Esta lógica pode precisar de ajuste se um item PAI for adminOnly e não tiver href.
      // Por agora, assumimos que itens com subitens têm um href que leva à página principal da seção.
      // E se não tiver href, mas tiver subitens, renderiza só os subitens (caso comum)
       if (visibleSubItems.length > 0) {
        return (
            <SidebarMenuItem key={`${item.label}-${index}-group`}>
                 <ButtonComponent
                    isActive={isActive} // O pai pode ser ativo se um dos filhos for.
                    tooltip={state === "collapsed" ? item.label : undefined}
                    className={isSubItem ? "text-xs" : ""}
                    // Se não há href no pai, o clique não faz nada, mas permite expandir
                    onClick={(e) => { if (!item.href || item.href === "#") e.preventDefault(); }} 
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
    
    // Renderiza item simples ou item colapsado que não tem subitens visíveis
    return (
      <SidebarMenuItem key={`${item.label}-${index}`}>
        <Link href={item.href} asChild>
          <ButtonComponent
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
        acc[groupName].push(item);
    }
    return acc;
  }, {} as Record<string, NavItem[]>);


  return (
    <div className="flex flex-col h-full justify-between">
        <SidebarMenu className="p-2 space-y-0">
            {Object.entries(groupedNavItems).map(([groupName, items]) => {
                // Filtra os itens principais do grupo se eles forem adminOnly e o usuário não for admin
                const visibleItemsInGroup = items.filter(item => !item.adminOnly || userRole === "admin");
                if (visibleItemsInGroup.length === 0) return null; // Não renderiza o grupo se não houver itens visíveis

                return (
                    <SidebarGroup key={groupName} className="p-0 pt-1">
                        {state === "expanded" && (
                            <SidebarGroupLabel className="mb-0.5 mt-1.5">{groupName}</SidebarGroupLabel>
                        )}
                        {state === "collapsed" && visibleItemsInGroup.length > 0 && <div className="h-2"/>} 
                        
                        <SidebarGroupContent className="space-y-0.5">
                        {visibleItemsInGroup.map((item, index) => renderNavItem(item, index))}
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
            <Link href="/help" asChild>
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

