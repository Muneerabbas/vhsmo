/** Shared address types for the autocomplete + editable fields. */

/** A single suggestion row returned by /api/address/autocomplete. */
export interface AddressSuggestionItem {
  id: string;
  title: string;
  subtitle: string;
}

/** Structured details returned by /api/address/details. */
export interface AddressDetails {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedAddress: string;
  latitude: number | null;
  longitude: number | null;
}

/** The editable address the form holds. Autocomplete only pre-fills it —
 *  every field stays user-editable afterward. */
export interface Address {
  apartment: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}



export const emptyAddress: Address = {
  apartment: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  latitude: null,
  longitude: null,
};
