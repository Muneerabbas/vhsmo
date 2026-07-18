"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Phone } from "lucide-react";
import { cardClass, controlClass, iconClass, labelClass } from "./styles";

const countries = [
  { code: "IN", flag: "🇮🇳", name: "India", dial: "+91" },
  { code: "US", flag: "🇺🇸", name: "United States", dial: "+1" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", dial: "+44" },
  { code: "AE", flag: "🇦🇪", name: "UAE", dial: "+971" },
  { code: "CA", flag: "🇨🇦", name: "Canada", dial: "+1" },
  { code: "AU", flag: "🇦🇺", name: "Australia", dial: "+61" },
  { code: "SG", flag: "🇸🇬", name: "Singapore", dial: "+65" },
  { code: "DE", flag: "🇩🇪", name: "Germany", dial: "+49" },
  { code: "FR", flag: "🇫🇷", name: "France", dial: "+33" },
  { code: "JP", flag: "🇯🇵", name: "Japan", dial: "+81" },
] as const;

type Country = (typeof countries)[number];

type PhoneFieldProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
};

export function PhoneField({ phone, onPhoneChange }: PhoneFieldProps) {
  const [country, setCountry] = useState<Country>(countries[0]);
      // const [number, setNumber] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <Phone className={iconClass} />
          <span className="min-w-0 flex-1">
            <span className={labelClass}>
              Phone
              <span className="text-bluehour"> *</span>
            </span>
            <div className="flex items-center gap-2">
              {/* Country-code trigger */}
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="-ml-0.5 flex shrink-0 items-center gap-1 rounded-md py-0.5 pr-1 text-sm font-semibold text-darkroom transition-colors hover:text-bluehour"
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span className="tabular-nums">{country.dial}</span>
                <ChevronDown
                  className={
                    "size-3.5 text-darkroom/40 transition-transform duration-200 " +
                    (open ? "rotate-180" : "")
                  }
                />
              </button>
              <input
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                
                placeholder="98765 43210"
                autoComplete="tel-national"
                inputMode="tel"
                className={controlClass}
              />
            </div>
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          data-lenis-prevent
          className="status-rise absolute left-0 right-0 top-full z-20 mt-1.5 max-h-52 overflow-y-auto overscroll-contain rounded-xl border-2 border-darkroom/12 bg-overexpose p-1.5 shadow-[0_16px_40px_-12px_rgba(31,26,24,0.35)]"
        >
          {countries.map((c) => {
            const active = c.code === country.code;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setCountry(c);
                    setOpen(false);
                  }}
                  className={
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors " +
                    (active
                      ? "bg-bluehour/10 text-bluehour"
                      : "text-darkroom hover:bg-darkroom/[0.06]")
                  }
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1 truncate font-medium">{c.name}</span>
                  <span className="tabular-nums text-darkroom/50">{c.dial}</span>
                  {active && <Check className="size-4 text-bluehour" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
