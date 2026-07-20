"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, Search } from "lucide-react";
import { cardClass, controlClass, labelClass } from "./styles";

export type LocationOption = {
  /** Human-readable name - this is what gets submitted. */
  name: string;
  /** ISO code used internally to fetch dependent lists. */
  isoCode: string;
};

type LocationSelectProps = {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Selected readable name, or "" when nothing is chosen. */
  value: string;
  options: LocationOption[];
  onSelect: (option: LocationOption) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
  /** Shown inside the open panel when there are genuinely no options. */
  emptyMessage?: string;
};

export function LocationSelect({
  label,
  placeholder,
  icon,
  required,
  disabled,
  value,
  options,
  onSelect,
  onBlur,
  error,
  className,
  emptyMessage = "No results found.",
}: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const invalid = Boolean(error);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Focus the search box when the panel opens.
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    onBlur?.();
  };

  const openPanel = () => {
    if (disabled) return;
    setOpen(true);
    setQuery("");
    // Highlight the current selection if there is one.
    const idx = options.findIndex((o) => o.name === value);
    setActive(idx >= 0 ? idx : 0);
  };

  const choose = (option: LocationOption) => {
    onSelect(option);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openPanel();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[active]) choose(filtered[active]);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  };

  return (
    <div className={className} ref={rootRef}>
      <div
        className={
          cardClass +
          " relative block " +
          (disabled ? "cursor-not-allowed opacity-55 " : "cursor-pointer ") +
          (invalid
            ? "!border-red-400/70 focus-within:!border-red-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(239,68,68,0.45)]"
            : "")
        }
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => (open ? close() : openPanel())}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-invalid={invalid}
          className="flex w-full items-center gap-3 text-left disabled:cursor-not-allowed"
        >
          {icon && <span aria-hidden>{icon}</span>}
          <span className="min-w-0 flex-1">
            <span className={labelClass}>
              {label}
              {required && <span className="text-bluehour"> *</span>}
            </span>
            <span
              className={
                controlClass +
                " block truncate " +
                (value ? "" : "text-darkroom/30")
              }
            >
              {value || placeholder}
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className={
              "h-4 w-4 shrink-0 text-darkroom/35 transition-transform duration-200 " +
              (open ? "rotate-180" : "")
            }
          />
        </button>

        {open && (
          <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border-2 border-darkroom/12 bg-overexpose shadow-[0_16px_40px_-12px_rgba(31,26,24,0.35)]">
            <div className="flex items-center gap-2 border-b border-darkroom/10 px-3 py-2">
              <Search aria-hidden className="h-4 w-4 shrink-0 text-darkroom/35" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={`Search ${label.toLowerCase()}…`}
                aria-label={`Search ${label.toLowerCase()}`}
                className="w-full bg-transparent text-sm text-darkroom outline-none placeholder:text-darkroom/30"
              />
            </div>
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label={label}
              className="max-h-60 overflow-y-auto py-1"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-darkroom/45">
                  {options.length === 0 ? emptyMessage : "No results found."}
                </li>
              ) : (
                filtered.map((option, i) => {
                  const selected = option.name === value;
                  return (
                    <li
                      key={option.isoCode + option.name}
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        choose(option);
                      }}
                      className={
                        "flex cursor-pointer items-center justify-between gap-2 px-4 py-2 text-sm text-darkroom " +
                        (i === active ? "bg-bluehour/10" : "")
                      }
                    >
                      <span className="truncate">{option.name}</span>
                      {selected && (
                        <Check className="h-4 w-4 shrink-0 text-bluehour" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {invalid && (
        <p className="status-rise mt-1.5 flex items-center gap-1 pl-1 text-xs font-semibold text-red-500">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
