async function appendOrderToSheet(orderId) {
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!sheetsKey || !spreadsheetId) {
    return { synced: false, reason: "Google Sheets not configured" };
  }
  const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
  const { data: order, error } = await supabaseAdmin.from("orders").select("order_number, status, total, email, phone, shipping_address, created_at, order_items(name, quantity, price)").eq("id", orderId).maybeSingle();
  if (error || !order) return { synced: false, reason: "Order not found" };
  const addr = order.shipping_address;
  const items = order.order_items;
  const itemsStr = items.map((i) => `${i.name} x${i.quantity}`).join(" | ");
  const addrStr = addr ? `${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}, ${addr.city}, ${addr.state} ${addr.pincode}, ${addr.country}` : "";
  const row = [
    order.order_number,
    new Date(order.created_at).toISOString(),
    addr?.full_name ?? "",
    order.email,
    order.phone ?? "",
    addrStr,
    itemsStr,
    String(order.total),
    order.status
  ];
  const range = "Sheet1!A:I";
  const headers = {
    "Content-Type": "application/json"
  };
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
  if (sheetsKey.startsWith("Bearer ") || sheetsKey.length > 100) {
    headers["Authorization"] = sheetsKey.startsWith("Bearer ") ? sheetsKey : `Bearer ${sheetsKey}`;
  } else {
    url += `&key=${sheetsKey}`;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ values: [row] })
  });
  if (!res.ok) {
    const txt = await res.text();
    return { synced: false, reason: `Sheets error ${res.status}: ${txt.slice(0, 200)}` };
  }
  await supabaseAdmin.from("orders").update({ sheet_synced: true }).eq("id", orderId);
  return { synced: true };
}
export {
  appendOrderToSheet
};
