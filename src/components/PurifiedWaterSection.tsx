import { useState } from "react";
import { ShoppingCart, Droplets, MapPin, Package } from "lucide-react";
import pack500ml from "@/assets/pack-500ml.png";
import pack1litre from "@/assets/pack-1litre.png";
import bottle5l from "@/assets/bottle-5l.png";
import bottle10l from "@/assets/bottle-10l.png";
import bottle20lSoft from "@/assets/bottle-20l-soft.png";
import bottle20lHard from "@/assets/bottle-20l-hard.png";
import QuantitySelector from "./QuantitySelector";
import { toast } from "sonner";

const refillOptions = [
  { litres: 1, price: 5 },
  { litres: 5, price: 25 },
  { litres: 10, price: 50 },
  { litres: 20, price: 100 },
];

const packagedProducts = [
  { name: "500ml Pack (24 pieces)", price: 400, image: pack500ml },
  { name: "1 Litre Pack (12 pieces)", price: 400, image: pack1litre },
];

const bottledRefillProducts = [
  { name: "5 Litre Bottle", price: 150, image: bottle5l },
  { name: "10 Litre Bottle", price: 300, image: bottle10l },
  { name: "20 Litre Soft Bottle", price: 500, image: bottle20lSoft },
  { name: "20 Litre Hard Bottle", price: 1500, image: bottle20lHard },
];

const PurifiedWaterSection = () => {
  const [refillLitres, setRefillLitres] = useState(20);
  const [packageQty, setPackageQty] = useState<Record<number, number>>({ 0: 1, 1: 1 });
  const [bottleQty, setBottleQty] = useState<Record<number, number>>({ 0: 1, 1: 1, 2: 1, 3: 1 });
  const [cart, setCart] = useState<Array<{ name: string; qty: number; total: number }>>([]);
  const [orderForm, setOrderForm] = useState({
    name: "", phone: "", location: "", productType: "", quantity: "", instructions: "",
  });

  const addToCart = (name: string, qty: number, unitPrice: number) => {
    setCart([...cart, { name, qty, total: qty * unitPrice }]);
    toast.success(`${name} x${qty} added to cart!`);
  };

  const handlePinLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOrderForm({ ...orderForm, location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}` });
          toast.success("Location pinned successfully!");
        },
        () => toast.error("Could not get your location. Please enter it manually.")
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order submitted! We will contact you shortly.");
    setOrderForm({ name: "", phone: "", location: "", productType: "", quantity: "", instructions: "" });
  };

  return (
    <section id="purified" className="py-20 md:py-28 bg-aqua-light">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
            Our Products
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Karen West Purified Water</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
            Our water passes through a 5-step purification process including sand and carbon filtration, micro filtration, reverse osmosis, and ultraviolet treatment — guaranteeing purity in every bottle.
          </p>
        </div>

        {/* Refill Water */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-water-gradient flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
            Refill Water — 5 KSH per Litre
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {refillOptions.map((opt) => (
              <button
                key={opt.litres}
                onClick={() => setRefillLitres(opt.litres)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                  refillLitres === opt.litres
                    ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <span className="text-2xl font-bold text-foreground">{opt.litres}L</span>
                <span className="block text-sm text-muted-foreground mt-1">{opt.price} KSH</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-sm">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">Custom litres:</label>
            <QuantitySelector value={refillLitres} onChange={setRefillLitres} min={1} max={10000} />
            <span className="text-sm text-muted-foreground">= <strong className="text-primary text-lg">{refillLitres * 5} KSH</strong></span>
          </div>
        </div>

        {/* Bottled Refill Water */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
              <Package className="w-5 h-5 text-navy-foreground" />
            </div>
            Bottled Refill Water
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bottledRefillProducts.map((product, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-md border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="aspect-[3/4] bg-gradient-to-b from-secondary to-background overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-navy text-navy-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {product.price} KSH
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">{product.name}</h4>
                  <p className="text-xl font-bold text-primary">{product.price} KSH</p>
                  <div className="flex flex-col gap-2 mt-3">
                    <QuantitySelector
                      size="sm"
                      value={bottleQty[i]}
                      onChange={(v) => setBottleQty({ ...bottleQty, [i]: v })}
                    />
                    <span className="text-xs text-muted-foreground">Total: {product.price * (bottleQty[i] || 1)} KSH</span>
                  </div>
                  <button
                    onClick={() => addToCart(product.name, bottleQty[i] || 1, product.price)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-navy text-navy-foreground font-semibold text-sm hover:opacity-90 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packaged Water */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-water-gradient flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            Packaged Water
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {packagedProducts.map((product, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-md border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="aspect-[4/3] bg-gradient-to-b from-secondary to-background overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-foreground text-lg">{product.name}</h4>
                  <p className="text-2xl font-bold text-primary mt-2">{product.price} KSH</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
                    <QuantitySelector
                      value={packageQty[i]}
                      onChange={(v) => setPackageQty({ ...packageQty, [i]: v })}
                    />
                    <span className="text-sm text-muted-foreground">Total: <strong className="text-foreground">{product.price * (packageQty[i] || 1)} KSH</strong></span>
                  </div>
                  <button
                    onClick={() => addToCart(product.name, packageQty[i] || 1, product.price)}
                    className="mt-4 w-full py-3.5 rounded-xl bg-water-gradient text-primary-foreground font-bold hover:opacity-90 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customized Water Bottles */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-navy via-primary/90 to-navy rounded-2xl p-8 sm:p-10 shadow-2xl text-navy-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-accent blur-3xl" />
              <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
            </div>
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                🎉 Customized Bottled Water for Your Special Event
              </h3>
              <p className="text-navy-foreground/90 text-base md:text-lg mb-6 leading-relaxed">
                Turn every celebration into a branded experience. At Karen West Natural Spring, we design and package premium purified water with custom labels tailored to your event — whether it's a wedding, graduation, seminar, or corporate function.
              </p>
              <p className="text-navy-foreground/80 text-base mb-6 leading-relaxed">
                Add your names, logo, colors, or special message and give your guests something both elegant and practical.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm font-medium"><span className="text-accent">✔</span> Clean, high-quality purified water</div>
                <div className="flex items-center gap-2 text-sm font-medium"><span className="text-accent">✔</span> Custom-designed labels</div>
                <div className="flex items-center gap-2 text-sm font-medium"><span className="text-accent">✔</span> Bulk orders for any event size</div>
                <div className="flex items-center gap-2 text-sm font-medium"><span className="text-accent">✔</span> Fast, reliable delivery</div>
              </div>
              <p className="text-navy-foreground/90 text-base font-semibold mb-6">
                Make your event stand out — refresh your guests in style.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold bg-card text-primary shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Order Your Customized Bottles Today
              </a>
            </div>
          </div>
        </div>


        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mb-16 bg-gradient-to-br from-navy to-primary/90 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-display font-bold text-navy-foreground mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart ({cart.length} items)
            </h3>
            <div className="space-y-2 mb-4">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-navy-foreground/80">
                  <span>{item.name} x{item.qty}</span>
                  <span className="font-semibold">{item.total} KSH</span>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-foreground/20 pt-3 flex justify-between text-navy-foreground font-bold text-lg">
              <span>Total</span>
              <span>{cart.reduce((sum, item) => sum + item.total, 0)} KSH</span>
            </div>
            <button
              onClick={() => {
                toast.success("Order placed! We'll contact you to confirm.");
                setCart([]);
              }}
              className="mt-4 w-full py-3.5 rounded-xl bg-card text-primary font-bold text-lg hover:shadow-lg transition-all duration-300"
            >
              Checkout
            </button>
          </div>
        )}

        {/* Order Form */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-display font-bold text-foreground mb-6 text-center">Order Purified Water</h3>
          <form onSubmit={handleOrder} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Your Name"
                value={orderForm.name}
                onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <input
                required
                placeholder="Phone Number"
                value={orderForm.phone}
                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-foreground">Delivery Location</label>
                <button
                  type="button"
                  onClick={handlePinLocation}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Pin My Location
                </button>
              </div>
              <input
                required
                placeholder="Enter location or pin it"
                value={orderForm.location}
                onChange={(e) => setOrderForm({ ...orderForm, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <select
                required
                value={orderForm.productType}
                onChange={(e) => setOrderForm({ ...orderForm, productType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="">Select Product</option>
                <option value="refill">Refill Water</option>
                <option value="5l">5L Bottle</option>
                <option value="10l">10L Bottle</option>
                <option value="20l-soft">20L Soft Bottle</option>
                <option value="20l-hard">20L Hard Bottle</option>
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
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <textarea
              placeholder="Delivery Instructions (optional)"
              rows={3}
              value={orderForm.instructions}
              onChange={(e) => setOrderForm({ ...orderForm, instructions: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-water-gradient text-primary-foreground font-bold text-lg hover:opacity-90 hover:shadow-xl transition-all duration-300"
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
