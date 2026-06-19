// Shiprocket integration — admin-triggered shipment creation.
// Requires SHIPROCKET_EMAIL + SHIPROCKET_PASSWORD secrets.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getToken(): Promise<string> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) throw new Error("Shiprocket not configured.");
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Shiprocket auth failed: ${res.status}`);
  const j = (await res.json()) as { token: string };
  return j.token;
}

export const createShiprocketShipment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Admin check
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin role required");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");

    const token = await getToken();
    const addr = order.shipping_address as Record<string, string>;

    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: order.order_number,
        order_date: new Date(order.created_at).toISOString().slice(0, 10),
        pickup_location: "Primary",
        billing_customer_name: addr.full_name,
        billing_address: addr.line1,
        billing_address_2: addr.line2 ?? "",
        billing_city: addr.city,
        billing_pincode: addr.pincode,
        billing_state: addr.state,
        billing_country: addr.country,
        billing_email: addr.email,
        billing_phone: addr.phone,
        shipping_is_billing: true,
        order_items: (order.order_items as Array<Record<string, unknown>>).map((it) => ({
          name: it.name,
          sku: it.sku ?? `IRY-${(it.product_id as string).slice(0, 8)}`,
          units: it.quantity,
          selling_price: it.price,
        })),
        payment_method: "Prepaid",
        sub_total: order.subtotal,
        length: 30,
        breadth: 25,
        height: 5,
        weight: 0.5,
      }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(`Shiprocket create failed: ${JSON.stringify(body)}`);

    const sr = body as { order_id: number; shipment_id: number; awb_code?: string };
    await supabaseAdmin
      .from("orders")
      .update({
        shiprocket_order_id: String(sr.order_id),
        shiprocket_shipment_id: String(sr.shipment_id),
        awb_code: sr.awb_code ?? null,
        status: "processing",
      })
      .eq("id", order.id);

    return { ok: true, shipment_id: sr.shipment_id, awb: sr.awb_code };
  });
