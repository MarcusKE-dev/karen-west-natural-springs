import { Phone, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy py-12">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl font-bold text-navy-foreground mb-3">Karen West Natural Spring</h3>
            <p className="text-navy-foreground/70 text-sm leading-relaxed">
              Providing safe, affordable, and accessible water solutions with integrity and reliability across Ngong and surrounding areas.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-navy-foreground mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="#home" className="text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors">Home</a>
              <a href="#about" className="text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors">About Us</a>
              <a href="#purified" className="text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors">Purified Water</a>
              <a href="#transport" className="text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors">Bulk Transport</a>
              <a href="#contact" className="text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors">Contact</a>
              <a href="#order-tracker" className="text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors">Track Order</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-navy-foreground mb-3">Contact</h4>
            <p className="text-sm text-navy-foreground/70 mb-1">+254 726 732 212</p>
            <p className="text-sm text-navy-foreground/70 mb-1">+254 717 630 186</p>
            <p className="text-sm text-navy-foreground/70 mb-4">Ngong & Surrounding Areas · P.O. Box 24563-00502, Nairobi</p>
            <div className="flex gap-3">
              <a
                href="tel:+254705062319"
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <Phone className="w-4 h-4 text-navy-foreground" />
              </a>
              <a
                href="https://wa.me/254705062319"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-navy-foreground" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-foreground/10 pt-6 text-center">
          <p className="text-sm text-navy-foreground/50">&copy; {new Date().getFullYear()} Karen West Natural Spring. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
