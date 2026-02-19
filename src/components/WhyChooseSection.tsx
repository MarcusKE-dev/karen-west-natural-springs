import { DollarSign, ShieldCheck, Truck, Smile, Filter } from "lucide-react";

const reasons = [
  { icon: DollarSign, title: "Affordable Pricing", desc: "Competitive rates for both purified and bulk water with no hidden costs." },
  { icon: ShieldCheck, title: "Safe & Hygienic Handling", desc: "Every stage from source to delivery meets strict hygiene standards." },
  { icon: Filter, title: "FRP Vessel Purification", desc: "Advanced FRP vessel filtration system for superior water purity." },
  { icon: Truck, title: "Reliable Fleet for Bulk Transport", desc: "Our water trucks deliver consistently across the region." },
  { icon: Smile, title: "Friendly Customer Service", desc: "A dedicated team always ready to help with your water needs." },
];

const WhyChooseSection = () => {
  return (
    <section className="py-20 md:py-28 bg-navy relative overflow-hidden">
      {/* Decorative water ripple */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-2 border-primary animate-ripple" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-2 border-accent animate-ripple" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className="section-container relative z-10">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase text-accent mb-3 block">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-foreground">Why Choose Karen West Natural Spring</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary/20 hover:bg-card/20 hover:border-primary/40 transition-all text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-water-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                <r.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-navy-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-navy-foreground/70">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
