import { cn } from "@/lib/utils";

type MarqueeProps = {
  text: string;
  /** Seconds for one loop. */
  duration?: number;
  reverse?: boolean;
  variant?: "kodak" | "darkroom" | "ghost";
  className?: string;
};

const variantClasses: Record<NonNullable<MarqueeProps["variant"]>, string> = {
  kodak: "bg-kodak text-darkroom",
  darkroom: "bg-darkroom text-kodak",
  ghost: "bg-transparent text-current opacity-40",
};

/**
 * Infinite strip of running microtext — the PDF's "now rolling" bands.
 * Pure CSS animation; pauses for prefers-reduced-motion.
 */
export function Marquee({
  text,
  duration = 28,
  reverse = false,
  variant = "kodak",
  className,
}: MarqueeProps) {
  const items = Array.from({ length: 14 }, () => text);

  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden whitespace-nowrap py-2",
        variantClasses[variant],
        className,
      )}
    >
      <div
        className="marquee-track inline-block"
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-direction": reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {/* Track is doubled; the keyframe travels -50% for a seamless loop */}
        {[0, 1].map((half) => (
          <span key={half} className="eyebrow inline-block">
            {items.map((item, i) => (
              <span key={i} className="mx-5 inline-block">
                {item}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
