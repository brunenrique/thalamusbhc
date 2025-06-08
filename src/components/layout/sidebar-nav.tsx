
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
  ShieldQuestion, // For User Approvals
  Wrench, // For Tools parent
  BookOpen, // Psychopharmacology
  BrainCog, // Knowledge Base
  HeartPulse, // Self-Care
  ArchiveIcon as DataBackupIcon, // Data Backup (alias to avoid conflict)
  GitFork, // Session Formulation Tree
  HistoryIcon, // Audit Trail (alias to avoid conflict)
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar"; 

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
  adminOnly?: boolean; // Simple flag, real role handling would be more complex
}

const mainNavItems: NavItem[] = [
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

const adminNavItems: NavItem[] = [
   { href: "/user-approvals", label: "User Approvals", icon: ShieldQuestion, adminOnly: true },
];

const toolsNavItems: NavItem = {
  href: "/tools", label: "Tools", icon: Wrench, subItems: [
    { href: "/tools/psychopharmacology", label: "Psychopharmacology", icon: BookOpen },
    { href: "/tools/knowledge-base", label: "Knowledge Base", icon: BrainCog },
    { href: "/tools/self-care", label: "Self-Care", icon: HeartPulse },
    { href: "/tools/backup", label: "Data Backup", icon: DataBackupIcon },
    { href: "/tools/session-formulation-tree", label: "Formulation Tree", icon: GitFork },
    { href: "/tools/audit-trail", label: "Audit Trail", icon: HistoryIcon },
  ]
};

const bottomNavItems: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
  // Logout would typically be an action, not a link here
  // { href: "/logout", label: "Logout", icon: LogOut }, 
];

interface SidebarNavProps {
  currentPath: string;
  // In a real app, user role would be passed here or determined from context
  userRole?: "admin" | "psychologist" | "secretary"; 
}

export default function SidebarNav({ currentPath, userRole = "admin" /* Default to admin for showing all links in dev */ }: SidebarNavProps) {
  const { state } = useSidebar(); 

  const renderNavItem = (item: NavItem, index: number, isSubItem: boolean = false) => {
    if (item.adminOnly && userRole !== "admin") {
        return null;
    }

    const ButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;
    const IconComponent = item.icon;
    
    const isActive = item.href === "/dashboard" 
      ? currentPath === item.href
      : currentPath.startsWith(item.href);

    return (
      <SidebarMenuItem key={`${item.label}-${index}`}>
        <Link href={item.href} passHref legacyBehavior>
          <ButtonComponent
            isActive={isActive}
            tooltip={state === "collapsed" ? item.label : undefined}
            className={isSubItem ? "text-xs" : ""}
          >
            <IconComponent className={isSubItem ? "h-3.5 w-3.5" : "h-4 w-4"} />
            <span className={isSubItem ? "" : "group-data-[collapsible=icon]:hidden"}>{item.label}</span>
          </ButtonComponent>
        </Link>
        {item.subItems && state === "expanded" && (
          <SidebarMenuSub>
            {item.subItems.map((subItem, subIndex) => renderNavItem(subItem, subIndex, true))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };
  
  const allNavItems = [...mainNavItems];
  if (userRole === "admin") {
    allNavItems.push(...adminNavItems);
  }
  allNavItems.push(toolsNavItems);


  return (
    <div className="flex flex-col h-full justify-between">
      <SidebarMenu className="p-2">
        {allNavItems.map((item, index) => renderNavItem(item, index))}
      </SidebarMenu>
      <SidebarMenu className="mt-auto p-2">
        {/* Logout Button if needed as a separate component/action */}
         <SidebarMenuItem>
            <SidebarMenuButton
                tooltip={state === "collapsed" ? "Logout" : undefined}
                onClick={() => console.log("Logout action")} // Placeholder for logout
            >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
        {bottomNavItems.map((item, index) => renderNavItem(item, index))}
      </SidebarMenu>
    </div>
  );
}

