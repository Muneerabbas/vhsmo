import { Hero } from "@/components/landing/Hero";
import { Story } from "@/components/landing/Story";
import { InstantTransfer } from "@/components/landing/InstantTransfer";
import { Careers } from "@/components/landing/Careers";
import { ShotOn } from "@/components/landing/ShotOn";
import { Community } from "@/components/landing/Community";
import { Showcase } from "@/components/landing/Showcase";
import { LandingFaq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";

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
      <InstantTransfer />
      <ShotOn />
      <Community />
      <Showcase />
      <Careers />

      <LandingFaq />
      <FinalCta />
    </>
  );
}
