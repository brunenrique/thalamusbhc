
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

export interface InfoDisplayProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

function InfoDisplayComponent({ label, value, icon: Icon, className }: InfoDisplayProps) {
  return (
    <div className={cn("flex items-start gap-3 p-3 bg-secondary/30 rounded-md", className)}>
      {Icon && <Icon className="text-accent h-5 w-5 mt-1" />}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-foreground">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

const InfoDisplay = React.memo(InfoDisplayComponent);
export default InfoDisplay;
