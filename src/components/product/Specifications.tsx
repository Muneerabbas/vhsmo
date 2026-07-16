import { specifications } from "@/lib/products";
import { Reveal } from "@/components/common/Reveal";

export function Specifications() {
  return (
    <section id="specs" className="scroll-mt-24">
      <Reveal>
        <h2 className="display text-[clamp(1.75rem,3.5vw,2.75rem)]">
          Specifications
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-x-12 gap-y-12 sm:grid-cols-2">
        {specifications.map((group) => (
          <Reveal key={group.group}>
            <div>
              <h3 className="eyebrow">{group.group}</h3>
              <dl className="mt-4 divide-y divide-line">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between gap-6 py-3.5"
                  >
                    <dt className="text-muted">{item.label}</dt>
                    <dd className="text-right font-medium">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
