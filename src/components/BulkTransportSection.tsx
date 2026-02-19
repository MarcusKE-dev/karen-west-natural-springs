import { useState } from "react";
import { Truck, MapPin } from "lucide-react";
import waterTruck from "@/assets/water-truck.png";
import { toast } from "sonner";

const BulkTransportSection = () => {
  const [capacity, setCapacity] = useState("10000");
  const [form, setForm] = useState({ location: "", amount: "", name: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Transport request submitted! We'll reach out shortly.");
    setForm({ location: "", amount: "", name: "", phone: "" });
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
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">Section 2</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Bulk Soft Water Transportation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We supply soft water using our fleet of water trucks for institutions, construction sites, farms, and other water businesses. Reliable delivery, competitive pricing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image & Info */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
              <img src={waterTruck} alt="Karen West water truck" className="w-full h-80 object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCapacity("5000")}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  capacity === "5000" ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <span className="text-xl font-bold text-foreground">5,000 L</span>
                <span className="block text-sm text-muted-foreground mt-1">From 3,000 KSH</span>
              </button>
              <button
                onClick={() => setCapacity("10000")}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  capacity === "10000" ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <Truck className="w-10 h-10 text-primary mx-auto mb-2" />
                <span className="text-xl font-bold text-foreground">10,000 L</span>
                <span className="block text-sm text-muted-foreground mt-1">Price varies by location</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              * Pricing starts from <strong>3,000 KSH</strong> and varies by delivery location and quantity. Contact us for a quote.
            </p>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl shadow-md border border-border p-8">
            <h3 className="text-xl font-display font-bold text-foreground mb-6">Request Water Transport</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
              <input
                required
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Capacity</label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="5000">5,000 Litres</option>
                  <option value="10000">10,000 Litres</option>
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-foreground">Delivery Location</label>
                  <button
                    type="button"
                    onClick={handlePinLocation}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Pin My Location
                  </button>
                </div>
                <input
                  required
                  placeholder="Enter location or pin it"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <input
                placeholder="Amount of water required (litres)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="w-full py-4 rounded-lg bg-water-gradient text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Request Transport
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkTransportSection;
