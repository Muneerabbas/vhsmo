import type { Metadata } from "next";
import { InternationalOrderForm } from "@/components/international/InternationalOrderForm";

export const metadata: Metadata = {
  title: "Order from outside India",
  description:
    "Checkout currently delivers within India. Ordering from anywhere else? Leave your details and we'll arrange your VHSMO Camera directly.",
  alternates: { canonical: "/international-order" },
};

export default function Page() {
  return (
    <div className="container-px mx-auto max-w-2xl pt-28 pb-16 sm:pt-32 sm:pb-24">
      <p className="eyebrow text-halide/55">Worldwide</p>
      <h1 className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)] text-halide">
        Ordering from
        <br />
        outside India?
      </h1>
      <p className="mt-6 max-w-lg text-halide/70">
        Our checkout currently delivers to Indian PIN codes only. Tell us where
        you are and what you&apos;d like, and we&apos;ll get back with shipping
        options and the total for your country - usually within 48 hours.
      </p>
      <div className="mt-10">
        <InternationalOrderForm />
      </div>
    </div>
  );
}
