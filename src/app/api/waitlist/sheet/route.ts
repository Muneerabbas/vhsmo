import { NextResponse } from "next/server";

/**
 * Floating "Join Waitlist" modal - forwards a signup to the Google Sheet via
 * the Apps Script web app (see scripts/waitlist-sheet.gs). Proxied server-side
 * so the webhook URL and shared secret never reach the browser.
 *
 * Location / country code are intentionally not collected.
 */
export async function POST(req: Request) {
  try {
    const { name, email, whatsapp } = await req.json();

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const cleanWhatsapp = typeof whatsapp === "string" ? whatsapp.trim() : "";

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

    const webhook = process.env.WAITLIST_SHEET_WEBHOOK_URL;
    const secret = process.env.WAITLIST_SHEET_SECRET;

    if (!webhook || !secret) {
      console.error("waitlist sheet: WAITLIST_SHEET_WEBHOOK_URL / _SECRET unset");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // Apps Script answers the /exec POST with a 302 to script.googleusercontent.com.
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        name: cleanName,
        email: cleanEmail,
        whatsapp: cleanWhatsapp,
      }),
      redirect: "follow",
    });

    if (!res.ok) {
      console.error("waitlist sheet: apps script responded", res.status);
      return NextResponse.json({ success: false }, { status: 502 });
    }

    const data = await res.json().catch(() => null);

    if (!data?.success) {
      console.error("waitlist sheet: apps script rejected", data);
      return NextResponse.json({ success: false }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("waitlist sheet:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
