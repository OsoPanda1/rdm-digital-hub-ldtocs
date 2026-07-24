
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PrismaticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "quantum" | "crystal" | "nebula";
  glow?: boolean;
  className?: string;
}

const PrismaticCard = ({
  children,
  variant = "default",
  glow = false,
  className,
  ...props
}: PrismaticCardProps) => {
  const baseClasses = "rounded-lg backdrop-blur-md border p-4 transition-all duration-300 celestial-card";
  
  const variantClasses = {
    default: "bg-card/70 border-white/5 text-card-foreground shadow-soft",
    quantum: "bg-secondary/70 border-accent/20 text-foreground shadow-electric",
    crystal: "bg-card/50 border-gold/20 text-foreground shadow-gold",
    nebula: "bg-card/50 border-teal/20 text-foreground shadow-teal",
  };

  const glowClasses = glow ? "glow-gold" : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        glowClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default PrismaticCard;

