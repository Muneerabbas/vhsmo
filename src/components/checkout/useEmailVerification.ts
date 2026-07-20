"use client";

import { useEffect, useState } from "react";
import { usePersistedState } from "./usePersistedState";

export type EmailStatus = "idle" | "checking" | "verified" | "notfound";

/** Debounced check of the entered email against the waitlist. */
export function useEmailVerification() {
  const [email, setEmail] = usePersistedState("checkout:email", "");
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

  return { email, setEmail, status };
}
