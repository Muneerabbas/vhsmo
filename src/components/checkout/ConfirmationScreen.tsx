import Link from "next/link";
import { Check } from "lucide-react";

export function ConfirmationScreen({ orderId }: { orderId: string }) {
  return (
    <div className="paper min-h-dvh">
      <div className="container-px mx-auto flex max-w-2xl flex-col items-center pt-40 pb-32 text-center sm:pt-48">
        <span className="flex size-16 items-center justify-center rounded-full bg-kodak shadow-[0.25rem_0.5rem_1.1rem_rgba(31,26,24,0.28)]">
          <Check className="size-8 text-darkroom" strokeWidth={3} />
        </span>
        <h1 className="display mt-8 text-[clamp(2rem,5vw,3.25rem)] text-darkroom">
          You&apos;re on the list.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-darkroom/60">
          Your reservation is locked in — nothing&apos;s charged until it ships.
          We&apos;ve sent a confirmation to your email.
        </p>
        <p className="font-marker mt-6 -rotate-1 bg-kodak px-4 py-1.5 text-lg text-darkroom">
          Order {orderId}
        </p>
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
