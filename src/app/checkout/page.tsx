"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { cameraProduct } from "@/lib/products";
import { YEAR_MARK } from "@/lib/landing";

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

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, count, isHydrated, clear } =
    useCart();
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState(
    () => "VHSMO-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
            <SectionHeader n={1} title="Contact" />
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <Field
                name="email"
                label="Email"
                type="email"
                placeholder="you@gmail.com"
                required
                autoComplete="email"
                inputMode="email"
                icon={<Mail className={iconClass} />}
              />
              <Field
                name="phone"
                label="Phone"
                type="tel"
                placeholder="+91 ·····"
                required
                autoComplete="tel"
                inputMode="tel"
                icon={<Phone className={iconClass} />}
              />
            </div>
          </section>

          {/* Shipping address */}
          <section>
            <SectionHeader n={2} title="Shipping address" />
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
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
              <Field
                name="address1"
                label="Address"
                placeholder="Flat / House no., street"
                required
                autoComplete="address-line1"
                className="sm:col-span-2"
                icon={<MapPin className={iconClass} />}
              />
              <Field
                name="address2"
                label="Apartment, landmark (optional)"
                placeholder="Near…"
                autoComplete="address-line2"
                className="sm:col-span-2"
              />
              <Field
                name="city"
                label="City"
                placeholder="Mumbai"
                required
                autoComplete="address-level2"
              />
              <Field
                name="state"
                label="State"
                placeholder="Maharashtra"
                required
                autoComplete="address-level1"
              />
              <Field
                name="pincode"
                label="PIN code"
                placeholder="400001"
                required
                autoComplete="postal-code"
                inputMode="numeric"
              />
              <Field
                name="country"
                label="Country"
                placeholder="India"
                required
                autoComplete="country-name"
              />
            </div>
          </section>

          {/* Payment note — it's a refundable reservation */}
          <section>
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
          </section>
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
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-bluehour px-8 py-4 text-base font-bold tracking-tight text-overexpose transition-all duration-300 ease-[var(--ease-out-expo)] hover:shadow-[0_0_0_5px_rgba(16,147,255,0.25)] active:scale-[0.98]"
            >
              <Lock className="size-4" />
              Place reservation
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

function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-marker flex size-7 items-center justify-center rounded-full bg-darkroom text-sm text-kodak">
        {n}
      </span>
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
