import { motion } from "framer-motion";
import { ReactNode } from "react";

// ============================================
// SCROLL ANIMATION WRAPPER
// ============================================
export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 40 };
      case "down":
        return { opacity: 0, y: -40 };
      case "left":
        return { opacity: 0, x: 40 };
      case "right":
        return { opacity: 0, x: -40 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// CLICK FEEDBACK EFFECT
// ============================================
export function ClickFeedback({
  children,
  onClickAnimation,
}: {
  children: ReactNode;
  onClickAnimation?: () => void;
}) {
  return (
    <motion.div
      whileTap={{
        scale: 0.95,
        boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)",
      }}
      onAnimationComplete={onClickAnimation}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// PAGE TRANSITION EFFECT
// ============================================
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// FLOATING ANIMATION
// ============================================
export function FloatingElement({
  children,
  duration = 3,
  distance = 20,
}: {
  children: ReactNode;
  duration?: number;
  distance?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// STAGGER CHILDREN ANIMATION
// ============================================
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  staggerDelay?: number;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {children}
    </motion.div>
  );
}

// ============================================
// GRADIENT SHIMMER EFFECT
// ============================================
export function GradientShimmer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "0 0" }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{
        background: "linear-gradient(90deg, rgba(251, 146, 60, 0.1) 0%, rgba(251, 146, 60, 0.3) 50%, rgba(251, 146, 60, 0.1) 100%)",
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SEPARATOR LINE ANIMATION
// ============================================
export function AnimatedSeparator({
  className = "",
  gradient = true,
}: {
  className?: string;
  gradient?: boolean;
}) {
  return (
    <motion.div
      className={`h-1 overflow-hidden ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div
        className={`h-full ${
          gradient
            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
            : "bg-amber-500"
        }`}
      />
    </motion.div>
  );
}

// ============================================
// COUNTER ANIMATION (for stats)
// ============================================
import { useEffect, useRef } from "react";

export function AnimatedCounter({
  from = 0,
  to = 100,
  duration = 2,
  suffix = "",
  prefix = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(from);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(from + (to - from) * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration]);

  return (
    <div ref={nodeRef} className="font-display text-4xl font-bold text-amber-400">
      {prefix}
      {count}
      {suffix}
    </div>
  );
}

// ============================================
// HOVER GLOW EFFECT
// ============================================
export function HoverGlow({
  children,
  glowColor = "amber",
}: {
  children: ReactNode;
  glowColor?: "amber" | "red" | "blue" | "green" | "purple";
}) {
  const glowColors = {
    amber: "group-hover:shadow-amber-500/40",
    red: "group-hover:shadow-red-500/40",
    blue: "group-hover:shadow-blue-500/40",
    green: "group-hover:shadow-green-500/40",
    purple: "group-hover:shadow-purple-500/40",
  };

  return (
    <motion.div
      className={`group transition-all duration-300 ${glowColors[glowColor]}`}
      whileHover={{ boxShadow: `0 0 30px rgba(251, 146, 60, 0.4)` }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// PULSE ANIMATION
// ============================================
export function PulseElement({
  children,
  intensity = 1,
}: {
  children: ReactNode;
  intensity?: number;
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1 + intensity * 0.1, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// ROTATE ON SCROLL
// ============================================
export function RotateOnScroll({
  children,
  maxRotation = 10,
}: {
  children: ReactNode;
  maxRotation?: number;
}) {
  return (
    <motion.div
      whileInView={{
        rotate: maxRotation,
      }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SLIDE-IN CARD
// ============================================
export function SlideInCard({
  children,
  delay = 0,
  direction = "left",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "left" | "right";
}) {
  const getInitial = () => {
    return direction === "left" ? { opacity: 0, x: -100 } : { opacity: 0, x: 100 };
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// RIPPLE EFFECT
// ============================================
export function RippleEffect({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{
        boxShadow: [
          "0 0 0 0 rgba(251, 146, 60, 0.7)",
          "0 0 0 10px rgba(251, 146, 60, 0.3)",
          "0 0 0 20px rgba(251, 146, 60, 0)",
        ],
      }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// TYPING EFFECT
// ============================================
export function TypingEffect({ text = "", speed = 50 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <span>
      {displayedText}
      {index < text.length && <motion.span animate={{ opacity: [0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>}
    </span>
  );
}

// ============================================
// FADE IN UP ON SCROLL
// ============================================
export function FadeInUp({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

import React from "react";
