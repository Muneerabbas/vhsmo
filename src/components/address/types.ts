/** Shipping address the checkout form holds - entered manually. */
export interface Address {
  apartment: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const emptyAddress: Address = {
  apartment: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  // The store only ships to India - the checkout locks the field to match.
  country: "India",
};
