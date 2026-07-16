import Image from "next/image";
import { Reveal } from "@/components/brand/Reveal";
import { MagneticButton } from "@/components/brand/MagneticButton";
import { finalCta, RESERVE_HREF } from "@/lib/landing";

/**
 * The ending. The PDF's field photograph mood — one image, the
 * farewell line in Kids Word, one last button.
 */
export function FinalCta() {
  return (
    <section aria-label="Reserve your VHSMO" className="relative flex min-h-[90svh] items-center overflow-hidden bg-darkroom">
      <Image
        src={finalCta.photo.src}
        alt={finalCta.photo.alt}
        fill
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-darkroom/70 via-transparent to-darkroom"
      />

      <div className="container-px relative z-10 mx-auto max-w-[120rem] py-32">
        <Reveal>
          <h2 className="font-marker max-w-4xl text-[clamp(2.6rem,7vw,7rem)] leading-[1.05] text-kodak drop-shadow-[0.3rem_0.5rem_0_rgba(31,26,24,0.4)]">
            {finalCta.lineOne}
            <br />
            {finalCta.lineTwo}
          </h2>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex flex-col items-start gap-8">
          <p className="max-w-md text-lg leading-relaxed text-overexpose/90">
            {finalCta.sub}
          </p>
          <MagneticButton href={RESERVE_HREF}>
            {finalCta.cta}
            <span aria-hidden>→</span>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
