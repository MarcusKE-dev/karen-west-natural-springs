import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUSINESS_EMAIL = "karenwestsprings@gmail.com";

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) { console.error("RESEND_API_KEY secret is missing"); return false; }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            from: "Karen West Natural Spring <hello@mail.karenwestwater.co.ke>",
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

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

    console.log("notify-contact invoked");

    let body: any;
    try { body = await req.json(); }
    catch { return new Response(JSON.stringify({ error: "Bad JSON" }), { status: 400, headers: cors }); }

    console.log("body:", JSON.stringify(body));

    const { messageId } = body ?? {};
    if (!messageId) {
        console.error("Missing messageId");
        return new Response(JSON.stringify({ error: "messageId required" }), { status: 400, headers: cors });
    }

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: msg, error } = await sb.from("messages").select("*").eq("id", messageId).single();
    if (error || !msg) {
        console.error("Message not found:", messageId, error);
        return new Response(JSON.stringify({ error: "Message not found" }), { status: 404, headers: cors });
    }
    console.log("message from:", msg.name);

    const waPhone = msg.phone ? msg.phone.replace(/\D/g, "").replace(/^0/, "254") : null;

    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
<div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:#1e3a5f;padding:20px 28px">
    <h1 style="margin:0;color:#fff;font-size:18px">💬 New Contact Message</h1>
    <p style="margin:4px 0 0;color:#93c5fd;font-size:12px">karenwestwater.co.ke</p>
  </div>
  <div style="padding:24px 28px">
    <table style="width:100%;font-size:14px;margin-bottom:20px">
      <tr><td style="color:#6b7280;padding:4px 0;width:70px">Name</td><td style="font-weight:600;color:#111827">${msg.name}</td></tr>
      ${msg.phone ? `<tr><td style="color:#6b7280;padding:4px 0">Phone</td><td style="color:#111827">${msg.phone}</td></tr>` : ""}
      ${msg.email ? `<tr><td style="color:#6b7280;padding:4px 0">Email</td><td style="color:#111827">${msg.email}</td></tr>` : ""}
    </table>
    <div style="background:#f9fafb;border-left:4px solid #065f46;padding:16px;border-radius:4px;margin-bottom:20px">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6">${msg.message}</p>
    </div>
    ${waPhone ? `<a href="https://wa.me/${waPhone}?text=${encodeURIComponent(`Hi ${msg.name}, thanks for contacting Karen West Natural Spring! How can we help you?`)}"
       style="background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block">
       💬 Reply on WhatsApp
    </a>` : ""}
  </div>
</div></body></html>`;

    await sendEmail(BUSINESS_EMAIL, `New Message from ${msg.name} — Karen West Website`, html);

    return new Response(JSON.stringify({ success: true }), { headers: cors });
});