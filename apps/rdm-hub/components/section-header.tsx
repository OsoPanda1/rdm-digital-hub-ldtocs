import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="space-y-2 max-w-2xl">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-[#c8a356]">{eyebrow}</p>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">{title}</h2>
        {description && <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  );
}
