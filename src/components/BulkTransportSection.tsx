import { useState } from "react";
import { Truck, MapPin } from "lucide-react";
import waterTruck from "@/assets/water-truck.webp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BulkTransportSection = () => {
  const [capacity, setCapacity] = useState("10000");
  const [form, setForm] = useState({ location: "", amount: "", name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          phone: form.phone,
          customer_email: form.email || null,
          location: form.location || null,
          instructions: `Bulk transport: ${capacity}L truck, Amount: ${form.amount || capacity}L`,
          total_amount: 0,
          order_number: "temp",
        } as any)
        .select("id, order_number")
        .single();

      if (error) throw error;

      await supabase.from("order_items").insert({
        order_id: order.id,
        product_name: `Bulk Water Transport (${capacity}L Truck)`,
        product_type: "truck",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      });

      // Trigger notification edge function
      try {
        await supabase.functions.invoke("notify-order", {
          body: { orderId: order.id },
        });
      } catch {
        // Notification failed silently
      }

      // Save to localStorage for recent order tracking
      localStorage.setItem("kw-last-order", order.order_number);

      setLastOrderNumber(order.order_number);
      toast.success(`Transport request submitted! Order: ${order.order_number}`);
      setForm({ location: "", amount: "", name: "", phone: "", email: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePinLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setForm({ ...form, location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}` });
          toast.success("Location pinned successfully!");
        },
        () => toast.error("Could not get your location. Please enter it manually.")
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  return (
    <section id="transport" className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
            Bulk Supply
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Bulk Soft Water Transportation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
            We supply soft water using our fleet of water trucks for institutions, construction sites, farms, and other water businesses across Ngong and surrounding areas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <div className="rounded-2xl overflow-hidden shadow-xl mb-8 group">
              <img src={waterTruck} alt="Karen West water truck" loading="lazy" className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCapacity("5000")}
                className={`p-5 sm:p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                  capacity === "5000" ? "border-primary bg-primary/10 shadow-lg scale-[1.02]" : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <span className="text-lg sm:text-xl font-bold text-foreground">5,000 L</span>
                <span className="block text-xs sm:text-sm text-muted-foreground mt-1">From 3,000 KSH</span>
              </button>
              <button
                onClick={() => setCapacity("10000")}
                className={`p-5 sm:p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                  capacity === "10000" ? "border-primary bg-primary/10 shadow-lg scale-[1.02]" : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <Truck className="w-10 h-10 text-primary mx-auto mb-2" />
                <span className="text-lg sm:text-xl font-bold text-foreground">10,000 L</span>
                <span className="block text-xs sm:text-sm text-muted-foreground mt-1">Price varies by location</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              * Pricing starts from <strong className="text-foreground">3,000 KSH</strong> and varies by delivery location and quantity.
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
            <h3 className="text-xl font-display font-bold text-foreground mb-6">Request Water Transport</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <input required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <input type="email" placeholder="Email (optional — get order updates)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Capacity</label>
                <select value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
                  <option value="5000">5,000 Litres</option>
                  <option value="10000">10,000 Litres</option>
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-foreground">Delivery Location</label>
                  <button type="button" onClick={handlePinLocation} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full transition-colors">
                    <MapPin className="w-3.5 h-3.5" /> Pin My Location
                  </button>
                </div>
                <input required placeholder="Enter location or pin it" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <input placeholder="Amount of water required (litres)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl bg-water-gradient text-primary-foreground font-bold text-lg hover:opacity-90 hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                {submitting ? "Submitting..." : "Request Transport"}
              </button>
            </form>

            {lastOrderNumber && (
              <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm text-muted-foreground mb-1">Your order number:</p>
                <p className="text-lg font-bold text-primary font-mono">{lastOrderNumber}</p>
                <a
                  href={`/track/${lastOrderNumber}`}
                  className="inline-flex items-center justify-center gap-2 mt-3 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  📦 Track Order
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkTransportSection;
