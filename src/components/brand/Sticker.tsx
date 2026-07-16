import { cn } from "@/lib/utils";

type StickerProps = {
  children: React.ReactNode;
  /** Rotation in degrees — pass a seeded value, never uniform. */
  rotate?: number;
  variant?: "kodak" | "bluehour" | "paper" | "darkroom";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const variantClasses: Record<NonNullable<StickerProps["variant"]>, string> = {
  kodak: "bg-kodak text-darkroom",
  bluehour: "bg-bluehour text-overexpose",
  paper: "bg-halide text-darkroom",
  darkroom: "bg-darkroom text-kodak",
};

const sizeClasses: Record<NonNullable<StickerProps["size"]>, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-1.5 text-base sm:text-lg",
  lg: "px-6 py-2.5 text-xl sm:text-2xl",
};

/**
 * A slapped-on brand sticker — Kids Word lettering, ragged edges,
 * cast shadow, wiggles when touched. The brand's graffiti mark.
 */
export function Sticker({
  children,
  rotate = -3,
  variant = "kodak",
  size = "md",
  className,
}: StickerProps) {
  return (
    <span
      className={cn(
        "font-marker edge-torn hover-wiggle inline-block whitespace-nowrap leading-tight shadow-[0.2rem_0.35rem_0_rgba(31,26,24,0.35)]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      style={{ rotate: `${rotate}deg` }}
    >
      {children}
    </span>
  );
}

/**
 * Circular starburst seal — the PDF's "Strategic Message" badge.
 * Text sits centered inside a serrated disc.
 */
export function StarburstSeal({
  children,
  rotate = 0,
  className,
}: {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex aspect-square items-center justify-center",
        className,
      )}
      style={{ rotate: `${rotate}deg` }}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 h-full w-full fill-kodak drop-shadow-[0.2rem_0.3rem_0_rgba(31,26,24,0.35)]"
      >
        <path
          d={Array.from({ length: 48 }, (_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            const r = i % 2 === 0 ? 50 : 46;
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
          }).join(" ") + " Z"}
        />
      </svg>
      <span className="font-marker relative z-10 max-w-[70%] text-center leading-tight text-darkroom">
        {children}
      </span>
    </span>
  );
}
