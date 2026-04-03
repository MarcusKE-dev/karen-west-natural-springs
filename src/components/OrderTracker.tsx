import { useState } from "react";
import { Search, Package, Clock, CheckCircle, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderData {
  order_number: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <Clock className="w-5 h-5" />, label: "Pending", color: "text-yellow-600 bg-yellow-100" },
  confirmed: { icon: <Package className="w-5 h-5" />, label: "Confirmed", color: "text-blue-600 bg-blue-100" },
  delivered: { icon: <CheckCircle className="w-5 h-5" />, label: "Delivered", color: "text-green-600 bg-green-100" },
  cancelled: { icon: <Truck className="w-5 h-5" />, label: "Cancelled", color: "text-destructive bg-destructive/10" },
};

const OrderTracker = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("order_number, customer_name, status, total_amount, created_at")
      .eq("order_number", orderNumber.trim().toUpperCase())
      .maybeSingle();

    if (error || !data) {
      toast.error("Order not found. Check the order number.");
    } else {
      setOrder(data as OrderData);
    }
    setLoading(false);
  };

  const status = order ? statusConfig[order.status] || statusConfig.pending : null;

  return (
    <div className="bg-card rounded-2xl shadow-md border border-border p-6 max-w-md mx-auto">
      <h3 className="text-lg font-display font-bold text-foreground mb-4 text-center">Track Your Order</h3>
      <form onSubmit={handleTrack} className="flex gap-2 mb-4">
        <input
          placeholder="e.g. KW-20260403-1234"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button type="submit" disabled={loading} className="px-4 py-2.5 rounded-xl bg-water-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">
          <Search className="w-4 h-4" />
        </button>
      </form>
      {order && status && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order</span>
            <span className="font-bold text-foreground">{order.order_number}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-bold text-primary">{Number(order.total_amount).toLocaleString()} KSH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm text-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
