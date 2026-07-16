"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TapedPhotoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Resting rotation in degrees — pass a seeded value. */
  rotate?: number;
  caption?: string;
  /** Which corners get masking tape. */
  tape?: "top" | "corners" | "none";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * A photo that looks taped into a scrapbook: white print border,
 * masking tape, cast shadow. On hover it lifts and settles flat,
 * like picking the print up off the page.
 */
export function TapedPhoto({
  src,
  alt,
  width,
  height,
  rotate = -2,
  caption,
  tape = "top",
  sizes,
  priority,
  className,
}: TapedPhotoProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      initial={false}
      whileHover={
        reduceMotion
          ? undefined
          : { rotate: 0, scale: 1.025, y: -4, zIndex: 20 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{ rotate }}
      className={cn("relative inline-block", className)}
    >
      <div className="relative bg-overexpose p-2 pb-3 shadow-[0.4rem_0.7rem_1.4rem_rgba(31,26,24,0.45)] sm:p-2.5 sm:pb-4">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="block h-auto w-full"
        />
        {tape === "top" && (
          <span aria-hidden className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
        )}
        {tape === "corners" && (
          <>
            <span aria-hidden className="tape -left-8 -top-2 w-20 -rotate-45" />
            <span aria-hidden className="tape -right-8 -top-2 w-20 rotate-45" />
          </>
        )}
      </div>
      {caption && (
        <figcaption className="font-marker mt-3 text-center text-sm text-current opacity-80 sm:text-base">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
