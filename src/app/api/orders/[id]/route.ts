// app/api/orders/[id]/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", id)
    .single();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}