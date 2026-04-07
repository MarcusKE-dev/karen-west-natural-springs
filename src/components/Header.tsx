import { useState, useEffect } from "react";
import { Menu, X, Phone, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trackInput, setTrackInput] = useState("");
  const [showTrackInput, setShowTrackInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Purified Water", href: "#purified" },
    { label: "Bulk Transport", href: "#transport" },
    { label: "Contact", href: "#contact" },
  ];

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackInput.trim().toUpperCase();
    if (trimmed) {
      navigate(`/track/${trimmed}`);
      setShowTrackInput(false);
      setTrackInput("");
    }
  };

  const scrollToTracker = () => {
    setMobileOpen(false);
    const el = document.getElementById("order-tracker");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("order-tracker")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/98 backdrop-blur-lg shadow-md"
          : "bg-card/90 backdrop-blur-md"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <a href="#home" className="flex items-center gap-2 shrink-0">
          <span className="text-sm md:text-base font-display font-bold text-primary tracking-wide">
            Karen West Natural Spring
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {showTrackInput ? (
            <form onSubmit={handleTrackOrder} className="flex items-center gap-1">
              <input
                autoFocus
                placeholder="KW-XXXXXXXX-XXXX"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                className="w-40 px-3 py-1.5 rounded-full border border-input bg-background text-foreground text-xs placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button type="submit" className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Go</button>
              <button type="button" onClick={() => setShowTrackInput(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </form>
          ) : (
            <button
              onClick={scrollToTracker}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <Search className="w-4 h-4" />
              Track Order
            </button>
          )}
          <a
            href="tel:+254717630186"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            <Phone className="w-4 h-4" />
            +254 717 630 186
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in-up">
          <div className="section-container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 py-3 px-3 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={scrollToTracker}
              className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 py-3 px-3 rounded-lg transition-colors text-left flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Track Order
            </button>
            <a
              href="tel:+254717630186"
              className="flex items-center gap-2 text-sm font-semibold text-primary mt-2 px-3 py-3 bg-primary/10 rounded-lg"
            >
              <Phone className="w-4 h-4" />
              +254 717 630 186
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
