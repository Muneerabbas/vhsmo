import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Floating "Join Waitlist" modal - stores the signup in the Supabase
 * `newwaitlist` table, which is the source of truth (/api/waitlist/check reads
 * from it). The dial code picked in the modal lands in `country_code`, the
 * national number in `whatsapp`.
 */
export async function POST(req: Request) {
  try {
    const { name, email, whatsapp, countryCode } = await req.json();

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const cleanWhatsapp = typeof whatsapp === "string" ? whatsapp.trim() : "";

    // Normalised to "+91" - digits and dashes only (e.g. Aland's "+358-18").
    const cleanCountryCode =
      typeof countryCode === "string"
        ? "+" + countryCode.replace(/[^\d-]/g, "")
        : "";

    if (!cleanName) {
      return NextResponse.json(
        { success: false, message: "Enter your name." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email." },
        { status: 400 },
      );
    }

    // Digits only, ignoring the usual +, spaces, dashes and brackets.
    if (cleanWhatsapp.replace(/[^\d]/g, "").length < 7) {
      return NextResponse.json(
        { success: false, message: "Enter a valid WhatsApp number." },
        { status: 400 },
      );
    }

    if (!/^\+\d/.test(cleanCountryCode)) {
      return NextResponse.json(
        { success: false, message: "Pick a country code." },
        { status: 400 },
      );
    }

    const { data: existing } = await supabase
      .from("newwaitlist")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      // Already in - the modal shows the same success screen either way.
      return NextResponse.json({ success: true, already: true });
    }

    const { error } = await supabase.from("newwaitlist").insert({
      name: cleanName,
      email: cleanEmail,
      whatsapp: cleanWhatsapp,
      country_code: cleanCountryCode,
    });

    if (error) {
      // 23505 = unique violation, i.e. a race with a second submit. Not an error.
      if (error.code === "23505") {
        return NextResponse.json({ success: true, already: true });
      }
      console.error("waitlist insert:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // Mirror the email into the legacy `waitlist` table (/api/waitlist/check
    // reads from it). Failure here shouldn't block the signup.
    const { error: legacyError } = await supabase.from("waitlist").insert({
      email: cleanEmail,
      joined_at: new Date().toISOString(),
    });

    if (legacyError && legacyError.code !== "23505") {
      console.error("waitlist legacy insert:", legacyError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("waitlist join:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
