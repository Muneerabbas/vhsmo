import type { Metadata, Viewport } from "next";
import { Inter_Tight, Shantell_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { FilmGrain } from "@/components/brand/FilmGrain";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Script from "next/script";

/*
 * Brand faces are Sequel Sans (display/body) and Kids Word (marker).
 * Both are commercial — these are the closest free stand-ins, exposed
 * under brand-agnostic variables so licensed files can be swapped in
 * later via next/font/local without touching any component.
 */
const sequel = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sequel",
  display: "swap",
});

const kids = Shantell_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-kids",
  display: "swap",
});

const SITE_URL = "https://vhsmo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VHSMO — Play it. Live it. Rewind Nothing.",
    template: "%s · VHSMO",
  },
  description:
    "A pocket camera with the soul of the 2000s. True retro lens, every shot on your phone in seconds, small enough to live in your jacket. Reserve yours — /2026.",
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
    title: "VHSMO — Play it. Live it. Rewind Nothing.",
    description:
      "A pocket camera with the soul of the 2000s. Reserve yours — /2026.",
    siteName: "VHSMO",
    images: [
      {
        url: "/buyproduct/firstimage.jpg",
        width: 1500,
        height: 1000,
        alt: "The VHSMO pocket camera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VHSMO — Play it. Live it. Rewind Nothing.",
    description:
      "A pocket camera with the soul of the 2000s. Reserve yours — /2026.",
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
    "A pocket camera with the soul of the 2000s — true retro lens, instant wireless transfer, palm-sized build.",
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
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-kodak focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-darkroom"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
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
