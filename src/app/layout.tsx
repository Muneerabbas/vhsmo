import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { FilmGrain } from "@/components/brand/FilmGrain";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Marquee } from "@/components/brand/Marquee";
import { shotOn } from "@/lib/landing";

/*
 * Brand faces are Sequel Sans (display/body) and Kids Word (marker).
 * Sequel is commercial - Inter Tight is the closest free stand-in. Kids
 * Word is the licensed brand marker face, loaded locally.
 */
const sequel = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sequel",
  display: "swap",
});

const kids = localFont({
  src: "./fonts/KidsWord.otf",
  variable: "--font-kids",
  display: "swap",
});

const SITE_URL = "https://vhsmo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VHSMO - Point. Shoot. Share.",
    template: "%s · VHSMO",
  },
  description:
    "A pocket camera with the soul of the 2000s. True retro lens, every shot on your phone in seconds, small enough to live in your jacket. Reserve yours - /2026.",
  keywords: [
    "VHSMO",
    "retro digital camera",
    "pocket camera",
    "y2k camera",
    "digicam",
    "point and shoot",
  ],
  authors: [{ name: "VHSMO" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "VHSMO - Point. Shoot. Share.",
    description:
      "A pocket camera with the soul of the 2000s. Reserve yours - /2026.",
    siteName: "VHSMO",
    images: [
      {
        url: "/buyproduct/pinkFront.png",
        width: 1500,
        height: 1000,
        alt: "The VHSMO pocket camera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VHSMO - Point. Shoot. Share.",
    description:
      "A pocket camera with the soul of the 2000s. Reserve yours - /2026.",
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2A2422",
  colorScheme: "light",
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "VHSMO Pocket Camera",
  description:
    "A pocket camera with the soul of the 2000s - true retro lens, instant wireless transfer, palm-sized build.",
  brand: { "@type": "Brand", name: "VHSMO" },
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/PreOrder",
    url: `${SITE_URL}/product`,
    priceCurrency: "USD",
    price: "149.00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sequel.variable} ${kids.variable}`}>
      <body className="min-h-dvh antialiased">
    
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <CartProvider>
          <SmoothScroll />
          <Analytics />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-kodak focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-darkroom"
          >
            Skip to content
          </a>
          <SiteChrome>{children}</SiteChrome>
          <CartDrawer />
          <FilmGrain />
        </CartProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
