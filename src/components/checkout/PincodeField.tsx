import { AlertCircle, CheckCircle2, Hash, Loader2, XCircle } from "lucide-react";
import { cardClass, controlClass, iconClass, labelClass } from "./styles";
import type { PincodeInfo, PincodeStatus } from "./usePincodeServiceability";

type PincodeFieldProps = {
  value: string;
  error?: string;
  status: PincodeStatus;
  info: PincodeInfo | null;
  onChange: (value: string) => void;
  onBlur: () => void;
};

/**
 * PIN code input with live Delhivery serviceability feedback, styled to match
 * the verified-email field: green when we deliver there, red when we don't.
 */
export function PincodeField({
  value,
  error,
  status,
  info,
  onChange,
  onBlur,
}: PincodeFieldProps) {
  // A format error always wins over the serviceability status.
  const invalid = Boolean(error) || status === "unserviceable";
  const valid = !error && status === "serviceable";

  return (
    <div>
      <label
        className={
          cardClass +
          " block cursor-text " +
          (valid
            ? "!border-green-500/60 focus-within:!border-green-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(22,163,74,0.5)]"
            : invalid
              ? "!border-red-400/70 focus-within:!border-red-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(239,68,68,0.45)]"
              : "")
        }
      >
        <div className="flex items-center gap-3">
          <span aria-hidden>
            <Hash className={iconClass} />
          </span>
          <span className="min-w-0 flex-1">
            <span className={labelClass}>
              PIN code
              <span className="text-bluehour"> *</span>
            </span>
            <input
              name="postalCode"
              type="text"
              required
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder="411032"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={6}
              aria-invalid={invalid}
              className={controlClass}
            />
          </span>
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            {status === "checking" && (
              <Loader2 className="h-4 w-4 animate-spin text-darkroom/40" />
            )}
            {valid && (
              <CheckCircle2
                key="ok"
                className="status-pop h-4 w-4 text-green-600"
              />
            )}
            {status === "unserviceable" && !error && (
              <XCircle key="no" className="status-pop h-4 w-4 text-red-500" />
            )}
          </span>
        </div>
      </label>

      {/* Format error wins; otherwise surface the serviceability status. */}
      {error ? (
        <p className="status-rise mt-1.5 flex items-center gap-1 pl-1 text-xs font-semibold text-red-500">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        status !== "idle" && (
          <p
            key={status}
            className={
              "status-rise mt-1.5 pl-1 text-xs font-semibold " +
              (status === "checking"
                ? "font-medium text-darkroom/45"
                : status === "serviceable"
                  ? "text-green-600"
                  : status === "unserviceable"
                    ? "text-red-500"
                    : "font-medium text-darkroom/45")
            }
          >
            {status === "checking" && "Checking serviceability…"}
            {status === "serviceable" &&
              (info?.city
                ? `Delivery available to ${info.city}`
                : "Delivery available to this PIN.")}
            {status === "unserviceable" &&
              "We don't deliver to this PIN code yet."}
            {status === "error" && "Couldn't verify PIN — you can still continue."}
          </p>
        )
      )}
    </div>
  );
}
