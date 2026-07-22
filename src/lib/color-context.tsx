"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { colorVariants, variantFor, type ColorVariant } from "@/lib/products";

interface ColorContextValue {
  color: string;
  setColor: (id: string) => void;
  variant: ColorVariant;
}

const ColorContext = createContext<ColorContextValue | null>(null);

/**
 * Holds the selected body colour for the reserve section. The swatch row lives
 * in the purchase panel but the photo gallery sits in the other column, so the
 * choice has to be shared rather than owned by either one.
 */
export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<string>(colorVariants[0]!.id);
  const value = useMemo(
    () => ({ color, setColor, variant: variantFor(color) }),
    [color],
  );
  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
}

export function useColor() {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error("useColor must be used inside a ColorProvider");
  return ctx;
}
