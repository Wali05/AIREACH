'use client';

import { motion } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variants?: {
    hidden: object;
    visible: object;
  };
  delay?: number;
}

/**
 * AnimatedSection component for creating scroll-based animations
 */
const AnimatedSection = ({ 
  children, 
  className, 
  id,
  variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  delay = 0.3
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      variants={variants}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection; 