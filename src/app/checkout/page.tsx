"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { YEAR_MARK } from "@/lib/landing";
import {
  emptyAddress,
  type Address,
  type AddressDetails,
} from "@/components/address/types";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { ContactSection } from "@/components/checkout/ContactSection";
import { EmptyCart } from "@/components/checkout/EmptyCart";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ShippingSection } from "@/components/checkout/ShippingSection";
import { useEmailVerification } from "@/components/checkout/useEmailVerification";

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, count, isHydrated, clear } =
    useCart();

  // Email verification against the waitlist.
  const { email, setEmail, status: emailStatus } = useEmailVerification();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

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

  // The checkout button drives the Razorpay flow directly, so the form only
  // needs to guard against accidental submits (e.g. Enter key in a field).
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  if (isHydrated && items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="paper min-h-dvh">
      <CheckoutHeader />

      <form
        onSubmit={onSubmit}
        className="container-px mx-auto grid max-w-[90rem] gap-10 py-10 lg:grid-cols-[1fr_minmax(360px,26rem)] lg:gap-14 lg:py-14"
      >
        {/* ---------- Left: details ---------- */}
        <div className="space-y-10">
          <ContactSection
            email={email}
            phone={phone}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            emailStatus={emailStatus}
          />
          <ShippingSection
            address={address}
            onChange={patchAddress}
            onSelectSuggestion={applySuggestion}
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
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
          customer={{
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
          }}
          address={address}
          onSuccess={clear}
        />
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
