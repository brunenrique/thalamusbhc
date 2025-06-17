import React from 'react';

interface CardBadgeProps {
  sessionNumber?: number;
  sessionDate?: string; // Assuming ISO string or similar format
}

const CardBadge: React.FC<CardBadgeProps> = ({ sessionNumber, sessionDate }) => {
  if (sessionNumber !== undefined && sessionNumber !== null) {
    return (
      <div className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-800 dark:bg-blue-300/10 dark:text-blue-300 rounded-full">
        Sessão: {sessionNumber}
      </div>
    );
  }

  if (sessionDate) {
    // Basic date formatting, consider using a library like date-fns or moment for more complex formatting
    try {
      const date = new Date(sessionDate);
      const formattedDate = date.toLocaleDateString(); // Adjust format as needed
      return (
        <div className="px-2 py-0.5 text-xs font-semibold bg-gray-500/10 text-gray-800 dark:bg-gray-300/10 dark:text-gray-300 rounded-full">
          {formattedDate}
        </div>
      );
    } catch (error) {
      console.error("Invalid date format for CardBadge:", sessionDate, error);
      return null; // Or display an error indicator
    }
  }

  return null; // Don't render anything if neither is provided
};

export default CardBadge;