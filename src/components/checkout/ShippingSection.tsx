import { useEffect, useMemo, useState } from "react";
import { City, Country, State } from "country-state-city";
import { Building2, Globe, Hash, Home, Landmark, MapPin, User } from "lucide-react";
import type { Address } from "@/components/address/types";
import type { CheckoutErrors, CheckoutField } from "@/lib/checkout-validation";
import { Field } from "./Field";
import { LocationSelect, type LocationOption } from "./LocationSelect";
import { SectionHeader } from "./SectionHeader";
import { iconClass } from "./styles";

type AddressKey = keyof Address;

type ShippingSectionProps = {
  address: Address;
  onChange: (patch: Partial<Address>) => void;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  errors: CheckoutErrors;
  onBlurField: (field: CheckoutField) => void;
};

type TextFieldDef = {
  key: AddressKey;
  label: string;
  placeholder: string;
  required?: boolean;
  autoComplete: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  icon: React.ReactNode;
  span2?: boolean;
};

export function ShippingSection({
  address,
  onChange,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  errors,
  onBlurField,
}: ShippingSectionProps) {
  // Country is locked to India - its ISO seeds the dependent state/city lists.
  const [countryIso] = useState("IN");
  const [stateIso, setStateIso] = useState("");

  // Ensure the submitted address always carries the locked country name.
  // Runs on every drift, not just mount: the persisted-address hydration can
  // land after mount and bring back an empty country from an old session.
  useEffect(() => {
    if (address.country !== "India") onChange({ country: "India" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.country]);

  // Load all countries once.
  const countries = useMemo<LocationOption[]>(
    () =>
      Country.getAllCountries().map((c) => ({
        name: c.name,
        isoCode: c.isoCode,
      })),
    [],
  );

  // States load only after a country is picked.
  const states = useMemo<LocationOption[]>(
    () =>
      countryIso
        ? State.getStatesOfCountry(countryIso).map((s) => ({
            name: s.name,
            isoCode: s.isoCode,
          }))
        : [],
    [countryIso],
  );

  // Cities load only after a state is picked.
  const cities = useMemo<LocationOption[]>(
    () =>
      countryIso && stateIso
        ? City.getCitiesOfState(countryIso, stateIso).map((c) => ({
            name: c.name,
            isoCode: c.name,
          }))
        : [],
    [countryIso, stateIso],
  );

  const handleState = (option: LocationOption) => {
    setStateIso(option.isoCode);
    // New state → drop the stale city.
    onChange({ state: option.name, city: "" });
  };

  const handleCity = (option: LocationOption) => {
    onChange({ city: option.name });
  };

  const textFields: TextFieldDef[] = [
    {
      key: "street",
      label: "Street address",
      placeholder: "Airport Road",
      required: true,
      autoComplete: "address-line1",
      maxLength: 120,
      icon: <MapPin className={iconClass} />,
      span2: true,
    },
    {
      key: "apartment",
      label: "Apartment, flat, landmark (optional)",
      placeholder: "Flat 4B, near the park",
      autoComplete: "address-line2",
      maxLength: 120,
      icon: <Building2 className={iconClass} />,
      span2: true,
    },
  ];

  return (
    <section>
      <SectionHeader
        title="Shipping address"
        subtitle="Where should we deliver your VHSMO Camera?"
      />
      <div className="mt-5 space-y-3.5">
        <div className="grid items-start gap-3.5 sm:grid-cols-2">
          <Field
            name="firstName"
            label="First name"
            placeholder="Jane"
            required
            autoComplete="given-name"
            maxLength={50}
            icon={<User className={iconClass} />}
            value={firstName}
            error={errors.firstName}
            onChange={onFirstNameChange}
            onBlur={() => onBlurField("firstName")}
          />
          <Field
            name="lastName"
            label="Last name"
            placeholder="Doe"
            required
            autoComplete="family-name"
            maxLength={50}
            icon={<User className={iconClass} />}
            value={lastName}
            error={errors.lastName}
            onChange={onLastNameChange}
            onBlur={() => onBlurField("lastName")}
          />
        </div>

        <div className="grid items-start gap-3.5 sm:grid-cols-2">
          {textFields.map((f) => (
            <Field
              key={f.key}
              name={f.key}
              label={f.label}
              placeholder={f.placeholder}
              required={f.required}
              autoComplete={f.autoComplete}
              inputMode={f.inputMode}
              maxLength={f.maxLength}
              icon={f.icon}
              className={f.span2 ? "sm:col-span-2" : undefined}
              value={address[f.key]}
              error={
                f.key === "apartment"
                  ? undefined
                  : errors[f.key as CheckoutField]
              }
              onChange={(value) => onChange({ [f.key]: value })}
              onBlur={
                f.key === "apartment"
                  ? undefined
                  : () => onBlurField(f.key as CheckoutField)
              }
            />
          ))}

          {/* Cascading location: Country → State → City. */}
          <LocationSelect
            label="Country"
            placeholder="Select Country"
            required
            disabled
            icon={<Globe className={iconClass} />}
            value={address.country}
            options={countries}
            onSelect={() => {}}
            error={errors.country}
          />
          <LocationSelect
            label="State / Province"
            placeholder="Select State"
            required
            disabled={!countryIso}
            icon={<Landmark className={iconClass} />}
            value={address.state}
            options={states}
            onSelect={handleState}
            onBlur={() => onBlurField("state")}
            error={errors.state}
            emptyMessage="No states available for this country."
          />
          <LocationSelect
            label="City"
            placeholder="Select City"
            required
            disabled={!stateIso}
            icon={<Home className={iconClass} />}
            value={address.city}
            options={cities}
            onSelect={handleCity}
            onBlur={() => onBlurField("city")}
            error={errors.city}
            emptyMessage="No cities available for this state."
          />

          <Field
            name="postalCode"
            label="PIN code"
            placeholder="411032"
            required
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={10}
            icon={<Hash className={iconClass} />}
            value={address.postalCode}
            error={errors.postalCode}
            onChange={(value) => onChange({ postalCode: value })}
            onBlur={() => onBlurField("postalCode")}
          />
        </div>
      </div>
    </section>
  );
}
