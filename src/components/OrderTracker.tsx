import { useState, useEffect } from "react";
import { Search, Package, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  pending:   { icon: <Clock className="w-5 h-5" />,       label: "Pending",   color: "text-yellow-600 bg-yellow-100" },
  confirmed: { icon: <Package className="w-5 h-5" />,     label: "Confirmed", color: "text-blue-600 bg-blue-100" },
  delivered: { icon: <CheckCircle className="w-5 h-5" />, label: "Delivered", color: "text-green-600 bg-green-100" },
  cancelled: { icon: <XCircle className="w-5 h-5" />,     label: "Cancelled", color: "text-red-600 bg-red-100" },
};

const OrderTracker = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [recentOrder, setRecentOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const recent = localStorage.getItem("kw-last-order");
    if (recent) setRecentOrder(recent);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("order_number, customer_name, status, total_amount, created_at")
      .eq("order_number", trimmed)
      .maybeSingle();

    if (error || !data) {
      toast.error("Order not found. Check the order number and try again.");
    } else {
      setOrder(data as OrderData);
    }
    setLoading(false);
  };

  const goToFullTracking = () => {
    if (order) navigate(`/track/${order.order_number}`);
  };

  const status = order ? statusConfig[order.status] ?? statusConfig.pending : null;

  return (
    <div className="bg-card rounded-2xl shadow-md border border-border p-6 max-w-md mx-auto">
      <h3 className="text-lg font-display font-bold text-foreground mb-4 text-center">Track Your Order</h3>

      {recentOrder && (
        <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/15 text-center">
          <p className="text-xs text-muted-foreground mb-1">Your recent order:</p>
          <button
            onClick={() => navigate(`/track/${recentOrder}`)}
            className="text-sm font-bold text-primary hover:underline"
          >
            {recentOrder} → Track Now
          </button>
        </div>
      )}

      <form onSubmit={handleTrack} className="flex gap-2 mb-4">
        <input
          placeholder="e.g. KW-20260403-1234"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-water-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </form>

      {order && status && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order</span>
            <span className="font-bold text-foreground font-mono">{order.order_number}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Customer</span>
            <span className="text-sm font-medium text-foreground">{order.customer_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </div>
          {order.total_amount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold text-primary">{Number(order.total_amount).toLocaleString()} KSH</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm text-foreground">{new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>

          <button
            onClick={goToFullTracking}
            className="w-full mt-2 py-3 rounded-xl bg-water-gradient text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
            View Full Tracking Page
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
