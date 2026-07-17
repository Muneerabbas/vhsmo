"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AddressSuggestionItem } from "./types";

type AddressSuggestionProps = {
  suggestion: AddressSuggestionItem;
  /** DOM id used by the combobox's aria-activedescendant. */
  optionId: string;
  /** Highlighted via keyboard or hover. */
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
};

/**
 * A single row in the autocomplete dropdown: pin, title, subtitle.
 * mousedown is prevented so the input keeps focus long enough for the
 * click to register (the dropdown doesn't close from blur first).
 */
export function AddressSuggestion({
  suggestion,
  optionId,
  active,
  onSelect,
  onHover,
}: AddressSuggestionProps) {
  return (
    <li
      id={optionId}
      role="option"
      aria-selected={active}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
        active ? "bg-bluehour/10" : "hover:bg-darkroom/[0.04]",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
          active ? "bg-bluehour text-overexpose" : "bg-darkroom/[0.06] text-darkroom/50",
        )}
      >
        <MapPin className="size-3.5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-darkroom">
          {suggestion.title}
        </span>
        {suggestion.subtitle && (
          <span className="block truncate text-xs text-darkroom/55">
            {suggestion.subtitle}
          </span>
        )}
      </span>
    </li>
  );
}
