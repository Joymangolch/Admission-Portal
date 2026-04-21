import React from "react";

type BadgeVariant = "green" | "amber" | "red" | "blue" | "gray";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  green: "gov-badge-green",
  amber: "gov-badge-amber",
  red: "gov-badge-red",
  blue: "gov-badge-blue",
  gray: "gov-badge-gray",
};

/**
 * Shared government-grade status badge.
 * Renders with consistent typography, spacing, and brand-token colors.
 */
export function StatusBadge({ variant, children, className = "" }: StatusBadgeProps) {
  return (
    <span className={`gov-badge ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
}
