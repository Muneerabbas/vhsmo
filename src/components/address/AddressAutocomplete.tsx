"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddressSuggestion } from "./AddressSuggestion";
import { fieldLabel } from "./styles";
import type { AddressDetails, AddressSuggestionItem } from "./types";

type AddressAutocompleteProps = {
  /** Called with structured details when a suggestion is chosen. */
  onSelect: (details: AddressDetails) => void;
  className?: string;
};

const DEBOUNCE_MS = 300;

/**
 * Premium address search: debounced autocomplete backed by our own
 * /api/address proxy routes (never Google directly). Full combobox
 * a11y — arrow keys, Enter, Escape, click-outside, aria-activedescendant.
 * It only *pre-fills* the address; every field stays editable afterward.
 */
export function AddressAutocomplete({
  onSelect,
  className,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searched, setSearched] = useState(false);

  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Skips the debounced search once, right after a suggestion is picked, so
  // writing the chosen address into the input doesn't re-open the dropdown.
  const skipFetchRef = useRef(false);
  const listboxId = useId();
  const inputId = useId();
  const optionId = (i: number) => `${listboxId}-option-${i}`;

  // Debounced fetch against our proxy. Aborts stale requests.
  useEffect(() => {
    const q = query.trim();
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setSearched(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/address/autocomplete?q=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        );
        const data = (await res.json()) as unknown;
        const list: AddressSuggestionItem[] = Array.isArray(data) ? data : [];
        setSuggestions(list);
        setActiveIndex(list.length ? 0 : -1);
        setOpen(true);
        setSearched(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([]);
          setSearched(true);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  // Keep the active option scrolled into view during keyboard nav.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, open]);

  const selectSuggestion = useCallback(
    async (s: AddressSuggestionItem) => {
      setOpen(false);
      skipFetchRef.current = true;
      setQuery(s.subtitle ? `${s.title}, ${s.subtitle}` : s.title);
      setResolving(true);
      try {
        const res = await fetch(
          `/api/address/details?placeId=${encodeURIComponent(s.id)}`,
        );
        if (res.ok) {
          const details = (await res.json()) as AddressDetails;
          onSelect(details);
        }
      } catch {
        /* leave the fields for manual entry */
      } finally {
        setResolving(false);
        inputRef.current?.blur();
      }
    },
    [onSelect],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Never let the search field submit the checkout form.
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIndex >= 0 && suggestions[activeIndex]) {
        selectSuggestion(suggestions[activeIndex]);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open && suggestions.length) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
  }

  function clearQuery() {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    setSearched(false);
    inputRef.current?.focus();
  }

  const showDropdown = open && query.trim().length >= 2;
  const showEmpty = showDropdown && !loading && searched && suggestions.length === 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label htmlFor={inputId} className={cn(fieldLabel, "mb-1.5 !text-darkroom/50")}>
        Search address
      </label>

      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 border-darkroom/12 bg-overexpose px-4 py-3 shadow-[0_1px_2px_rgba(31,26,24,0.05)] transition-all duration-200",
          "hover:border-darkroom/25",
          "focus-within:border-bluehour focus-within:shadow-[0_8px_24px_-10px_rgba(16,147,255,0.5)] focus-within:ring-2 focus-within:ring-bluehour/20",
        )}
      >
        <Search className="size-4 shrink-0 text-darkroom/40" aria-hidden />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          autoComplete="off"
          spellCheck={false}
          placeholder="Start typing your address…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm text-darkroom outline-none placeholder:text-darkroom/30"
        />
        {loading || resolving ? (
          <Loader2
            className="size-4 shrink-0 animate-spin text-bluehour"
            aria-label="Searching"
          />
        ) : query ? (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Clear address search"
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-darkroom/40 transition-colors hover:bg-darkroom/[0.06] hover:text-darkroom"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-2 origin-top"
          >
            {showEmpty ? (
              <div className="rounded-xl border-2 border-darkroom/12 bg-overexpose px-4 py-3.5 text-sm text-darkroom/55 shadow-[0_20px_50px_-20px_rgba(31,26,24,0.45)]">
                No matches. You can type the address in the fields below.
              </div>
            ) : (
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Address suggestions"
                className="max-h-72 overflow-y-auto rounded-xl border-2 border-darkroom/12 bg-overexpose p-1.5 shadow-[0_20px_50px_-20px_rgba(31,26,24,0.45)] [scrollbar-width:thin]"
              >
                {suggestions.map((s, i) => (
                  <AddressSuggestion
                    key={s.id}
                    suggestion={s}
                    optionId={optionId(i)}
                    active={i === activeIndex}
                    onHover={() => setActiveIndex(i)}
                    onSelect={() => selectSuggestion(s)}
                  />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
