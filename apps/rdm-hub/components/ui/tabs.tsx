"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type Tab = { id: string; label: string };

export function Tabs({
  tabs,
  defaultTab,
  children,
}: {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div>
      <div className="border-b border-[#2a2d35] mb-6">
        <div className="flex items-center gap-1 h-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm rounded-lg transition-colors",
                activeTab === tab.id
                  ? "bg-[#c8a356]/10 text-[#c8a356]"
                  : "text-[#9ca3af] hover:text-[#e8e6e0]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {children(activeTab)}
    </div>
  );
}
