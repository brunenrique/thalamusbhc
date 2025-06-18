import React from 'react';

interface CardLabelProps {
  tags: string[];
}

const CardLabel: React.FC<CardLabelProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300"
          aria-label={`Tipo de cartão: ${tag}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default CardLabel;