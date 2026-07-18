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
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
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
  className,
  value,
  onChange,
}: FieldProps) {
  return (
    <label className={cardClass + " block cursor-text " + (className ?? "")}>
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
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            className={controlClass}
          />
        </span>
      </div>
    </label>
  );
}
