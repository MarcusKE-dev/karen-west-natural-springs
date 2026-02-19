import heroImage from "@/assets/hero-water.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Crystal clear water" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
      </div>

      <div className="relative section-container py-32 md:py-40">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-navy-foreground leading-tight mb-6">
            Pure Water.<br />Reliable Supply.
          </h1>
          <p className="text-lg md:text-xl text-navy-foreground/90 mb-10 leading-relaxed">
            Karen West Natural Spring delivers purified drinking water and bulk soft water transportation across the region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#purified"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-semibold bg-card text-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Order Purified Water
            </a>
            <a
              href="#transport"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-semibold border-2 border-navy-foreground/40 text-navy-foreground hover:bg-navy-foreground/10 transition-all"
            >
              Book Water Transport
            </a>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="hsl(200,20%,98%)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
