import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Purified Water", href: "#purified" },
    { label: "Bulk Transport", href: "#transport" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-sm">
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        {/* Logo area */}
        <a href="#home" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Karen West Natural Springs Logo"
            className="h-12 md:h-16 w-auto object-contain"
            style={{ imageRendering: "auto" }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+254717630186"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Phone className="w-4 h-4" />
            +254 717 630 186
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="section-container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-primary py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+254717630186"
              className="flex items-center gap-2 text-sm font-medium text-primary mt-2"
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
