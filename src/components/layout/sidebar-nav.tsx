'use client';

import React from 'react';
import Link from 'next/link';
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
  LineChart,
  LucideIcon,
} from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { USER_ROLES, type UserRole } from '@/constants/roles';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
  adminOnly?: boolean;
  group?: string;
}

const navStructure: NavItem[] = [
  { href: APP_ROUTES.dashboard, label: 'Painel', icon: LayoutDashboard, group: 'Visão Geral' },
  { href: APP_ROUTES.schedule, label: 'Agenda', icon: CalendarDays, group: 'Visão Geral' },
  { href: APP_ROUTES.patients, label: 'Pacientes', icon: Users, group: 'Gestão de Pacientes' },
  {
    href: APP_ROUTES.groups,
    label: 'Grupos Terapêuticos',
    icon: GroupsIcon,
    group: 'Gestão de Pacientes',
  },
  {
    href: APP_ROUTES.waitingList,
    label: 'Lista de Espera',
    icon: ListChecks,
    group: 'Gestão de Pacientes',
  },
  {
    href: APP_ROUTES.templates,
    label: 'Modelos Inteligentes',
    icon: FileText,
    group: 'Gestão de Pacientes',
  },
  { href: APP_ROUTES.tasks, label: 'Tarefas', icon: CheckSquare, group: 'Operações da Clínica' },
  {
    href: APP_ROUTES.resources,
    label: 'Recursos da Clínica',
    icon: FolderArchive,
    group: 'Operações da Clínica',
  },
  {
    href: APP_ROUTES.analytics,
    label: 'Relatórios e Análises',
    icon: BarChartBig,
    group: 'Operações da Clínica',
  },
  {
    href: APP_ROUTES.tools,
    label: 'Ferramentas Clínicas',
    icon: Wrench,
    group: 'Utilidades',
    subItems: [
      { href: APP_ROUTES.toolsPsychopharmacology, label: 'Psicofarmacologia', icon: BookOpen },
      { href: APP_ROUTES.toolsKnowledgeBase, label: 'Base de Conhecimento', icon: BrainCog },
      {
        href: APP_ROUTES.toolsCaseFormulationModels,
        label: 'Modelos de Formulação',
        icon: Network,
      },
      { href: APP_ROUTES.inventoriesScales, label: 'Inventários e Escalas', icon: ClipboardList },
    ],
  },
  {
    href: '#',
    label: 'Ferramentas Admin',
    icon: Settings,
    adminOnly: true,
    group: 'Administração',
    subItems: [
      {
        href: APP_ROUTES.toolsBackup,
        label: 'Backup de Dados',
        icon: DataBackupIcon,
        adminOnly: true,
      },
      {
        href: APP_ROUTES.toolsAuditTrail,
        label: 'Trilha de Auditoria',
        icon: HistoryIcon,
        adminOnly: true,
      },
      {
        href: APP_ROUTES.adminMetrics,
        label: 'Métricas da Clínica',
        icon: LineChart,
        adminOnly: true,
      },
      { href: APP_ROUTES.adminRoles, label: 'Gerenciar Papéis', icon: Settings, adminOnly: true },
    ],
  },
  { href: APP_ROUTES.settings, label: 'Configurações', icon: Settings, group: 'Configuração' },
];

interface SidebarNavProps {
  currentPath: string;
  userRole?: UserRole;
}

export default function SidebarNav({ currentPath, userRole = USER_ROLES.ADMIN }: SidebarNavProps) {
  const { state } = useSidebar();

  const renderNavItem = (
    item: NavItem,
    index: number,
    isSubItem: boolean = false
  ): React.ReactElement | null => {
    if (item.adminOnly && userRole !== USER_ROLES.ADMIN) return null;

    const IconComponent = item.icon;
    const isActive =
      item.href === '/dashboard'
        ? currentPath === item.href
        : item.href === '/'
          ? currentPath === '/'
          : currentPath.startsWith(item.href) && item.href !== '#';

    const buttonContent = (
      <span className="flex items-center gap-2">
        <IconComponent className={isSubItem ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        <span className={isSubItem ? '' : 'group-data-[collapsible=icon]:hidden'}>
          {item.label}
        </span>
      </span>
    );

    const ButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;

    if (item.subItems?.length && state === 'expanded') {
      const visibleSubItems = item.subItems.filter(
        (sub) => !sub.adminOnly || userRole === USER_ROLES.ADMIN
      );
      if (visibleSubItems.length === 0) return null;

      return (
        <SidebarMenuItem key={item.href || item.label}>
          <ButtonComponent
            asChild
            isActive={isActive && !visibleSubItems.some((sub) => currentPath.startsWith(sub.href))}
            tooltip={state === 'collapsed' ? item.label : undefined}
            className={isSubItem ? 'text-xs' : ''}
          >
            <Link href={item.href} tabIndex={0} aria-current={isActive ? 'page' : undefined}>
              {buttonContent}
            </Link>
          </ButtonComponent>
          <SidebarMenuSub>
            {visibleSubItems.map((subItem, subIndex) => (
              <React.Fragment key={subItem.href || subItem.label || subIndex}>
                {renderNavItem(subItem, subIndex, true)}
              </React.Fragment>
            ))}
          </SidebarMenuSub>
        </SidebarMenuItem>
      );
    }

    if (!item.href || item.href === '#') {
      return (
        <SidebarMenuItem key={item.href || item.label}>
          <ButtonComponent
            isActive={isActive}
            tooltip={state === 'collapsed' ? item.label : undefined}
            className={isSubItem ? 'text-xs' : ''}
            onClick={(e) => e.preventDefault()}
            aria-disabled="true"
          >
            {buttonContent}
          </ButtonComponent>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.href || item.label}>
        <ButtonComponent
          asChild
          isActive={isActive}
          tooltip={state === 'collapsed' ? item.label : undefined}
          className={isSubItem ? 'text-xs' : ''}
        >
          <Link href={item.href} tabIndex={0} aria-current={isActive ? 'page' : undefined}>
            {buttonContent}
          </Link>
        </ButtonComponent>
      </SidebarMenuItem>
    );
  };

  const groupedNavItems = navStructure.reduce(
    (acc, item) => {
      const groupName = item.group || 'Geral';
      if (!acc[groupName]) acc[groupName] = [];

      if (!item.adminOnly || userRole === USER_ROLES.ADMIN) {
        if (item.subItems?.length) {
          const visibleSubItems = item.subItems.filter(
            (sub) => !sub.adminOnly || userRole === USER_ROLES.ADMIN
          );
          if (visibleSubItems.length > 0 || (item.href && item.href !== '#')) {
            acc[groupName].push(item);
          }
        } else {
          acc[groupName].push(item);
        }
      }

      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  return (
    <div className="flex flex-col h-full justify-between">
      <SidebarMenu className="p-2 space-y-0">
        {Object.entries(groupedNavItems).map(([groupName, items]) => {
          if (items.length === 0) return null;

          return (
            <SidebarGroup key={groupName} className="p-0 pt-1">
              {state === 'expanded' && (
                <SidebarGroupLabel className="mb-0.5 mt-1.5">{groupName}</SidebarGroupLabel>
              )}
              {state === 'collapsed' && <div className="h-2" />}

              <SidebarGroupContent className="space-y-0.5">
                {items.map((item, index) => (
                  <React.Fragment key={item.href || item.label || index}>
                    {renderNavItem(item, index)}
                  </React.Fragment>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarMenu>

      <SidebarMenu className="mt-auto p-2 border-t border-sidebar-border">
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={state === 'collapsed' ? 'Sair' : undefined}
            onClick={() => {}}
          >
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Sair</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={currentPath.startsWith('/help')}
            tooltip={state === 'collapsed' ? 'Ajuda e Suporte' : undefined}
          >
            <Link href="/help" passHref>
              <span>
                <HelpCircle />
                <span className="group-data-[collapsible=icon]:hidden">Ajuda e Suporte</span>
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
