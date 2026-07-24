import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";

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

const money = (n: number) =>
  `₹${Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/**
 * Order-confirmation email. Table-based, fully inline-styled so it survives
 * Gmail/Outlook/Apple Mail (which strip <style> and flex/grid). Palette is the
 * VHSMO brand: Darkroom #2A2422, Kodak Yellow #FDF100, Silver Halide #E3E3E1.
 */
function orderConfirmationEmail({
  name,
  orderId,
  paymentId,
  orderUrl,
  items,
  subtotal,
  shippingCost,
  tax,
  total,
}: {
  name: string;
  orderId: string;
  paymentId: string;
  orderUrl: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}) {
  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #efefee;font-size:14px;color:#2A2422;">
          <span style="font-weight:600;">${it.name}</span>${
            it.variant
              ? `<span style="color:#8a8580;"> · ${it.variant}</span>`
              : ""
          }
          <span style="display:block;color:#8a8580;font-size:12px;margin-top:2px;">Qty ${it.quantity}</span>
        </td>
        <td align="right" style="padding:14px 0;border-bottom:1px solid #efefee;font-size:14px;color:#2A2422;white-space:nowrap;">${money(
          it.total,
        )}</td>
      </tr>`,
    )
    .join("");

  const totalRow = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:4px 0;font-size:${strong ? "16px" : "13px"};color:${
        strong ? "#2A2422" : "#8a8580"
      };${strong ? "font-weight:700;padding-top:12px;" : ""}">${label}</td>
      <td align="right" style="padding:4px 0;font-size:${
        strong ? "16px" : "13px"
      };color:#2A2422;${
        strong ? "font-weight:700;padding-top:12px;" : ""
      }white-space:nowrap;">${value}</td>
    </tr>`;

  return `
  <div style="margin:0;padding:0;background:#E3E3E1;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E3E3E1;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

          <!-- header -->
          <tr><td style="background:#2A2422;padding:28px 32px 24px;">
            <div style="font-size:22px;font-weight:800;letter-spacing:3px;color:#ffffff;">VHSMO</div>
            <div style="height:3px;width:34px;background:#FDF100;margin-top:8px;border-radius:2px;"></div>
          </td></tr>

          <!-- confirmation -->
          <tr><td style="padding:32px 32px 8px;">
            <div style="display:inline-block;background:#FDF100;color:#2A2422;font-size:11px;font-weight:700;letter-spacing:1px;padding:5px 10px;border-radius:20px;text-transform:uppercase;">Order confirmed</div>
            <h1 style="margin:16px 0 4px;font-size:22px;color:#2A2422;">Thank you, ${name}.</h1>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#6f6a65;">Your payment went through and we're getting your order ready. We'll email you the moment it ships.</p>
          </td></tr>

          <!-- order meta -->
          <tr><td style="padding:20px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f6;border-radius:12px;">
              <tr>
                <td style="padding:14px 16px;font-size:11px;color:#8a8580;text-transform:uppercase;letter-spacing:.5px;">Order ID<br><span style="font-size:13px;color:#2A2422;letter-spacing:0;text-transform:none;">${orderId}</span></td>
                <td style="padding:14px 16px;font-size:11px;color:#8a8580;text-transform:uppercase;letter-spacing:.5px;">Payment ID<br><span style="font-size:13px;color:#2A2422;letter-spacing:0;text-transform:none;">${paymentId}</span></td>
              </tr>
            </table>
          </td></tr>

          <!-- items -->
          <tr><td style="padding:24px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          </td></tr>

          <!-- totals -->
          <tr><td style="padding:8px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${totalRow("Subtotal", money(subtotal))}
              ${totalRow("Shipping", shippingCost ? money(shippingCost) : "Free")}
              ${tax ? totalRow("Tax", money(tax)) : ""}
              ${totalRow("Total", money(total), true)}
            </table>
          </td></tr>

          <!-- cta -->
          <tr><td style="padding:28px 32px 8px;">
            <a href="${orderUrl}" style="display:block;text-align:center;background:#2A2422;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px;border-radius:10px;">View your order</a>
          </td></tr>

          <!-- footer -->
          <tr><td style="padding:20px 32px 32px;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#a5a09b;">Real moments. No filters.<br>Questions? Reply to this email or reach us at team@vhsmo.com</p>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </div>`;
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

    try {
      const origin =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        new URL(req.url).origin;
      const orderUrl = `${origin}/checkout/success?order=${encodeURIComponent(
        razorpay_order_id,
      )}&payment=${encodeURIComponent(razorpay_payment_id)}`;

      await sendEmail({
        to: customer.email,
        subject: `Your VHSMO Order #${razorpay_order_id} is Confirmed`,
        html: orderConfirmationEmail({
          name: customer.name,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          orderUrl,
          items: stored,
          subtotal,
          shippingCost,
          tax,
          total,
        }),
      });
    } catch (err) {
      console.error("Failed to send order email:", err);
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
