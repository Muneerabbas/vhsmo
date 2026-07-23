import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { email } = await req.json();

  const { data } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  return NextResponse.json({
    exists: !!data,
  });
}
