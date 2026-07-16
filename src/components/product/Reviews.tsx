import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/content";
import { Reveal } from "@/components/common/Reveal";

export function Reviews() {
  return (
    <section id="product-reviews" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.75rem,3.5vw,2.75rem)]">
            Beta tester reviews
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm text-muted">4.9 out of 5 · 120 reviews</span>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {testimonials.map((review) => (
          <Reveal key={review.name}>
            <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[0.975rem] leading-relaxed">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Image
                  src={review.image}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{review.name}</p>
                  <p className="text-xs text-muted">{review.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
