"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { emptyAddress, type Address } from "@/components/address/types";
import {
  CHECKOUT_FIELDS,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
} from "@/lib/checkout-validation";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { ContactSection } from "@/components/checkout/ContactSection";
import { EmptyCart } from "@/components/checkout/EmptyCart";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ShippingSection } from "@/components/checkout/ShippingSection";
import { DeliveryBanner } from "@/components/checkout/DeliveryBanner";
import { useEmailVerification } from "@/components/checkout/useEmailVerification";

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, count, isHydrated, clear } =
    useCart();

  // Email verification against the waitlist.
  const { email, setEmail, status: emailStatus } = useEmailVerification();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Shipping address — entered manually, every field editable.
  const [address, setAddress] = useState<Address>(emptyAddress);
  const patchAddress = (patch: Partial<Address>) =>
    setAddress((a) => ({ ...a, ...patch }));

  // Validation — a field's error only shows once it's been touched or the
  // user has attempted checkout.
  const [touched, setTouched] = useState<Set<CheckoutField>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const values = useMemo(
    () => ({ email, phone, firstName, lastName, address }),
    [email, phone, firstName, lastName, address],
  );
  const errors = useMemo(() => validateCheckout(values), [values]);

  const visibleErrors = useMemo<CheckoutErrors>(() => {
    const out: CheckoutErrors = {};
    for (const field of CHECKOUT_FIELDS) {
      if ((submitted || touched.has(field)) && errors[field]) {
        out[field] = errors[field];
      }
    }
    return out;
  }, [errors, touched, submitted]);

  const handleBlur = (field: CheckoutField) =>
    setTouched((t) => new Set(t).add(field));

  /** Called by the checkout button. Reveals errors and reports readiness. */
  const attemptCheckout = () => {
    setSubmitted(true);
    return Object.keys(errors).length === 0 && emailStatus === "verified";
  };

  // The form only guards against accidental Enter-key submits.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  if (isHydrated && items.length === 0) {
    return (
      <div className="paper flex min-h-dvh flex-col">
        <CheckoutHeader />
        <div className="flex-1">
          <EmptyCart />
        </div>
        <CheckoutFooter />
      </div>
    );
  }

  return (
    <div className="paper flex min-h-dvh flex-col">
      <CheckoutHeader />

      <form
        onSubmit={onSubmit}
        className="container-px mx-auto grid w-full max-w-[90rem] flex-1 gap-10 py-10 lg:grid-cols-[1fr_minmax(360px,26rem)] lg:gap-14 lg:py-12"
      >
        {/* ---------- Left: details ---------- */}
        <div className="space-y-9">
          <ContactSection
            email={email}
            phone={phone}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            emailStatus={emailStatus}
            errors={visibleErrors}
            onBlurField={handleBlur}
          />
          <ShippingSection
            address={address}
            onChange={patchAddress}
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            errors={visibleErrors}
            onBlurField={handleBlur}
          />
        </div>

        {/* ---------- Right: order summary ---------- */}
        <OrderSummary
          items={items}
          count={count}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={1}
          emailStatus={emailStatus}
          canCheckout={Object.keys(errors).length === 0 && emailStatus === "verified"}
          onAttemptCheckout={attemptCheckout}
          customer={{ firstName, lastName, email, phone }}
          address={address}
          onSuccess={clear}
        />
      </form>

      <CheckoutFooter />
    </div>
  );
}
