import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/** Footer newsletter - adds an email to the subscribers table. */
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

    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", clean)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        already: true,
      });
    }

    const { error } = await supabase
      .from("subscribers")
      .insert({ email: clean });

    if (error) {
      console.error("subscriber insert:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
