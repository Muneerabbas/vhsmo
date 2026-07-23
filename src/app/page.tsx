import { Hero } from "@/components/landing/Hero";
import { Story } from "@/components/landing/Story";
import { Showcase } from "@/components/landing/Showcase";
import { InstantTransfer } from "@/components/landing/InstantTransfer";
import { ShotOn } from "@/components/landing/ShotOn";
import { Community } from "@/components/landing/Community";
import { LandingFaq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Gallery } from "@/components/product/Gallery";
import { ColorProvider } from "@/lib/color-context";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductAccordion } from "@/components/product/ProductAccordion";

/**
 * The landing page, read as one story rather than a stack of bands:
 *
 *   1. Hero            - the hook (full-bleed)
 *   2. Story           - why VHSMO exists
 *   3. Showcase        - the object, annotated with its three pillars
 *   4. InstantTransfer - the one feature that sells it: it's already on your phone
 *   5. ShotOn          - proof: real photos off the camera
 *   6. Community       - social proof: people's actual nights
 *   7. Reserve         - the buy (gallery + price + what's included)
 *   8. FAQ             - the last objections
 *   9. FinalCta        - the send-off
 *
 * Every section aligns to the `.shell` container; only the hero backdrop
 * and the gallery strips are allowed to bleed full-width.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      {/* <Showcase /> */}
      {/* <InstantTransfer /> */}
      <ShotOn />
      {/* <Community /> */}

      {/* Reserve - the object itself (photos or the 3D model, same stage) +
          price, then the feature strip */}
      <div id="reserve" className="paper scroll-mt-20">
        <section className="shell section">
          {/* The swatches live in the panel but drive the gallery's photos,
              so both columns read the finish from one provider */}
          <ColorProvider>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                {/* Wrapper bounds the gallery's sticky box so it can't slide
                    over the accordion sharing its column */}
                <div className="relative">
                  <Gallery />
                </div>
                {/* The fine print fills the column's dead space on laptops */}
                <div className="mt-14 hidden lg:block">
                  <ProductAccordion />
                </div>
              </div>
              <PurchasePanel />
            </div>
          </ColorProvider>

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
