import React from "react";
import { cn } from "@/shared/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-10", className)}>
      {icon}
      <h3 className="mt-2 text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
