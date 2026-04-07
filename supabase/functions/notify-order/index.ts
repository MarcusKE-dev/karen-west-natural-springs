import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({ messageId: z.string().uuid() });

const BUSINESS_EMAIL = "marcuske001@gmail.com"; // ← swap to Karen West email once Resend domain is verified

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Karen West Natural Spring <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  const body = await res.text();
  console.log(`Email to ${to}: ${res.status} ${body}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messageId } = parsed.data;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: msg, error } = await supabase
      .from("messages")
      .select("*")
      .eq("id", messageId)
      .single();

    if (error || !msg) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e3a5f;padding:20px 28px">
      <h1 style="margin:0;color:#fff;font-size:18px">💬 New Contact Message</h1>
      <p style="margin:4px 0 0;color:#93c5fd;font-size:12px">Karen West Natural Spring Website</p>
    </div>
    <div style="padding:24px 28px">
      <table style="width:100%;font-size:14px;margin-bottom:20px">
        <tr><td style="color:#6b7280;padding:4px 0;width:80px">Name</td><td style="font-weight:600;color:#111827">${msg.name}</td></tr>
        ${msg.phone ? `<tr><td style="color:#6b7280;padding:4px 0">Phone</td><td style="color:#111827">${msg.phone}</td></tr>` : ""}
        ${msg.email ? `<tr><td style="color:#6b7280;padding:4px 0">Email</td><td style="color:#111827">${msg.email}</td></tr>` : ""}
      </table>
      <div style="background:#f9fafb;border-left:4px solid #065f46;padding:16px;border-radius:4px">
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.6">${msg.message}</p>
      </div>
      ${msg.phone ? `<div style="margin-top:20px"><a href="https://wa.me/${msg.phone.replace(/\D/g, "").replace(/^0/, "254")}?text=${encodeURIComponent(`Hi ${msg.name}, thanks for reaching out to Karen West Natural Spring!`)}" style="background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block">Reply on WhatsApp</a></div>` : ""}
    </div>
  </div></body></html>`;

    await sendEmail(BUSINESS_EMAIL, `New Message from ${msg.name} — Karen West Website`, html);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-contact error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});