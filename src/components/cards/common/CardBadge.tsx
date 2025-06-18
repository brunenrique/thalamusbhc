"use client";

import React from "react";

export type CardBadgeStatus = "default" | "success" | "warning" | "error";
export type CardBadgeVariant = "solid" | "outline";

interface CardBadgeProps {
  label: string;
  status?: CardBadgeStatus;
  variant?: CardBadgeVariant;
}

const statusStyles: Record<CardBadgeStatus, string> = {
  default: "bg-gray-500/10 text-gray-800 dark:bg-gray-300/10 dark:text-gray-300",
  success: "bg-green-500/10 text-green-800 dark:bg-green-300/10 dark:text-green-300",
  warning: "bg-yellow-500/10 text-yellow-800 dark:bg-yellow-300/10 dark:text-yellow-300",
  error: "bg-red-500/10 text-red-800 dark:bg-red-300/10 dark:text-red-300",
};

const variantStyles: Record<CardBadgeVariant, string> = {
  solid: "font-semibold",
  outline: "border px-2 py-0.5",
};

const CardBadge: React.FC<CardBadgeProps> = ({
  label,
  status = "default",
  variant = "solid",
}) => {
  const classes = `${statusStyles[status]} ${variantStyles[variant]} rounded-full px-2 py-0.5 text-xs`;
  return (
    <span role="status" aria-label={label} className={classes}>
      {label}
    </span>
  );
};

export default CardBadge;
