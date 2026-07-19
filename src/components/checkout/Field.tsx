import { AlertCircle } from "lucide-react";
import { cardClass, controlClass, labelClass } from "./styles";

export type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
  className?: string;
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

export function Field({
  name,
  label,
  placeholder,
  icon,
  type = "text",
  required,
  autoComplete,
  inputMode,
  maxLength,
  className,
  value,
  error,
  onChange,
  onBlur,
}: FieldProps) {
  const invalid = Boolean(error);
  return (
    <div className={className}>
      <label
        className={
          cardClass +
          " block cursor-text " +
          (invalid
            ? "!border-red-400/70 focus-within:!border-red-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(239,68,68,0.45)]"
            : "")
        }
      >
        <div className="flex items-center gap-3">
          {icon && <span aria-hidden>{icon}</span>}
          <span className="min-w-0 flex-1">
            <span className={labelClass}>
              {label}
              {required && <span className="text-bluehour"> *</span>}
            </span>
            <input
              name={name}
              type={type}
              required={required}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              maxLength={maxLength}
              value={value}
              aria-invalid={invalid}
              onChange={onChange ? (e) => onChange(e.target.value) : undefined}
              onBlur={onBlur}
              className={controlClass}
            />
          </span>
        </div>
      </label>
      {invalid && (
        <p className="status-rise mt-1.5 flex items-center gap-1 pl-1 text-xs font-semibold text-red-500">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
