import heroImage from "@/assets/hero-water.jpg";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Crystal clear water" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/75 to-primary/60" />
      </div>

      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full bg-primary/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative section-container py-32 md:py-40">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={logo}
              alt="Karen West Natural Springs Logo"
              className="h-36 sm:h-44 md:h-52 w-auto object-contain drop-shadow-lg"
              style={{ imageRendering: "auto" }}
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-accent tracking-wide leading-tight">
              Karen West<br />Natural Spring
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-navy-foreground leading-tight mb-6">
            Pure Water.<br />Reliable Supply.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-navy-foreground/90 mb-10 leading-relaxed max-w-xl">
            Karen West Natural Spring delivers purified drinking water and bulk soft water transportation across the region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/254705062319?text=Hi%2C%20I%20want%20to%20order%20purified%20water.%20Please%20send%20me%20details%20and%20price%20."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold bg-card text-primary shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold bg-card text-primary shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Order Purified Water
            </a>
            <a
              href="#transport"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold border-2 border-navy-foreground/40 text-navy-foreground hover:bg-navy-foreground/10 backdrop-blur-sm transition-all duration-300"
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
