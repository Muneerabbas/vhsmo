import { User } from "lucide-react";
import { AddressAutocomplete } from "@/components/address/AddressAutocomplete";
import { AddressFields } from "@/components/address/AddressFields";
import type { Address, AddressDetails } from "@/components/address/types";
import { Field } from "./Field";
import { SectionHeader } from "./SectionHeader";
import { iconClass } from "./styles";

type ShippingSectionProps = {
  address: Address;
  onChange: (patch: Partial<Address>) => void;
  onSelectSuggestion: (details: AddressDetails) => void;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
};

export function ShippingSection({
  address,
  onChange,
  onSelectSuggestion,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: ShippingSectionProps) {
  return (
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
            value={firstName}
            onChange={onFirstNameChange}
          />
          <Field
            name="lastName"
            label="Last name"
            placeholder="Doe"
            required
            autoComplete="family-name"
            icon={<User className={iconClass} />}
            value={lastName}
            onChange={onLastNameChange}
          />
        </div>

        <AddressAutocomplete onSelect={onSelectSuggestion} />

        <AddressFields address={address} onChange={onChange} />
      </div>
    </section>
  );
}
