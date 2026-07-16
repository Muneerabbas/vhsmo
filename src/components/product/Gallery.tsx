"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProductImage } from "@/lib/products";
import { cameraProduct } from "@/lib/products";
import { cn } from "@/lib/utils";

export function Gallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active]!;

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:flex-row">
      {/* Thumbnails */}
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {images.map((image, i) => (
          <button
            key={image.src}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={i === active}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-lg bg-overexpose p-1 transition-all lg:size-[72px]",
              i === active
                ? "ring-2 ring-kodak ring-offset-2 ring-offset-halide"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <Image src={image.src} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image — a taped print in the darkroom */}
      <div className="relative order-1 flex-1 lg:order-2">
        <span
          aria-hidden
          className="tape -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-2"
        />
        <div className="relative aspect-square overflow-hidden bg-overexpose p-2.5 shadow-[0.4rem_0.7rem_1.6rem_rgba(31,26,24,0.22)] sm:p-3">
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live badge */}
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-kodak px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-darkroom">
              <span className="size-1.5 animate-pulse rounded-full bg-darkroom" />
              Reservations open
            </span>
          </div>

          {/* Shipping note, handwritten */}
          <span className="font-marker absolute bottom-4 right-4 -rotate-2 bg-darkroom px-3 py-1 text-sm text-kodak shadow-[0.15rem_0.25rem_0.5rem_rgba(31,26,24,0.35)]">
            {cameraProduct.estimatedShipping}
          </span>
        </div>
      </div>
    </div>
  );
}
