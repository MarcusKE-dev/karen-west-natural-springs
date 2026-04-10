try {
  const { data: notifData, error: notifError } = await supabase.functions.invoke("notify-order", {
    body: { orderId: order.id },
  });
  if (notifError) {
    console.error("notify-order error:", notifError);
  } else {
    if (notifData?.trackingUrl) trackingUrl = notifData.trackingUrl;
    if (notifData?.customerWhatsappLink) customerWhatsappLink = notifData.customerWhatsappLink;
  }
} catch (err) {
  console.error("notify-order exception:", err);
}