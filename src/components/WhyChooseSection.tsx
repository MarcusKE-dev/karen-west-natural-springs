import { DollarSign, ShieldCheck, Cpu, Truck, Smile } from "lucide-react";

const reasons = [
  { icon: DollarSign, title: "Affordable Pricing", desc: "Competitive rates for both purified and bulk water with no hidden costs." },
  { icon: ShieldCheck, title: "Safe & Hygienic Handling", desc: "Every stage from source to delivery meets strict hygiene standards." },
  { icon: Cpu, title: "Modern Purification System", desc: "5-step process including reverse osmosis and UV treatment." },
  { icon: Truck, title: "Reliable Fleet for Bulk Transport", desc: "Our blue boozers deliver consistently across the region." },
  { icon: Smile, title: "Friendly Customer Service", desc: "A dedicated team always ready to help with your water needs." },
];

const WhyChooseSection = () => {
  return (
    <section className="py-20 md:py-28 bg-aqua-light">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Why Choose Karen West Natural Spring</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-water-gradient flex items-center justify-center">
                <r.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
