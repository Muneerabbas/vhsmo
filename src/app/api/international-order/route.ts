import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * /international-order form - checkout only ships to Indian PIN codes, so
 * buyers everywhere else leave their details here and the order is arranged
 * over email/WhatsApp. Rows land in the Supabase `international_orders` table.
 * The dial code picked in the form lands in `country_code`, the national
 * number in `whatsapp`, mirroring the waitlist tables.
 */
export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      whatsapp,
      countryCode,
      country,
      city,
      postalCode,
      address,
      colour,
      quantity,
      notes,
    } = await req.json();

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail =
      typeof email === "string" ? email.toLowerCase().trim() : "";
    const cleanWhatsapp = typeof whatsapp === "string" ? whatsapp.trim() : "";
    const cleanCountry = typeof country === "string" ? country.trim() : "";
    const cleanCity = typeof city === "string" ? city.trim() : "";
    const cleanPostalCode =
      typeof postalCode === "string" ? postalCode.trim() : "";
    const cleanAddress = typeof address === "string" ? address.trim() : "";
    const cleanColour = typeof colour === "string" ? colour.trim() : "";
    const cleanNotes = typeof notes === "string" ? notes.trim() : "";

    // Normalised to "+91" - digits and dashes only (e.g. Aland's "+358-18").
    const cleanCountryCode =
      typeof countryCode === "string"
        ? "+" + countryCode.replace(/[^\d-]/g, "")
        : "";

    const cleanQuantity =
      typeof quantity === "number" && Number.isInteger(quantity)
        ? quantity
        : NaN;

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

    // The whole point of the form - orders from India go through checkout.
    if (!cleanCountry || cleanCountry.toLowerCase() === "india") {
      return NextResponse.json(
        { success: false, message: "Pick a country outside India." },
        { status: 400 },
      );
    }

    if (!cleanCity) {
      return NextResponse.json(
        { success: false, message: "Enter your city." },
        { status: 400 },
      );
    }

    if (!cleanPostalCode) {
      return NextResponse.json(
        { success: false, message: "Enter your PIN / postal code." },
        { status: 400 },
      );
    }

    if (cleanAddress.length < 10) {
      return NextResponse.json(
        { success: false, message: "Enter your full shipping address." },
        { status: 400 },
      );
    }

    if (!cleanColour) {
      return NextResponse.json(
        { success: false, message: "Pick a colour." },
        { status: 400 },
      );
    }

    if (!(cleanQuantity >= 1 && cleanQuantity <= 10)) {
      return NextResponse.json(
        { success: false, message: "Quantity must be between 1 and 10." },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("international_orders").insert({
      name: cleanName,
      email: cleanEmail,
      whatsapp: cleanWhatsapp,
      country_code: cleanCountryCode,
      country: cleanCountry,
      city: cleanCity,
      postal_code: cleanPostalCode,
      address: cleanAddress,
      colour: cleanColour,
      quantity: cleanQuantity,
      notes: cleanNotes || null,
    });

    if (error) {
      console.error("international order insert:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("international order:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
