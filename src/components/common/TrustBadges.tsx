import { trustItems, type TrustItem } from "@/lib/content";
import { cn } from "@/lib/utils";

interface TrustBadgesProps {
  items?: TrustItem[];
  variant?: "row" | "grid";
  className?: string;
}

export function TrustBadges({
  items = trustItems,
  variant = "row",
  className,
}: TrustBadgesProps) {
  return (
    <ul
      className={cn(
        variant === "grid"
          ? "grid grid-cols-2 gap-4 sm:grid-cols-4"
          : "flex flex-wrap items-center justify-center gap-x-8 gap-y-4",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className={cn(
            "flex items-center gap-3",
            variant === "grid" &&
              "rounded-2xl border border-line bg-canvas/60 p-4",
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent-strong">
            <item.icon className="size-5" strokeWidth={1.5} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-medium text-ink">
              {item.title}
            </span>
            <span className="block text-xs text-muted">{item.description}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
