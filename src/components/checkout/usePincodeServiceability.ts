"use client";

import { useEffect, useState } from "react";
import { digitsOf } from "@/lib/checkout-validation";

export type PincodeStatus =
  | "idle"
  | "checking"
  | "serviceable"
  | "unserviceable"
  | "error";

export type PincodeInfo = {
  city: string | null;
  state: string | null;
  cod: boolean;
};

/** A serviceable Indian PIN is exactly six digits, first non-zero. */
function isCheckablePincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

/**
 * Debounced Delhivery serviceability check for the entered PIN code.
 * Only fires for a well-formed 6-digit PIN; anything shorter stays "idle"
 * so the format validation owns that error.
 */
export function usePincodeServiceability(postalCode: string) {
  const pin = digitsOf(postalCode);
  const [status, setStatus] = useState<PincodeStatus>("idle");
  const [info, setInfo] = useState<PincodeInfo | null>(null);

  useEffect(() => {
    if (!isCheckablePincode(pin)) {
      setStatus("idle");
      setInfo(null);
      return;
    }

    setStatus("checking");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/pincode?pincode=${pin}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (data.serviceable) {
          setStatus("serviceable");
          setInfo({
            city: data.city ?? null,
            state: data.state ?? null,
            cod: Boolean(data.cod),
          });
        } else {
          setStatus("unserviceable");
          setInfo(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          // Network / API failure: don't punish the buyer, let the order
          // proceed on the format-validated PIN alone.
          setStatus("error");
          setInfo(null);
        }
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [pin]);

  return { status, info };
}
