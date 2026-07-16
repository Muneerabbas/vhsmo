"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { faq } from "@/lib/landing";

/**
 * The fine print, set as a ruled editorial index — hairlines, index
 * numbers, one accent. No boxes.
 */
export function LandingFaq() {
  return (
    <section id="faq" aria-label="Frequently asked questions" className="paper py-28 sm:py-40">
      <div className="container-px mx-auto grid max-w-[120rem] grid-cols-12 gap-y-12">
        <Reveal className="col-span-12 lg:col-span-4">
          <p className="eyebrow text-darkroom/60">{faq.kicker}</p>
          <h2 className="display mt-6 text-[clamp(2.2rem,4vw,4.5rem)] text-darkroom">
            Asked,
            <br />
            answered.
          </h2>
          <p className="font-marker mt-8 rotate-[-2deg] text-lg text-darkroom/70">
            still curious? write to us.
          </p>
        </Reveal>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <Accordion.Root type="single" collapsible className="border-t border-darkroom/25">
            {faq.items.map((item, i) => (
              <Accordion.Item
                key={item.q}
                value={`item-${i}`}
                className="border-b border-darkroom/25"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-baseline gap-6 py-6 text-left text-darkroom transition-colors hover:text-bluehour">
                    <span className="eyebrow shrink-0 opacity-50">
                      /{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-lg font-semibold leading-snug sm:text-xl">
                      {item.q}
                    </span>
                    <Plus
                      aria-hidden
                      className="h-5 w-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_0.25s_ease-out] data-[state=open]:animate-[acc-down_0.3s_ease-out]">
                  <p className="max-w-prose pb-8 pl-14 pr-8 text-base leading-relaxed text-darkroom/80">
                    {item.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
