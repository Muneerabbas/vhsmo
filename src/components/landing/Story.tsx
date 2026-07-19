import Image from "next/image";
import { Send } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { Scribble } from "@/components/brand/Scribble";
import { story, YEAR_MARK } from "@/lib/landing";
import { seededRotation } from "@/lib/random";

type StoryPhoto = NonNullable<(typeof story.photos)[number]>;

/** Ink asterisk doodle. */
function AsteriskDoodle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Frame used only in this spread: a clean pinned print — white border,
 * one strip of tape, caption underlined in yellow marker, and the
 * one-line story beneath. Straightens slightly on hover.
 */
function PinnedPrint({
  photo,
  rotate,
  sizes,
  circle,
}: {
  photo: StoryPhoto;
  rotate: number;
  sizes: string;
  /** Sentence inside `story` to circle in ink, if present. */
  circle?: string;
}) {
  const circleAt = circle ? photo.story.indexOf(circle) : -1;

  return (
    <figure
      className="group relative bg-overexpose p-2.5 pb-4 shadow-[0.25rem_0.5rem_1.1rem_rgba(31,26,24,0.22)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:rotate-0 hover:scale-[1.015] sm:p-3 sm:pb-5"
      style={{ rotate: `${rotate}deg` }}
    >
      <span aria-hidden className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" />
      <Image
        src={photo.src}
        alt={photo.alt}
        width={1024}
        height={768}
        sizes={sizes}
        className="block h-auto w-full"
      />
      <figcaption className="px-1 pt-4">
        <span className="font-marker relative inline-block pb-1 text-base leading-tight text-darkroom sm:text-lg">
          {photo.caption}
          <Scribble />
        </span>
        <span className="mt-2.5 block text-sm leading-snug text-darkroom/75">
          {circleAt >= 0 && circle ? (
            <>
              {photo.story.slice(0, circleAt)}
              <span className="relative inline-block whitespace-nowrap">
                {circle}
                <span
                  aria-hidden
                  className="absolute -inset-x-2 -inset-y-1 -rotate-1 rounded-[50%] border-[1.5px] border-darkroom/80"
                />
              </span>
              {photo.story.slice(circleAt + circle.length)}
            </>
          ) : (
            photo.story
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * The "why" spread — argument on the left page; a neat corkboard of
 * pinned prints, doodles, and a promise note on the right.
 */
export function Story() {
  const [night, golden, route9, almostDeleted, promiseShot] = story.photos;

  return (
    <section
      id="story"
      aria-label="Why VHSMO exists"
      className="paper relative overflow-hidden"
    >
      <div className="container-px mx-auto max-w-[120rem] py-8 sm:py-8">
        {/* Running head */}

        <div className="mt-16 grid grid-cols-12 gap-y-16 lg:mt-20 lg:gap-x-10">
          {/* Left page — the argument */}
          <div className="col-span-12 lg:col-span-4">
            <Reveal>
              <h2 className="display text-[clamp(2.1rem,3.4vw,3.6rem)] text-darkroom">
                Cameras got smarter.
                <br />
                Photos got{" "}
                <span className="font-marker relative inline-block font-normal tracking-normal">
                  emptier.
                  <Scribble />
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.12} className="mt-10 max-w-prose">
              {story.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mt-6 text-base leading-relaxed text-darkroom/90 first:mt-0 sm:text-lg sm:leading-loose"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {/* The takeaway, framed in crop marks */}
            <Reveal delay={0.2} className="mt-12">
              <span className="relative inline-block px-5 py-4">
                {[
                  "left-0 top-0 border-l-2 border-t-2",
                  "right-0 top-0 border-r-2 border-t-2",
                  "bottom-0 left-0 border-b-2 border-l-2",
                  "bottom-0 right-0 border-b-2 border-r-2",
                ].map((corner) => (
                  <span
                    key={corner}
                    aria-hidden
                    className={`absolute h-4 w-4 border-darkroom ${corner}`}
                  />
                ))}
                <span className="font-marker bg-kodak px-2 py-0.5 text-xl text-darkroom sm:text-2xl">
                  {story.note}
                </span>
              </span>
            </Reveal>
          </div>

          {/* Right page — the corkboard */}
          <div className="relative col-span-12 lg:col-span-8">
            <AsteriskDoodle className="absolute -top-8 right-0 h-8 w-8 rotate-12 text-darkroom" />

            {/* Top row — three prints */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {almostDeleted && (
                <Reveal fromRotate={-5}>
                  <PinnedPrint
                    photo={almostDeleted}
                    rotate={seededRotation(53, 1.6)}
                    sizes="(min-width: 1024px) 21vw, 45vw"
                  />
                </Reveal>
              )}
              {night && (
                <Reveal delay={0.1} fromRotate={4} className="sm:mt-2">
                  <PinnedPrint
                    photo={night}
                    rotate={seededRotation(23, 1.6)}
                    sizes="(min-width: 1024px) 21vw, 45vw"
                  />
                </Reveal>
              )}
              {golden && (
                <Reveal delay={0.1} fromRotate={4} className="sm:mt-2">
                  <PinnedPrint
                    photo={golden}
                    rotate={seededRotation(31, 1.6)}
                    sizes="(min-width: 1024px) 21vw, 45vw"
                  />
                </Reveal>
              )}
              {almostDeleted && (
                <Reveal delay={0.1} fromRotate={4} className="sm:mt-2">
                  <PinnedPrint
                    photo={almostDeleted}
                    rotate={seededRotation(53, 1.6)}
                    sizes="(min-width: 1024px) 21vw, 45vw"
                  />
                </Reveal>
              )}
              {route9 && (
                <Reveal delay={0.1} fromRotate={4} className="sm:mt-2">
                  <PinnedPrint
                    photo={route9}
                    rotate={seededRotation(41, 1.6)}
                    sizes="(min-width: 1024px) 21vw, 45vw"
                  />
                </Reveal>
              )}
              {route9 && (
                <Reveal delay={0.1} fromRotate={4} className="sm:mt-2">
                  <PinnedPrint
                    photo={route9}
                    rotate={seededRotation(41, 1.6)}
                    sizes="(min-width: 1024px) 21vw, 45vw"
                  />
                </Reveal>
              )}
              {/* {golden && (
                <Reveal
                  delay={0.2}
                  fromRotate={-4}
                  className="col-span-2 mx-auto w-[72%] sm:col-span-1 sm:mx-0 sm:mt-1 sm:w-auto"
                >
                  <PinnedPrint
                    photo={golden}
                    rotate={seededRotation(31, 1.6)}
                    sizes="(min-width: 1024px) 21vw, 45vw"
                    circle="The camera was already out."
                  />
                </Reveal>
              )} */}
            </div>

          
          </div>
        </div>
      </div>
    </section>
  );
}
