"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { useReducedMotion } from "framer-motion";
import { Check, Plus, RotateCcw, Truck } from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { Scribble } from "@/components/brand/Scribble";
import {
  cameraProduct,
  inspectFeatures,
  productFaq,
  type InspectFeature,
} from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { flyToCart } from "@/lib/fly-to-cart";
import type { ModelView } from "@/components/product/CameraViewer";

/**
 * The 3D stack (three.js + the model) never touches the initial bundle or
 * the server render - it's code-split here and only fetched once the
 * section is within a screen of the viewport.
 */
const CameraViewer = dynamic(() => import("@/components/product/CameraViewer"), {
  ssr: false,
  loading: () => <ViewerPoster />,
});

/** Lightweight placeholder shown before the 3D chunk mounts. */
function ViewerPoster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="font-marker rotate-[-2deg] text-lg text-darkroom/40">
        loading the object…
      </p>
    </div>
  );
}

const finishes = [
  { id: "Blush", swatch: "#f2b8c6" },
  { id: "Cream", swatch: "#ece4d3" },
  { id: "Charcoal", swatch: "#2a2422" },
] as const;

/**
 * Inspect - the buy section built around the object itself. No photography:
 * the 3D model is the gallery. Feature rows swing the orbit camera to the
 * matching angle; the rail reads like a product page - price, finish,
 * reserve. Blue hour shows up only in the details: the eyebrow, the check
 * discs, the active feature rule, a faint glow behind the model.
 */
export function Inspect() {
  const holderRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Two observers, two jobs: `mounted` fetches the 3D chunk one screen
  // early (once, then disconnects); `inView` gates auto-rotate so the GPU
  // is fully idle whenever the section is scrolled away.
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<ModelView | null>(null);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const mountObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          mountObs.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    const viewObs = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.15 },
    );
    mountObs.observe(el);
    viewObs.observe(el);
    return () => {
      mountObs.disconnect();
      viewObs.disconnect();
    };
  }, []);

  const selectFeature = (feature: InspectFeature) => {
    setActiveId(feature.id);
    // Fresh object each click so re-selecting the same angle still glides.
    setView({ ...feature.view });
  };

  // Add to cart - same flight + line shape as the purchase panel so the
  // item merges with anything reserved from the main panel.
  const { addItem } = useCart();
  const [finish, setFinish] = useState<string>(finishes[0].id);
  const [adding, setAdding] = useState(false);
  const hero = cameraProduct.images[0]!;

  const reserve = async (button: HTMLElement) => {
    if (adding) return;
    setAdding(true);
    await flyToCart(button, hero.src);
    addItem({
      id: cameraProduct.id,
      name: cameraProduct.name,
      variant: finish,
      price: cameraProduct.price,
      image: hero.src,
    });
    setAdding(false);
  };

  const discount =
    cameraProduct.compareAtPrice != null
      ? Math.round(
          ((cameraProduct.compareAtPrice - cameraProduct.price) /
            cameraProduct.compareAtPrice) *
            100,
        )
      : 0;

  return (
    <section id="inspect" aria-label="Buy the camera - inspect it in 3D" className="section paper">
      <div className="shell">
        <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
          {/* The object - the 3D model is the product gallery */}
          <div className="col-span-12 lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <div
                ref={holderRef}
                className="relative aspect-square touch-pan-y overflow-hidden rounded-3xl sm:aspect-[4/3]"
                style={{
                  background:
                    "radial-gradient(80% 65% at 50% 30%, rgba(16, 147, 255, 0.07), transparent 70%), linear-gradient(to bottom, #ffffff, #e3e3e1)",
                }}
              >
                {mounted ? (
                  <CameraViewer
                    view={view}
                    autoRotate={inView && !interacted && !reduceMotion}
                    onInteract={() => setInteracted(true)}
                  />
                ) : (
                  <ViewerPoster />
                )}

                {/* 360 tag - the one loud-ish blue moment, kept small */}
                <span className="font-marker pointer-events-none absolute left-4 top-4 rotate-[-3deg] rounded-full bg-bluehour px-2.5 py-1 text-xs text-overexpose">
                  360° · this is the real shape
                </span>

                {/* Control hint - retires after the first grab */}
                {!interacted && (
                  <p className="font-marker pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rotate-[-1deg] text-sm text-darkroom/50">
                    drag to spin · pinch or scroll to zoom
                  </p>
                )}
              </div>

              {/* Angle shortcuts under the stage, like a gallery's thumb row */}
              <div className="mt-4 flex flex-wrap gap-2">
                {inspectFeatures.map((feature) => {
                  const active = activeId === feature.id;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => selectFeature(feature)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                        active
                          ? "border-bluehour bg-bluehour/10 text-bluehour"
                          : "border-darkroom/20 text-darkroom/70 hover:border-darkroom/40 hover:text-darkroom"
                      }`}
                    >
                      {feature.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Buy rail */}
          <div className="col-span-12 lg:col-span-5">
            <Reveal>

              <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.25rem)] text-darkroom">
                {cameraProduct.name}
              </h2>
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

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-darkroom/70">
                <span className="flex items-center gap-2">
                  <Truck className="size-4" /> Free shipping
                </span>
                <span className="flex items-center gap-2">
                  <RotateCcw className="size-4" /> 7-day returns
                </span>
              </div>
            </Reveal>

            <div className="my-7 h-px bg-darkroom/15" />

            {/* What you're looking at - each row aims the camera */}
            <div>
              {inspectFeatures.map((feature) => {
                const active = activeId === feature.id;
                return (
                  <button
                    key={feature.id}
                    onClick={() => selectFeature(feature)}
                    aria-pressed={active}
                    className={`block w-full border-l-2 py-3 pl-4 text-left transition-colors ${
                      active
                        ? "border-bluehour"
                        : "border-darkroom/15 hover:border-darkroom/40"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                          active ? "bg-bluehour" : "bg-bluehour/10"
                        }`}
                      >
                        <Check
                          className={`size-3 ${active ? "text-overexpose" : "text-bluehour"}`}
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-[0.95rem] font-semibold text-darkroom">
                        {feature.title}
                      </span>
                    </span>
                    {active && (
                      <span className="mt-1.5 block pl-[1.9rem] text-sm leading-relaxed text-darkroom/70">
                        {feature.detail}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="my-7 h-px bg-darkroom/15" />

            {/* Finish */}
            <div>
              <p className="text-sm font-semibold text-darkroom">
                Finish: <span className="font-normal text-darkroom/60">{finish}</span>
              </p>
              <div className="mt-3 flex gap-3">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFinish(f.id)}
                    aria-pressed={finish === f.id}
                    aria-label={f.id}
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                      finish === f.id ? "border-darkroom" : "border-darkroom/20"
                    }`}
                  >
                    <span
                      className="size-6 rounded-full ring-1 ring-darkroom/10"
                      style={{ background: f.swatch }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Reserve */}
            <div className="mt-7">
              <button
                onClick={(e) => void reserve(e.currentTarget)}
                disabled={adding}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-kodak px-8 py-4 text-base font-bold tracking-tight text-darkroom transition-all duration-300 ease-[var(--ease-out-expo)] hover:shadow-[0_0_0_5px_rgba(253,241,0,0.25)] active:scale-[0.98] disabled:cursor-wait"
              >
                {adding ? "Adding…" : "Reserve yours"}
              </button>
              <p className="mt-4 flex items-start gap-2.5 border-l-2 border-bluehour bg-bluehour/[0.06] px-4 py-3 text-sm text-darkroom/80">
                {cameraProduct.depositNote}
              </p>
            </div>
          </div>
        </div>

        {/* Product FAQ */}
        <div className="mt-20 grid grid-cols-12 gap-y-10  pt-14 lg:mt-28">
          <Reveal className="col-span-12 lg:col-span-4">
            <h3 className="display mt-4 text-[clamp(1.8rem,3vw,3rem)] text-darkroom">
              Before you
              <br />
              reserve.
            </h3>
          </Reveal>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion.Root type="single" collapsible className="border-t border-darkroom/25">
              {productFaq.map((item, i) => (
                <Accordion.Item
                  key={item.q}
                  value={`inspect-faq-${i}`}
                  className="border-b border-darkroom/25"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-baseline gap-6 py-5 text-left text-darkroom transition-colors hover:text-bluehour">
                      <span className="eyebrow shrink-0 opacity-50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-lg font-semibold leading-snug">
                        {item.q}
                      </span>
                      <Plus
                        aria-hidden
                        className="h-5 w-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_0.25s_ease-out] data-[state=open]:animate-[acc-down_0.3s_ease-out]">
                    <p className="max-w-prose pb-7 pl-14 pr-8 text-base leading-relaxed text-darkroom/80">
                      {item.a}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </section>
  );
}
