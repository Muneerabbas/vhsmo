"use client";

import { Marquee } from "@/components/brand/Marquee";
import { Reveal } from "@/components/brand/Reveal";
import { Scribble } from "@/components/brand/Scribble";
import { TapedPhoto } from "@/components/brand/TapedPhoto";
import { shotOn } from "@/lib/landing";
import { seededRotation } from "@/lib/random";
import { useEffect, useRef } from "react";

/** One auto-scrolling row of taped prints. Renders the strip twice so the
 *  translateX(-50%) loop lands on a seamless boundary - no jitter, no gaps.
 *
 *  Driven by the Web Animations API rather than a CSS keyframe so hovering
 *  can *ease* the scroll to a halt (ramping playbackRate 1 → 0) instead of
 *  snapping it with `animation-play-state: paused`. */
function GalleryTrack({
  photos,
  direction,
  rotSeed,
  tapeFor,
  durationMs,
}: {
  photos: typeof shotOn.photos;
  direction: "left" | "right";
  rotSeed: number;
  tapeFor: (i: number) => "top" | "corners" | "none";
  durationMs: number;
}) {
  // Repeat the base strip so a single half comfortably overflows even ultrawide
  // screens, then duplicate that half for the seamless loop.
  const strip = [...photos, ...photos];

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const from = direction === "left" ? "translateX(0)" : "translateX(-50%)";
    const to = direction === "left" ? "translateX(-50%)" : "translateX(0)";
    const anim = el.animate([{ transform: from }, { transform: to }], {
      duration: durationMs,
      iterations: Infinity,
      easing: "linear",
    });

    // Smoothly tween the scroll's playbackRate toward `target` (1 = full
    // speed, 0 = stopped) with an ease-out curve, so hovering eases the
    // marquee to a halt instead of snapping it.
    let rampFrame = 0;
    const rampTo = (target: number) => {
      cancelAnimationFrame(rampFrame);
      const start = anim.playbackRate;
      const startT = performance.now();
      const dur = 550;
      const tick = (now: number) => {
        const t = Math.min(1, (now - startT) / dur);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        anim.playbackRate = start + (target - start) * eased;
        if (t < 1) rampFrame = requestAnimationFrame(tick);
      };
      rampFrame = requestAnimationFrame(tick);
    };

    // Use bubbling mouseover/mouseout (rather than mouseenter/leave) so the
    // handlers fire even while the pointer is over a child print. onOver just
    // eases toward a stop (idempotent); onOut only eases back to full speed
    // once the pointer has actually left the track, not when it crosses
    // between prints inside it.
    const onOver = () => rampTo(0);
    const onOut = (e: MouseEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) rampTo(1);
    };
    el.addEventListener("mouseover", onOver);
    el.addEventListener("mouseout", onOut);

    return () => {
      anim.cancel();
      cancelAnimationFrame(rampFrame);
      el.removeEventListener("mouseover", onOver);
      el.removeEventListener("mouseout", onOut);
    };
  }, [direction, durationMs]);

  const half = (
    <div className="flex shrink-0 items-center gap-8 px-4 md:gap-12">
      {strip.map((photo, i) => (
        <TapedPhoto
          key={i}
          src={photo.src}
          alt={photo.alt}
          width={300}
          height={200}
          rotate={seededRotation(i * rotSeed, 3)}
          tape={tapeFor(i)}
        />
      ))}
    </div>
  );

  return (
    <div ref={trackRef} className="flex w-max items-center">
      {half}
      <div aria-hidden>{half}</div>
    </div>
  );
}

export function ShotOn() {
  const photos = shotOn.photos;

  return (
    <section
      id="photos"
      aria-label="Shot on VHSMO"
      className="relative overflow-hidden bg-darkroom-deep  text-halide pb-12 sm:pb-12"
    >
      <Marquee text={`shot on VHSMO · ${shotOn.marquee}`} variant="kodak" />

      {/* Running head - matches the eyebrow pattern used across the site */}
      <div className=" relative mb-14 mt-16  text-center ">
   

        <Reveal delay={0.05}>
          <h2 className="display mt-12 max-w-4xl text-[clamp(2.2rem,4.5vw,4.25rem)] leading-[0.95] text-overexpose">
            Real moments.{" "}
            <span className="relative inline-block text-kodak">
              No filters.
              <Scribble className="absolute -bottom-1 left-0 h-2.5 w-full" />
            </span>
          </h2>
        </Reveal>
      </div>

      {/* Auto-scrolling gallery - two rows drifting in opposite directions */}
      <div className="relative flex flex-col gap-14 md:gap-20">
        <GalleryTrack
          photos={photos}
          direction="left"
          rotSeed={3}
          durationMs={80000}
          tapeFor={(i) => (i % 2 === 0 ? "top" : "corners")}
        />
        <GalleryTrack
          photos={[...photos].reverse()}
          direction="right"
          rotSeed={7}
          durationMs={88000}
          tapeFor={(i) => (i % 2 === 0 ? "corners" : "top")}
        />

        {/* Soft edge fades so prints dissolve into the dark instead of clipping */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-darkroom-deep to-transparent sm:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-darkroom-deep to-transparent sm:w-32"
        />
      </div>
    </section>
  );
}
