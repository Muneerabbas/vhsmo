"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart, type CartItem } from "@/lib/cart-context";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  item: Omit<CartItem, "quantity">;
  quantity?: number;
  children: React.ReactNode;
}

export function AddToCartButton({
  item,
  quantity = 1,
  children,
  ...props
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  return (
    <Button onClick={() => addItem(item, quantity)} {...props}>
      {children}
    </Button>
  );
}
