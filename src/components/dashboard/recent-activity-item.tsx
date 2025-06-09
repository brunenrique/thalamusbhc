
import React from 'react';

interface RecentActivityItemProps {
  id: string; // Added id for key prop if needed
  icon: React.ReactNode;
  description: string;
  time: string;
}

function RecentActivityItemComponent({ icon, description, time }: RecentActivityItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-secondary/30 rounded-md transition-colors">
      <span className="flex-shrink-0 text-muted-foreground mt-1">{icon}</span>
      <div className="flex-1">
        <p className="text-sm">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

export const RecentActivityItem = React.memo(RecentActivityItemComponent);
