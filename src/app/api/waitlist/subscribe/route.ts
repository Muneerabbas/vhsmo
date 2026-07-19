import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/** Footer newsletter — adds an email to the waitlist table. */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const clean = typeof email === "string" ? email.toLowerCase().trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email." },
        { status: 400 },
      );
    }

    // Already on the list — treat as subscribed.
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", clean)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ success: true, already: true });
    }

    const { error } = await supabase.from("waitlist").insert({ email: clean });
    if (error) {
      console.error("waitlist subscribe:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
