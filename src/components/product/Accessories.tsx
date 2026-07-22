"use client";

import { Plus, Link2, Shield, BatteryCharging, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { accessories } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Reveal } from "@/components/brand/Reveal";
import { YEAR_MARK } from "@/lib/landing";

const icons: Record<string, LucideIcon> = {
  strap: Link2,
  skin: Shield,
  battery: BatteryCharging,
  looks: Palette,
};

export function Accessories() {
  const { addItem } = useCart();

  return (
    <section id="accessories" className="scroll-mt-24">
      <Reveal>
        <div className="eyebrow flex justify-between border-b border-darkroom/20 pb-4 text-darkroom/55">
          <span>Complete the kit</span>
          <span className="hidden sm:inline">add to your reservation</span>
          <span>{YEAR_MARK}</span>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {accessories.map((acc) => {
          const Icon = icons[acc.icon] ?? Link2;
          return (
            <Reveal key={acc.id}>
              <article className="group flex h-full flex-col bg-overexpose p-6 shadow-[0.2rem_0.4rem_1rem_rgba(31,26,24,0.12)]">
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-halide">
                  <span className="flex size-16 items-center justify-center rounded-full bg-kodak">
                    <Icon className="size-7 text-darkroom" strokeWidth={1.7} />
                  </span>
                  {acc.comingSoon && (
                    <span className="font-marker absolute left-3 top-3 -rotate-2 bg-darkroom px-2.5 py-0.5 text-xs text-kodak">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-bold text-darkroom">{acc.name}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-darkroom/65">
                  {acc.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-semibold text-darkroom">
                    {acc.comingSoon
                      ? "Free with app"
                      : formatCurrency(acc.price)}
                  </span>
                  <button
                    disabled={acc.comingSoon}
                    onClick={() =>
                      addItem({
                        id: acc.id,
                        name: acc.name,
                        price: acc.price,
                        image: "/buyproduct/pinkFront.png",
                      })
                    }
                    className="flex size-10 items-center justify-center rounded-full bg-darkroom text-halide transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                    aria-label={`Add ${acc.name} to reservation`}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
