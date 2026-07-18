import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { payment, customer, shipping, amount } = await req.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      payment ?? {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 },
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid signature",
        },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("orders").insert({
      razorpay_order_id,
      razorpay_payment_id,

      customer_name: customer?.name,
      email: customer?.email,
      phone: customer?.phone,

      address_line1: shipping?.address1,
      address_line2: shipping?.address2,
      city: shipping?.city,
      state: shipping?.state,
      country: shipping?.country,
      postal_code: shipping?.postalCode,

      amount,
      currency: "INR",
      payment_status: "paid",
    });

    if (error) {
      console.error("Failed to save order:", error);
      return NextResponse.json(
        { success: false, message: "Payment verified but order not saved" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 },
    );
  }
}
