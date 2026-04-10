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

const BUSINESS_EMAIL = "karenwestsprings@gmail.com";
const BUSINESS_WHATSAPP = "254726732212";

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is NOT set in Supabase secrets. Emails will not send.");
    return { error: "RESEND_API_KEY not set" };
  }
  console.log(`📧 Sending email to: ${to} | Subject: ${subject}`);
  const payload = {
    from: "Karen West Natural Spring <orders@karenwestwater.co.ke>",
    reply_to: "karenwestsprings@gmail.com",
    to: [to],
    subject,
    html,
  };
  console.log("📤 Resend payload from:", payload.from);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (res.ok) {
    console.log(`✅ Email sent to ${to} — Resend ID: ${body}`);
    return { success: true };
  } else {
    console.error(`❌ Email FAILED to ${to} — Status: ${res.status} — Error: ${body}`);
    return { error: body };
  }
}

function formatTime(dateStr: string) {
  // Format in East Africa Time (UTC+3)
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
      <h2 style="margin:0 0 8px;color:#065f46">Order Confirmed!</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Hi <strong>${order.customer_name}</strong>, we have received your order and will be in touch shortly.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px">
        <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase">Order Number</p>
        <p style="margin:0;font-size:28px;font-weight:700;color:#065f46">${order.order_number}</p>
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
        <a href="${trackingUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">Track My Order Live</a>
      </div>
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center">Questions? Call us: <strong>+254 726 732 212</strong></p>
    </div>
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">Karen West Natural Spring · Ngong · P.O. Box 24563-00502, Nairobi</p>
    </div>
  </div></body></html>`;
}

function businessEmailHtml(order: any, items: any[], trackingUrl: string, adminOrderUrl: string) {
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
      <div style="display:flex;gap:12px">
        <a href="${adminOrderUrl}" style="background:#1e3a5f;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block">⚙️ Manage This Order</a>
        <a href="${trackingUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block">📦 View Tracking Page</a>
      </div>
    </div>
  </div></body></html>`;
}

function statusChangeEmailHtml(order: any, newStatus: string, trackingUrl: string) {
  const statusLabels: Record<string, string> = {
    pending: "Order Placed",
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
      <p style="margin:0 0 24px;font-size:14px;color:#6b7280">Your order <strong>${order.order_number}</strong> status has been updated:</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px">
        <p style="margin:0;font-size:24px;font-weight:700;color:#065f46">${label}</p>
      </div>
      <a href="${trackingUrl}" style="background:#065f46;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">Track My Order</a>
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">Karen West Natural Spring · +254 726 732 212</p>
    </div>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { orderId, statusUpdate, newStatus } = parsed.data;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: order, error: orderErr } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (orderErr || !order) return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", orderId);

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
      const statusLabels: Record<string, string> = { pending: "Placed", confirmed: "Confirmed ✅", delivered: "Delivered 🎉", cancelled: "Cancelled ❌" };
      const statusLabel = statusLabels[newStatus] || newStatus;
      const statusMsg = `Hi ${order.customer_name},\n\nYour order ${order.order_number} has been updated:\n\n📦 Status: ${statusLabel}\n\nTrack your order:\n${trackingUrl}\n\nKaren West Natural Spring\n+254 726 732 212`;
      const customerWhatsappLink = normalised ? `https://wa.me/${normalised}?text=${encodeURIComponent(statusMsg)}` : null;

      return new Response(JSON.stringify({ success: true, customerWhatsappLink }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // === NEW ORDER FLOW ===
    // Email business owner
    const adminOrderUrl = `${siteUrl}/admin?order=${order.order_number}`;
    await sendEmail(BUSINESS_EMAIL, `New Order ${order.order_number} — ${order.customer_name}`, businessEmailHtml(order, items ?? [], trackingUrl, adminOrderUrl));

    // Email customer if they provided an email
    if (order.customer_email) {
      await sendEmail(order.customer_email, `Your Karen West order is confirmed — ${order.order_number}`, customerEmailHtml(order, items ?? [], trackingUrl));
    }

    // Build customer WhatsApp message
    const phone = order.phone?.replace(/\D/g, "");
    const normalised = phone?.startsWith("0") ? "254" + phone.slice(1) : phone;
    const orderType = isTruck ? "🚛 BULK TRANSPORT" : "💧 WATER ORDER";
    let customerMsg = `Order Confirmed!\n\nHi ${order.customer_name}, your order ${order.order_number} has been received!\n\n`;
    (items ?? []).forEach((i: any) => {
      customerMsg += isTruck
        ? `• ${i.product_name} x${i.quantity} — Price as negotiated\n`
        : `• ${i.product_name} x${i.quantity} — ${Number(i.total_price).toLocaleString()} KSH\n`;
    });
    customerMsg += isTruck
      ? `\nTotal: Price as negotiated\n`
      : `\nTotal: ${Number(order.total_amount).toLocaleString()} KSH\n`;
    customerMsg += `\nTrack your order:\n${trackingUrl}\n\nThank you for choosing Karen West Natural Spring!`;
    const customerWhatsappLink = normalised ? `https://wa.me/${normalised}?text=${encodeURIComponent(customerMsg)}` : null;

    // Build owner WhatsApp notification
    let ownerMsg = `${orderType} — New Order!\n\nOrder: ${order.order_number}\nCustomer: ${order.customer_name}\nPhone: ${order.phone}\n`;
    if (order.location) ownerMsg += `Location: ${order.location}\n`;
    if (order.instructions) ownerMsg += `Notes: ${order.instructions}\n`;
    ownerMsg += `\nItems:\n`;
    (items ?? []).forEach((i: any) => {
      ownerMsg += isTruck
        ? `• ${i.product_name} x${i.quantity} — Price as negotiated\n`
        : `• ${i.product_name} x${i.quantity} — ${Number(i.total_price).toLocaleString()} KSH\n`;
    });
    ownerMsg += isTruck
      ? `\nTotal: Price as negotiated\n`
      : `\nTotal: ${Number(order.total_amount).toLocaleString()} KSH\n`;
    ownerMsg += `\nTrack: ${trackingUrl}`;
    const ownerWhatsappLink = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(ownerMsg)}`;

    return new Response(JSON.stringify({ success: true, trackingUrl, customerWhatsappLink, ownerWhatsappLink }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("notify-order error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});