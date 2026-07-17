import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cameraProduct } from "@/lib/products";
import { YEAR_MARK } from "@/lib/landing";
import { Gallery } from "@/components/product/Gallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { CommunityGallery } from "@/components/product/CommunityGallery";
import { CreatorReviews } from "@/components/product/CreatorReviews";
import { WhatsInBox } from "@/components/product/WhatsInBox";
import { Accessories } from "@/components/product/Accessories";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = {
  title: "Reserve the VHSMO — A pocket camera with the soul of the 2000s.",
  description:
    "Reserve the VHSMO Camera. True 2000s optics, one button, no menus, and wireless transfer to your phone in seconds. Fully refundable — first batch ships 2026.",
  alternates: { canonical: "https://vhsmo.camera/product" },
};

export default function ProductPage() {
  return (
    <div className="paper">
      {/* Breadcrumb */}
      <div className="container-px mx-auto max-w-[120rem] pt-24 sm:pt-28">
        <nav
          aria-label="Breadcrumb"
          className="eyebrow flex items-center gap-2 text-darkroom/50"
        >
          <Link href="/" className="transition-colors hover:text-darkroom">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-darkroom">Reserve</span>
        </nav>
      </div>

      {/* Gallery + purchase */}
      <section className="container-px mx-auto max-w-[120rem] py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Gallery images={cameraProduct.images} />
          <PurchasePanel />
        </div>
      </section>

      <ProductFeatures />

      {/* Detail sections */}
      <div className="container-px mx-auto max-w-[120rem] space-y-24 py-24 sm:space-y-32 sm:py-28">
        <WhatsInBox />
        <CommunityGallery />
        <CreatorReviews />
        {/* <Accessories /> */}
      </div>

      <Faq />

      {/* Colophon */}
      <div className="container-px mx-auto max-w-[120rem] pb-16">
        <div className="eyebrow flex justify-between border-t border-darkroom/15 pt-5 text-darkroom/45">
          <span>VHSMO - reserve</span>
          <span>{YEAR_MARK}</span>
        </div>
      </div>
    </div>
  );
}
