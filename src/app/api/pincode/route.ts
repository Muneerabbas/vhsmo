import { NextResponse } from "next/server";

const DELHIVERY_URL = "https://track.delhivery.com/c/api/pin-codes/json/";

type PostalCode = {
  pin: number;
  city?: string;
  state_code?: string;
  district?: string;
  country_code?: string;
  pre_paid?: string;
  cash?: string;
  cod?: string;
  pickup?: string;
  repl?: string;
  is_oda?: string;
  remarks?: string;
};

function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

async function checkServiceability(pincode: string) {
  const token = process.env.DELHIVERY_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Serviceability check is not configured" },
      { status: 500 },
    );
  }

  if (!isValidPincode(pincode)) {
    return NextResponse.json(
      { serviceable: false, error: "Enter a valid 6-digit pincode" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${DELHIVERY_URL}?filter_codes=${encodeURIComponent(pincode)}`,
      {
        headers: { Authorization: `Token ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { serviceable: false, error: "Could not verify pincode right now" },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      delivery_codes?: { postal_code: PostalCode }[];
    };

    const entry = data.delivery_codes?.[0]?.postal_code;

    if (!entry) {
      return NextResponse.json({
        serviceable: false,
        pincode,
        message: "We don't deliver to this pincode yet",
      });
    }

    return NextResponse.json({
      serviceable: true,
      pincode,
      city: entry.city ?? null,
      district: entry.district ?? null,
      state: entry.state_code ?? null,
      cod: entry.cod === "Y",
      prepaid: entry.pre_paid === "Y",
      pickup: entry.pickup === "Y",
      message: `Delivery available to ${entry.city ?? pincode}`,
    });
  } catch (error) {
    console.error("Delhivery serviceability error:", error);
    return NextResponse.json(
      { serviceable: false, error: "Could not verify pincode right now" },
      { status: 502 },
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pincode = (searchParams.get("pincode") ?? "").trim();
  return checkServiceability(pincode);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const pincode = String(body?.pincode ?? "").trim();
  return checkServiceability(pincode);
}
