"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function StaggerLines({ children, className }: Props) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
