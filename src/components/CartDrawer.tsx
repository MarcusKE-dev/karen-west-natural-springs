import { useState } from "react";
import { ShoppingCart, Minus, Plus, Trash2, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUSINESS_WHATSAPP = "254726732212";

const CartDrawer = () => {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalAmount, isCartOpen, setIsCartOpen } = useCart();
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", email: "", location: "", instructions: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderNumber: string; trackingUrl: string } | null>(null);

  const handlePinLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCheckoutForm({ ...checkoutForm, location: `Lat: ${pos.coords.latitude.toFixed(6)}, Lng: ${pos.coords.longitude.toFixed(6)}` });
          toast.success("Location pinned!");
        },
        () => toast.error("Could not get location. Enter manually.")
      );
    }
  };

  // WhatsApp message to BUSINESS — used for "Order via WhatsApp Instead"
  const generateOwnerWhatsAppMessage = () => {
    const lines = [
      "💧 *New Order — Karen West Natural Spring*",
      "",
      ...items.map((item) => `• ${item.name} x${item.quantity} — ${(item.unitPrice * item.quantity).toLocaleString()} KSH`),
      "",
      `💰 *Total:* ${totalAmount.toLocaleString()} KSH`,
      `🛒 *Items:* ${totalItems}`,
    ];
    if (checkoutForm.name) lines.push(`👤 *Name:* ${checkoutForm.name}`);
    if (checkoutForm.phone) lines.push(`📞 *Phone:* ${checkoutForm.phone}`);
    if (checkoutForm.location) lines.push(`📍 *Location:* ${checkoutForm.location}`);
    if (checkoutForm.instructions) lines.push(`📝 *Notes:* ${checkoutForm.instructions}`);
    return encodeURIComponent(lines.join("\n"));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Cart is empty!"); return; }
    setIsSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: checkoutForm.name,
          phone: checkoutForm.phone,
          customer_email: checkoutForm.email || null,
          location: checkoutForm.location || null,
          instructions: checkoutForm.instructions || null,
          total_amount: totalAmount,
          order_number: "temp",
        } as any)
        .select("id, order_number")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        product_type: item.type,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.unitPrice * item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      localStorage.setItem("kw-last-order", order.order_number);

      // Trigger notification edge function (best-effort — order is already saved)
      let trackingUrl = `/track/${order.order_number}`;
      try {
        const { data: notifData } = await supabase.functions.invoke("notify-order", {
          body: { orderId: order.id },
        });
        if (notifData?.trackingUrl) trackingUrl = notifData.trackingUrl;
      } catch {
        // silent — order saved, notification is best-effort
      }

      setOrderResult({ orderNumber: order.order_number, trackingUrl });
      toast.success(`Order #${order.order_number} placed!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    clearCart();
    setOrderResult(null);
    setCheckoutForm({ name: "", phone: "", email: "", location: "", instructions: "" });
    setIsCartOpen(false);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingCart className="w-5 h-5 text-primary" />
            {orderResult ? "Order Placed!" : `Your Cart (${totalItems})`}
          </SheetTitle>
        </SheetHeader>

        {/* ── SUCCESS SCREEN ── */}
        {orderResult ? (
          <div className="mt-6 space-y-4">
            <div className="bg-primary/10 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Your Order Number</p>
              <p className="text-3xl font-bold text-primary font-display tracking-widest">{orderResult.orderNumber}</p>
              <p className="text-xs text-muted-foreground mt-2">Save this number to track your delivery</p>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              {checkoutForm.email
                ? "A confirmation email is on its way to you."
                : "We'll contact you on the phone number you provided."}
            </p>

            <a
              href={orderResult.trackingUrl}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-colors"
            >
              📦 Track Your Order Live
            </a>

            <button
              onClick={handleDone}
              className="w-full py-3 rounded-xl border border-border font-semibold hover:bg-secondary transition-colors"
            >
              Done
            </button>
          </div>

        /* ── EMPTY CART ── */
        ) : items.length === 0 ? (
          <div className="mt-12 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>

        /* ── CART + CHECKOUT FORM ── */
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {/* Cart items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.unitPrice.toLocaleString()} KSH each</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-primary w-20 text-right">{(item.unitPrice * item.quantity).toLocaleString()} KSH</p>
                  <button onClick={() => removeItem(item.id)} className="text-destructive/60 hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t border-border">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{totalAmount.toLocaleString()} KSH</span>
            </div>

            {/* Checkout form */}
            <form onSubmit={handlePlaceOrder} className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Delivery Details</p>
              <input required placeholder="Your Name" value={checkoutForm.name} onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <input required placeholder="Phone Number" value={checkoutForm.phone} onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <input type="email" placeholder="Email (optional — for order confirmation)" value={checkoutForm.email} onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={handlePinLocation} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full transition-colors">
                    <MapPin className="w-3 h-3" /> Pin My Location
                  </button>
                </div>
                <input placeholder="Delivery Location (e.g. Ngong, off Magadi Rd)" value={checkoutForm.location} onChange={(e) => setCheckoutForm({ ...checkoutForm, location: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <textarea placeholder="Special instructions (optional)" rows={2} value={checkoutForm.instructions} onChange={(e) => setCheckoutForm({ ...checkoutForm, instructions: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />

              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-water-gradient text-primary-foreground font-bold text-base hover:opacity-90 hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <a
                href={`https://wa.me/${BUSINESS_WHATSAPP}?text=${generateOwnerWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp Instead
              </a>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;