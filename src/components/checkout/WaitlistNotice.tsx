"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Ticket,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { cardClass, controlClass, iconClass, labelClass } from "./styles";
import { useWaitlistCheck } from "./useEmailVerification";

const EASE = [0.16, 1, 0.3, 1] as const;

// Public sale opens to everyone on this date; until then only waitlist
// members can complete an order.
const PUBLIC_SALE_LABEL = "28 July";

type WaitlistNoticeProps = {
  email: string;
  onEmailChange: (value: string) => void;
  /** Called once a verified waitlist email unlocks the checkout. */
  onUnlock: () => void;
};

/**
 * Access gate for the checkout page. It covers checkout on every visit —
 * only waitlist members can buy right now, so the shopper must enter the
 * email they joined with (their "password") before the form is reachable.
 * Everyone else is pointed at {@link PUBLIC_SALE_LABEL}, when orders open to
 * all. Verification lives here alone; the checkout form no longer re-checks.
 */
export function WaitlistNotice({
  email,
  onEmailChange,
  onUnlock,
}: WaitlistNoticeProps) {
  // Locked on every visit until a verified email unlocks it this page load.
  const [unlocked, setUnlocked] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const status = useWaitlistCheck(email);

  const verified = status === "verified";
  const notFound = status === "notfound";
  const checking = status === "checking";

  const proceed = () => {
    setAttempted(true);
    if (!verified) return;
    onUnlock();
    setUnlocked(true);
  };

  return (
    <AnimatePresence>
      {!unlocked && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-notice-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-darkroom-deep/45 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-halide text-darkroom shadow-2xl"
          >
            <div className="px-7 pb-7 pt-8">
              <div className="flex size-12 items-center justify-center rounded-full bg-bluehour/12 text-bluehour">
                <Ticket className="size-6" />
              </div>

              <h2
                id="waitlist-notice-title"
                className="mt-5 text-xl font-bold leading-tight text-darkroom"
              >
                Early access for waitlist members
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-darkroom/70">
                Checkout is open to waitlist members only right now. Enter the
                email you joined the waitlist with to unlock it.
              </p>

              {/* Email verification — the password for checkout. */}
              <div className="mt-5">
                <label
                  className={
                    cardClass +
                    " block cursor-text " +
                    (verified
                      ? "!border-green-500/60 focus-within:!border-green-500"
                      : notFound
                        ? "!border-red-400/70 focus-within:!border-red-500"
                        : "")
                  }
                >
                  <div className="flex items-center gap-3">
                    <span aria-hidden>
                      <Mail className={iconClass} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={labelClass}>Waitlist email</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="you@gmail.com"
                        autoComplete="email"
                        inputMode="email"
                        maxLength={254}
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && proceed()}
                        aria-invalid={notFound}
                        className={controlClass}
                      />
                    </span>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {checking && (
                        <Loader2 className="h-4 w-4 animate-spin text-darkroom/40" />
                      )}
                      {verified && (
                        <CheckCircle2 className="status-pop h-4 w-4 text-green-600" />
                      )}
                      {notFound && (
                        <XCircle className="status-pop h-4 w-4 text-red-500" />
                      )}
                    </span>
                  </div>
                </label>

                {verified && (
                  <p className="status-rise mt-2 pl-1 text-xs font-semibold text-green-600">
                    Verified — you&apos;re on the waitlist.
                  </p>
                )}
              </div>

              {/* Non-member notice: only after a lookup has actually failed. */}
              {notFound && (
                <div className="status-rise mt-4 flex items-start gap-3 rounded-xl bg-overexpose/70 px-4 py-3.5">
                  <Clock className="mt-0.5 size-5 shrink-0 text-darkroom/55" />
                  <p className="text-sm leading-relaxed text-darkroom/75">
                    This email isn&apos;t on the waitlist. Orders open to
                    everyone from{" "}
                    <span className="font-semibold text-darkroom">
                      {PUBLIC_SALE_LABEL}
                    </span>
                    —check back then.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={proceed}
                disabled={!verified}
                aria-disabled={!verified}
                className={
                  "mt-6 flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold tracking-tight transition-all duration-300 ease-[var(--ease-out-expo)] " +
                  (verified
                    ? "bg-bluehour text-overexpose hover:shadow-[0_0_0_5px_rgba(16,147,255,0.25)] active:scale-[0.98]"
                    : "cursor-not-allowed bg-darkroom/15 text-darkroom/50")
                }
              >
                Unlock checkout
                <ArrowRight className="size-4" />
              </button>

              {/* Hint if they hit continue before a valid, verified email. */}
              {attempted && !verified && !notFound && !checking && (
                <p className="mt-3 text-center text-xs font-medium text-darkroom/55">
                  Enter your waitlist email to continue.
                </p>
              )}

              <Link
                href="/"
                className="mt-4 block text-center text-sm font-medium text-darkroom/55 underline-offset-4 transition-colors hover:text-darkroom hover:underline"
              >
                Back to store
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
