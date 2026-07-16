import { Marquee } from "@/components/brand/Marquee";
import { Reveal } from "@/components/brand/Reveal";
import { TapedPhoto } from "@/components/brand/TapedPhoto";
import { shotOn } from "@/lib/landing";
import { seededRotation } from "@/lib/random";

/**
 * The big gallery — a broken masonry of prints at random angles,
 * yellow "issue cards" mixed into the flow like the PDF's covers.
 * No sliders; the page IS the pinboard.
 */
export function ShotOn() {
  const photos = shotOn.photos;

  return (
    <section id="photos" aria-label="Shot on VHSMO" className="bg-darkroom-deep pb-32 text-halide">
      <Marquee text={`shot on VHSMO · ${shotOn.marquee}`} variant="kodak" />

      <div className="container-px mx-auto max-w-[120rem] pt-24 sm:pt-32">
        <Reveal>
          <p className="eyebrow text-kodak">{shotOn.kicker}</p>
          <h2 className="display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,7.5rem)] text-overexpose">
            {shotOn.headline}
          </h2>
        </Reveal>

        <div className="mt-20 columns-2 gap-6 sm:mt-28 lg:columns-3 lg:gap-10 [&>*]:mb-10 [&>*]:break-inside-avoid lg:[&>*]:mb-14">
          {photos.slice(0, 3).map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 0.08} fromRotate={seededRotation(i, 7)}>
              <TapedPhoto
                src={photo.src}
                alt={photo.alt}
                width={1024}
                height={768}
                rotate={seededRotation(i + 31, 4)}
                tape={i % 2 === 0 ? "corners" : "top"}
                sizes="(min-width: 1024px) 30vw, 45vw"
              />
            </Reveal>
          ))}

          {/* Issue card — the PDF's yellow cover slipped into the pile */}
          <Reveal fromRotate={5}>
            <div
              className="edge-torn flex aspect-[3/4] flex-col justify-between bg-kodak p-6 text-darkroom shadow-[0.4rem_0.7rem_1.4rem_rgba(0,0,0,0.45)]"
              style={{ rotate: `${seededRotation(101, 4)}deg` }}
            >
              <span className="font-marker text-4xl leading-none sm:text-5xl">
                VHSMO
              </span>
              <div>
                <p className="display text-xl leading-tight sm:text-2xl">
                  REAL MOMENTS
                  <br />/ NO FILTERS
                </p>
                <p className="eyebrow mt-4 opacity-70">vol. I · now rolling</p>
              </div>
            </div>
          </Reveal>

          {photos.slice(3).map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={(i % 3) * 0.08}
              fromRotate={seededRotation(i + 50, 7)}
            >
              <TapedPhoto
                src={photo.src}
                alt={photo.alt}
                width={1024}
                height={768}
                rotate={seededRotation(i + 61, 4)}
                tape={i % 2 === 0 ? "top" : "corners"}
                sizes="(min-width: 1024px) 30vw, 45vw"
              />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <Marquee text={shotOn.marquee} variant="darkroom" reverse duration={22} className="border-y border-kodak/30" />
      </div>
    </section>
  );
}
