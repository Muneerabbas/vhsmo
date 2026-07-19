"use client";

import { AlertCircle, Phone } from "lucide-react";
import { cardClass, controlClass, iconClass, labelClass } from "./styles";

type PhoneFieldProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
  error?: string;
  onBlur?: () => void;
};

export function PhoneField({
  phone,
  onPhoneChange,
  error,
  onBlur,
}: PhoneFieldProps) {
  const invalid = Boolean(error);

  return (
    <div className="relative">
      <div
        className={
          cardClass +
          (invalid
            ? " !border-red-400/70 focus-within:!border-red-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(239,68,68,0.45)]"
            : "")
        }
      >
        <div className="flex items-center gap-3">
          <Phone className={iconClass} />
          <span className="min-w-0 flex-1">
            <span className={labelClass}>
              Phone
              <span className="text-bluehour"> *</span>
            </span>
            <div className="flex items-center gap-2">
              {/* Fixed India country code — not changeable. */}
              <span className="-ml-0.5 shrink-0 py-0.5 text-sm font-semibold tabular-nums text-darkroom">
                +91
              </span>
              <input
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  // Cap input at 10 digits (formatting characters don't count).
                  const next = e.target.value;
                  if (next.replace(/\D/g, "").length > 10) return;
                  onPhoneChange(next);
                }}
                onBlur={onBlur}
                aria-invalid={invalid}
                placeholder="98765 43210"
                autoComplete="tel-national"
                inputMode="tel"
                className={controlClass}
              />
            </div>
          </span>
        </div>
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
