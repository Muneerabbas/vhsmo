import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/brand/Reveal";
import { Scribble } from "@/components/brand/Scribble";
import { MagneticButton } from "@/components/brand/MagneticButton";
import { showcase, hero, features, RESERVE_HREF, TAGLINE, YEAR_MARK } from "@/lib/landing";

/** Hand-drawn feature icons — rough marker marks, not clean geometry. */
function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "lens") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden className={className}>
        <path
          {...common}
          d="M50 14c21 0 37 15 36 37 -1 21 -17 35 -37 35 -21 0 -36 -16 -35 -37 1 -20 16 -35 36 -35Z"
        />
        <path
          {...common}
          strokeWidth={6}
          d="M50 30c12 0 21 9 20 21 -1 11 -9 19 -21 19 -11 0 -20 -9 -19 -21 1 -10 9 -18 20 -19Z"
        />
        <circle cx="43" cy="45" r="6" fill="currentColor" />
        <circle cx="58" cy="56" r="3.5" fill="currentColor" />
      </svg>
    );
  }

  if (name === "transfer") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden className={className}>
        <path {...common} d="M22 50h56" />
        <path {...common} d="M35 36 20 50l15 14" />
        <path {...common} d="M65 36l15 14 -15 14" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <path
        {...common}
        strokeDasharray="6 7"
        d="M24 24h52v34c0 15 -11 24 -26 24 -15 0 -26 -9 -26 -24Z"
      />
      <path {...common} d="M40 44l10 10 10 -10" />
    </svg>
  );
}

/** A wobbly marker connector — a dash and a dot, drawn toward the object. */
function Connector({ side }: { side: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 80 12"
      aria-hidden
      className={
        "hidden h-3 w-16 shrink-0 text-kodak lg:block " +
        (side === "left" ? "-scale-x-100" : "")
      }
    >
      <path
        d="M2 6 Q 26 3, 52 7 T 72 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="76" cy="6" r="3.5" fill="currentColor" />
    </svg>
  );
}

type Pillar = (typeof features.items)[number];

/** One annotated spec, chip + copy, connector pointing at the object. */
function Callout({
  pillar,
  index,
  align,
}: {
  pillar: Pillar;
  index: number;
  align: "left" | "right";
}) {
  const chip =
    index % 2 === 0 ? "bg-kodak text-darkroom" : "bg-bluehour text-overexpose";

  return (
    <div
      className={
        "flex items-center gap-4 " +
        (align === "right" ? "flex-row-reverse text-right" : "text-left")
      }
    >
      {/* connector points inward — toward the centered object */}
      <Connector side={align === "right" ? "left" : "right"} />
      <div className={align === "right" ? "flex flex-row-reverse gap-4" : "flex gap-4"}>
        <span
          className={
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-[0.2rem_0.35rem_0.9rem_rgba(0,0,0,0.4)] sm:h-14 sm:w-14 " +
            chip
          }
        >
          <FeatureIcon name={pillar.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
        </span>
        <div>
          <h3 className="display text-lg text-overexpose sm:text-xl">{pillar.title}</h3>
          <p className="mt-1 max-w-[13rem] text-sm leading-snug text-halide/55">
            {pillar.body}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * "The Object," developed out of the darkroom. On near-black the pink
 * camera goes electric; a kodak spotlight blooms behind it and an inset
 * vignette dissolves the studio backdrop into the dark. The three pillars
 * frame it as annotated call-outs with hand-drawn marker connectors —
 * a product diagram in the brand's scrappy hand, not a spec grid.
 */
export function Showcase() {
  const [lens, ...rest] = features.items;

  return (
    <section
      aria-label="The VHSMO camera"
      className="section relative overflow-hidden bg-darkroom-deep text-halide"
    >
      {/* Faint ambient wash so the dark isn't flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(16,147,255,0.07), transparent 64%)",
        }}
      />

      <div className="shell relative">
        {/* Running head */}
        <Reveal>
          <div className="eyebrow flex justify-between border-b border-halide/15 pb-4 text-halide/50">
            <span>{showcase.kicker}</span>
            <span className="hidden sm:inline">one object · built to last</span>
            <span className="text-kodak">{YEAR_MARK}</span>
          </div>
        </Reveal>

        {/* The statement — quiet line, then loud line */}
        <Reveal className="mx-auto mt-14 max-w-4xl text-center sm:mt-16">
          <h2 className="display text-[clamp(2.4rem,5.5vw,4.75rem)]">
            <span className="block text-halide/35">Small enough to forget.</span>
            <span className="block text-overexpose">
              Loud enough to be{" "}
              <span className="relative inline-block text-kodak">
                noticed.
                <Scribble className="absolute -bottom-1 left-0 h-2.5 w-full" />
              </span>
            </span>
          </h2>
        </Reveal>

        {/* The object, annotated. Center = camera, gutters = spec call-outs. */}
        <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-[1fr_minmax(0,1.35fr)_1fr] lg:gap-6">
          {/* Left gutter — the lens */}
          {lens && (
            <Reveal className="hidden lg:flex lg:justify-end">
              <Callout pillar={lens} index={0} align="right" />
            </Reveal>
          )}

          {/* Center — the object emerging from the dark */}
          <Reveal delay={0.1}>
            <div className="relative mx-auto w-full max-w-xl">
              {/* Kodak spotlight blooming behind the camera */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -m-6 sm:-m-8"
                style={{
                  background:
                    "radial-gradient(circle at 50% 47%, rgba(253,241,0,0.32), rgba(250,190,20,0.1) 34%, transparent 58%)",
                  filter: "blur(4px)",
                }}
              />
              <div className="cam-float relative">
                <Image
                  src={showcase.image.src}
                  alt={showcase.image.alt}
                  width={showcase.image.width}
                  height={showcase.image.height}
                  sizes="(min-width: 1024px) 34rem, 88vw"
                  className="relative block h-auto w-full"
                />
              </div>
            </div>
          </Reveal>

          {/* Right gutter — transfer + pocket */}
          <div className="hidden lg:flex lg:flex-col lg:gap-12">
            {rest.map((pillar, i) => (
              <Reveal key={pillar.title} delay={0.16 + i * 0.08}>
                <Callout pillar={pillar} index={i + 1} align="left" />
              </Reveal>
            ))}
          </div>

          {/* Mobile / tablet — the same specs, stacked cleanly under the object */}
          <div className="grid gap-6 sm:grid-cols-3 lg:hidden">
            {features.items.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.08}>
                <div className="flex flex-col items-start gap-3">
                  <span
                    className={
                      "flex h-12 w-12 items-center justify-center rounded-xl " +
                      (i % 2 === 0
                        ? "bg-kodak text-darkroom"
                        : "bg-bluehour text-overexpose")
                    }
                  >
                    <FeatureIcon name={pillar.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="display text-lg text-overexpose">{pillar.title}</h3>
                  <p className="text-sm leading-snug text-halide/55">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Pitch + CTAs */}
        <Reveal delay={0.1} className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-8 text-center sm:mt-20">
          <p className="max-w-md text-lg leading-relaxed text-halide/70">
            {hero.sub}{" "}
            <span className="text-kodak">{TAGLINE.join(" ")}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <MagneticButton href={RESERVE_HREF}>
              {showcase.cta}
              <span aria-hidden>→</span>
            </MagneticButton>
            <Link
              href="/#story"
              className="inline-flex items-center gap-2 border-b-2 border-halide/25 pb-1 text-base font-semibold text-halide transition-colors hover:border-kodak hover:text-kodak"
            >
              Learn more
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
