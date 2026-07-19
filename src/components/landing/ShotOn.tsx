"use client";

import { Marquee } from "@/components/brand/Marquee";
import { Reveal } from "@/components/brand/Reveal";
import { Scribble } from "@/components/brand/Scribble";
import { TapedPhoto } from "@/components/brand/TapedPhoto";
import { shotOn, YEAR_MARK } from "@/lib/landing";
import { seededRotation } from "@/lib/random";
import React from "react";

/** One auto-scrolling row of taped prints. Renders the strip twice so the
 *  translateX(-50%) loop lands on a seamless boundary — no jitter, no gaps. */
function GalleryTrack({
  photos,
  direction,
  rotSeed,
  tapeFor,
}: {
  photos: typeof shotOn.photos;
  direction: "left" | "right";
  rotSeed: number;
  tapeFor: (i: number) => "top" | "corners" | "none";
}) {
  // Repeat the base strip so a single half comfortably overflows even ultrawide
  // screens, then duplicate that half for the seamless loop.
  const strip = [...photos, ...photos];

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
    <div
      className={
        "flex w-max items-center pause-on-hover " +
        (direction === "left" ? "animate-scroll-left" : "animate-scroll-right")
      }
    >
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
      {/* Inline styles for the infinite scroll */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left { animation: scroll-left 80s linear infinite; }
        .animate-scroll-right { animation: scroll-right 88s linear infinite; }
        .pause-on-hover:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-left, .animate-scroll-right { animation: none; }
        }
      `,
        }}
      />

      <Marquee text={`shot on VHSMO · ${shotOn.marquee}`} variant="kodak" />

      {/* Running head — matches the eyebrow pattern used across the site */}
      <div className="container-px relative mx-auto mb-14 mt-16 max-w-[120rem]">
        {/* <Reveal>
          <div className="eyebrow flex justify-between border-b border-halide/15 pb-4 text-halide/50">
            <span>{shotOn.kicker}</span>
            <span className="hidden sm:inline">raw captures · continuous roll</span>
            <span className="text-kodak">{YEAR_MARK}</span>
          </div>
        </Reveal> */}

        <Reveal delay={0.05}>
          <h2 className="display mt-12 max-w-4xl text-[clamp(2.4rem,5.5vw,6rem)] leading-[0.95] text-overexpose">
            Real moments.{" "}
            <span className="relative inline-block text-kodak">
              No filters.
              <Scribble className="absolute -bottom-1 left-0 h-2.5 w-full" />
            </span>
          </h2>
        </Reveal>
      </div>

      {/* Auto-scrolling gallery — two rows drifting in opposite directions */}
      <div className="relative flex flex-col gap-14 md:gap-20">
        <GalleryTrack
          photos={photos}
          direction="left"
          rotSeed={3}
          tapeFor={(i) => (i % 2 === 0 ? "top" : "corners")}
        />
        <GalleryTrack
          photos={[...photos].reverse()}
          direction="right"
          rotSeed={7}
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
