import { useState } from "react";
import { ShoppingCart, Droplets } from "lucide-react";
import bottleFront from "@/assets/bottle-front.jpg";
import bottleFull from "@/assets/bottle-full.jpg";
import { toast } from "sonner";

const refillOptions = [
  { litres: 1, price: 5 },
  { litres: 5, price: 25 },
  { litres: 10, price: 50 },
  { litres: 20, price: 100 },
];

const packagedProducts = [
  { name: "500ml Pack (24 pieces)", price: 400, image: bottleFront },
  { name: "1 Litre Pack (12 pieces)", price: 400, image: bottleFull },
];

const PurifiedWaterSection = () => {
  const [refillLitres, setRefillLitres] = useState(20);
  const [packageQty, setPackageQty] = useState<Record<number, number>>({ 0: 1, 1: 1 });
  const [orderForm, setOrderForm] = useState({
    name: "", phone: "", location: "", productType: "", quantity: "", instructions: "",
  });

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order submitted! We will contact you shortly.");
    setOrderForm({ name: "", phone: "", location: "", productType: "", quantity: "", instructions: "" });
  };

  return (
    <section id="purified" className="py-20 md:py-28 bg-aqua-light">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">Section 1</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Karen West Purified Water</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our water passes through a 5-step purification process including sand and carbon filtration, micro filtration, reverse osmosis, and ultraviolet treatment — guaranteeing purity in every bottle.
          </p>
        </div>

        {/* Refill Water */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <Droplets className="w-7 h-7 text-primary" />
            Refill Water — 5 KSH per Litre
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {refillOptions.map((opt) => (
              <button
                key={opt.litres}
                onClick={() => setRefillLitres(opt.litres)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  refillLitres === opt.litres
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="text-2xl font-bold text-foreground">{opt.litres}L</span>
                <span className="block text-sm text-muted-foreground mt-1">{opt.price} KSH</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border">
            <label className="text-sm font-medium text-foreground">Custom litres:</label>
            <input
              type="number"
              min={1}
              value={refillLitres}
              onChange={(e) => setRefillLitres(Math.max(1, Number(e.target.value)))}
              className="w-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-center"
            />
            <span className="text-sm text-muted-foreground">= <strong className="text-foreground">{refillLitres * 5} KSH</strong></span>
          </div>
        </div>

        {/* Packaged Water */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-primary" />
            Packaged Water
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {packagedProducts.map((product, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-foreground text-lg">{product.name}</h4>
                  <p className="text-2xl font-bold text-primary mt-2">{product.price} KSH</p>
                  <div className="flex items-center gap-4 mt-4">
                    <label className="text-sm text-muted-foreground">Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={packageQty[i]}
                      onChange={(e) => setPackageQty({ ...packageQty, [i]: Math.max(1, Number(e.target.value)) })}
                      className="w-20 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-center"
                    />
                    <span className="text-sm text-muted-foreground">Total: <strong className="text-foreground">{product.price * (packageQty[i] || 1)} KSH</strong></span>
                  </div>
                  <button
                    onClick={() => toast.success(`${product.name} x${packageQty[i]} added! We'll call to confirm.`)}
                    className="mt-4 w-full py-3 rounded-lg bg-water-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-card rounded-2xl shadow-md border border-border p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-display font-bold text-foreground mb-6 text-center">Order Purified Water</h3>
          <form onSubmit={handleOrder} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Your Name"
                value={orderForm.name}
                onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                className="px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
              <input
                required
                placeholder="Phone Number"
                value={orderForm.phone}
                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                className="px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <input
              required
              placeholder="Delivery Location"
              value={orderForm.location}
              onChange={(e) => setOrderForm({ ...orderForm, location: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <select
                required
                value={orderForm.productType}
                onChange={(e) => setOrderForm({ ...orderForm, productType: e.target.value })}
                className="px-4 py-3 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="">Select Product</option>
                <option value="refill">Refill Water</option>
                <option value="500ml">500ml Pack (24 pcs)</option>
                <option value="1litre">1 Litre Pack (12 pcs)</option>
              </select>
              <input
                required
                placeholder="Quantity"
                type="number"
                min={1}
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                className="px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <textarea
              placeholder="Delivery Instructions (optional)"
              rows={3}
              value={orderForm.instructions}
              onChange={(e) => setOrderForm({ ...orderForm, instructions: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-water-gradient text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Submit Order
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PurifiedWaterSection;
