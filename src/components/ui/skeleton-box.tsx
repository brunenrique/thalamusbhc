import React from 'react';

interface SkeletonBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
};

export { SkeletonBox };