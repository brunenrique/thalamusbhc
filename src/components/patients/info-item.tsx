
import React from 'react';
import { cn } from "@/shared/utils";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  className?: string;
}

function InfoItemComponent({ icon, label, value, className }: InfoItemProps) {
  return (
    <div className={cn("flex items-start gap-3 p-3 bg-secondary/30 rounded-md", className)}>
      <span className="text-muted-foreground mt-1">{icon}</span>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-foreground">{value || "N/A"}</p>
      </div>
    </div>
  );
}

const InfoItem = React.memo(InfoItemComponent);
export default InfoItem;
