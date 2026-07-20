# Aperture - Premium Camera Pre-order Landing

A production-ready, conversion-focused launch site for a fictional premium camera
brand, **Aperture Field One**. Built to feel like a hardware startup preparing for
launch (Apple / Leica / Teenage Engineering territory) rather than a generic store.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS v4** (CSS-first `@theme` config)
- **Framer Motion** - scroll reveals, parallax, sticky storytelling, carousel
- **GSAP** - available for future timeline work
- **Lenis** - smooth scrolling (respects `prefers-reduced-motion`)
- **shadcn/ui-style** primitives on **Radix UI** (Button, Accordion)
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

> **Node 25 note:** the npm scripts set `NODE_OPTIONS=--no-experimental-webstorage`.
> Node 25 ships a half-initialised global `localStorage` that throws during SSR when
> libraries feature-detect it. The flag disables it so the browser-only Web Storage
> API is used as intended. Remove it on Node ≤ 22.

## Routes

| Route       | Description                                                            |
| ----------- | --------------------------------------------------------------------- |
| `/`         | Home - hero, vision, sticky showcase, sample photos, features, journey, team, testimonials, FAQ, final pre-order |
| `/product`  | Product - gallery, sticky purchase panel, specs, in-the-box, shipping/warranty, reviews, accessories, FAQ |
| `/sitemap.xml`, `/robots.txt` | Generated for SEO                                   |

## Architecture

```
src/
├─ app/                 # routes, layout, SEO (metadata, JSON-LD, sitemap, robots)
├─ components/
│  ├─ ui/               # Button, Accordion (shadcn-style, Radix-backed)
│  ├─ layout/           # Header, Footer
│  ├─ providers/        # SmoothScroll (Lenis)
│  ├─ common/           # Reveal, TrustBadges, QuantityStepper
│  ├─ cart/             # CartDrawer, AddToCartButton
│  ├─ sections/         # Home sections
│  └─ product/          # Product-page sections
└─ lib/
   ├─ products.ts       # Product, specs, box contents, accessories (typed data)
   ├─ content.ts        # Features, journey, team, testimonials, FAQ, trust, photos
   ├─ cart-context.tsx  # Cart state + localStorage persistence + cross-tab sync
   └─ utils.ts          # cn(), formatCurrency()
```

### Cart

A typed `useReducer` context (`lib/cart-context.tsx`) backs a polished slide-out
drawer: quantity controls, remove, order summary, shipping estimate, tax
placeholder, secure-checkout CTA. State persists to `localStorage` and syncs
across tabs via the `storage` event. Variants (camera finish) are tracked per line.

### Adding a product / scaling

All content lives in `lib/products.ts` and `lib/content.ts` as typed modules.
The cart and components are product-agnostic - add entries to the data files (and,
for a multi-product catalogue, parameterise `/product/[slug]`) to scale.

## Trust & conversion

Secure-checkout, 1-year warranty, free shipping, easy returns, money-back
guarantee, estimated delivery and a "Limited first batch" badge are surfaced in
the hero trust strip, purchase panel, cart, and final pre-order section. All are
clearly-labelled placeholders ready to wire to a real payment/fulfilment backend.

## Notes

- Imagery uses Unsplash source URLs (configured in `next.config.ts`) for a
  deterministic build - swap `src` values in the data files for brand photography.
- Animations honour `prefers-reduced-motion` globally.
- Accessible: skip link, focus-visible rings, ARIA on interactive controls,
  semantic landmarks. SEO: per-route metadata, Open Graph, Product JSON-LD.
# vhsmo
