"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  { id: 1, title: "Personal Details",     description: "Identification info" },
  { id: 2, title: "Parent Details",       description: "Family background" },
  { id: 3, title: "Address",              description: "Permanent & Correspondence" },
  { id: 4, title: "Education",            description: "Academic qualifications" },
  { id: 5, title: "Course Preferences",   description: "Branch selection" },
  { id: 6, title: "Documents",            description: "Upload certificates" },
  { id: 7, title: "Preview",              description: "Review application" },
  { id: 8, title: "Declaration",          description: "Agreement & signature" },
  { id: 9, title: "Payment",              description: "Application fee" },
];

export function Sidebar({
  currentStep,
  stepsCompleted = [],
  currentApplicationStep,
  isCollapsed = false,
}: {
  currentStep: number;
  stepsCompleted: number[];
  currentApplicationStep: number;
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();
 
  return (
    <nav aria-label="Application steps" role="list">
      {STEPS.map((step) => {
        const stepPath = `/apply/${step.id}`;
        const isActive = pathname === stepPath;
        const isCompleted = stepsCompleted.includes(step.id);
        const isLocked = step.id > currentApplicationStep && step.id !== 1;
 
        return (
          <Link
            key={step.id}
            href={isLocked ? "#" : stepPath}
            role="listitem"
            aria-label={`Step ${step.id}: ${step.title}${isCompleted ? " (completed)" : isActive ? " (current)" : isLocked ? " (locked)" : ""}`}
            aria-current={isActive ? "step" : undefined}
            aria-disabled={isLocked}
            className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 group border-b last:border-none ${ /* Reduced padding px-4 -> px-3, py-2.5 -> py-2 */
              isActive
                ? "border-r-[3px]"
                : !isLocked ? "hover:bg-slate-50" : ""
            } ${isLocked ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"} ${isCollapsed ? "justify-center" : ""}`}
            style={{
              borderBottomColor: "var(--gov-gray-light)",
              background: isActive ? "var(--gov-navy-xlight)" : undefined,
              borderRightColor: isActive ? "var(--gov-navy)" : undefined,
            }}
            onClick={(e) => {
              if (isLocked) e.preventDefault();
            }}
            tabIndex={isLocked ? -1 : 0}
          >
            <div
              className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold transition-all duration-200 border shrink-0`}
              style={{
                background: isActive
                  ? "var(--gov-navy)"
                  : isCompleted
                  ? "var(--gov-white)"
                  : "var(--gov-bg)",
                borderColor: isActive || isCompleted
                  ? "var(--gov-navy)"
                  : "var(--gov-gray-border)",
                color: isActive
                  ? "#fff"
                  : isCompleted
                  ? "var(--gov-navy)"
                  : "var(--gov-text-muted)",
              }}
            >
              {isCompleted ? (
                <CheckCircle2 size={14} strokeWidth={3} />
              ) : (
                step.id
              )}
            </div>
 
            {/* Step info */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p
                  className="text-[10px] font-bold uppercase tracking-wider leading-tight transition-colors truncate"
                  style={{
                    color: isActive ? "var(--gov-navy)" : "var(--gov-text-secondary)",
                  }}
                >
                  {step.title}
                </p>
                <p
                  className="text-[9px] mt-0.5 truncate uppercase tracking-tighter"
                  style={{ color: "var(--gov-text-muted)" }}
                >
                  {step.description}
                </p>
              </div>
            )}
 
            {/* State indicator */}
            {!isCollapsed && isLocked && (
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-[8px]" aria-hidden="true">🔒</span>
              </div>
            )}
            {!isCollapsed && !isLocked && !isCompleted && !isActive && (
              <div className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-blue-200"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
