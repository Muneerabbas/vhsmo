"use client";

import { createContext, useContext } from "react";
import type { ProductVariant } from "@/lib/products";

const ProductsContext = createContext<ProductVariant[]>([]);

/**
 * Carries the Supabase `products` rows the layout fetched on the server down
 * to the client components that sell them - the purchase panel, the header's
 * reserve button, the empty cart. One fetch per render, one source of truth
 * for name, colour, price and stock.
 */
export function ProductsProvider({
  products,
  children,
}: {
  products: ProductVariant[];
  children: React.ReactNode;
}) {
  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
}

/** Every active finish, in swatch order. Empty if the table couldn't load. */
export function useProducts() {
  return useContext(ProductsContext);
}

/** The finish that stands in for the product outside the gallery: the first
 *  one still in stock, or the first one at all. */
export function useDefaultProduct(): ProductVariant | undefined {
  const products = useProducts();
  return products.find((p) => p.stock > 0) ?? products[0];
}
