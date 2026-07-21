import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Headphones,
  Instagram,
  ShieldCheck,
  ShoppingBag,
  Youtube,
} from "lucide-react";
import { Scribble } from "@/components/brand/Scribble";
import { RazorpayLogo } from "@/components/checkout/PartnerLogos";
import { LEGAL_DOCS } from "@/lib/legal";
import { RESERVE_HREF } from "@/lib/landing";
import { FooterNewsletter } from "./FooterNewsletter";

/** Link columns - only destinations that actually exist on the site. */
const columns = [
  {
    title: "Shop",
    Icon: ShoppingBag,
    links: [
      { label: "Pre-order Now", href: RESERVE_HREF },
      { label: "The Camera", href: "/product" },
    ],
  },
  {
    title: "Explore",
    Icon: Camera,
    links: [
      { label: "Our Story", href: "/#story" },
      { label: "Shot on VHSMO", href: "/#photos" },
    ],
  },
  {
    title: "Support",
    Icon: Headphones,
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact Us", href: "mailto:support@vhsmo.com" },
    ],
  },
];

/** Discord glyph - not in lucide, so drawn here. */
function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 640 512" className={className} fill="currentColor">
      <path d="M524.5 69.8a1.5 1.5 0 0 0-.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0-1.9.9 337.5 337.5 0 0 0-14.9 30.6 447.8 447.8 0 0 0-134.4 0 309.5 309.5 0 0 0-15.1-30.6 1.9 1.9 0 0 0-1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0-.8.7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7 348.2 348.2 0 0 0 30-48.8 1.9 1.9 0 0 0-1-2.6 321.2 321.2 0 0 1-45.9-21.9 1.9 1.9 0 0 1-.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9.2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1-.2 3.1 301.4 301.4 0 0 1-45.9 21.8 1.9 1.9 0 0 0-1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1.7A486 486 0 0 0 610.7 405.8a1.9 1.9 0 0 0 .8-1.4c12.2-126.9-20.5-237-86.9-334.6zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.6-23.4 59.2-52.8 59.2zm195.4 0c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.6-23.1 59.2-52.8 59.2z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "YouTube", href: "#", Icon: Youtube },
  { label: "Discord", href: "#", Icon: DiscordLogo },
];

/** Official card / rail logos for the "We accept" row (public/payments). */
function PaymentMarks() {
  return (
    <span className="flex items-center gap-4">
      <Image
        src="/payments/visa.svg"
        alt="Visa"
        width={49}
        height={16}
        unoptimized
        className="h-4 w-auto"
      />
      <Image
        src="/payments/mastercard.svg"
        alt="Mastercard"
        width={39}
        height={24}
        unoptimized
        className="h-6 w-auto"
      />
      <Image
        src="/payments/rupay.jpg"
        alt="RuPay"
        width={59}
        height={20}
        unoptimized
        className="h-5 w-auto mix-blend-multiply"
      />
      <Image
        src="/payments/upi.svg"
        alt="UPI"
        width={57}
        height={20}
        unoptimized
        className="h-5 w-auto"
      />
    </span>
  );
}

/**
 * The universal closing frame - brand + socials on the left, the site's real
 * destinations in the middle, the waitlist signup on the right, and a trust
 * bar (Razorpay + payment rails + legal) underneath.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="paper relative overflow-hidden border-t border-darkroom/10">
      <div className="shell relative pt-16 pb-10 sm:pt-20">
        {/* Top zone - brand · links · newsletter */}
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr_1.25fr] lg:gap-14">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="VHSMO home"
              className="font-marker inline-block -rotate-2 text-4xl leading-none text-darkroom transition-transform hover:rotate-0"
            >
              VHSMO
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-darkroom/70">
              Retro photography like never before.
              <br />
              Real moments. No filters.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-darkroom/20 text-darkroom transition-colors hover:border-darkroom/60 hover:bg-darkroom hover:text-kodak"
                  >
                    <Icon aria-hidden className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3"
          >
            {columns.map(({ title, Icon, links }) => (
              <div key={title}>
                <Icon
                  aria-hidden
                  strokeWidth={1.7}
                  className="h-5 w-5 text-darkroom"
                />
                <h3 className="eyebrow mt-3 text-darkroom">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-darkroom/65 transition-colors hover:text-darkroom"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Newsletter */}
          <div className="lg:border-l lg:border-darkroom/15 lg:pl-10">
            <h3 className="eyebrow relative inline-block text-darkroom">
              Stay in the loop
              <Scribble className="absolute -bottom-1.5 left-0 h-1.5 w-full" />
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-darkroom/70">
              Updates on drops, stories, and more.
            </p>
            <div className="mt-5">
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* Rule */}
        <div className="mt-14 h-px bg-darkroom/15" />

        {/* Trust bar */}
        <div className="flex flex-col items-center gap-5 py-7 text-sm text-darkroom/60 lg:flex-row lg:justify-between">
          <p>© {year} VHSMO. All rights reserved.</p>

          <p className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-darkroom/70" />
            Secure payments powered by
            <RazorpayLogo className="h-4 w-auto" />
          </p>

          <p className="flex items-center gap-3">
            <span className="text-darkroom/50">We accept</span>
            <PaymentMarks />
          </p>
        </div>

        {/* Legal row */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-darkroom/10 pt-6 text-sm text-darkroom/55">
          {LEGAL_DOCS.map((doc, i) => (
            <span key={doc.slug} className="flex items-center gap-3">
              {i > 0 && <span className="text-darkroom/25">·</span>}
              <Link
                href={`/legal/${doc.slug}`}
                className="transition-colors hover:text-darkroom"
              >
                {doc.navLabel ?? doc.title}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
