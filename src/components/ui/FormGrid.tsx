import React from "react";

interface FormGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3;
}

/**
 * Standardized form grid following the 2-column rule.
 * gap: 16px (md) per design system guidelines.
 */
export function FormGrid({ children, className = "", cols = 2 }: FormGridProps) {
  const colClass = {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
  }[cols];

  return (
    <div className={`grid gap-4 ${colClass} ${className}`}>
      {children}
    </div>
  );
}
