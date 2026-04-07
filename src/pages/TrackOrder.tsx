import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, ArrowLeft, MapPin, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  total_amount: number;
  location: string | null;
  instructions: string | null;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100 border-yellow-300" },
  { key: "confirmed", label: "Confirmed", icon: Package, color: "text-blue-600", bg: "bg-blue-100 border-blue-300" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100 border-green-300" },
];

const statusIndex: Record<string, number> = { pending: 0, confirmed: 1, delivered: 2, cancelled: -1 };

const TrackOrder = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchOrder = async (num: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", num.toUpperCase())
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setOrder(data as OrderData);

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", data.id);

    setItems((orderItems as OrderItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!orderNumber) return;
    fetchOrder(orderNumber);

    const channel = supabase
      .channel(`order-${orderNumber}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `order_number=eq.${orderNumber.toUpperCase()}`,
        },
        (payload) => {
          setOrder((prev) => (prev ? { ...prev, ...payload.new } as OrderData : prev));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center max-w-md w-full">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find order "{orderNumber}".</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = statusIndex[order.status] ?? 0;
  const isCancelled = order.status === "cancelled";
  const isTruckOrder = items.some((i) => i.product_type === "truck");

  return (
    <div className="min-h-screen bg-secondary">
      <div className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Order Tracking</h1>
            <p className="text-sm text-muted-foreground">Live updates enabled</p>
          </div>
          <span className="ml-auto relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-card rounded-2xl shadow-md border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Order Number</p>
          <p className="text-3xl font-display font-bold text-primary">{order.order_number}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Placed on {new Date(order.created_at).toLocaleDateString("en-KE", { dateStyle: "long" })}
          </p>
        </div>

        {isCancelled ? (
          <div className="bg-destructive/10 rounded-2xl border border-destructive/30 p-6 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <p className="text-lg font-bold text-destructive">Order Cancelled</p>
            <p className="text-sm text-muted-foreground mt-1">This order has been cancelled.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-md border border-border p-6">
            <h2 className="text-sm font-semibold text-foreground mb-6">Delivery Progress</h2>
            <div className="flex items-start justify-between relative">
              <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-border rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              {statusSteps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i <= currentIdx;
                return (
                  <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? step.bg + " " + step.color : "bg-card border-border text-muted-foreground"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`text-xs mt-2 font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl shadow-md border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium text-foreground">{order.customer_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium text-foreground">{order.phone}</span>
            </div>
            {order.location && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">{order.location}</span>
              </div>
            )}
            {order.instructions && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Notes</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">{order.instructions}</span>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <>
              <hr className="border-border" />
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.product_name} × {item.quantity}</span>
                    <span className="font-medium text-primary">
                      {isTruckOrder ? "As negotiated" : `${Number(item.total_price).toLocaleString()} KSH`}
                    </span>
                  </div>
                ))}
              </div>
              {!isTruckOrder && (
                <>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-primary text-lg">{Number(order.total_amount).toLocaleString()} KSH</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <a
          href={`https://wa.me/254705062319?text=${encodeURIComponent(`Hi, I'd like to check on my order #${order.order_number}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Contact Us on WhatsApp
        </a>

        <Link to="/" className="block text-center text-sm text-primary font-semibold hover:underline">
          ← Back to Karen West
        </Link>
      </div>
    </div>
  );
};

export default TrackOrder;
