import Image from "next/image";
import { Aperture, ArrowLeftRight, BatteryCharging, BookOpen, Cable, MousePointerClick, Link2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cameraProduct } from "@/lib/products";
import { Reveal } from "@/components/brand/Reveal";
import { YEAR_MARK } from "@/lib/landing";

const boxItems: { label: string; image?: string; icon?: LucideIcon }[] = [
  { label: "VHSMO Camera", image: cameraProduct.images[0]!.src },
  { label: "USB-C cable", icon: Cable },
  { label: "Wrist strap", icon: Link2 },
  { label: "Quick-start zine", icon: BookOpen },
];

const specs: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: Aperture, title: "True 2000s optics", sub: "The warm bloom, kept — no filters." },
  { icon: MousePointerClick, title: "One button", sub: "No menus, no modes, no learning curve." },
  { icon: ArrowLeftRight, title: "Wireless transfer", sub: "On your phone in seconds — iOS & Android." },
  { icon: BatteryCharging, title: "All-day battery", sub: "A weekend of shooting. Tops up on USB-C." },
];

export function WhatsInBox() {
  return (
    <section id="whats-in-box" className="scroll-mt-24">
      <Reveal>
        <div className="eyebrow flex justify-between border-b border-darkroom/20 pb-4 text-darkroom/55">
          <span>In the box</span>
          <span className="hidden sm:inline">one object · built to last</span>
          <span>{YEAR_MARK}</span>
        </div>
      </Reveal>

      <Reveal>
        <h2 className="display mt-8 text-[clamp(1.9rem,3.6vw,2.9rem)] text-darkroom">
          Everything you need,
          <br className="hidden sm:block" /> nothing you don&apos;t.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-12">
        {/* Items */}
        <div className="grid grid-cols-2 gap-4">
          {boxItems.map((item) => (
            <Reveal key={item.label}>
              <div className="flex flex-col items-center gap-3 bg-overexpose p-5 text-center shadow-[0.2rem_0.4rem_1rem_rgba(31,26,24,0.12)]">
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-halide">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    item.icon && (
                      <item.icon className="size-9 text-darkroom/70" strokeWidth={1.4} />
                    )
                  )}
                </div>
                <span className="text-sm font-semibold text-darkroom">{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Specs */}
        <Reveal>
          <ul className="h-full border-y border-darkroom/15">
            {specs.map((spec) => (
              <li
                key={spec.title}
                className="flex items-center gap-4 border-t border-darkroom/10 py-5 first:border-t-0"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-kodak text-darkroom">
                  <spec.icon className="size-5" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block font-bold text-darkroom">{spec.title}</span>
                  <span className="block text-sm text-darkroom/65">{spec.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
