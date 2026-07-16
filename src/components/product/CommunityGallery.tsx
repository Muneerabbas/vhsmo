import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { YEAR_MARK } from "@/lib/landing";

const shots = [
  { src: "/vhsmoclicks/one.jpeg", handle: "@jaden.visuals", likes: 241 },
  { src: "/vhsmoclicks/two.avif", handle: "@film.by.sana", likes: 198 },
  { src: "/vhsmoclicks/three.avif", handle: "@analog.archive", likes: 165 },
  { src: "/vhsmoclicks/four.avif", handle: "@shotbykaii", likes: 201 },
  { src: "/vhsmoclicks/five.avif", handle: "@luvv.shots", likes: 183 },
];

export function CommunityGallery() {
  return (
    <section id="community" className="scroll-mt-24">
      <Reveal>
        <div className="eyebrow flex justify-between border-b border-darkroom/20 pb-4 text-darkroom/55">
          <span>Shot on VHSMO</span>
          <span className="hidden sm:inline">real moments · no filters</span>
          <span>{YEAR_MARK}</span>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.9rem,3.6vw,2.9rem)] text-darkroom">
            Clicked by the community.
          </h2>
          <Link
            href="/#photos"
            className="font-marker inline-flex items-center gap-1.5 text-lg text-darkroom transition-colors hover:text-bluehour"
          >
            View all shots <ArrowRight className="size-4" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-5">
        {shots.map((shot, i) => (
          <Reveal key={shot.handle} delay={i * 0.05}>
            <figure
              className={`group relative aspect-[4/5] overflow-hidden bg-overexpose p-2 shadow-[0.25rem_0.5rem_1.1rem_rgba(31,26,24,0.18)] ${
                i === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={shot.src}
                  alt={`Shot by ${shot.handle}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-darkroom-deep/80 to-transparent p-3">
                  <span className="text-xs font-semibold text-overexpose">{shot.handle}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-overexpose">
                    <Heart className="size-3.5 fill-overexpose" /> {shot.likes}
                  </span>
                </div>
              </div>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
