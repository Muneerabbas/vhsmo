import { Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { boxContents } from "@/lib/products";
import { Reveal } from "@/components/common/Reveal";

const shippingCards = [
  {
    icon: Truck,
    title: "Free PAN India shipping",
    body: "Every pre-order ships free, fully insured and tracked door to door. Duties shown transparently at checkout.",
  },
  {
    icon: ShieldCheck,
    title: "1-year warranty",
    body: "Covers manufacturing defects from day one. Extend to three years at checkout closer to shipping.",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    body: "Not the camera for you? Send it back within 30 days for a full, no-questions money-back refund.",
  },
];

export function BoxAndShipping() {
  return (
    <section id="shipping" className="scroll-mt-24 space-y-16">
      {/* In the box */}
      <div>
        <Reveal>
          <div className="flex items-center gap-3">
            <Package className="size-6 text-accent-strong" strokeWidth={1.5} />
            <h2 className="display text-[clamp(1.75rem,3.5vw,2.75rem)]">
              In the box
            </h2>
          </div>
        </Reveal>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {boxContents.map((entry) => (
            <li key={entry.item} className="bg-canvas p-6">
              <p className="font-medium">{entry.item}</p>
              <p className="mt-1 text-sm text-muted">{entry.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping / warranty */}
      <div>
        <Reveal>
          <h2 className="display text-[clamp(1.75rem,3.5vw,2.75rem)]">
            Shipping &amp; warranty
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {shippingCards.map((card) => (
            <Reveal key={card.title}>
              <div className="h-full rounded-2xl border border-line bg-surface/50 p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-canvas text-accent-strong">
                  <card.icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-medium">{card.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {card.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
