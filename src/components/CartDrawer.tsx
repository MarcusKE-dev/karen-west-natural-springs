import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, Trash2, MapPin, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalAmount, isCartOpen, setIsCartOpen } = useCart();
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", location: "", instructions: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderNumber: string } | null>(null);

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

  const generateWhatsAppMessage = (orderNumber?: string) => {
    let msg = "Hello, I want to place an order:\n\n";
    items.forEach((item) => {
      msg += `• ${item.name} x ${item.quantity} — ${(item.unitPrice * item.quantity).toLocaleString()} KSH\n`;
    });
    msg += `\nTotal Items: ${totalItems}\nTotal: ${totalAmount.toLocaleString()} KSH`;
    if (orderNumber) msg += `\nOrder ID: #${orderNumber}`;
    if (checkoutForm.name) msg += `\nName: ${checkoutForm.name}`;
    if (checkoutForm.phone) msg += `\nPhone: ${checkoutForm.phone}`;
    if (checkoutForm.location) msg += `\nLocation: ${checkoutForm.location}`;
    if (checkoutForm.instructions) msg += `\nInstructions: ${checkoutForm.instructions}`;
    return encodeURIComponent(msg);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Cart is empty!"); return; }
    setIsSubmitting(true);

    try {
      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: checkoutForm.name,
          phone: checkoutForm.phone,
          location: checkoutForm.location || null,
          instructions: checkoutForm.instructions || null,
          total_amount: totalAmount,
          order_number: "temp",
        } as any)
        .select("id, order_number")
        .single();

      if (orderError) throw orderError;

      // Insert order items
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

      // Also send to Formspree as backup
      try {
        const formData = new FormData();
        formData.append("Order Number", order.order_number);
        formData.append("Customer", checkoutForm.name);
        formData.append("Phone", checkoutForm.phone);
        formData.append("Location", checkoutForm.location);
        formData.append("Total", `${totalAmount} KSH`);
        formData.append("Items", items.map((i) => `${i.name} x${i.quantity}`).join(", "));
        await fetch("https://formspree.io/f/meeplrnz", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
      } catch {
        // Backup failed silently — order is in DB
      }

      setOrderResult({ orderNumber: order.order_number });
      toast.success(`Order #${order.order_number} placed successfully!`);
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
    setCheckoutForm({ name: "", phone: "", location: "", instructions: "" });
    setIsCartOpen(false);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingCart className="w-5 h-5 text-primary" />
            {orderResult ? "Order Confirmed!" : `Your Cart (${totalItems})`}
          </SheetTitle>
        </SheetHeader>

        {orderResult ? (
          <div className="mt-6 text-center space-y-4">
            <div className="bg-primary/10 rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold text-primary font-display">{orderResult.orderNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">Save your order number to track your order.</p>
            <a
              href={`https://wa.me/254705062319?text=${generateWhatsAppMessage(orderResult.orderNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Confirm via WhatsApp
            </a>
            <button onClick={handleDone} className="w-full py-3 rounded-xl border border-border font-semibold hover:bg-secondary transition-colors">
              Done
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {/* Items */}
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

            {/* Checkout Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Delivery Details</p>
              <input required placeholder="Your Name" value={checkoutForm.name} onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <input required placeholder="Phone Number" value={checkoutForm.phone} onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={handlePinLocation} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full transition-colors">
                    <MapPin className="w-3 h-3" /> Pin Location
                  </button>
                </div>
                <input placeholder="Delivery Location" value={checkoutForm.location} onChange={(e) => setCheckoutForm({ ...checkoutForm, location: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <textarea placeholder="Instructions (optional)" rows={2} value={checkoutForm.instructions} onChange={(e) => setCheckoutForm({ ...checkoutForm, instructions: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />

              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-water-gradient text-primary-foreground font-bold text-base hover:opacity-90 hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              <a
                href={`https://wa.me/254705062319?text=${generateWhatsAppMessage()}`}
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
