"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Rotate3d } from "lucide-react";
import { inspectFeatures, type ProductImage, type InspectFeature } from "@/lib/products";
import { cn } from "@/lib/utils";
import type { ModelView } from "@/components/product/CameraViewer";

/**
 * The 3D stack (three.js + the model) never touches the initial bundle or
 * the server render - it's code-split here and only fetched once the gallery
 * is within a screen of the viewport.
 */
const CameraViewer = dynamic(() => import("@/components/product/CameraViewer"), {
  ssr: false,
  loading: () => <ViewerPoster />,
});

/** Lightweight placeholder shown before the 3D chunk mounts. */
function ViewerPoster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="font-marker rotate-[-2deg] text-lg text-darkroom/40">
        loading the object…
      </p>
    </div>
  );
}

const MODEL_BACKGROUND =
  "radial-gradient(80% 65% at 50% 30%, rgba(16, 147, 255, 0.07), transparent 70%), linear-gradient(to bottom, #ffffff, #e3e3e1)";

/**
 * The product gallery: the photos and the object itself, behind one switch.
 * Photo thumbs sit in the rail; the last tile flips the same stage over to the
 * 3D model, where the feature chips swing the orbit camera to that angle.
 */
export function Gallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"photos" | "model">("photos");

  const holderRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Two observers, two jobs: `mounted` fetches the 3D chunk one screen early
  // (once, then disconnects); `inView` gates auto-rotate so the GPU is fully
  // idle whenever the gallery is scrolled away.
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [view, setView] = useState<ModelView | null>(null);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const mountObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          mountObs.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    const viewObs = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.15 },
    );
    mountObs.observe(el);
    viewObs.observe(el);
    return () => {
      mountObs.disconnect();
      viewObs.disconnect();
    };
  }, []);

  const selectFeature = (feature: InspectFeature) => {
    setActiveFeature(feature.id);
    // Fresh object each click so re-selecting the same angle still glides.
    setView({ ...feature.view });
  };

  const showModel = mode === "model";

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-28">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Thumbnails - photos, then the 3D tile */}
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
          {images.map((image, i) => (
            <button
              key={image.src}
              onClick={() => {
                setActive(i);
                setMode("photos");
              }}
              aria-label={`View image ${i + 1}`}
              aria-current={!showModel && i === active}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg bg-overexpose p-1 transition-all lg:size-[72px]",
                !showModel && i === active
                  ? "ring-2 ring-kodak ring-offset-2 ring-offset-halide"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image.src} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}

          <button
            onClick={() => setMode("model")}
            aria-label="View the camera in 3D"
            aria-current={showModel}
            className={cn(
              "relative flex size-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg text-darkroom transition-all lg:size-[72px]",
              showModel
                ? "ring-2 ring-kodak ring-offset-2 ring-offset-halide"
                : "opacity-70 hover:opacity-100",
            )}
            style={{ background: MODEL_BACKGROUND }}
          >
            <Rotate3d className="size-5" strokeWidth={1.75} />
            <span className="text-[0.6rem] font-bold uppercase tracking-wide">3D</span>
          </button>
        </div>

        {/* The stage - a taped print in the darkroom, or the object itself */}
        <div className="relative order-1 flex-1 lg:order-2">
          <span
            aria-hidden
            className="tape -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-2"
          />
          <div
            className={cn(
              "relative aspect-square overflow-hidden p-2.5 shadow-[0.4rem_0.7rem_1.6rem_rgba(31,26,24,0.22)] sm:p-3",
              showModel ? "" : "bg-overexpose",
            )}
            style={showModel ? { background: MODEL_BACKGROUND } : undefined}
          >
            <div
              ref={holderRef}
              className="relative h-full w-full touch-pan-y overflow-hidden"
            >
              {showModel ? (
                mounted ? (
                  <CameraViewer
                    view={view}
                    autoRotate={inView && !interacted && !reduceMotion}
                    onInteract={() => setInteracted(true)}
                  />
                ) : (
                  <ViewerPoster />
                )
              ) : (
                images.map((image, i) => (
                  <Image
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={cn(
                      "object-cover",
                      i === active ? "opacity-100" : "opacity-0",
                    )}
                  />
                ))
              )}
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
              {showModel ? (
                <span className="font-marker pointer-events-none rotate-[-3deg] rounded-full bg-bluehour px-2.5 py-1 text-xs text-overexpose">
                  360° · this is the real shape
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-kodak px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-darkroom">
                  <span className="size-1.5 animate-pulse rounded-full bg-darkroom" />
                  Reservations open
                </span>
              )}
            </div>

            {/* Control hint - retires after the first grab */}
            {showModel && !interacted && (
              <p className="font-marker pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rotate-[-1deg] text-sm text-darkroom/50">
                drag to spin · pinch or scroll to zoom
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Angle shortcuts, only while the object is on the stage */}
      {showModel && (
        <div className="flex flex-wrap gap-2 lg:pl-[84px]">
          {inspectFeatures.map((feature) => {
            const isActive = activeFeature === feature.id;
            return (
              <button
                key={feature.id}
                onClick={() => selectFeature(feature)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-bluehour bg-bluehour/10 text-bluehour"
                    : "border-darkroom/20 text-darkroom/70 hover:border-darkroom/40 hover:text-darkroom",
                )}
              >
                {feature.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
