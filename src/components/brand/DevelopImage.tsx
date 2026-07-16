"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type DevelopImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * A photo that develops as it scrolls into view — starts washed out
 * and overexposed, settles into full density. Film in the tray.
 */
export function DevelopImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  className,
  imgClassName,
}: DevelopImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const tween = gsap.fromTo(
      el,
      { filter: "brightness(2.1) contrast(0.65) saturate(0.4)", opacity: 0.4 },
      {
        filter: "brightness(1) contrast(1) saturate(1)",
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.6,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className={cn(fill ? "relative" : "", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn(fill ? "object-cover" : "block h-auto w-full", imgClassName)}
      />
    </div>
  );
}
