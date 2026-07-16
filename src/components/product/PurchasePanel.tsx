"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, RotateCcw, Star, Truck } from "lucide-react";
import { cameraProduct } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Scribble } from "@/components/brand/Scribble";

const colors = [
  { id: "Blush", swatch: "#f2b8c6" },
  { id: "Cream", swatch: "#ece4d3" },
  { id: "Charcoal", swatch: "#2a2422" },
] as const;

const waitlistAvatars = [
  "/vhsmoclicks/one.jpeg",
  "/vhsmoclicks/two.avif",
  "/vhsmoclicks/three.avif",
  "/vhsmoclicks/five.avif",
];

export function PurchasePanel() {
  const { addItem } = useCart();
  const [color, setColor] = useState<string>(colors[0].id);

  const hero = cameraProduct.images[0]!;
  const discount =
    cameraProduct.compareAtPrice != null
      ? Math.round(
          ((cameraProduct.compareAtPrice - cameraProduct.price) /
            cameraProduct.compareAtPrice) *
            100,
        )
      : 0;

  return (
    <div className="lg:sticky lg:top-28">
      {/* Running head */}
      <div className="eyebrow flex items-center justify-between border-b border-darkroom/15 pb-3 text-darkroom/50">
        <span>The object</span>
        <span className="flex items-center gap-1.5">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-kodak text-kodak" />
            ))}
          </span>
          4.9 · 1,248
        </span>
      </div>

      <h1 className="display mt-6 text-[clamp(2.2rem,4vw,3.25rem)] text-darkroom">
        {cameraProduct.name}
      </h1>
      <p className="font-marker mt-2 text-xl text-darkroom/70 sm:text-2xl">
        {cameraProduct.tagline}
      </p>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-3">
        <span className="relative inline-block">
          <span className="display text-4xl text-darkroom">
            {formatCurrency(cameraProduct.price)}
          </span>
          <Scribble className="absolute -bottom-2 left-0 h-2.5 w-full" />
        </span>
        {cameraProduct.compareAtPrice != null && (
          <span className="text-lg text-darkroom/45 line-through">
            {formatCurrency(cameraProduct.compareAtPrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="font-marker -rotate-2 bg-kodak px-2 py-0.5 text-sm text-darkroom">
            {discount}% off
          </span>
        )}
      </div>

      {/* Free shipping / returns */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-darkroom/70">
        <span className="flex items-center gap-2">
          <Truck className="size-4" /> Free shipping
        </span>
        <span className="flex items-center gap-2">
          <RotateCcw className="size-4" /> 7-day returns
        </span>
      </div>

      {/* What it is */}
      <ul className="mt-6 space-y-2.5">
        {cameraProduct.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5 text-[0.95rem] text-darkroom/85">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-kodak">
              <Check className="size-3 text-darkroom" strokeWidth={3} />
            </span>
            {h}
          </li>
        ))}
      </ul>

      <div className="my-6 h-px bg-darkroom/15" />

      {/* Color */}
      <div>
        <p className="text-sm font-semibold text-darkroom">
          Finish: <span className="font-normal text-darkroom/60">{color}</span>
        </p>
        <div className="mt-3 flex gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              aria-pressed={color === c.id}
              aria-label={c.id}
              className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                color === c.id ? "border-darkroom" : "border-darkroom/20"
              }`}
            >
              <span
                className="size-6 rounded-full ring-1 ring-darkroom/10"
                style={{ background: c.swatch }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-7">
        <button
          onClick={() =>
            addItem({
              id: cameraProduct.id,
              name: cameraProduct.name,
              variant: color,
              price: cameraProduct.price,
              image: hero.src,
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-full bg-kodak px-8 py-4 text-base font-bold tracking-tight text-darkroom transition-all duration-300 ease-[var(--ease-out-expo)] hover:shadow-[0_0_0_5px_rgba(253,241,0,0.25)] active:scale-[0.98]"
        >
          Reserve yours — {formatCurrency(cameraProduct.price)}
        </button>
      </div>

      {/* Refundable note */}
      <p className="mt-4 flex items-start gap-2.5 border-l-2 border-kodak bg-kodak/10 px-4 py-3 text-sm text-darkroom/80">
        {cameraProduct.depositNote}
      </p>

      {/* Waitlist proof */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex">
          {waitlistAvatars.map((src, i) => (
            <span
              key={i}
              className="relative -ml-2 size-9 overflow-hidden rounded-full ring-2 ring-halide first:ml-0"
            >
              <Image src={src} alt="" fill sizes="36px" className="object-cover" />
            </span>
          ))}
        </div>
        <p className="text-sm leading-tight text-darkroom">
          <span className="font-bold">22K+ creators</span>
          <br />
          <span className="text-darkroom/60">already holding a spot</span>
        </p>
      </div>
    </div>
  );
}
