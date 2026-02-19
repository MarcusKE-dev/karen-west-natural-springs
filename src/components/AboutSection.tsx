import { Shield, Clock, Eye, Heart, Leaf } from "lucide-react";

const values = [
  { icon: Shield, title: "Purity & Quality Control", desc: "Rigorous 5-step purification and lab testing" },
  { icon: Clock, title: "Reliability & Timely Delivery", desc: "Consistent supply you can depend on" },
  { icon: Eye, title: "Transparency & Fair Pricing", desc: "Honest pricing with no hidden charges" },
  { icon: Heart, title: "Customer Satisfaction", desc: "Dedicated service for every client" },
  { icon: Leaf, title: "Environmental Responsibility", desc: "Sustainable practices and recyclable packaging" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">About Us</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Trusted by Communities Since Day One
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Karen West Natural Spring was founded with a single mission: to provide safe, clean, and affordable water to every home, business, and institution in the region. Based in Karen, Nairobi, we source our water from natural springs and treat it through a rigorous 5-step purification process — including sand and carbon filtration, micro filtration, reverse osmosis, and ultraviolet treatment — ensuring every drop meets the highest quality standards.
          </p>
          <div className="mt-8 p-6 rounded-xl bg-aqua-light border border-primary/10">
            <p className="font-display text-lg font-semibold text-navy italic">
              "To provide safe, affordable, and accessible water solutions with integrity and reliability."
            </p>
            <span className="text-sm text-muted-foreground mt-2 block">— Our Mission</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((v) => (
            <div key={v.title} className="text-center p-6 rounded-xl bg-card shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-2">{v.title}</h3>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
