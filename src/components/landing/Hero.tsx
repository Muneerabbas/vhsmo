"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { MagneticButton } from "@/components/brand/MagneticButton";
import { hero, RESERVE_HREF, YEAR_MARK, TAGLINE } from "@/lib/landing";
import { seededRotation } from "@/lib/random";

/**
 * Full-bleed cinematic opener. The photograph is the set; the wordmark
 * is sprayed across it larger than the viewport, drifting against the
 * cursor like a print floating over the scene.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });

  const imgX = useTransform(smx, [-0.5, 0.5], [14, -14]);
  const imgY = useTransform(smy, [-0.5, 0.5], [10, -10]);
  const logoX = useTransform(smx, [-0.5, 0.5], [-26, 26]);
  const logoY = useTransform(smy, [-0.5, 0.5], [-16, 16]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scrollImgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scrollLogoY = useTransform(scrollYProgress, [0, 1], ["0%", "-32%"]);
  const fade = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

  function onMouseMove(e: React.MouseEvent) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      aria-label="VHSMO"
      className="relative flex h-[100svh] min-h-[620px] flex-col justify-end overflow-hidden bg-darkroom"
    >
      {/* The scene */}
      <motion.div
        className="absolute inset-[-4%]"
        style={reduceMotion ? undefined : { x: imgX, y: imgY }}
      >
        <motion.div
          className="relative h-full w-full"
          style={reduceMotion ? undefined : { y: scrollImgY }}
        >
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
          {/* <div className="absolute inset-0 bg-[#5A4332]/35 mix-blend-multiply" /> */}
          {/* <div className="absolute inset-0 bg-[#163B38]/45 mix-blend-multiply pointer-events-none" />{" "} */}
        </motion.div>
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-darkroom/85 via-darkroom/10 to-darkroom/65"
      />

      {/* The wordmark - wider than the frame, always clipped */}
      <motion.h1
        aria-label="VHSMO"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[120vw] -translate-x-1/2 -translate-y-1/2 select-none text-center"
        style={reduceMotion ? undefined : { x: logoX, y: logoY }}
      >
        <motion.span
          className="font-marker block whitespace-nowrap text-[30vw] leading-none text-kodak drop-shadow-[0.5rem_0.8rem_0_rgba(31,26,24,0.35)]  select-none"
          style={reduceMotion ? undefined : { y: scrollLogoY }}
        >
          {/* <Image
            src={hero.camera.src}
            alt={hero.camera.alt}
            width={1000}
            height={400}
            className="absolute mx-auto top-1rem right-130 z-0"
          /> */}
          {"VHSMO".split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden
              className=" inline-block z-10"
              style={{
                rotate: `${seededRotation(i + 7, 6)}deg`,
                translate: `0px ${seededRotation(i + 3, 2)}vw`,
              }}
            >
              {ch}
            </span>
          ))}
        </motion.span>
      </motion.h1>
      <div>
        <Image
          src={hero.camera.src}
          alt={hero.camera.alt}
          width={400}
          height={400}
          className="mx-auto mb-4 z-10"
        />
      </div>
      {/* Running heads */}

      {/* The pitch */}
      <motion.div
        style={reduceMotion ? undefined : { opacity: fade }}
        className="shell relative z-10 flex flex-col items-start gap-6 pb-12 sm:flex-row sm:items-end sm:justify-between sm:pb-16"
      >
        <div>
          <p className="max-w-md text-lg font-medium leading-snug text-overexpose sm:text-2xl">
            {hero.sub}
          </p>
          <p className="eyebrow mt-3 text-kodak">{TAGLINE.join(" ")}</p>
        </div>
        <MagneticButton href={RESERVE_HREF}>
          {hero.cta}
          <span aria-hidden>→</span>
        </MagneticButton>
      </motion.div>
    </section>
  );
}
