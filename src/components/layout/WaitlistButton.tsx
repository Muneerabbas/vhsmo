"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import {
  CountryCodeSelect,
  DEFAULT_COUNTRY,
  type CountryCode,
} from "./CountryCodeSelect";

const EASE = [0.16, 1, 0.3, 1] as const;

type Status = "idle" | "sending" | "done" | "error";

type FieldName = "name" | "email";

const FIELDS: {
  name: FieldName;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  inputMode: "text" | "email";
}[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Your name",
    autoComplete: "name",
    inputMode: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@email.com",
    autoComplete: "email",
    inputMode: "email",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escape hatch to /launch, where an email can be checked against the list. */
function CheckStatusLink({ onNavigate }: { onNavigate: () => void }) {
  return (
    <p className="text-center text-xs text-darkroom/55">
      Already signed up?{" "}
      <Link
        href="/launch"
        onClick={onNavigate}
        className="font-bold text-darkroom underline underline-offset-2 transition-colors hover:text-bluehour"
      >
        Check if you&apos;re on the waitlist
      </Link>
    </p>
  );
}

const EMPTY = { name: "", email: "", whatsapp: "" };

const INPUT_CLASS =
  "w-full min-w-0 rounded-xl border-2 border-darkroom/15 bg-overexpose px-4 py-3 text-sm text-darkroom outline-none transition-colors placeholder:text-darkroom/35 hover:border-darkroom/30 focus:border-darkroom";

/**
 * Floating "Join Waitlist" pill, pinned bottom-right on every chrome'd page.
 * Opens a signup modal that posts to /api/waitlist/join, which stores the row
 * in Supabase. The WhatsApp number is submitted with the picked dial code.
 */
export function WaitlistButton() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [status, setStatus] = useState<Status>("idle");
  const pathname = usePathname();

  const sending = status === "sending";

  // Deep link: navigating to /#joinwaitlist opens the modal, so marketing
  // links, QR codes and other pages can point straight at the form. Three ways
  // to arrive, three triggers: fresh page load (mount), same-page hash change
  // (hashchange), and a client-side navigation from another route - which
  // pushes state without firing hashchange, hence the `pathname` dep.
  useEffect(() => {
    const check = () => {
      if (window.location.hash.toLowerCase() === "#joinwaitlist") {
        setOpen(true);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [pathname]);

  // Every field filled and plausible - gates the submit button.
  const isValid =
    values.name.trim().length > 0 &&
    EMAIL_RE.test(values.email.trim()) &&
    values.whatsapp.replace(/[^\d]/g, "").length >= 7;

  function close() {
    if (sending) return;
    setOpen(false);
    // Drop the deep-link hash so the URL matches the closed state and a second
    // click on the same #joinwaitlist link still fires a hashchange.
    if (window.location.hash.toLowerCase() === "#joinwaitlist") {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }

  // Body scroll lock + escape to close, mirroring the cart drawer.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sending]);

  // Reset back to a blank form once the closing animation is done.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setValues(EMPTY);
      setCountry(DEFAULT_COUNTRY);
      setStatus("idle");
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || !isValid) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          whatsapp: values.whatsapp.trim(),
          countryCode: country.dial,
        }),
      });
      const data = await res.json().catch(() => null);
      setStatus(res.ok && data?.success ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-bluehour px-6 py-3 text-sm font-bold text-halide shadow-lg shadow-darkroom/40 transition-colors duration-300 hover:bg-kodak hover:text-darkroom sm:bottom-8 sm:right-8 sm:text-base"
      >
        Join Waitlist
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="waitlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
          >
            <div
              onClick={close}
              className="absolute inset-0 bg-darkroom-deep/60 backdrop-blur-[3px]"
            />

            <motion.div
              initial={{ y: 24, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative w-full max-w-md rounded-2xl bg-halide p-6 text-darkroom shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={close}
                disabled={sending}
                aria-label="Close waitlist form"
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-darkroom transition-colors hover:bg-darkroom/[0.06] disabled:opacity-40"
              >
                <X className="size-5" aria-hidden />
              </button>

              {status === "done" ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-bluehour text-halide">
                    <Check className="size-7" aria-hidden />
                  </span>
                  <h2
                    id="waitlist-title"
                    className="font-marker mt-5 text-3xl text-darkroom"
                  >
                    You&apos;re on the list!
                  </h2>
                  <p className="mt-2 text-sm text-darkroom/65">
                    We&apos;ll ping you on WhatsApp when the next batch drops.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 rounded-full bg-darkroom px-6 py-3 text-sm font-bold text-halide transition-colors duration-300 hover:bg-kodak hover:text-darkroom"
                  >
                    Done
                  </button>
                  <div className="mt-5 w-full">
                    <CheckStatusLink onNavigate={() => setOpen(false)} />
                  </div>
                </div>
              ) : (
                <>
                  <h2
                    id="waitlist-title"
                    className="font-marker text-3xl text-darkroom"
                  >
                    Join the waitlist
                  </h2>
                  <p className="mt-2 text-sm text-darkroom/65">
                    Be first in line when the next batch drops.
                  </p>

                  <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
                    {FIELDS.map((field) => (
                      <label key={field.name} className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-darkroom/60">
                          {field.label}
                        </span>
                        <input
                          type={field.type}
                          name={field.name}
                          value={values[field.name]}
                          onChange={(e) => {
                            const next = e.target.value;
                            setValues((v) => ({ ...v, [field.name]: next }));
                            if (status === "error") setStatus("idle");
                          }}
                          disabled={sending}
                          required
                          placeholder={field.placeholder}
                          autoComplete={field.autoComplete}
                          inputMode={field.inputMode}
                          className={INPUT_CLASS}
                        />
                      </label>
                    ))}

                    {/* Not a <label>: it wraps two controls (picker + input). */}
                    <div className="flex flex-col gap-1.5">
                      <span
                        id="waitlist-whatsapp-label"
                        className="text-xs font-bold uppercase tracking-wider text-darkroom/60"
                      >
                        WhatsApp number
                      </span>
                      <div className="flex items-start gap-2">
                        <CountryCodeSelect
                          value={country}
                          onChange={setCountry}
                          disabled={sending}
                        />
                        <input
                          type="tel"
                          name="whatsapp"
                          value={values.whatsapp}
                          onChange={(e) => {
                            // Digits and the usual separators only - the dial
                            // code comes from the picker beside it.
                            const next = e.target.value.replace(
                              /[^\d\s-]/g,
                              "",
                            );
                            setValues((v) => ({ ...v, whatsapp: next }));
                            if (status === "error") setStatus("idle");
                          }}
                          disabled={sending}
                          required
                          placeholder="98765 43210"
                          autoComplete="tel-national"
                          inputMode="tel"
                          aria-labelledby="waitlist-whatsapp-label"
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!isValid || sending}
                      className="mt-2 flex items-center justify-center gap-2 rounded-full bg-bluehour px-6 py-3 text-sm font-bold text-halide transition-colors duration-300 hover:bg-kodak hover:text-darkroom disabled:cursor-not-allowed disabled:bg-darkroom/20 disabled:text-darkroom/40 disabled:hover:bg-darkroom/20 disabled:hover:text-darkroom/40"
                    >
                      {sending && (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      )}
                      {sending ? "Joining..." : "Join Waitlist"}
                    </button>

                    {status === "error" && (
                      <p
                        role="alert"
                        className="text-xs font-semibold text-red-500"
                      >
                        That didn&apos;t work - please try again in a moment.
                      </p>
                    )}

                    <CheckStatusLink onNavigate={() => setOpen(false)} />
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
