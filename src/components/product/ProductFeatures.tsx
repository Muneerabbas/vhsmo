import { Aperture, ArrowLeftRight, Feather, Lock, MousePointerClick } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";

const features: { icon: LucideIcon; l1: string; l2: string }[] = [
  { icon: Aperture, l1: "Real retro look", l2: "No filters. No overlays." },
  { icon: MousePointerClick, l1: "Point & shoot", l2: "No menus. No setup." },
  { icon: ArrowLeftRight, l1: "Wireless in seconds", l2: "Direct to the VHSMO app." },
  { icon: Feather, l1: "Pocket-sized", l2: "Ready when the moment is." },
  { icon: Lock, l1: "Private by default", l2: "No cloud transfer." },
];

export function ProductFeatures() {
  return (
    <section aria-label="Why VHSMO" className="bg-bluehour py-14 text-overexpose sm:py-16">
      <div className="shell">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {features.map(({ icon: Icon, l1, l2 }, i) => (
            <Reveal
              key={l1}
              delay={i * 0.06}
              className={
                "text-center" +
                // The 5th feature is alone in the last mobile row - span both
                // columns so it centres instead of hugging the left.
                (i === features.length - 1 ? " col-span-2 sm:col-span-1" : "")
              }
            >
              <li className="flex flex-col items-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-kodak shadow-[0.2rem_0.4rem_0.9rem_rgba(31,26,24,0.25)] sm:size-[4.5rem]">
                  <Icon className="size-7 text-darkroom" strokeWidth={1.8} />
                </span>
                <span className="mt-4 block text-base font-bold text-overexpose sm:text-lg">
                  {l1}
                </span>
                <span className="mt-0.5 block text-xs text-overexpose/80 sm:text-sm">
                  {l2}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
