import { Hero } from "@/components/landing/Hero";
import { Story } from "@/components/landing/Story";
import { Careers } from "@/components/landing/Careers";
import { ShotOn } from "@/components/landing/ShotOn";
import { Community } from "@/components/landing/Community";
import { Showcase } from "@/components/landing/Showcase";
import { LandingFaq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { cameraProduct } from "@/lib/products";
import { Gallery } from "@/components/product/Gallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { Marquee } from "@/components/brand/Marquee";
import { shotOn } from "@/lib/landing";

/**
 * The issue, front to back:
 * hook → why → proof (transfer, pocket, gallery)
 * → people → object → fine print → farewell.
 */
export default function HomePage() {
  return (
    <>

      <Hero />
      <Story />
      <ShotOn />
      {/* <Community /> */}
      {/* <Showcase /> */}
      {/* <Careers /> */}

      {/* Reserve — the object itself, gallery + price, then the feature strip */}
      <div id="reserve" className="paper scroll-mt-20">
        <section className="container-px mx-auto max-w-[120rem] py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              {/* Wrapper bounds the gallery's sticky box so it can't slide
                  over the accordion sharing its column */}
              <div className="relative">
                <Gallery images={cameraProduct.images} />
              </div>
              {/* The fine print fills the column's dead space on laptops */}
              <div className="mt-14 hidden lg:block">
                <ProductAccordion />
              </div>
            </div>
            <PurchasePanel />
          </div>

          {/* On smaller screens the fine print stays below everything */}
          <div className="mt-16 lg:hidden">
            <ProductAccordion />
          </div>
        </section>
        <ProductFeatures />
      </div>

      <LandingFaq />
      <FinalCta />
    </>
  );
}
