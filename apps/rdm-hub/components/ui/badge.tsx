import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-[#1e2128] text-[#9ca3af]",
    success: "bg-green-900/50 text-green-400",
    warning: "bg-yellow-900/50 text-yellow-400",
    danger: "bg-red-900/50 text-red-400",
    info: "bg-blue-900/50 text-blue-400",
  };
  return (
    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
