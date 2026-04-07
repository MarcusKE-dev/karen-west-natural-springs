import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, RefreshCw, MessageSquare, Package } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  location: string | null;
  instructions: string | null;
  total_amount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  created_at: string;
};

type Message = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusBtnColors: Record<string, string> = {
  pending: "bg-yellow-500 hover:bg-yellow-600 text-white",
  confirmed: "bg-blue-500 hover:bg-blue-600 text-white",
  delivered: "bg-emerald-600 hover:bg-emerald-700 text-white",
  cancelled: "bg-red-500 hover:bg-red-600 text-white",
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "messages">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [fetching, setFetching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeTab]);

  const fetchData = async () => {
    setFetching(true);
    if (activeTab === "orders") {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
    } else {
      const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      setMessages((data as Message[]) || []);
    }
    setFetching(false);
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
    setSigningIn(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status: status as "pending" | "confirmed" | "delivered" | "cancelled" }).eq("id", orderId);
    
    // Notify customer of status change
    try {
      await supabase.functions.invoke("notify-order", {
        body: { orderId, statusUpdate: true, newStatus: status },
      });
    } catch {
      // Notification failed silently
    }
    
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-emerald-800">Karen West Admin</CardTitle>
            <p className="text-emerald-600 text-sm">Natural Spring</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSignIn}
              disabled={signingIn}
            >
              {signingIn ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const counts = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Karen West Admin</h1>
        <Button variant="outline" size="sm" className="border-white text-white hover:bg-emerald-700" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 flex items-center gap-2 border-b bg-white">
        <Button
          variant={activeTab === "orders" ? "default" : "outline"}
          size="sm"
          className={activeTab === "orders" ? "bg-emerald-700 hover:bg-emerald-800" : ""}
          onClick={() => setActiveTab("orders")}
        >
          <Package className="h-4 w-4 mr-1" /> Orders
        </Button>
        <Button
          variant={activeTab === "messages" ? "default" : "outline"}
          size="sm"
          className={activeTab === "messages" ? "bg-emerald-700 hover:bg-emerald-800" : ""}
          onClick={() => setActiveTab("messages")}
        >
          <MessageSquare className="h-4 w-4 mr-1" /> Messages
        </Button>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={fetching}>
          <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="p-4 max-w-5xl mx-auto">
        {fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
          </div>
        ) : activeTab === "orders" ? (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {(["pending", "confirmed", "delivered", "cancelled"] as const).map((s) => (
                <Card key={s} className="text-center">
                  <CardContent className="py-4">
                    <p className="text-2xl font-bold">{counts[s]}</p>
                    <p className="text-sm capitalize text-muted-foreground">{s}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <p className="font-bold text-lg">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("en-KE", {
                              year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Badge className={`${statusColors[order.status]} border`}>{order.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                        <p><span className="font-medium">Customer:</span> {order.customer_name}</p>
                        <p><span className="font-medium">Phone:</span> {order.phone}</p>
                        {order.location && <p><span className="font-medium">Location:</span> {order.location}</p>}
                        {order.instructions && <p className="sm:col-span-2"><span className="font-medium">Instructions:</span> {order.instructions}</p>}
                        <p><span className="font-medium">Total:</span> {order.total_amount > 0 ? `${order.total_amount} KSH` : "As negotiated"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(["pending", "confirmed", "delivered", "cancelled"] as const).map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            className={`text-xs capitalize ${order.status === s ? statusBtnColors[s] + " ring-2 ring-offset-1 ring-black/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                            onClick={() => updateStatus(order.id, s)}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <Card key={msg.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <p className="font-bold">{msg.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleDateString("en-KE", {
                            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {msg.email && <p className="text-sm text-muted-foreground">{msg.email}</p>}
                      {msg.phone && <p className="text-sm text-muted-foreground">{msg.phone}</p>}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      {msg.phone && (
                        <a
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
                        >
                          Reply via WhatsApp
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
