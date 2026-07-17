import { NextResponse, type NextRequest } from "next/server";
import { mockDetails } from "@/lib/address-mock";
import type { AddressDetails } from "@/components/address/types";

export const dynamic = "force-dynamic";

interface GoogleAddressComponent {
  longText?: string;
  shortText?: string;
  types?: string[];
}

/**
 * GET /api/address/details?placeId=...
 *
 * Proxies Google Place Details (New) and maps addressComponents into a clean,
 * structured address. The API key never reaches the browser.
 */
export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId")?.trim() ?? "";
  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Dev fallback so the UI works without a key. Never runs in production.
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      const details = mockDetails(placeId);
      if (!details) {
        return NextResponse.json({ error: "Place not found." }, { status: 404 });
      }
      return NextResponse.json(details);
    }
    return NextResponse.json(
      { error: "Address service is not configured." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "formattedAddress,addressComponents,location",
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not fetch address details." },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      formattedAddress?: string;
      addressComponents?: GoogleAddressComponent[];
      location?: { latitude?: number; longitude?: number };
    };

    const components = data.addressComponents ?? [];
    const get = (type: string) =>
      components.find((c) => c.types?.includes(type));

    const streetNumber = get("street_number")?.longText ?? "";
    const route = get("route")?.longText ?? "";
    const street = [streetNumber, route].filter(Boolean).join(" ").trim();

    const city =
      get("locality")?.longText ??
      get("postal_town")?.longText ??
      get("administrative_area_level_2")?.longText ??
      "";

    const details: AddressDetails = {
      street,
      city,
      state: get("administrative_area_level_1")?.longText ?? "",
      postalCode: get("postal_code")?.longText ?? "",
      country: get("country")?.longText ?? "",
      formattedAddress: data.formattedAddress ?? "",
      latitude: data.location?.latitude ?? null,
      longitude: data.location?.longitude ?? null,
    };

    return NextResponse.json(details);
  } catch {
    return NextResponse.json(
      { error: "Could not fetch address details." },
      { status: 502 },
    );
  }
}
