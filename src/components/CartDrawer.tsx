import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, Trash2, MapPin, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalAmount, isCartOpen, setIsCartOpen } = useCart();
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", email: "", location: "", instructions: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderNumber: string; trackingUrl: string; customerWhatsappLink: string | null } | null>(null);

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

<<<<<<< HEAD
=======
      // Trigger notification edge function