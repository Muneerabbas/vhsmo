import { Reveal } from "@/components/brand/Reveal";
import { TapedPhoto } from "@/components/brand/TapedPhoto";
import { Sticker, StarburstSeal } from "@/components/brand/Sticker";
import { community } from "@/lib/landing";
import { seededRotation } from "@/lib/random";

/**
 * The corkboard — messages people sent us, pinned up as paper scraps
 * between their photos. A scrapbook, not a testimonial wall.
 */
export function Community() {
  return (
    <section id="community" aria-label="Community" className="section paper relative overflow-hidden">
      <div className="shell">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-darkroom/60">{community.kicker}</p>
            <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] text-darkroom">
              {community.headline}
            </h2>
          </div>
          <StarburstSeal rotate={8} className="w-28 text-sm sm:w-36 sm:text-base">
            play it. live it.
          </StarburstSeal>
        </Reveal>

        <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-10 sm:gap-x-8">
          {/* Scraps and prints interleaved, deliberately off-grid */}
          {community.scraps.map((scrap, i) => {
            const spans = [
              "col-span-11 sm:col-span-5 lg:col-span-4",
              "col-span-11 col-start-2 sm:col-span-4 sm:col-start-8 lg:col-span-3 lg:col-start-9 lg:-mt-10",
              "col-span-10 col-start-2 sm:col-span-4 sm:col-start-2 lg:col-span-3 lg:col-start-3",
              "col-span-11 sm:col-span-5 sm:col-start-6 lg:col-span-4 lg:col-start-7 lg:-mt-16",
              "col-span-10 col-start-3 sm:col-span-4 sm:col-start-3 lg:col-span-3 lg:col-start-2 lg:-mt-6",
            ];
            return (
              <Reveal
                key={scrap.handle}
                delay={(i % 3) * 0.1}
                fromRotate={seededRotation(i + 40, 6)}
                className={spans[i]}
              >
                <blockquote
                  className="edge-torn relative bg-overexpose px-6 py-5 text-darkroom shadow-[0.3rem_0.5rem_1rem_rgba(31,26,24,0.25)]"
                  style={{ rotate: `${seededRotation(i + 71, 3.5)}deg` }}
                >
                  <span aria-hidden className="tape -top-3 left-6 w-16 -rotate-6" />
                  <p className="text-base leading-snug sm:text-lg">
                    “{scrap.text}”
                  </p>
                  <footer className="font-marker mt-3 text-sm text-bluehour">
                    {scrap.handle}
                  </footer>
                </blockquote>
              </Reveal>
            );
          })}

          {/* Their photos, pinned between the notes */}
          {community.photos.map((photo, i) => {
            const spans = [
              "col-span-8 col-start-4 sm:col-span-4 sm:col-start-9 lg:col-span-3 lg:col-start-6 lg:-mt-24",
              "col-span-9 sm:col-span-4 sm:col-start-1 lg:col-span-3 lg:col-start-10 lg:-mt-8",
              "col-span-8 col-start-4 sm:col-span-4 sm:col-start-6 lg:col-span-3 lg:col-start-6 lg:-mt-10",
            ];
            return (
              <Reveal
                key={photo.src}
                delay={(i % 3) * 0.12}
                fromRotate={seededRotation(i + 90, 8)}
                className={spans[i]}
              >
                <TapedPhoto
                  src={photo.src}
                  alt={photo.alt}
                  width={1024}
                  height={768}
                  rotate={seededRotation(i + 81, 5)}
                  tape="corners"
                  sizes="(min-width: 1024px) 24vw, 60vw"
                  className="text-darkroom"
                />
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-24 text-center">
          <Sticker rotate={2} size="md" variant="bluehour">
            tag us — we print our favourites
          </Sticker>
        </Reveal>
      </div>
    </section>
  );
}
