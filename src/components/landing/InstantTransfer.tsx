"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, Images, Share } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { Scribble } from "@/components/brand/Scribble";
import { instantTransfer } from "@/lib/landing";

const featureIcons = [SlidersHorizontal, Images, Share];

/** Apple logo, for the App Store badge. */
function AppleLogo() {
  return (
    <svg aria-hidden viewBox="0 0 384 512" className="h-7 w-7 fill-current">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/** Google Play glyph, for the Play Store badge. */
function PlayLogo() {
  return (
    <svg aria-hidden viewBox="0 0 512 512" className="h-6 w-6">
      <path fill="#2196F3" d="M99.6 32.7 325 258.1 99.6 483.5c-9.9-5.2-16.6-15.6-16.6-27.6V60.3c0-12 6.7-22.4 16.6-27.6z" />
      <path fill="#FFC107" d="m396.7 186.6 65.9 38.1c20.5 11.8 20.5 41.5 0 53.3l-65.9 38.1-71.7-58 71.7-71.5z" />
      <path fill="#4CAF50" d="M99.6 32.7c3.8-2 8.1-3.2 12.9-3.2 5.5 0 11.1 1.5 16.3 4.5l267.9 152.6-71.7 71.5L99.6 32.7z" />
      <path fill="#F44336" d="M325 258.1 396.7 316 128.8 468.6c-5.2 3-10.8 4.5-16.3 4.5-4.8 0-9.1-1.2-12.9-3.2L325 258.1z" />
    </svg>
  );
}

/** Little emphasis strokes next to the handwritten note. */
function EmphasisStrokes({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 20 L9 12 M12 21 L13 12 M20 19 L16 12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Instant transfer, staged like a product spread: the pitch and the
 * app on the left, the camera floating mid-air with a print escaping
 * along a dashed arc, and the phone on the right already holding the
 * whole night in its camera roll.
 */
export function InstantTransfer() {
  const reduceMotion = useReducedMotion();
  const [line1, line2, line3] = instantTransfer.headline;

  return (
    <section aria-label="Instant transfer" className="paper relative overflow-hidden py-24 sm:py-32">
      <div className="container-px mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 items-center gap-y-16 lg:gap-x-10">
          {/* The pitch */}
          <div className="col-span-12 lg:col-span-4">
            <Reveal>
              <p className="eyebrow text-darkroom/60">{instantTransfer.kicker}</p>
              <h2 className="display mt-6 text-[clamp(2.4rem,4.2vw,4.6rem)] text-darkroom">
                {line1}
                <br />
                {line2}
                <br />
                <span className="relative inline-block">
                  {line3}
                  <Scribble className="absolute -bottom-3 left-0 h-3 w-full" />
                </span>
              </h2>
              <p className="mt-8 max-w-md text-base leading-relaxed text-darkroom/85 sm:text-lg">
                {instantTransfer.body}
              </p>
            </Reveal>

            {/* The app card */}
            <Reveal delay={0.15} className="mt-10">
              <div className="flex items-start gap-5 rounded-2xl bg-darkroom/[0.06] p-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22%] bg-darkroom-deep shadow-[0.15rem_0.3rem_0.6rem_rgba(31,26,24,0.35)]">
                  <span className="font-marker -rotate-3 text-sm text-kodak">
                    VHSMO
                  </span>
                </span>
                <div>
                  <h3 className="text-lg font-bold text-darkroom">
                    {instantTransfer.app.name}
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-darkroom/75">
                    {instantTransfer.app.description}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* The hand-off — print, arrow, camera and phone share one frame,
              so the composition can't drift apart between breakpoints */}
          <div className="col-span-12 lg:col-span-8">
            <div className="relative flex flex-col items-center lg:block lg:min-h-[640px]">
              {/* The escaping print — flies out of the camera (order 2 on
                  mobile so the story reads camera → print → phone) */}
              <motion.div
                className="relative z-20 order-2 mt-10 w-[42%] max-w-[9rem] lg:absolute lg:left-[7%] lg:top-[15%] lg:order-none lg:mt-0 lg:w-[22%] lg:max-w-[13rem]"
                animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="-rotate-2 bg-overexpose p-1.5 pb-5 shadow-[0.3rem_0.5rem_1rem_rgba(31,26,24,0.3)]">
                  <Image
                    src={instantTransfer.flyingPrint}
                    alt=""
                    width={1024}
                    height={768}
                    sizes="13rem"
                    className="block h-auto w-full"
                  />
                </div>
              </motion.div>

              {/* Dashed flight path — from the print's top-right corner,
                  arcing up to land just beside the phone */}
              <svg
                aria-hidden
                viewBox="0 0 360 120"
                fill="none"
                className="pointer-events-none absolute left-[27%] top-[6%] z-10 hidden w-[38%] lg:block"
              >
                <path
                  d="M8 104 C 80 34, 210 4, 344 28"
                  stroke="#2A2422"
                  strokeWidth="3.5"
                  strokeDasharray="10 12"
                  strokeLinecap="round"
                />
                <path
                  d="M344 28 l-17 -5 M344 28 l-13 11"
                  stroke="#2A2422"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* The camera, floating bottom-left under the print */}
              <motion.div
                className="relative order-1 mx-auto mt-2 w-full max-w-sm lg:absolute lg:bottom-[6%] lg:left-0 lg:order-none lg:mt-0 lg:w-[46%] lg:max-w-none"
                animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <Image
                  src={instantTransfer.cameraCutout}
                  alt="The VHSMO pocket camera"
                  width={1536}
                  height={1024}
                  sizes="(min-width: 1024px) 26rem, 90vw"
                  className="block h-auto w-full drop-shadow-[0_1.4rem_1.6rem_rgba(31,26,24,0.35)]"
                />
              </motion.div>
              {/* Floor shadow */}
              <div
                aria-hidden
                className="order-1 mx-auto -mt-3 h-6 w-[45%] rounded-[50%] bg-darkroom/25 blur-md lg:absolute lg:bottom-[3%] lg:left-[9%] lg:mt-0 lg:w-[28%]"
              />

              {/* Mobile-only transfer arrow — the print travelling down into
                  the phone, so the "instant transfer" motive is legible when
                  the desktop flight path can't fit */}
              <div aria-hidden className="order-3 mt-6 lg:hidden">
                <motion.svg
                  viewBox="0 0 60 96"
                  fill="none"
                  className="h-24 w-14 text-darkroom"
                  animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path
                    d="M30 6 C 10 30, 50 58, 30 82"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeDasharray="9 11"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 82 l-9 -9 M30 82 l9 -9"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </div>

              {/* The phone — everything already arrived */}
              <div className="relative order-4 mx-auto mt-14 w-full max-w-[280px] sm:max-w-[300px] lg:order-none lg:ml-auto lg:mr-[1%] lg:mt-14">
                <p className="font-marker absolute -top-12 left-1/2 z-10 w-max -translate-x-1/2 text-xl text-darkroom sm:text-2xl">
                  {instantTransfer.note}
                  <EmphasisStrokes className="absolute -right-7 -top-4 h-6 w-6 text-darkroom" />
                </p>

                <Reveal delay={0.2}>
              <div className="rounded-[3rem] bg-darkroom-deep p-2 shadow-[0.8rem_1.4rem_2.4rem_rgba(31,26,24,0.4)] ring-1 ring-darkroom/40">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#111] pb-6">
                  {/* Status bar + island */}
                  <div className="flex items-center justify-between px-7 pt-3 text-[0.65rem] font-semibold text-overexpose">
                    <span>9:41</span>
                    <span aria-hidden className="flex items-center gap-1.5">
                      <svg viewBox="0 0 16 12" className="h-2.5 w-3.5 fill-current">
                        <rect x="0" y="7" width="3" height="5" rx="0.8" />
                        <rect x="4.5" y="5" width="3" height="7" rx="0.8" />
                        <rect x="9" y="2.5" width="3" height="9.5" rx="0.8" />
                        <rect x="13" y="0" width="3" height="12" rx="0.8" />
                      </svg>
                      <svg viewBox="0 0 16 12" className="h-2.5 w-3.5 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M1.5 4.5a9 9 0 0 1 13 0M4 7.2a5.5 5.5 0 0 1 8 0M6.6 9.8a2 2 0 0 1 2.8 0" />
                        <circle cx="8" cy="11" r="0.4" className="fill-current" />
                      </svg>
                      <svg viewBox="0 0 22 12" className="h-2.5 w-5">
                        <rect x="0.5" y="0.5" width="18" height="11" rx="3" className="fill-none stroke-current" strokeWidth="1" opacity="0.5" />
                        <rect x="2" y="2" width="14" height="8" rx="1.8" className="fill-current" />
                        <path d="M20.5 4v4a2 2 0 0 0 0-4z" className="fill-current" opacity="0.5" />
                      </svg>
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-black"
                  />

                  {/* Camera roll */}
                  <div className="px-4 pt-6">
                    <h3 className="text-xl font-bold text-overexpose">
                      {instantTransfer.phone.title}
                    </h3>
                    <p className="mt-0.5 text-[0.7rem] text-halide/60">
                      {instantTransfer.phone.subtitle}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-1">
                      {instantTransfer.phone.photos.map((src, i) => (
                        <motion.div
                          key={src}
                          className="relative aspect-square overflow-hidden"
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ delay: 0.05 * i, duration: 0.4 }}
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="90px"
                            className="object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Home indicator */}
                  <span
                    aria-hidden
                    className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-overexpose/80"
                  />
                </div>
              </div>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Store badges + app features, running along the bottom */}
          <Reveal className="col-span-12 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#"
                  aria-label="Download on the App Store"
                  className="flex items-center gap-2.5 rounded-xl bg-darkroom-deep px-4 py-2 text-overexpose transition-transform hover:scale-[1.03]"
                >
                  <AppleLogo />
                  <span className="leading-tight">
                    <span className="block text-[0.6rem] opacity-80">Download on the</span>
                    <span className="block text-lg font-semibold">App Store</span>
                  </span>
                </a>
                <a
                  href="#"
                  aria-label="Get it on Google Play"
                  className="flex items-center gap-2.5 rounded-xl bg-darkroom-deep px-4 py-2 text-overexpose transition-transform hover:scale-[1.03]"
                >
                  <PlayLogo />
                  <span className="leading-tight">
                    <span className="block text-[0.6rem] uppercase tracking-wide opacity-80">Get it on</span>
                    <span className="block text-lg font-semibold">Google Play</span>
                  </span>
                </a>
              </div>

              <ul className="flex items-center">
                {instantTransfer.features.map((feature, i) => {
                  const Icon = featureIcons[i] ?? SlidersHorizontal;
                  return (
                    <li
                      key={feature}
                      className="flex flex-col items-center gap-2 border-l border-darkroom/20 px-6 text-darkroom first:border-l-0 sm:px-8"
                    >
                      <Icon aria-hidden strokeWidth={1.7} className="h-6 w-6" />
                      <span className="text-xs font-medium sm:text-sm">{feature}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
