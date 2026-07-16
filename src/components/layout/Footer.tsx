import Link from "next/link";
import { Camera, Images, Users, MessageCircle, Bookmark, Instagram, Youtube } from "lucide-react";
import { Scribble } from "@/components/brand/Scribble";
import { RESERVE_HREF, TAGLINE, YEAR_MARK } from "@/lib/landing";

/** Link columns — icon, heading, and a short stack of destinations. */
const columns = [
  {
    title: "Story",
    Icon: Camera,
    links: [
      { label: "Our Story", href: "/#story" },
      { label: "Founders", href: "/#story" },
      { label: "Behind VHSMO", href: "/#story" },
    ],
  },
  {
    title: "Shot on VHSMO",
    Icon: Images,
    links: [
      { label: "Gallery", href: "/#photos" },
      { label: "Community Shots", href: "/#community" },
      { label: "Submit Yours", href: "/#community" },
    ],
  },
  {
    title: "Community",
    Icon: Users,
    links: [
      { label: "Discord", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
  {
    title: "FAQ",
    Icon: MessageCircle,
    links: [
      { label: "Product", href: RESERVE_HREF },
      { label: "Shipping", href: "/#faq" },
      { label: "Support", href: "/#faq" },
    ],
  },
  {
    title: "Reserve",
    Icon: Bookmark,
    links: [
      { label: "Pre-order Now", href: RESERVE_HREF },
      { label: "Shipping Info", href: RESERVE_HREF },
      { label: "Returns", href: RESERVE_HREF },
    ],
  },
];

/** Apple logo for the App Store badge. */
function AppleLogo() {
  return (
    <svg aria-hidden viewBox="0 0 384 512" className="h-6 w-6 fill-current">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/** Google Play glyph for the Play Store badge. */
function PlayLogo() {
  return (
    <svg aria-hidden viewBox="0 0 512 512" className="h-5 w-5">
      <path fill="#2196F3" d="M99.6 32.7 325 258.1 99.6 483.5c-9.9-5.2-16.6-15.6-16.6-27.6V60.3c0-12 6.7-22.4 16.6-27.6z" />
      <path fill="#FFC107" d="m396.7 186.6 65.9 38.1c20.5 11.8 20.5 41.5 0 53.3l-65.9 38.1-71.7-58 71.7-71.5z" />
      <path fill="#4CAF50" d="M99.6 32.7c3.8-2 8.1-3.2 12.9-3.2 5.5 0 11.1 1.5 16.3 4.5l267.9 152.6-71.7 71.5L99.6 32.7z" />
      <path fill="#F44336" d="M325 258.1 396.7 316 128.8 468.6c-5.2 3-10.8 4.5-16.3 4.5-4.8 0-9.1-1.2-12.9-3.2L325 258.1z" />
    </svg>
  );
}

/** Discord glyph — not in lucide, so drawn here. */
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

/**
 * The closing frame — a paper spread: the tagline set big on the left,
 * the app on the right, a grid of destinations below, and a bottom rule
 * carrying the copyright, the "made it real" sticker, and the socials.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="paper relative overflow-hidden">
      <div className="container-px relative mx-auto max-w-[120rem] py-12 sm:py-16">
        {/* Top zone — tagline + the app */}
        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* Left — the tagline, big */}
          <div className="relative">
            <p className="eyebrow text-darkroom/50">{YEAR_MARK.replace("/", "")}</p>
            <h2 className="display mt-3 text-[clamp(2.1rem,4.4vw,3.6rem)] text-darkroom">
              {TAGLINE[0]} {TAGLINE[1]}
              <br />
              <span className="relative inline-block">
                {TAGLINE[2]}
                <Scribble className="absolute -bottom-2 left-0 h-3 w-full" />
              </span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-darkroom/75">
              VHSMO is a new kind of camera experience.
              <br className="hidden sm:block" /> Real moments. No filters. Just you.
            </p>
          </div>

          {/* Right — the app */}
          <div className="lg:pl-16 lg:[border-left:1px_solid_rgba(42,36,34,0.14)]">
            <h3 className="relative inline-block text-lg font-bold text-darkroom">
              The VHSMO App
              <Scribble className="absolute -bottom-1.5 left-0 h-2 w-full" />
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-darkroom/70">
              Edit with film filters, curate your moments, and relive them — exactly as you saw them.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#"
                aria-label="Download on the App Store"
                className="flex items-center gap-2.5 rounded-xl border border-darkroom/25 px-4 py-2.5 text-darkroom transition-colors hover:border-darkroom/60 hover:bg-darkroom/[0.04]"
              >
                <AppleLogo />
                <span className="leading-tight">
                  <span className="block text-[0.6rem] opacity-70">Download on the</span>
                  <span className="block text-base font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="flex items-center gap-2.5 rounded-xl border border-darkroom/25 px-4 py-2.5 text-darkroom transition-colors hover:border-darkroom/60 hover:bg-darkroom/[0.04]"
              >
                <PlayLogo />
                <span className="leading-tight">
                  <span className="block text-[0.6rem] uppercase tracking-wide opacity-70">Get it on</span>
                  <span className="block text-base font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Rule */}
        <div className="my-10 h-px bg-darkroom/15" />

        {/* Link columns */}
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {columns.map(({ title, Icon, links }) => (
            <div key={title}>
              <Icon aria-hidden strokeWidth={1.7} className="h-5 w-5 text-darkroom" />
              <h4 className="eyebrow mt-3 text-darkroom">{title}</h4>
              <ul className="mt-3 space-y-2">
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

        {/* Rule */}
        <div className="my-10 h-px bg-darkroom/15" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-darkroom-deep">
              <span className="font-marker -rotate-3 text-sm text-kodak">V</span>
            </span>
            <p className="text-sm text-darkroom/60">
              © {year} VHSMO.
              <br className="hidden sm:block" /> Designed to be noticed.
            </p>
          </div>

          <p className="font-marker w-fit -rotate-2 bg-kodak px-3 py-1.5 text-lg leading-tight text-darkroom shadow-[0.15rem_0.3rem_0.5rem_rgba(31,26,24,0.18)]">
            that&apos;s what made it real.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:hello@vhsmo.com"
              className="text-sm text-darkroom/70 transition-colors hover:text-darkroom"
            >
              hello@vhsmo.com
            </a>
            <ul className="flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-darkroom/20 text-darkroom transition-colors hover:border-darkroom/60 hover:bg-darkroom hover:text-halide"
                  >
                    <Icon aria-hidden className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
