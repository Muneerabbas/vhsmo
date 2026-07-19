import { AlertCircle, CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import type { CheckoutErrors, CheckoutField } from "@/lib/checkout-validation";
import { PhoneField } from "./PhoneField";
import { SectionHeader } from "./SectionHeader";
import { cardClass, controlClass, iconClass, labelClass } from "./styles";
import type { EmailStatus } from "./useEmailVerification";

type ContactSectionProps = {
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  emailStatus: EmailStatus;
  errors: CheckoutErrors;
  onBlurField: (field: CheckoutField) => void;
};

export function ContactSection({
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  emailStatus,
  errors,
  onBlurField,
}: ContactSectionProps) {
  const emailError = errors.email;
  // A format error takes precedence over the waitlist status message.
  const emailInvalid = Boolean(emailError) || emailStatus === "notfound";
  const emailValid = !emailError && emailStatus === "verified";

  return (
    <section>
      <SectionHeader
        title="Contact information"
        subtitle="We'll send your order confirmation here."
      />
      <div className="mt-5 grid items-start gap-3.5 sm:grid-cols-2">
        <div>
          <label
            className={
              cardClass +
              " block cursor-text " +
              (emailValid
                ? "!border-green-500/60 focus-within:!border-green-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(22,163,74,0.5)]"
                : emailInvalid
                  ? "!border-red-400/70 focus-within:!border-red-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(239,68,68,0.45)]"
                  : "")
            }
          >
            <div className="flex items-center gap-3">
              <span aria-hidden>
                <Mail className={iconClass} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={labelClass}>
                  Email
                  <span className="text-bluehour"> *</span>
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  onBlur={() => onBlurField("email")}
                  placeholder="you@gmail.com"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={emailInvalid}
                  className={controlClass}
                />
              </span>
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                {emailStatus === "checking" && (
                  <Loader2 className="h-4 w-4 animate-spin text-darkroom/40" />
                )}
                {emailValid && (
                  <CheckCircle2
                    key="ok"
                    className="status-pop h-4 w-4 text-green-600"
                  />
                )}
                {emailInvalid && (
                  <XCircle key="no" className="status-pop h-4 w-4 text-red-500" />
                )}
              </span>
            </div>
          </label>

          {/* Format error wins; otherwise surface the waitlist status. */}
          {emailError ? (
            <p className="status-rise mt-1.5 flex items-center gap-1 pl-1 text-xs font-semibold text-red-500">
              <AlertCircle className="size-3.5 shrink-0" />
              {emailError}
            </p>
          ) : (
            emailStatus !== "idle" && (
              <p
                key={emailStatus}
                className={
                  "status-rise mt-1.5 pl-1 text-xs font-semibold " +
                  (emailStatus === "checking"
                    ? "font-medium text-darkroom/45"
                    : emailStatus === "verified"
                      ? "text-green-600"
                      : "text-red-500")
                }
              >
                {emailStatus === "checking" && "Checking waitlist…"}
                {emailStatus === "verified" &&
                  "Verified — you're on the waitlist."}
                {emailStatus === "notfound" &&
                  "This email isn't on the waitlist yet."}
              </p>
            )
          )}
        </div>

        <PhoneField
          phone={phone}
          onPhoneChange={onPhoneChange}
          error={errors.phone}
          onBlur={() => onBlurField("phone")}
        />
      </div>
    </section>
  );
}
