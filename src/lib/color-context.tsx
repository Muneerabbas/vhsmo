"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { variantFor, type ProductVariant } from "@/lib/products";
import { useProducts } from "@/lib/products-context";

interface ColorContextValue {
  /** The selected row's id, or "" when the table has nothing to sell. */
  color: string;
  setColor: (id: string) => void;
  /** Every active finish from Supabase, in swatch order. */
  variants: ProductVariant[];
  /** The selected finish, or undefined when there is nothing to sell. */
  variant: ProductVariant | undefined;
}

const ColorContext = createContext<ColorContextValue | null>(null);

/**
 * Holds the selected body colour for the reserve section. The swatch row lives
 * in the purchase panel but the photo gallery sits in the other column, so the
 * choice has to be shared rather than owned by either one.
 *
 * The finishes themselves are the Supabase rows - the first one still in stock
 * opens selected, so nobody lands on a sold-out colour.
 */
export function ColorProvider({ children }: { children: React.ReactNode }) {
  const variants = useProducts();
  const initial = variants.find((v) => v.stock > 0) ?? variants[0];
  const [color, setColor] = useState<string>(initial?.id ?? "");
  const value = useMemo(
    () => ({
      color,
      setColor,
      variants,
      variant: variantFor(variants, color),
    }),
    [color, variants],
  );
  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
}

export function useColor() {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error("useColor must be used inside a ColorProvider");
  return ctx;
}
