
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
  History as HistoryIcon, // Audit Trail (alias to avoid conflict)
  BarChartBig, // For Analytics parent
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
  group?: string; // To group items under a label like "Management" or "Tools"
}

const navStructure: NavItem[] = [
  // Main Section
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/schedule", label: "Schedule", icon: CalendarDays, group: "Overview" },
  { href: "/notifications", label: "Notifications", icon: Bell, group: "Overview" },
  
  // Patient Management
  { href: "/patients", label: "Patients", icon: Users, group: "Patient Care" },
  { href: "/waiting-list", label: "Waiting List", icon: ListChecks, group: "Patient Care" },
  { href: "/assessments", label: "Assessments", icon: ClipboardList, group: "Patient Care" },
  { href: "/templates", label: "Templates", icon: FileText, group: "Patient Care" },
  
  // Clinic Operations
  { href: "/tasks", label: "Tasks", icon: CheckSquare, group: "Clinic Operations" },
  { href: "/resources", label: "Resources", icon: FolderArchive, group: "Clinic Operations" },
  { 
    href: "/analytics", label: "Analytics", icon: BarChartBig, group: "Clinic Operations",
    subItems: [
      { href: "/analytics/clinic-occupancy", label: "Clinic Occupancy", icon: BarChartBig },
      // Add more analytics sub-items here if needed
    ]
  },

  // Tools
  { 
    href: "/tools", label: "Clinical Tools", icon: Wrench, group: "Utilities",
    subItems: [
      { href: "/tools/psychopharmacology", label: "Psychopharmacology", icon: BookOpen },
      { href: "/tools/knowledge-base", label: "Knowledge Base", icon: BrainCog },
      { href: "/tools/self-care", label: "Self-Care", icon: HeartPulse },
      { href: "/tools/session-formulation-tree", label: "Formulation Tree", icon: GitFork },
    ]
  },
  
  // Administration (Admin Only)
  { href: "/user-approvals", label: "User Approvals", icon: ShieldQuestion, adminOnly: true, group: "Administration" },
  { 
    href: "/admin/tools", label: "Admin Tools", icon: Settings, adminOnly: true, group: "Administration",
    subItems: [
        { href: "/tools/backup", label: "Data Backup", icon: DataBackupIcon },
        { href: "/tools/audit-trail", label: "Audit Trail", icon: HistoryIcon },
    ]
  },
  { href: "/settings", label: "Settings", icon: Settings, group: "Configuration" },
  // { href: "/help", label: "Help & Support", icon: HelpCircle, group: "Configuration" },
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
    
    // Exact match for dashboard, startsWith for others to keep parent active
    const isActive = item.href === "/dashboard" 
      ? currentPath === item.href
      : currentPath.startsWith(item.href) && (item.href !== "/" || currentPath === "/");


    if (item.subItems && item.subItems.length > 0) {
       return (
        <SidebarMenuItem key={`${item.label}-${index}-group`}>
            <ButtonComponent
                isActive={isActive}
                tooltip={state === "collapsed" ? item.label : undefined}
                className={isSubItem ? "text-xs" : ""}
                // For parent items with subItems, click might toggle sub-menu or navigate.
                // If it should only toggle, remove Link wrapper or adjust behavior.
                // For now, assume parent also navigates.
                asChild={!isSubItem} // Top level buttons can be links
                // onClick={isSubItem ? undefined : (e) => { if (item.href === "#") e.preventDefault(); /* Handle toggle here */}}
            >
             {isSubItem ? (
                <Link href={item.href} passHref legacyBehavior>
                    <span><IconComponent className={isSubItem ? "h-3.5 w-3.5" : "h-4 w-4"} />{item.label}</span>
                </Link>
             ) : (
                <Link href={item.href} passHref legacyBehavior>
                    <a><IconComponent className={isSubItem ? "h-3.5 w-3.5" : "h-4 w-4"} />
                    <span className={"group-data-[collapsible=icon]:hidden"}>{item.label}</span></a>
                </Link>
             )}
            </ButtonComponent>
            {state === "expanded" && ( // Only show sub-menu if sidebar is expanded
                <SidebarMenuSub>
                    {item.subItems.map((subItem, subIndex) => renderNavItem(subItem, subIndex, true))}
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
       )
    }

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
      </SidebarMenuItem>
    );
  };
  
  const groupedNavItems = navStructure.reduce((acc, item) => {
    const groupName = item.group || "General";
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
                {/* Small spacer for collapsed view with groups */}
                
                <SidebarGroupContent className="space-y-0.5">
                 {items.map((item, index) => renderNavItem(item, index))}
                </SidebarGroupContent>
            </SidebarGroup>
            ))}
        </SidebarMenu>
      
      <SidebarMenu className="mt-auto p-2 border-t border-sidebar-border">
         <SidebarMenuItem>
            <SidebarMenuButton
                tooltip={state === "collapsed" ? "Logout" : undefined}
                onClick={() => console.log("Logout action")} 
            >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/help" passHref legacyBehavior>
                <SidebarMenuButton tooltip={state === "collapsed" ? "Help & Support" : undefined} isActive={currentPath.startsWith("/help")}>
                    <HelpCircle />
                    <span className="group-data-[collapsible=icon]:hidden">Help & Support</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
