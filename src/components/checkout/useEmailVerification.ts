"use client";

import { useEffect, useState } from "react";

export type EmailStatus = "idle" | "checking" | "verified" | "notfound";

/**
 * Debounced check of a given email against the waitlist. The email is owned by
 * the caller; this hook only reports its status. Waitlist membership is the
 * "password" that unlocks checkout, so this lives with the access gate (the
 * checkout popup) rather than the checkout form itself.
 */
export function useWaitlistCheck(email: string): EmailStatus {
  const [status, setStatus] = useState<EmailStatus>("idle");
  const isFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    if (!isFormatValid) {
      setStatus("idle");
      return;
    }
    setStatus("checking");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/waitlist/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
          signal: controller.signal,
        });
        const data = await res.json();
        setStatus(data.exists ? "verified" : "notfound");
      } catch {
        if (!controller.signal.aborted) setStatus("notfound");
      }
    }, 500);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [email, isFormatValid]);

  return status;
}
