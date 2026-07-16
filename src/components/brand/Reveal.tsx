"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  /** Extra starting rotation for the settle-into-place feel. */
  fromRotate?: number;
  once?: boolean;
  className?: string;
};

/**
 * Cinematic section reveal — rises, settles, no bounce.
 */
export function Reveal({
  children,
  delay = 0,
  fromRotate = 0,
  once = true,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 36, rotate: fromRotate }
      }
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Line-by-line reveal for manifesto-scale typography.
 *
 * The observer lives on the (unclipped) container: each line starts
 * fully outside its own overflow-hidden mask, so observing the lines
 * themselves would never trigger.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  highlight,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** Index of the line rendered as a yellow-highlighted marker line. */
  highlight?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.div
            variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
            transition={{
              duration: 0.9,
              delay: i * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              lineClassName,
              i === highlight &&
                "font-marker bg-kodak px-3 text-darkroom sm:px-5",
            )}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
