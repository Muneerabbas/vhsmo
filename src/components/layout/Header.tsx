"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { RESERVE_HREF, YEAR_MARK } from "@/lib/landing";

const navLinks = [
  { label: "Story", href: "/#story" },
  { label: "Shot on VHSMO", href: "/#photos" },
  { label: "Community", href: "/#community" },
  { label: "FAQ", href: "/#faq" },
];

export function Header() {
  const { count, openCart, isHydrated } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Pages that open on a light (paper) surface need dark nav until the
  // header picks up its dark backdrop on scroll.
  const lightTop =
    !!pathname &&
    (pathname.startsWith("/product") || pathname.startsWith("/checkout"));
  const darkText = lightTop && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)]",
        darkText ? "text-darkroom" : "text-halide",
        scrolled
          ? "border-b border-halide/10 bg-darkroom/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-px mx-auto flex h-16 max-w-[120rem] items-center justify-between sm:h-20">
        <Link
          href="/"
          aria-label="VHSMO home"
          className={cn(
            "font-marker -rotate-2 text-2xl leading-none transition-transform hover:rotate-0 sm:text-3xl",
            darkText ? "text-darkroom" : "text-kodak",
          )}
        >
          VHSMO
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-[0.9rem] font-medium transition-colors",
                darkText
                  ? "text-darkroom/80 hover:text-darkroom"
                  : "text-halide/85 hover:text-kodak",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={RESERVE_HREF}
            className="hidden rounded-full bg-kodak px-5 py-2 text-sm font-bold text-darkroom transition-transform hover:scale-105 sm:inline-block"
          >
            Reserve
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart${isHydrated && count > 0 ? ` (${count} items)` : ""}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-halide/10"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {isHydrated && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-kodak text-[0.65rem] font-bold text-darkroom">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-halide/10 md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-darkroom md:hidden"
          >
            <div className="container-px flex h-16 items-center justify-between">
              <span className="font-marker -rotate-2 text-2xl text-kodak">VHSMO</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-halide hover:bg-halide/10"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <nav
              aria-label="Mobile"
              className="container-px flex flex-1 flex-col justify-center gap-2"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="display block py-3 text-4xl text-overexpose transition-colors hover:text-kodak"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  href={RESERVE_HREF}
                  onClick={() => setMenuOpen(false)}
                  className="font-marker inline-block -rotate-2 bg-kodak px-8 py-4 text-2xl text-darkroom"
                >
                  Reserve yours →
                </Link>
              </motion.div>
            </nav>
            <p className="eyebrow container-px pb-8 text-halide/50">
              Play it. Live it. Rewind Nothing. {YEAR_MARK}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
