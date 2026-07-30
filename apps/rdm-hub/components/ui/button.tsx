import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<Variant, string> = {
    primary: "bg-[#c8a356] text-[#0a0b0e] hover:bg-[#d4b26a]",
    secondary: "border border-[#2a2d35] text-[#e8e6e0] hover:bg-[#1a1d24]",
    danger: "bg-red-900/50 text-red-400 border border-red-800 hover:bg-red-900/80",
    ghost: "text-[#9ca3af] hover:text-[#e8e6e0] hover:bg-[#1a1d24]",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
