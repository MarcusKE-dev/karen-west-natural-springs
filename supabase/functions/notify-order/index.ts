import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  orderId: z.string().uuid(),
  statusUpdate: z.boolean().optional(),
  newStatus: z.string().optional(),
});

const BUSINESS_EMAIL = "karenwestspring@gmail.com";
const BUSINESS_WHATSAPP = "254726732212";

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not set in Supabase secrets");
    return { error: "RESEND_API_KEY not set" };
  }
  console.log(`📧 Sending email to ${to} with subject: ${subject}`);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Karen West Natural Spring <orders@mail.karenwestwater.co.ke>",
      reply_to: "karenwestspring@gmail.com",
      to: [to],
      subject,
      html,
    }),
  });
  const body = await res.text();
  if (res.ok) {
    console.log(`✅ Email sent to ${to}: ${res.status}`);
    return { success: true };
  } else {
    console.error(`❌ Email FAILED to ${to}: ${res.status} — ${body}`);
    return { error: body };
  }
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "medium", timeStyle: "short" });
}

function customerEmailHtml(order: any, items: any[], trackingUrl: string) {
  const isTruck = items.some((i: any) => i.product_type === "truck");
  const rows = items.map((i: any) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151">${i.product_name} x${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#065f46">${isTruck ? "As negotiated" : Number(i.total_price).toLocaleString() + " KSH"}</td></tr>`
  ).join("");
  const totalRow = isTruck
    ? `<tr><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#111827">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:16px;color:#065f46">Price as negotiated</td></tr>`
    : `<tr><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#111827">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:16px;color:#065f46">${Number(order.total_amount).toLocaleString()} KSH</td></tr>`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#065f46;padding:28px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:22px">Karen West Natural Spring</h1>
      <p style="margin:6px 0 0;color:#a7f3d0;font-size:14px">Pure Water. Reliable Supply.</p>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;color:#065f46">Order Confirmed! 💧</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Hi <strong>${order.customer_name}</strong>, we have received your order and will be in touch shortly.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px">
        <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px">Your Order Number</p>
        <p style="margin:0;font-size:32px;font-weight:700;color:#065f46;letter-spacing:2px">${order.order_number}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#9ca3af">${formatTime(order.created_at)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><th style="text-align:left;font-size:12px;color:#9ca3af;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #e5e7eb">Item</th><th style="text-align:right;font-size:12px;color:#9ca3af;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #e5e7eb">Amount</th></tr>
        ${rows}
        ${totalRow}
      </table>
      ${order.location ? `<p style="margin:0 0 6px;font-size:13px;color:#6b7280">📍 <strong>Delivery to:</strong> ${order.location}</p>` : ""}
      ${order.instructions ? `<p style="margin:0 0 20px;font-size:13px;color:#6b7280">📝 <strong>Instructions:</strong> ${order.instructions}</p>` : "<div style='margin-bottom:20px'></div>"}
      <div style="text-align:center;margin:24px 0">
        <a href="${trackingUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">📦 Track My Order Live</a>
      </div>
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center">Questions? Call or WhatsApp: <strong>+254 726 732 212</strong></p>
    </div>
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">Karen West Natural Spring · Ngong · karenwestwater.co.ke</p>
    </div>
  </div></body></html>`;
}

function businessEmailHtml(order: any, items: any[], trackingUrl: string) {
  const isTruck = items.some((i: any) => i.product_type === "truck");
  const rows = items.map((i: any) =>
    `<tr><td style="padding:6px 0;border-bottom:1px solid #e5e7eb;color:#374151">${i.product_name} x${i.quantity}</td><td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;color:#374151">${isTruck ? "As negotiated" : Number(i.total_price).toLocaleString() + " KSH"}</td></tr>`
  ).join("");
  const orderType = isTruck ? "🚛 BULK TRANSPORT" : "💧 PURIFIED WATER";
  const totalDisplay = isTruck ? "Price as negotiated" : `${Number(order.total_amount).toLocaleString()} KSH`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e3a5f;padding:20px 28px">
      <h1 style="margin:0;color:#fff;font-size:18px">${orderType} — New Order ${order.order_number}</h1>
      <p style="margin:4px 0 0;color:#93c5fd;font-size:12px">${formatTime(order.created_at)}</p>
    </div>
    <div style="padding:24px 28px">
      <table style="width:100%;font-size:14px;margin-bottom:20px">
        <tr><td style="color:#6b7280;padding:4px 0;width:120px">Customer</td><td style="font-weight:600;color:#111827">${order.customer_name}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0">Phone</td><td style="color:#111827">${order.phone}</td></tr>
        ${order.customer_email ? `<tr><td style="color:#6b7280;padding:4px 0">Email</td><td style="color:#111827">${order.customer_email}</td></tr>` : ""}
        ${order.location ? `<tr><td style="color:#6b7280;padding:4px 0">Location</td><td style="color:#111827">${order.location}</td></tr>` : ""}
        ${order.instructions ? `<tr><td style="color:#6b7280;padding:4px 0">Notes</td><td style="color:#111827">${order.instructions}</td></tr>` : ""}
        <tr><td style="color:#6b7280;padding:4px 0">Total</td><td style="font-weight:700;font-size:16px;color:#065f46">${totalDisplay}</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rows}</table>
      <a href="${trackingUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block">View Order Tracking Page</a>
    </div>
  </div></body></html>`;
}

function statusChangeEmailHtml(order: any, newStatus: string, trackingUrl: string) {
  const statusLabels: Record<string, string> = {
    pending: "Order Placed 🕐",
    confirmed: "Order Confirmed ✅",
    delivered: "Order Delivered 🎉",
    cancelled: "Order Cancelled ❌",
  };
  const label = statusLabels[newStatus] || newStatus;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#065f46;padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:20px">Order Status Update</h1>
    </div>
    <div style="padding:32px;text-align:center">
      <p style="margin:0 0 8px;font-size:14px;color:#6b7280">Hi <strong>${order.customer_name}</strong>,</p>
      <p style="margin:0 0 24px;font-size:14px;color:#6b7280">Your order <strong>${order.order_number}</strong> has been updated:</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px">
        <p style="margin:0;font-size:24px;font-weight:700;color:#065f46">${label}</p>
      </div>
      <a href="${trackingUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">Track My Order</a>
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">Karen West Natural Spring · +254 726 732 212 · karenwestwater.co.ke</p>
    </div>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    console.log("📨 notify-order called with:", JSON.stringify(body));

    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      console.error("❌ Invalid request body:", parsed.error);
      return new Response(JSON.stringify({ error: "Invalid request", details: parsed.error }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { orderId, statusUpdate, newStatus } = parsed.data;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: order, error: orderErr } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (orderErr || !order) {
      console.error("❌ Order not found:", orderId, orderErr);
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    console.log("✅ Order found:", order.order_number);

    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", orderId);
    console.log("✅ Items fetched:", items?.length ?? 0);

    const siteUrl = Deno.env.get("SITE_URL") || "https://www.karenwestwater.co.ke";
    const trackingUrl = `${siteUrl}/track/${order.order_number}`;
    const isTruck = (items ?? []).some((i: any) => i.product_type === "truck");

    // === STATUS UPDATE FLOW ===
    if (statusUpdate && newStatus) {
      if (order.customer_email) {
        await sendEmail(
          order.customer_email,
          `Order ${order.order_number} — Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
          statusChangeEmailHtml(order, newStatus, trackingUrl)
        );
      }
      const phone = order.phone?.replace(/\D/g, "");
      const normalised = phone?.startsWith("0") ? "254" + phone.slice(1) : phone;
      const statusLabels: Record<string, string> = { pending: "Placed 🕐", confirmed: "Confirmed ✅", delivered: "Delivered 🎉", cancelled: "Cancelled ❌" };
      const statusLabel = statusLabels[newStatus] || newStatus;
      const statusMsg = `Hi ${order.customer_name},\n\nYour Karen West order ${order.order_number} has been updated:\n\n📦 Status: ${statusLabel}\n\nTrack your order:\n${trackingUrl}\n\nKaren West Natural Spring\n+254 726 732 212`;
      const customerWhatsappLink = normalised ? `https://wa.me/${normalised}?text=${encodeURIComponent(statusMsg)}` : null;
      return new Response(JSON.stringify({ success: true, customerWhatsappLink }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // === NEW ORDER FLOW ===
    console.log("📧 Sending business notification to:", BUSINESS_EMAIL);
    const bizResult = await sendEmail(BUSINESS_EMAIL, `New Order ${order.order_number} — ${order.customer_name}`, businessEmailHtml(order, items ?? [], trackingUrl));
    console.log("Business email result:", JSON.stringify(bizResult));

    if (order.customer_email) {
      console.log("📧 Sending customer confirmation to:", order.customer_email);
      const custResult = await sendEmail(order.customer_email, `Your Karen West order is confirmed — ${order.order_number}`, customerEmailHtml(order, items ?? [], trackingUrl));
      console.log("Customer email result:", JSON.stringify(custResult));
    } else {
      console.log("ℹ️ No customer email provided — skipping customer notification");
    }

    // Build owner WhatsApp notification message
    const orderType = isTruck ? "🚛 BULK TRANSPORT" : "💧 WATER ORDER";
    let ownerMsg = `${orderType} — New Order!\n\n`;
    ownerMsg += `📋 Order: ${order.order_number}\n`;
    ownerMsg += `👤 Customer: ${order.customer_name}\n`;
    ownerMsg += `📞 Phone: ${order.phone}\n`;
    if (order.location) ownerMsg += `📍 Location: ${order.location}\n`;
    if (order.instructions) ownerMsg += `📝 Notes: ${order.instructions}\n`;
    ownerMsg += `\n🛒 Items:\n`;
    (items ?? []).forEach((i: any) => {
      ownerMsg += isTruck
        ? `  • ${i.product_name} x${i.quantity} — As negotiated\n`
        : `  • ${i.product_name} x${i.quantity} — ${Number(i.total_price).toLocaleString()} KSH\n`;
    });
    ownerMsg += isTruck ? `\n💰 Total: As negotiated\n` : `\n💰 Total: ${Number(order.total_amount).toLocaleString()} KSH\n`;
    ownerMsg += `\n🔗 Track: ${trackingUrl}`;
    const ownerWhatsappLink = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(ownerMsg)}`;

    return new Response(JSON.stringify({ success: true, trackingUrl, ownerWhatsappLink }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error("❌ notify-order crashed:", err);
    return new Response(JSON.stringify({ error: "Internal error", message: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});