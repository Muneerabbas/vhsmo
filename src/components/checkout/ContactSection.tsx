import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
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
};

export function ContactSection({
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  emailStatus,
}: ContactSectionProps) {
  return (
    <section>
      <SectionHeader title="Contact" />
      <div className="mt-5 grid items-start gap-3.5 sm:grid-cols-2">
        <div className="relative">
          <label
            className={
              cardClass +
              " block cursor-text " +
              (emailStatus === "verified"
                ? "!border-green-500/60 focus-within:!border-green-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(22,163,74,0.5)]"
                : emailStatus === "notfound"
                  ? "!border-red-400/60 focus-within:!border-red-500 focus-within:!shadow-[0_8px_24px_-10px_rgba(239,68,68,0.5)]"
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
                  placeholder="you@gmail.com"
                  autoComplete="email"
                  inputMode="email"
                  className={controlClass}
                />
              </span>
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                {emailStatus === "checking" && (
                  <Loader2 className="h-4 w-4 animate-spin text-darkroom/40" />
                )}
                {emailStatus === "verified" && (
                  <CheckCircle2
                    key="ok"
                    className="status-pop h-4 w-4 text-green-600"
                  />
                )}
                {emailStatus === "notfound" && (
                  <XCircle key="no" className="status-pop h-4 w-4 text-red-500" />
                )}
              </span>
            </div>
          </label>
          {/* Absolutely positioned so it never resizes the grid cell. */}
          {emailStatus !== "idle" && (
            <p
              key={emailStatus}
              className={
                "status-rise absolute left-1 top-full mt-1.5 text-xs font-semibold " +
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
          )}
        </div>
        <PhoneField
          phone={phone}
          onPhoneChange={onPhoneChange}
        />
      </div>
    </section>
  );
}
