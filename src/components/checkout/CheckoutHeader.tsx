import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export function CheckoutHeader() {
  return (
    <div className="container-px mx-auto max-w-[90rem] pt-24 sm:pt-28">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="eyebrow flex items-center gap-2 text-darkroom/50"
      >
        <Link href="/" className="transition-colors hover:text-darkroom">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/product" className="transition-colors hover:text-darkroom">
          Reserve
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-darkroom">Checkout</span>
      </nav>

      <div className="mt-6 flex items-end justify-between gap-4">
        <h1 className="display text-[clamp(2rem,5vw,3.25rem)] text-darkroom">
          Checkout
        </h1>
        <Link
          href="/product"
          className="hidden items-center gap-2 text-sm font-semibold text-darkroom/60 transition-colors hover:text-darkroom sm:inline-flex"
        >
          <ArrowLeft className="size-4" /> Back to product
        </Link>
      </div>
    </div>
  );
}
