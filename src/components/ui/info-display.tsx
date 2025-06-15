
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

export interface InfoDisplayProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon | (() => React.ReactNode); // Allow function for custom icon rendering
  className?: string;
}

function InfoDisplayComponent({ label, value, icon: IconComponent, className }: InfoDisplayProps) {
  return (
    <div className={cn("flex items-start gap-2", className)}> {/* Adjusted gap */}
      {IconComponent && (
        typeof IconComponent === 'function' 
          ? IconComponent() 
          : <IconComponent className="text-muted-foreground h-4 w-4 mt-0.5" /> // Default icon styling
      )}
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

const InfoDisplay = React.memo(InfoDisplayComponent);
export default InfoDisplay;
