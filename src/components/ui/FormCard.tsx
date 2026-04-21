import React from "react";

interface FormCardProps {
  /** Card section title shown with left accent border */
  title?: string;
  /** Optional short description below the title */
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "form" | "preview";
}

/**
 * Shared card wrapper for form sections.
 * Enforces consistent gov-card padding (16px for forms, 20px for preview),
 * radius (8px), and layout hierarchy.
 */
export function FormCard({ 
  title, 
  description, 
  children, 
  className = "",
  variant = "form"
}: FormCardProps) {
  const paddingClass = variant === "preview" ? "p-5" : "p-4"; // 20px or 16px
  
  return (
    <div className={`gov-card ${paddingClass} ${className}`}>
      {title && (
        <div className="mb-3"> {/* 12px margin-bottom */}
          <h3 className="gov-form-section-heading !mb-0">{title}</h3>
          {description && (
            <p className="text-[11px] text-slate-500 mt-1 pl-3 font-medium uppercase tracking-tight">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3"> {/* 12px gap between items */}
        {children}
      </div>
    </div>
  );
}
