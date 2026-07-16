"use client";

import { faqs as defaultFaqs, type FaqItem } from "@/lib/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/brand/Reveal";
import { YEAR_MARK } from "@/lib/landing";

export function Faq({
  items = defaultFaqs,
  className = "",
}: {
  items?: FaqItem[];
  className?: string;
}) {
  return (
    <section id="faq" className={`${className} py-16 sm:py-24`}>
      <div className="container-px mx-auto max-w-[120rem]">
        <Reveal>
          <div className="eyebrow flex justify-between border-b border-darkroom/20 pb-4 text-darkroom/55">
            <span>Fine print</span>
            <span className="hidden sm:inline">before you reserve</span>
            <span>{YEAR_MARK}</span>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Reveal>
              <h2 className="display text-[clamp(2rem,4.5vw,3.5rem)] text-darkroom">
                Everything you
                <br />
                might want to know.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-darkroom/70">
                Still unsure? Email{" "}
                <a
                  href="mailto:hello@vhsmo.com"
                  className="font-semibold text-darkroom underline decoration-kodak decoration-2 underline-offset-4"
                >
                  hello@vhsmo.com
                </a>{" "}
                and a real human will reply.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <Accordion type="single" collapsible defaultValue="item-0">
              {items.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
