import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 bg-[#121418] border border-[#2a2d35] rounded-lg text-sm",
        "focus:outline-none focus:ring-2 focus:ring-[#c8a356] focus:border-transparent",
        "placeholder:text-[#6b7280]",
        className,
      )}
      {...props}
    />
  );
}
