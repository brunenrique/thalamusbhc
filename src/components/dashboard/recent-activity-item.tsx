
import React from 'react';

interface RecentActivityItemProps {
  id?: string; // id is optional since it's only used as React key
  icon: React.ReactNode;
  description: string;
  time: string;
}

function RecentActivityItemComponent({ icon, description, time }: RecentActivityItemProps) {
  return (
    <div
      className="flex items-start space-x-3 p-3 hover:bg-secondary/30 rounded-md transition-colors"
      aria-label={`${description} em ${time}`}
    >
      <span className="flex-shrink-0 text-muted-foreground mt-1" aria-hidden="true">{icon}</span>
      <div className="flex-1 text-foreground">
        <p className="text-sm">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

export const RecentActivityItem = React.memo(RecentActivityItemComponent);
