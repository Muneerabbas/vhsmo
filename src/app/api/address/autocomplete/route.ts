import { NextResponse, type NextRequest } from "next/server";
import { mockAutocomplete } from "@/lib/address-mock";
import type { AddressSuggestionItem } from "@/components/address/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/address/autocomplete?q=...
 *
 * Proxies Google Places API (New) Autocomplete so the API key never reaches
 * the browser. Returns a simplified [{ id, title, subtitle }] list.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  // Nothing meaningful to search yet.
  if (q.length < 2) return NextResponse.json([]);

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Dev fallback so the UI works without a key. Never runs in production.
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(mockAutocomplete(q));
    }
    return NextResponse.json(
      { error: "Address service is not configured." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
        },
        body: JSON.stringify({
          input: q,
          // ISO 3166-1 alpha-2, lowercase as Google expects.
          includedRegionCodes: ["in"],
        }),
      },
    );

    if (!res.ok) {
      // Fail soft — the user can still type the address manually.
      return NextResponse.json([]);
    }

    const data = (await res.json()) as {
      suggestions?: {
        placePrediction?: {
          placeId: string;
          text?: { text?: string };
          structuredFormat?: {
            mainText?: { text?: string };
            secondaryText?: { text?: string };
          };
        };
      }[];
    };

    const suggestions: AddressSuggestionItem[] = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
      .map((p) => ({
        id: p.placeId,
        title: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
        subtitle: p.structuredFormat?.secondaryText?.text ?? "",
      }));

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
