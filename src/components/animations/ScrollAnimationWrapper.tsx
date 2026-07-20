'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideIn';
}

const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  slideIn: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
};

export function ScrollAnimationWrapper({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  variant = 'fadeInUp',
}: ScrollAnimationWrapperProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[variant]}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SeparatorLine() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent origin-left"
    />
  );
}

export function RevealOnScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export function ClickFeedback({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(251, 146, 60, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}
