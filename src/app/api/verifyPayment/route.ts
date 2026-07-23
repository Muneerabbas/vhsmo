import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  productId: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  total: number;
}

interface ProductRow {
  id: string;
  name: string;
  color: string;
  selling_price: number;
  stock: number | null;
}

/**
 * Replace whatever the browser sent with the row the store actually sells:
 * name, colour and price come from `products`, keyed by the cart line's
 * productId. Lines that don't resolve (stale carts from before the table
 * existed) are kept verbatim so the paid order is never lossy, but they
 * can't touch stock.
 */
function canonicalise(
  items: OrderItem[],
  rows: ProductRow[],
): { stored: OrderItem[]; resolved: { row: ProductRow; quantity: number }[] } {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const stored: OrderItem[] = [];
  const resolved: { row: ProductRow; quantity: number }[] = [];

  for (const item of items) {
    const row = byId.get(item.productId);
    const quantity = Math.max(1, Math.floor(item.quantity ?? 1));
    if (!row) {
      stored.push({ ...item, quantity });
      continue;
    }
    stored.push({
      productId: row.id,
      name: row.name.trim(),
      variant: row.color,
      quantity,
      price: row.selling_price,
      total: row.selling_price * quantity,
    });
    resolved.push({ row, quantity });
  }

  return { stored, resolved };
}

/**
 * `stock = stock - qty`, without a database function: read the row, write it
 * back guarded by the value we read. A concurrent order makes the guarded
 * update match zero rows, and the loop re-reads. Never goes below zero.
 */
async function decrementStock(productId: string, quantity: number) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: current, error } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();
    if (error || current?.stock == null) return false;

    const next = Math.max(0, current.stock - quantity);
    const { data: updated } = await supabase
      .from("products")
      .update({ stock: next })
      .eq("id", productId)
      .eq("stock", current.stock)
      .select("id");
    if (updated?.length) return true;
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const {
      payment,
      customer,
      shipping,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
    } = await req.json();
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

    // The cart lines carry product row ids - pull those rows so the order
    // records what the store sells, not what the browser claimed. A non-uuid
    // id (legacy carts, tampering) would make Postgres reject the whole
    // query, so those never reach it.
    const UUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const cartItems: OrderItem[] = Array.isArray(items) ? items : [];
    const ids = [
      ...new Set(
        cartItems.map((i) => i.productId).filter((id) => UUID.test(id ?? "")),
      ),
    ];
    let rows: ProductRow[] = [];
    if (ids.length) {
      const { data, error: productsError } = await supabase
        .from("products")
        .select("id, name, color, selling_price, stock")
        .in("id", ids);
      if (productsError) {
        console.error("Failed to load products for order:", productsError);
      }
      rows = (data as ProductRow[]) ?? [];
    }

    const { stored, resolved } = canonicalise(cartItems, rows);

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

      items: stored,

      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
      amount: total,
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

    // The payment is real and the order is saved - take the units out of
    // stock. A failure here is logged, never surfaced: the customer paid.
    for (const { row, quantity } of resolved) {
      const ok = await decrementStock(row.id, quantity);
      if (!ok) {
        console.error(
          `Order ${razorpay_order_id}: could not decrement stock for ${row.id}`,
        );
      }
    }
    // Bust the cached storefront read so the new stock shows immediately.
    revalidateTag("products");

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
