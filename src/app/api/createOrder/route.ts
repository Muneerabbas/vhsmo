import { hasLaunched } from "@/lib/launch";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {


    if (!hasLaunched()) {
      return Response.json(
        { error: "Launch has not started" },
        { status: 403 },
      );
    } 
    
  try {
    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Full Razorpay error:", error);

    return NextResponse.json(
      {
        message: "Failed to create order",
        error,
      },
      { status: 500 },
    );
  }
}
