import { Aperture, ArrowLeftRight, BatteryCharging, Feather, MousePointerClick } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";

const features: { icon: LucideIcon; l1: string; l2: string }[] = [
  { icon: Aperture, l1: "Retro lens", l2: "true 2000s optics" },
  { icon: MousePointerClick, l1: "One button", l2: "no menus, ever" },
  { icon: ArrowLeftRight, l1: "Instant transfer", l2: "to your phone" },
  { icon: Feather, l1: "Pocket build", l2: "always in reach" },
  { icon: BatteryCharging, l1: "All-day battery", l2: "charges on USB-C" },
];

export function ProductFeatures() {
  return (
    <section aria-label="Why VHSMO" className="bg-bluehour py-14 text-overexpose sm:py-16">
      <div className="container-px mx-auto max-w-[120rem]">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {features.map(({ icon: Icon, l1, l2 }, i) => (
            <Reveal key={l1} delay={i * 0.06} className="text-center">
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
