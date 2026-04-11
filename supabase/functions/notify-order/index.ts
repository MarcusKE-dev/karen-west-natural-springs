import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CORS ────────────────────────────────────────────────────────────────────
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BUSINESS_EMAIL   = "karenwestsprings@gmail.com";
const BUSINESS_WHATSAPP = "254726732212";

// ─── SEND EMAIL ──────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) { console.error("RESEND_API_KEY secret is missing"); return false; }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Karen West Natural Spring <orders@mail.karenwestwater.co.ke>",
      reply_to: BUSINESS_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });
  const txt = await res.text();
  if (res.ok) { console.log(`EMAIL OK → ${to} | ${txt}`); return true; }
  console.error(`EMAIL FAIL → ${to} | ${res.status} | ${txt}`);
  return false;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi", dateStyle: "medium", timeStyle: "short",
  });
}

function money(n: number) { return Number(n).toLocaleString() + " KSH"; }

// ─── CUSTOMER EMAIL ──────────────────────────────────────────────────────────
function customerHtml(order: any, items: any[], trackUrl: string): string {
  const truck = items.some((i: any) => i.product_type === "truck");
  const rows = items.map((i: any) =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151">${i.product_name} ×${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#065f46">
        ${truck ? "As negotiated" : money(i.total_price)}
      </td>
    </tr>`
  ).join("");

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:#065f46;padding:28px 32px;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:22px">Karen West Natural Spring</h1>
    <p style="margin:6px 0 0;color:#a7f3d0;font-size:14px">Pure Water. Reliable Supply.</p>
  </div>
  <div style="padding:32px">
    <h2 style="margin:0 0 8px;color:#065f46">Order Confirmed! 💧</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px">
      Hi <strong>${order.customer_name}</strong>, your order has been received. We'll contact you shortly.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px">Order Number</p>
      <p style="margin:0;font-size:30px;font-weight:700;color:#065f46;letter-spacing:2px">${order.order_number}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#9ca3af">${fmt(order.created_at)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <tr>
        <th style="text-align:left;font-size:11px;color:#9ca3af;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #e5e7eb">Item</th>
        <th style="text-align:right;font-size:11px;color:#9ca3af;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #e5e7eb">Amount</th>
      </tr>
      ${rows}
      <tr>
        <td style="padding:12px 0 0;font-weight:700;color:#111827">Total</td>
        <td style="padding:12px 0 0;text-align:right;font-weight:700;color:#065f46">
          ${truck ? "Price as negotiated" : money(order.total_amount)}
        </td>
      </tr>
    </table>
    ${order.location ? `<p style="margin:0 0 6px;font-size:13px;color:#6b7280">📍 <strong>Delivery to:</strong> ${order.location}</p>` : ""}
    ${order.instructions ? `<p style="margin:0 0 20px;font-size:13px;color:#6b7280">📝 <strong>Notes:</strong> ${order.instructions}</p>` : "<div style='margin-bottom:20px'></div>"}
    <div style="text-align:center;margin:24px 0">
      <a href="${trackUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">
        📦 Track My Order
      </a>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center">
      Questions? Call or WhatsApp: <strong>+254 726 732 212</strong>
    </p>
  </div>
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center">
    <p style="margin:0;font-size:12px;color:#9ca3af">Karen West Natural Spring · Ngong · karenwestwater.co.ke</p>
  </div>
</div></body></html>`;
}

// ─── BUSINESS EMAIL ──────────────────────────────────────────────────────────
function businessHtml(order: any, items: any[], adminUrl: string): string {
  const truck = items.some((i: any) => i.product_type === "truck");
  const rows = items.map((i: any) =>
    `<tr>
      <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;color:#374151">${i.product_name} ×${i.quantity}</td>
      <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;color:#374151">
        ${truck ? "As negotiated" : money(i.total_price)}
      </td>
    </tr>`
  ).join("");
  const label = truck ? "🚛 BULK TRANSPORT" : "💧 PURIFIED WATER";

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
<div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:#1e3a5f;padding:20px 28px">
    <h1 style="margin:0;color:#fff;font-size:18px">${label} — New Order ${order.order_number}</h1>
    <p style="margin:4px 0 0;color:#93c5fd;font-size:12px">${fmt(order.created_at)}</p>
  </div>
  <div style="padding:24px 28px">
    <table style="width:100%;font-size:14px;margin-bottom:20px">
      <tr><td style="color:#6b7280;padding:4px 0;width:110px">Customer</td><td style="font-weight:600;color:#111827">${order.customer_name}</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0">Phone</td><td style="color:#111827">${order.phone}</td></tr>
      ${order.customer_email ? `<tr><td style="color:#6b7280;padding:4px 0">Email</td><td style="color:#111827">${order.customer_email}</td></tr>` : ""}
      ${order.location ? `<tr><td style="color:#6b7280;padding:4px 0">Location</td><td style="color:#111827">${order.location}</td></tr>` : ""}
      ${order.instructions ? `<tr><td style="color:#6b7280;padding:4px 0">Notes</td><td style="color:#111827">${order.instructions}</td></tr>` : ""}
      <tr><td style="color:#6b7280;padding:4px 0">Total</td><td style="font-weight:700;font-size:16px;color:#065f46">${truck ? "As negotiated" : money(order.total_amount)}</td></tr>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${rows}</table>
    <!-- ONE BUTTON — goes straight to admin to update order status -->
    <a href="${adminUrl}"
       style="background:#065f46;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">
      ⚙️ Manage This Order
    </a>
    <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">
      This link opens your admin page — log in and update the order status.
    </p>
  </div>
</div></body></html>`;
}

// ─── STATUS UPDATE EMAIL ─────────────────────────────────────────────────────
function statusHtml(order: any, newStatus: string, trackUrl: string): string {
  const labels: Record<string, string> = {
    pending: "Order Placed 🕐", confirmed: "Order Confirmed ✅",
    delivered: "Order Delivered 🎉", cancelled: "Order Cancelled ❌",
  };
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
<div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:#065f46;padding:24px 32px;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:20px">Order Status Update</h1>
  </div>
  <div style="padding:32px;text-align:center">
    <p style="margin:0 0 8px;color:#6b7280">Hi <strong>${order.customer_name}</strong>,</p>
    <p style="margin:0 0 24px;color:#6b7280">Your order <strong>${order.order_number}</strong> has been updated:</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px">
      <p style="margin:0;font-size:24px;font-weight:700;color:#065f46">${labels[newStatus] ?? newStatus}</p>
    </div>
    <a href="${trackUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">
      Track My Order
    </a>
    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">Karen West Natural Spring · +254 726 732 212</p>
  </div>
</div></body></html>`;
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  console.log("notify-order invoked");

  let body: any;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "Bad JSON" }), { status: 400, headers: cors }); }

  console.log("body:", JSON.stringify(body));

  const { orderId, statusUpdate, newStatus } = body ?? {};
  if (!orderId) {
    console.error("Missing orderId");
    return new Response(JSON.stringify({ error: "orderId required" }), { status: 400, headers: cors });
  }

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: order, error: oErr } = await sb.from("orders").select("*").eq("id", orderId).single();
  if (oErr || !order) {
    console.error("Order not found:", orderId, oErr);
    return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: cors });
  }
  console.log("order:", order.order_number);

  const { data: items } = await sb.from("order_items").select("*").eq("order_id", orderId);
  console.log("items count:", items?.length ?? 0);

  const site      = Deno.env.get("SITE_URL") ?? "https://www.karenwestwater.co.ke";
  const trackUrl  = `${site}/track/${order.order_number}`;
  const adminUrl  = `${site}/admin?order=${order.order_number}`;

  // ── STATUS UPDATE ──
  if (statusUpdate && newStatus) {
    if (order.customer_email) {
      await sendEmail(order.customer_email,
        `Your order ${order.order_number} — ${newStatus}`,
        statusHtml(order, newStatus, trackUrl));
    }
    const ph = order.phone?.replace(/\D/g, "");
    const wa = ph?.startsWith("0") ? "254" + ph.slice(1) : ph;
    const msgs: Record<string, string> = { pending: "Placed 🕐", confirmed: "Confirmed ✅", delivered: "Delivered 🎉", cancelled: "Cancelled ❌" };
    const txt = `Hi ${order.customer_name},\n\nYour Karen West order ${order.order_number} has been updated:\n\n📦 ${msgs[newStatus] ?? newStatus}\n\nTrack: ${trackUrl}\n\nKaren West · +254 726 732 212`;
    const waLink = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(txt)}` : null;
    return new Response(JSON.stringify({ success: true, customerWhatsappLink: waLink }), { headers: cors });
  }

  // ── NEW ORDER ──
  const truck = (items ?? []).some((i: any) => i.product_type === "truck");

  // Business email
  await sendEmail(BUSINESS_EMAIL,
    `New Order ${order.order_number} — ${order.customer_name}`,
    businessHtml(order, items ?? [], adminUrl));

  // Customer email (only if they gave one)
  if (order.customer_email) {
    await sendEmail(order.customer_email,
      `Your Karen West order is confirmed — ${order.order_number}`,
      customerHtml(order, items ?? [], trackUrl));
  }

  // WhatsApp message for owner (pre-composed, ready to send)
  const orderType = truck ? "🚛 BULK TRANSPORT" : "💧 WATER ORDER";
  let ownerMsg = `${orderType} — New Order!\n\n📋 Order: ${order.order_number}\n👤 ${order.customer_name}\n📞 ${order.phone}\n`;
  if (order.location) ownerMsg += `📍 ${order.location}\n`;
  if (order.instructions) ownerMsg += `📝 ${order.instructions}\n`;
  ownerMsg += `\n🛒 Items:\n`;
  (items ?? []).forEach((i: any) => {
    ownerMsg += truck
      ? `  • ${i.product_name} ×${i.quantity} — As negotiated\n`
      : `  • ${i.product_name} ×${i.quantity} — ${money(i.total_price)}\n`;
  });
  ownerMsg += truck ? `\n💰 Total: As negotiated\n` : `\n💰 Total: ${money(order.total_amount)}\n`;
  ownerMsg += `\n🔗 Manage: ${adminUrl}`;

  const ownerWa = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(ownerMsg)}`;
  return new Response(JSON.stringify({ success: true, trackingUrl: trackUrl, ownerWhatsappLink: ownerWa }), { headers: cors });
});