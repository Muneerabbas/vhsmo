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
  country: "",
};
