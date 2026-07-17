"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { cameraProduct } from "@/lib/products";
import { YEAR_MARK } from "@/lib/landing";
import { AddressAutocomplete } from "@/components/address/AddressAutocomplete";
import { AddressFields } from "@/components/address/AddressFields";
import { emptyAddress, type Address, type AddressDetails } from "@/components/address/types";

const cardClass =
  "group rounded-xl border-2 border-darkroom/12 bg-overexpose px-4 py-2.5 shadow-[0_1px_2px_rgba(31,26,24,0.05)] transition-all duration-200 hover:border-darkroom/25 focus-within:border-bluehour focus-within:shadow-[0_8px_24px_-10px_rgba(16,147,255,0.5)]";
const labelClass =
  "block text-[0.62rem] font-bold uppercase tracking-[0.15em] text-darkroom/45 transition-colors group-focus-within:text-bluehour";
const controlClass =
  "w-full bg-transparent text-sm text-darkroom outline-none placeholder:text-darkroom/30";
const iconClass =
  "h-4 w-4 shrink-0 text-darkroom/35 transition-colors group-focus-within:text-bluehour";

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  className?: string;
};

function Field({
  name,
  label,
  placeholder,
  icon,
  type = "text",
  required,
  autoComplete,
  inputMode,
  className,
}: FieldProps) {
  return (
    <label className={cardClass + " block cursor-text " + (className ?? "")}>
      <div className="flex items-center gap-3">
        {icon && <span aria-hidden>{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className={labelClass}>
            {label}
            {required && <span className="text-bluehour"> *</span>}
          </span>
          <input
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            className={controlClass}
          />
        </span>
      </div>
    </label>
  );
}

// ---- Phone field with a country-code dropdown --------------------------
const countries = [
  { code: "IN", flag: "🇮🇳", name: "India", dial: "+91" },
  { code: "US", flag: "🇺🇸", name: "United States", dial: "+1" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", dial: "+44" },
  { code: "AE", flag: "🇦🇪", name: "UAE", dial: "+971" },
  { code: "CA", flag: "🇨🇦", name: "Canada", dial: "+1" },
  { code: "AU", flag: "🇦🇺", name: "Australia", dial: "+61" },
  { code: "SG", flag: "🇸🇬", name: "Singapore", dial: "+65" },
  { code: "DE", flag: "🇩🇪", name: "Germany", dial: "+49" },
  { code: "FR", flag: "🇫🇷", name: "France", dial: "+33" },
  { code: "JP", flag: "🇯🇵", name: "Japan", dial: "+81" },
] as const;

type Country = (typeof countries)[number];

function PhoneField() {
  const [country, setCountry] = useState<Country>(countries[0]);
  const [number, setNumber] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <Phone className={iconClass} />
          <span className="min-w-0 flex-1">
            <span className={labelClass}>
              Phone
              <span className="text-bluehour"> *</span>
            </span>
            <div className="flex items-center gap-2">
              {/* Country-code trigger */}
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="-ml-0.5 flex shrink-0 items-center gap-1 rounded-md py-0.5 pr-1 text-sm font-semibold text-darkroom transition-colors hover:text-bluehour"
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span className="tabular-nums">{country.dial}</span>
                <ChevronDown
                  className={
                    "size-3.5 text-darkroom/40 transition-transform duration-200 " +
                    (open ? "rotate-180" : "")
                  }
                />
              </button>
              <input
                name="phone"
                type="tel"
                required
                value={number}
                onChange={(e) =>
                  setNumber(e.target.value.replace(/[^\d\s-]/g, ""))
                }
                placeholder="98765 43210"
                autoComplete="tel-national"
                inputMode="tel"
                className={controlClass}
              />
            </div>
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          data-lenis-prevent
          className="status-rise absolute left-0 right-0 top-full z-20 mt-1.5 max-h-52 overflow-y-auto overscroll-contain rounded-xl border-2 border-darkroom/12 bg-overexpose p-1.5 shadow-[0_16px_40px_-12px_rgba(31,26,24,0.35)]"
        >
          {countries.map((c) => {
            const active = c.code === country.code;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setCountry(c);
                    setOpen(false);
                  }}
                  className={
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors " +
                    (active
                      ? "bg-bluehour/10 text-bluehour"
                      : "text-darkroom hover:bg-darkroom/[0.06]")
                  }
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1 truncate font-medium">{c.name}</span>
                  <span className="tabular-nums text-darkroom/50">{c.dial}</span>
                  {active && <Check className="size-4 text-bluehour" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, count, isHydrated, clear } =
    useCart();
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState(
    () => "VHSMO-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  );

  // Email verification against the waitlist ------------------------------
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "verified" | "notfound"
  >("idle");
  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    if (!isEmailFormatValid) {
      setEmailStatus("idle");
      return;
    }
    setEmailStatus("checking");
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
        setEmailStatus(data.exists ? "verified" : "notfound");
      } catch (err) {
        if (!controller.signal.aborted) setEmailStatus("notfound");
      }
    }, 500);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [email, isEmailFormatValid]);

  // Shipping address — autocomplete pre-fills it, all fields stay editable.
  const [address, setAddress] = useState<Address>(emptyAddress);
  const patchAddress = (patch: Partial<Address>) =>
    setAddress((a) => ({ ...a, ...patch }));
  const applySuggestion = (d: AddressDetails) =>
    setAddress((a) => ({
      ...a,
      street: d.street,
      city: d.city,
      state: d.state,
      postalCode: d.postalCode,
      country: d.country,
      latitude: d.latitude,
      longitude: d.longitude,
    }));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (emailStatus !== "verified") return;
    setPlaced(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---- Confirmation state ----------------------------------------------
  if (placed) {
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

  // ---- Empty cart -------------------------------------------------------
  if (isHydrated && items.length === 0) {
    return (
      <div className="paper min-h-dvh">
        <div className="container-px mx-auto flex max-w-2xl flex-col items-center pt-40 pb-32 text-center sm:pt-48">
          <span className="flex size-16 items-center justify-center rounded-full bg-overexpose shadow-[0_1px_2px_rgba(31,26,24,0.08)]">
            <ShoppingBag className="size-7 text-darkroom/50" />
          </span>
          <h1 className="display mt-8 text-[clamp(1.8rem,4vw,2.5rem)] text-darkroom">
            Your cart is empty.
          </h1>
          <p className="mt-4 max-w-sm text-base text-darkroom/60">
            Reserve your VHSMO to lock in the early price, then check out here.
          </p>
          <Link
            href="/product"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-kodak px-7 py-3.5 text-sm font-bold text-darkroom transition-transform hover:scale-[1.02]"
          >
            Reserve yours — {formatCurrency(cameraProduct.price)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="paper min-h-dvh">
      <div className="container-px mx-auto max-w-[90rem] pt-24 sm:pt-28">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="eyebrow flex items-center gap-2 text-darkroom/50"
        >
          <Link href="/" className="transition-colors hover:text-darkroom">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/product" className="transition-colors hover:text-darkroom">
            Reserve
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-darkroom">Checkout</span>
        </nav>

        <div className="mt-6 flex items-end justify-between gap-4">
          <h1 className="display text-[clamp(2rem,5vw,3.25rem)] text-darkroom">
            Checkout
          </h1>
          <Link
            href="/product"
            className="hidden items-center gap-2 text-sm font-semibold text-darkroom/60 transition-colors hover:text-darkroom sm:inline-flex"
          >
            <ArrowLeft className="size-4" /> Back to product
          </Link>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="container-px mx-auto grid max-w-[90rem] gap-10 py-10 lg:grid-cols-[1fr_minmax(360px,26rem)] lg:gap-14 lg:py-14"
      >
        {/* ---------- Left: details ---------- */}
        <div className="space-y-10">
          {/* Contact */}
          <section>
            <SectionHeader  title="Contact" />
            <div className="mt-5 grid items-start gap-3.5 sm:grid-cols-2">
              <div className="relative">
                <label
                  className={
                    cardClass +
                    " block cursor-text " +
                    (emailStatus === "verified"
                      ? "!border-green-500/60 focus-within:!border-green-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(22,163,74,0.5)]"
                      : emailStatus === "notfound"
                        ? "!border-red-400/60 focus-within:!border-red-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(239,68,68,0.5)]"
                        : "")
                  }
                >
                  <div className="flex items-center gap-3">
                    <span aria-hidden>
                      <Mail className={iconClass} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={labelClass}>
                        Email
                        <span className="text-bluehour"> *</span>
                      </span>
                      <input
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        autoComplete="email"
                        inputMode="email"
                        className={controlClass}
                      />
                    </span>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {emailStatus === "checking" && (
                        <Loader2 className="h-4 w-4 animate-spin text-darkroom/40" />
                      )}
                      {emailStatus === "verified" && (
                        <CheckCircle2
                          key="ok"
                          className="status-pop h-4 w-4 text-green-600"
                        />
                      )}
                      {emailStatus === "notfound" && (
                        <XCircle
                          key="no"
                          className="status-pop h-4 w-4 text-red-500"
                        />
                      )}
                    </span>
                  </div>
                </label>
                {/* Absolutely positioned so it never resizes the grid cell. */}
                {emailStatus !== "idle" && (
                  <p
                    key={emailStatus}
                    className={
                      "status-rise absolute left-1 top-full mt-1.5 text-xs font-semibold " +
                      (emailStatus === "checking"
                        ? "font-medium text-darkroom/45"
                        : emailStatus === "verified"
                          ? "text-green-600"
                          : "text-red-500")
                    }
                  >
                    {emailStatus === "checking" && "Checking waitlist…"}
                    {emailStatus === "verified" &&
                      "Verified — you're on the waitlist."}
                    {emailStatus === "notfound" &&
                      "This email isn't on the waitlist yet."}
                  </p>
                )}
              </div>
              <PhoneField />
            </div>
          </section>

          {/* Shipping address */}
          <section>
            <SectionHeader title="Shipping address" />
            <div className="mt-5 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="firstName"
                  label="First name"
                  placeholder="Jane"
                  required
                  autoComplete="given-name"
                  icon={<User className={iconClass} />}
                />
                <Field
                  name="lastName"
                  label="Last name"
                  placeholder="Doe"
                  required
                  autoComplete="family-name"
                  icon={<User className={iconClass} />}
                />
              </div>

              <AddressAutocomplete onSelect={applySuggestion} />

              <AddressFields address={address} onChange={patchAddress} />
            </div>
          </section>

          {/* Payment note — it's a refundable reservation */}
          {/* <section>
            <SectionHeader n={3} title="Payment" />
            <div className="mt-5 flex items-start gap-3 rounded-xl border-2 border-dashed border-darkroom/15 bg-kodak/[0.08] px-5 py-4">
              <Lock className="mt-0.5 size-4 shrink-0 text-darkroom/60" />
              <p className="text-sm leading-relaxed text-darkroom/75">
                <span className="font-semibold text-darkroom">
                  Nothing is charged today.
                </span>{" "}
                This reserves your VHSMO at the early price. We collect payment
                only when your camera ships — and it&apos;s fully refundable until
                then.
              </p>
            </div>
          </section> */}
        </div>

        {/* ---------- Right: order summary ---------- */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-2xl border-2 border-darkroom/12 bg-overexpose p-6 shadow-[0_10px_40px_-24px_rgba(31,26,24,0.4)]">
            <div className="flex items-center justify-between border-b border-darkroom/10 pb-4">
              <h2 className="text-lg font-bold text-darkroom">
                Order summary
              </h2>
              <span className="flex items-center gap-1.5 text-sm text-darkroom/55">
                <ShoppingBag className="size-4" />
                {count}
              </span>
            </div>

            {/* Items */}
            <ul className="divide-y divide-darkroom/10">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.variant ?? ""}`}
                  className="flex gap-3.5 py-4"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-halide">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-darkroom text-[0.65rem] font-bold text-halide">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-semibold leading-snug text-darkroom">
                      {item.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-darkroom/55">{item.variant}</p>
                    )}
                  </div>
                  <span className="self-center text-sm font-semibold tabular-nums text-darkroom">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="space-y-2 border-t border-darkroom/10 pt-4 text-sm">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatCurrency(shipping)}
              />
              <Row
                label="Tax"
                value={tax === 0 ? "Calculated at shipping" : formatCurrency(tax)}
                muted
              />
              <div className="my-3 h-px bg-darkroom/12" />
              <div className="flex items-center justify-between text-base font-bold text-darkroom">
                <span>Due today</span>
                <span className="tabular-nums">{formatCurrency(0)}</span>
              </div>
              <p className="text-xs text-darkroom/50">
                {formatCurrency(total)} charged when your camera ships.
              </p>
            </div>

            {/* Checkout button */}
            <button
              type="submit"
              disabled={emailStatus !== "verified"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-bluehour px-8 py-4 text-base font-bold tracking-tight text-overexpose transition-all duration-300 ease-[var(--ease-out-expo)] hover:shadow-[0_0_0_5px_rgba(16,147,255,0.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:shadow-none disabled:active:scale-100"
            >
              <Lock className="size-4" />
              {emailStatus === "verified"
                ? "Place reservation"
                : "Verify email to continue"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-darkroom/55">
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5" /> Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="size-3.5" /> Free shipping
              </span>
            </div>
          </div>
        </aside>
      </form>

      {/* Colophon */}
      <div className="container-px mx-auto max-w-[90rem] pb-16">
        <div className="eyebrow flex justify-between border-t border-darkroom/15 pt-5 text-darkroom/45">
          <span>VHSMO — checkout</span>
          <span>{YEAR_MARK}</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: {title: string }) {
  return (
    <div className="flex items-center gap-3">
   
      <h2 className="text-lg font-bold text-darkroom">{title}</h2>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-darkroom/60">{label}</span>
      <span
        className={
          muted ? "text-xs text-darkroom/50" : "tabular-nums text-darkroom"
        }
      >
        {value}
      </span>
    </div>
  );
}
