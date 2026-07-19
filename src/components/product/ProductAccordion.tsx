"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

type Item = {
  title: string;
  body: React.ReactNode;
};

const items: Item[] = [
  {
    title: "How It Works",
    body: (
      <p>
        Charge it, pocket it, press the one button. No menus, no previews, no
        retakes — every shot lands in your phone&apos;s camera roll through the
        VHSMO app seconds after you take it. You find out what you caught
        later, and the finding out is half the joy.
      </p>
    ),
  },
  {
    title: "Free Returns",
    body: (
      <p>
        7-day no-questions returns after delivery, with free shipping both
        ways. Your reservation itself is fully refundable — nothing is charged
        until the camera ships.
      </p>
    ),
  },
  {
    title: "What's Inside",
    body: (
      <ul className="space-y-2">
        {[
          ["VHSMO Camera", "in your choice of finish"],
          ["Woven wrist cord", "so it stays on you, not in a drawer"],
          ["USB-C charging cable", ""],
          ["Quick-start card", "one side is enough"],
          ["VHSMO sticker sheet", "slap them somewhere loud"],
        ].map(([item, detail]) => (
          <li key={item} className="flex gap-2">
            <span className="font-semibold text-darkroom">{item}</span>
            {detail && <span className="text-darkroom/60">— {detail}</span>}
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Specs",
    body: (
      <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {[
          ["Lens", "Fixed-focus retro optic, true 2000s rendering"],
          ["Flash", "Built-in, on by default — that's the look"],
          ["Transfer", "Wireless to the VHSMO app in seconds"],
          ["Battery", "USB-C rechargeable, weeks of shots per charge"],
          ["Size", "Palm-sized, pocket-ready"],
          ["Finishes", "Blush, Cream, Charcoal"],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="text-xs font-semibold uppercase tracking-wide text-darkroom/50">
              {label}
            </dt>
            <dd className="text-darkroom/85">{value}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    title: "Warranty",
    body: (
      <p>
        Every VHSMO ships with a 1-year warranty covering manufacturing
        defects. If something&apos;s wrong that we caused, we repair or replace
        it — simple as that.
      </p>
    ),
  },
];

/** The fine print, ruled like the FAQ — same hairlines, blue hover,
 *  same open/close motion. */
export function ProductAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-darkroom/25">
      {items.map((item) => (
        <Accordion.Item
          key={item.title}
          value={item.title}
          className="border-b border-darkroom/25"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left text-darkroom transition-colors hover:text-bluehour">
              <span className="text-xl font-bold sm:text-2xl">{item.title}</span>
              <Plus
                aria-hidden
                strokeWidth={1.8}
                className="h-7 w-7 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_0.25s_ease-out] data-[state=open]:animate-[acc-down_0.3s_ease-out]">
            <div className="pb-7 pr-10 text-[0.95rem] leading-relaxed text-darkroom/80">
              {item.body}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
