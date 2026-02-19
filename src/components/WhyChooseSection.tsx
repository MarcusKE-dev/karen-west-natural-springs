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
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-primary/20 animate-ripple" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border border-accent/20 animate-ripple" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="section-container relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-accent/20 text-accent text-sm font-semibold tracking-wide backdrop-blur-sm border border-accent/20">
            Why Us
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-navy-foreground">Why Choose Karen West Natural Spring</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:bg-card/20 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-water-gradient flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <r.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-navy-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-navy-foreground/70 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
