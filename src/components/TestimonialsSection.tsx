import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Grace Mwangi",
    role: "Household Customer, Karen",
    text: "Karen West has been our go-to water supplier for over two years. The water is always clean, delivery is on time, and the pricing is very fair. I trust them completely for my family's drinking water.",
  },
  {
    name: "James Otieno",
    role: "Restaurant Owner, Ngong Road",
    text: "We use Karen West purified water in our restaurant — both for cooking and serving. The quality is consistently excellent, and they've never let us down on delivery. Highly recommended for any business.",
  },
  {
    name: "Mary Njeri",
    role: "School Administrator, Rongai",
    text: "We order bulk water from Karen West for our boarding school every month. Their water trucks arrive on schedule and the process is seamless. They're reliable partners for our institution.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">What Our Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
