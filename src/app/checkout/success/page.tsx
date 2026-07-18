"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Mail, Package, Truck } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const paymentId = params.get("payment");

  return (
    <div className="paper min-h-dvh">
      <div className="container-px mx-auto flex max-w-2xl flex-col items-center pt-32 pb-32 text-center sm:pt-40">
        <span className="flex size-16 items-center justify-center rounded-full bg-kodak shadow-[0.25rem_0.5rem_1.1rem_rgba(31,26,24,0.28)]">
          <Check className="size-8 text-darkroom" strokeWidth={3} />
        </span>

        <h1 className="display mt-8 text-[clamp(2rem,5vw,3.25rem)] text-darkroom">
          Payment confirmed.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-darkroom/60">
          Your VHSMO is reserved. We&apos;ve emailed your receipt and will send
          shipping updates as your camera makes its way to you.
        </p>

        {(orderId || paymentId) && (
          <div className="mt-8 w-full max-w-sm rounded-2xl border-2 border-darkroom/12 bg-overexpose p-5 text-left shadow-[0_10px_40px_-24px_rgba(31,26,24,0.4)]">
            {orderId && (
              <div className="flex items-center justify-between gap-4 py-1.5">
                <span className="text-sm text-darkroom/55">Order ID</span>
                <span className="font-mono text-sm font-semibold text-darkroom">
                  {orderId}
                </span>
              </div>
            )}
            {paymentId && (
              <div className="flex items-center justify-between gap-4 py-1.5">
                <span className="text-sm text-darkroom/55">Payment ID</span>
                <span className="font-mono text-sm font-semibold text-darkroom">
                  {paymentId}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 grid w-full max-w-sm gap-3 text-left">
          <Step
            icon={<Mail className="size-4" />}
            title="Receipt on the way"
            body="Check your inbox for confirmation."
          />
          <Step
            icon={<Package className="size-4" />}
            title="We're preparing your order"
            body="Your camera is queued for the next batch."
          />
          <Step
            icon={<Truck className="size-4" />}
            title="Shipping updates"
            body="We'll notify you the moment it ships."
          />
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-darkroom px-7 py-3.5 text-sm font-bold text-halide transition-transform hover:scale-[1.02]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-darkroom/10 bg-overexpose/60 p-3.5">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-kodak/60 text-darkroom">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-darkroom">{title}</p>
        <p className="text-xs text-darkroom/55">{body}</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={<div className="paper min-h-dvh" />}
    >
      <SuccessContent />
    </Suspense>
  );
}
