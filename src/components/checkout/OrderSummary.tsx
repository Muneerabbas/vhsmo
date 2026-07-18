import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShoppingBag, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/lib/cart-context";
import type { Address } from "@/components/address/types";
import type { EmailStatus } from "./useEmailVerification";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type OrderSummaryProps = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  emailStatus: EmailStatus;

  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: Address;
  onSuccess: () => void;
};
export function OrderSummary({
  items,
  count,
  subtotal,
  shipping,
  tax,
  total,
  emailStatus,
  customer,
  address,
  onSuccess,
}: OrderSummaryProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCheckout = async () => {
    if (processing) return;
    setProcessing(true);

    // Read straight from the form so browser-autofilled values are captured
    // even when they don't fire React's onChange. Fall back to React state.
    const form = buttonRef.current?.form;
    const fd = form ? new FormData(form) : null;
    const fromForm = (name: string) => (fd?.get(name)?.toString() ?? "").trim();

    const firstName = fromForm("firstName") || customer.firstName;
    const lastName = fromForm("lastName") || customer.lastName;
    const fullName = `${firstName} ${lastName}`.trim();

    const shippingInfo = {
      address1: fromForm("street") || address.street,
      address2: fromForm("apartment") || address.apartment,
      city: fromForm("city") || address.city,
      state: fromForm("state") || address.state,
      country: fromForm("country") || address.country,
      postalCode: fromForm("postalCode") || address.postalCode,
    };

    try {
      const res = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Razorpay uses paise
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,

        name: "VHSMO",
        description: "VHSMO Camera Preorder",

        order_id: order.id,

        prefill: {
          name: fullName,
          email: customer.email,
          contact: customer.phone,
        },

        theme: {
          color: "#111111",
        },

        modal: {
          ondismiss: () => setProcessing(false),
        },

        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await fetch("/api/verifyPayment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                payment: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },

                customer: {
                  name: fullName,
                  email: customer.email,
                  phone: customer.phone,
                },

                shipping: shippingInfo,

                amount: total,
              }),
            });

            const result = await verifyRes.json();

            if (verifyRes.ok && result.success) {
              onSuccess();
              router.push(
                `/checkout/success?order=${encodeURIComponent(
                  response.razorpay_order_id,
                )}&payment=${encodeURIComponent(response.razorpay_payment_id)}`,
              );
            }
          } catch (err) {
            // Payment failures are surfaced by Razorpay's own UI; nothing to do.
            console.error(err);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit">
      <div className="rounded-2xl border-2 border-darkroom/12 bg-overexpose p-6 shadow-[0_10px_40px_-24px_rgba(31,26,24,0.4)]">
        <div className="flex items-center justify-between border-b border-darkroom/10 pb-4">
          <h2 className="text-lg font-bold text-darkroom">Order summary</h2>
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
          <div className="my-3 h-px bg-darkroom/12" />
          <div className="flex items-center justify-between text-base font-bold text-darkroom">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
          <p className="text-xs text-darkroom/50">Inclusive of all taxes.</p>
        </div>

        {/* Checkout button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleCheckout}
          disabled={emailStatus !== "verified" || processing}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-bluehour px-8 py-4 text-base font-bold tracking-tight text-overexpose transition-all duration-300 ease-[var(--ease-out-expo)] hover:shadow-[0_0_0_5px_rgba(16,147,255,0.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:shadow-none disabled:active:scale-100"
        >
          {processing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock className="size-4" />
              {emailStatus === "verified"
                ? "Checkout"
                : "Verify email to continue"}
            </>
          )}
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
