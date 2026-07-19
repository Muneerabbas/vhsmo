import {
  Building2,
  Globe,
  Hash,
  Home,
  Landmark,
  MapPin,
  User,
} from "lucide-react";
import type { Address } from "@/components/address/types";
import type { CheckoutErrors, CheckoutField } from "@/lib/checkout-validation";
import { Field } from "./Field";
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

type AddressFieldDef = {
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
  const addressFields: AddressFieldDef[] = [
    {
      key: "street",
      label: "Street address",
      placeholder: "Airport Road",
      required: true,
      autoComplete: "address-line1",
      icon: <MapPin className={iconClass} />,
      span2: true,
    },
    {
      key: "apartment",
      label: "Apartment, flat, landmark (optional)",
      placeholder: "Flat 4B, near the park",
      autoComplete: "address-line2",
      icon: <Building2 className={iconClass} />,
      span2: true,
    },
    {
      key: "city",
      label: "City",
      placeholder: "Pune",
      required: true,
      autoComplete: "address-level2",
      icon: <Home className={iconClass} />,
    },
    {
      key: "state",
      label: "State",
      placeholder: "Maharashtra",
      required: true,
      autoComplete: "address-level1",
      icon: <Landmark className={iconClass} />,
    },
    {
      key: "postalCode",
      label: "PIN code",
      placeholder: "411032",
      required: true,
      autoComplete: "postal-code",
      inputMode: "numeric",
      maxLength: 10,
      icon: <Hash className={iconClass} />,
    },
    {
      key: "country",
      label: "Country",
      placeholder: "India",
      required: true,
      autoComplete: "country-name",
      icon: <Globe className={iconClass} />,
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
            icon={<User className={iconClass} />}
            value={lastName}
            error={errors.lastName}
            onChange={onLastNameChange}
            onBlur={() => onBlurField("lastName")}
          />
        </div>

        <div className="grid items-start gap-3.5 sm:grid-cols-2">
          {addressFields.map((f) => (
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
        </div>
      </div>
    </section>
  );
}
