import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 ease-[var(--ease-out-expo)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-canvas hover:bg-[#000] shadow-[0_1px_2px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)]",
        accent:
          "bg-accent text-ink hover:bg-accent-strong hover:text-canvas shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(182,154,106,0.35)]",
        outline:
          "border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
        ghost: "bg-transparent text-ink hover:bg-ink/[0.05]",
        light:
          "bg-canvas/90 text-ink backdrop-blur hover:bg-canvas border border-white/40",
      },
      size: {
        sm: "h-10 rounded-full px-5 text-sm",
        md: "h-12 rounded-full px-7 text-[0.95rem]",
        lg: "h-14 rounded-full px-9 text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
