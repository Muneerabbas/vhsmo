"use client";

import { Building2, Home, Landmark, MapPin, Globe, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldCard, fieldControl, fieldIcon, fieldLabel } from "./styles";
import type { Address } from "./types";

type AddressFieldsProps = {
  address: Address;
  /** Patch local state — every field is freely editable. */
  onChange: (patch: Partial<Address>) => void;
  className?: string;
};

type EditableKey = Exclude<keyof Address, "latitude" | "longitude">;

type FieldDef = {
  key: EditableKey;
  label: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "numeric";
  icon: React.ReactNode;
  span2?: boolean;
};

/**
 * The address, as editable fields. These are controlled by the parent's
 * `address` state — autocomplete pre-fills them, and the user can override
 * any of them without affecting the search.
 */
export function AddressFields({ address, onChange, className }: AddressFieldsProps) {
  const fields: FieldDef[] = [
    {
      key: "street",
      label: "Street address",
      placeholder: "Airport Road",
      required: true,
      autoComplete: "address-line1",
      icon: <MapPin className={fieldIcon} />,
      span2: true,
    },
    {
      key: "apartment",
      label: "Apartment / Flat / Landmark",
      placeholder: "Flat 4B, near the park (optional)",
      autoComplete: "address-line2",
      icon: <Building2 className={fieldIcon} />,
      span2: true,
    },
    {
      key: "city",
      label: "City",
      placeholder: "Pune",
      required: true,
      autoComplete: "address-level2",
      icon: <Home className={fieldIcon} />,
    },
    {
      key: "state",
      label: "State",
      placeholder: "Maharashtra",
      required: true,
      autoComplete: "address-level1",
      icon: <Landmark className={fieldIcon} />,
    },
    {
      key: "postalCode",
      label: "PIN code",
      placeholder: "411032",
      required: true,
      autoComplete: "postal-code",
      inputMode: "numeric",
      icon: <Hash className={fieldIcon} />,
    },
    {
      key: "country",
      label: "Country",
      placeholder: "India",
      required: true,
      autoComplete: "country-name",
      icon: <Globe className={fieldIcon} />,
    },
  ];

  return (
    <div className={cn("grid gap-3.5 sm:grid-cols-2", className)}>
      {fields.map((f) => (
        <label
          key={f.key}
          className={cn(fieldCard, "block cursor-text", f.span2 && "sm:col-span-2")}
        >
          <div className="flex items-center gap-3">
            <span aria-hidden>{f.icon}</span>
            <span className="min-w-0 flex-1">
              <span className={fieldLabel}>
                {f.label}
                {f.required && <span className="text-bluehour"> *</span>}
              </span>
              <input
                name={f.key}
                type="text"
                required={f.required}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                inputMode={f.inputMode}
                value={address[f.key]}
                onChange={(e) => onChange({ [f.key]: e.target.value })}
                className={fieldControl}
              />
            </span>
          </div>
        </label>
      ))}
    </div>
  );
}
