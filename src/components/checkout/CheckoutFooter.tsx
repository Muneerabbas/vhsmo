import Link from "next/link";
import { RazorpayLogo, WareIQLogo } from "./PartnerLogos";

export const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/legal/terms?from=checkout" },
  { label: "Privacy Policy", href: "/legal/privacy?from=checkout" },
  { label: "Refund Policy", href: "/legal/refund?from=checkout" },
  { label: "Shipping Policy", href: "/legal/shipping?from=checkout" },
];

export function CheckoutFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-darkroom/10 bg-halide">
      <div className="container-px mx-auto flex max-w-[90rem] flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="font-marker text-2xl leading-none text-darkroom">
            VHSMO
          </span>
          <span className="text-xs text-darkroom/50">
            Retro moments. Reimagined.
          </span>
        </div>

        {/* Legal links */}
        <nav
          aria-label="Legal"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-darkroom/60"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-darkroom"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Trust marks */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-darkroom/55">
          <span className="flex items-center gap-2">
            <span className="text-darkroom/50">Powered by</span>
            <RazorpayLogo className="h-[18px] w-auto" />
          </span>
          <span className="text-darkroom/20">|</span>
          <WareIQLogo className="h-5 w-auto text-darkroom" />
          <span className="text-darkroom/20">|</span>
          <span className="text-darkroom/45">© {year} VHSMO</span>
        </div>
      </div>
    </footer>
  );
}
