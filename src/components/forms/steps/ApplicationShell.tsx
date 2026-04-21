"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChevronLeft, ChevronRight, Mail, Clock } from "lucide-react";

interface ApplicationShellProps {
  children: React.ReactNode;
  application: any;
}

export function ApplicationShell({ children, application }: ApplicationShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-1 w-full bg-white relative">
      {/* ── Left Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 border-r transition-all duration-300 ease-in-out sticky top-[128px] self-start`}
        style={{
          width: isCollapsed ? "64px" : "260px",
          minWidth: isCollapsed ? "64px" : "260px", // Rule 7: Fixed width
          background: "#fff",
          borderColor: "var(--gov-gray-mid)",
          height: "calc(100vh - 128px)",
        }}
        aria-label="Application form steps"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 shadow-md z-10 hover:bg-slate-50 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Sidebar Header */}
        <div
          className={`px-4 py-4 border-b flex items-center transition-all ${isCollapsed ? "justify-center" : "gap-2"}`}
          style={{
            background: "var(--gov-navy-xlight)",
            borderColor: "var(--gov-gray-mid)",
          }}
        >
          <div className="w-1 h-3.5 bg-[#08387F] rounded-full flex-shrink-0"></div>
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap overflow-hidden">
              Workflow Steps
            </span>
          )}
        </div>

        {/* Step List */}
        <div className="flex-1 py-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <Sidebar
            currentStep={0}
            stepsCompleted={application.stepsCompleted || []}
            currentApplicationStep={application.currentStep}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Technical assistance */}
        {!isCollapsed && (
          <div
            className="p-4 border-t bg-slate-50/30"
            style={{ borderColor: "var(--gov-gray-mid)" }}
          >
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Clock size={10} /> Technical Oversight
            </p>
            <p className="text-[10px] font-bold text-[#08387F] flex items-center gap-1 truncate">
              <Mail size={10} /> admissions@mtu.ac.in
            </p>
            <p className="text-[9px] text-gray-400 mt-1 font-medium italic">Support: 09:00 - 17:00 IST</p>
          </div>
        )}
      </aside>

      {/* ── Main Content ── */}
      <main
        className="flex-1 min-w-0" // Removed padding from here, moving to container
        id="main-content"
        tabIndex={-1}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-8"> {/* Rule 2: Max-width 1200px, centered, 24px (px-6) padding, 32px (py-8) section spacing */}
          {children}
        </div>
      </main>
    </div>
  );
}
