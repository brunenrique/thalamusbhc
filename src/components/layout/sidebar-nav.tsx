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
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar"; // To access collapsed state for tooltips

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/waiting-list", label: "Waiting List", icon: ListChecks },
  { href: "/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/resources", label: "Resources", icon: FolderArchive },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const bottomNavItems: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
  { href: "/logout", label: "Logout", icon: LogOut }, // This would typically trigger a logout action
];

interface SidebarNavProps {
  currentPath: string;
}

export default function SidebarNav({ currentPath }: SidebarNavProps) {
  const { state } = useSidebar(); // 'expanded' or 'collapsed'

  const renderNavItem = (item: NavItem, index: number) => (
    <SidebarMenuItem key={`${item.label}-${index}`}>
      <Link href={item.href} passHref legacyBehavior>
        <SidebarMenuButton
          isActive={currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href))}
          tooltip={state === "collapsed" ? item.label : undefined}
        >
          <item.icon />
          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
        </SidebarMenuButton>
      </Link>
      {item.subItems && (
        <SidebarMenuSub>
          {item.subItems.map((subItem, subIndex) => (
            <SidebarMenuSubItem key={`${subItem.label}-${subIndex}`}>
              <Link href={subItem.href} passHref legacyBehavior>
                <SidebarMenuSubButton
                  isActive={currentPath === subItem.href || currentPath.startsWith(subItem.href)}
                >
                  <subItem.icon className="mr-2 h-4 w-4" /> {/* Keep icon small for sub-items or omit */}
                  {subItem.label}
                </SidebarMenuSubButton>
              </Link>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );

  return (
    <div className="flex flex-col h-full justify-between">
      <SidebarMenu>
        {navItems.map(renderNavItem)}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
        {bottomNavItems.map(renderNavItem)}
      </SidebarMenu>
    </div>
  );
}
