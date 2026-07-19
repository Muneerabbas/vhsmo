import type { Address } from "@/components/address/types";

/** All fields the checkout form validates. */
export type CheckoutField =
  | "email"
  | "phone"
  | "firstName"
  | "lastName"
  | "street"
  | "city"
  | "state"
  | "postalCode"
  | "country";

export type CheckoutValues = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: Address;
};

/** Partial map of field → error message. Absent key = valid. */
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Digits only, for length checks on phone / PIN. */
export function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

function name(label: string, value: string): string | undefined {
  const v = value.trim();
  if (!v) return `${label} is required.`;
  if (v.length < 2) return `${label} looks too short.`;
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(v)) return `${label} has invalid characters.`;
  return undefined;
}

/** Validate a single field. Returns an error string, or undefined when valid. */
export function validateField(
  field: CheckoutField,
  values: CheckoutValues,
): string | undefined {
  const { address } = values;
  switch (field) {
    case "email": {
      const v = values.email.trim();
      if (!v) return "Email is required.";
      if (!EMAIL_RE.test(v)) return "Enter a valid email address.";
      return undefined;
    }
    case "phone": {
      const d = digitsOf(values.phone);
      if (!d) return "Phone number is required.";
      if (d.length < 7 || d.length > 15) return "Enter a valid phone number.";
      return undefined;
    }
    case "firstName":
      return name("First name", values.firstName);
    case "lastName":
      return name("Last name", values.lastName);
    case "street": {
      const v = address.street.trim();
      if (!v) return "Street address is required.";
      if (v.length < 4) return "Enter your full street address.";
      return undefined;
    }
    case "city":
      return address.city.trim() ? undefined : "City is required.";
    case "state":
      return address.state.trim() ? undefined : "State is required.";
    case "postalCode": {
      const v = address.postalCode.trim();
      if (!v) return "PIN code is required.";
      if (!/^\d{4,10}$/.test(digitsOf(v))) return "Enter a valid PIN code.";
      return undefined;
    }
    case "country":
      return address.country.trim() ? undefined : "Country is required.";
    default:
      return undefined;
  }
}

/** Every field the form requires, in display order. */
export const CHECKOUT_FIELDS: CheckoutField[] = [
  "email",
  "phone",
  "firstName",
  "lastName",
  "street",
  "city",
  "state",
  "postalCode",
  "country",
];

/** Validate the whole form. Returns a map of only the fields with errors. */
export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const field of CHECKOUT_FIELDS) {
    const err = validateField(field, values);
    if (err) errors[field] = err;
  }
  return errors;
}
