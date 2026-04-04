import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const BodySchema = z.object({
  orderId: z.string().uuid(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    // Build tracking URL
    const siteUrl = Deno.env.get("SITE_URL") || "https://karen-west-natural-springs.lovable.app";
    const trackingUrl = `${siteUrl}/track/${order.order_number}`;

    // Generate WhatsApp notification message for the customer
    let customerMsg = `🎉 *Order Confirmed!*\n\n`;
    customerMsg += `Hi ${order.customer_name}, your order has been received!\n\n`;
    customerMsg += `📦 *Order Number:* ${order.order_number}\n`;

    if (items && items.length > 0) {
      customerMsg += `\n🛒 *Items:*\n`;
      for (const item of items) {
        customerMsg += `  • ${item.product_name} × ${item.quantity} — ${Number(item.total_price).toLocaleString()} KSH\n`;
      }
    }

    customerMsg += `\n💰 *Total:* ${Number(order.total_amount).toLocaleString()} KSH\n`;
    customerMsg += `\n📍 *Track your order live:*\n${trackingUrl}\n`;
    customerMsg += `\nThank you for choosing Karen West Natural Spring! 💧`;

    // Generate WhatsApp link for the customer
    const phone = order.phone?.replace(/\D/g, "");
    const whatsappLink = phone
      ? `https://wa.me/${phone.startsWith("0") ? "254" + phone.slice(1) : phone}?text=${encodeURIComponent(customerMsg)}`
      : null;

    // Also generate business notification message
    let bizMsg = `📋 *New Order Received*\n\n`;
    bizMsg += `Order: ${order.order_number}\n`;
    bizMsg += `Customer: ${order.customer_name}\n`;
    bizMsg += `Phone: ${order.phone}\n`;
    bizMsg += `Location: ${order.location || "Not specified"}\n`;
    bizMsg += `Total: ${Number(order.total_amount).toLocaleString()} KSH\n`;
    if (order.instructions) bizMsg += `Instructions: ${order.instructions}\n`;
    bizMsg += `\nTracking: ${trackingUrl}`;

    const businessWhatsappLink = `https://wa.me/254705062319?text=${encodeURIComponent(bizMsg)}`;

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber: order.order_number,
        trackingUrl,
        customerWhatsappLink: whatsappLink,
        businessWhatsappLink,
        customerMessage: customerMsg,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("notify-order error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
