import { Star } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { seededRotation } from "@/lib/random";

const reviews = [
  {
    quote: "The vibe is unreal. It's the only camera I actually grab on the way out.",
    handle: "@nostalgic.mind",
  },
  {
    quote: "Finally something that brings back the analog feeling. VHSMO just gets it.",
    handle: "@film.by.sana",
  },
  {
    quote: "Reserved mine already — the photos are on my phone before I've put it down.",
    handle: "@shotbykaii",
  },
];

/** Two-letter mark pulled from the handle, e.g. @film.by.sana → FS. */
function initials(handle: string) {
  const parts = handle.replace("@", "").split(/[.\-_]/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function CreatorReviews() {
  return (
    <section id="product-reviews" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:gap-14">
        <Reveal>
          <div>
            <p className="eyebrow text-darkroom/55">The verdict</p>
            <h2 className="display mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] text-darkroom">
              What creators say.
            </h2>
            <p className="display mt-8 text-7xl leading-none text-darkroom">4.9</p>
            <div className="mt-3 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-kodak text-kodak" />
              ))}
            </div>
            <p className="mt-3 text-sm text-darkroom/60">Based on 1,248 reviews</p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.handle} delay={i * 0.08}>
              <figure
                className="relative flex h-full flex-col bg-overexpose p-6 shadow-[0.25rem_0.5rem_1.1rem_rgba(31,26,24,0.16)]"
                style={{ rotate: `${seededRotation(i + 9, 1.4)}deg` }}
              >
                <span aria-hidden className="tape -top-3 left-6 w-12 -rotate-6" />
                <div aria-hidden className="flex text-kodak">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-kodak" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-darkroom/90">
                  {review.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="font-marker flex size-9 items-center justify-center rounded-full bg-darkroom text-xs text-kodak">
                    {initials(review.handle)}
                  </span>
                  <span className="text-sm font-semibold text-darkroom/70">
                    {review.handle}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
