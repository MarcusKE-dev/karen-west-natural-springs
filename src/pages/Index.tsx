import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PurifiedWaterSection from "@/components/PurifiedWaterSection";
import BulkTransportSection from "@/components/BulkTransportSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import OrderTracker from "@/components/OrderTracker";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <PurifiedWaterSection />
      <BulkTransportSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <ContactSection />
      {/* Order Tracking Section */}
      <section id="order-tracker" className="py-16 bg-background">
        <div className="section-container">
          <div className="text-center mb-8">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">Order Status</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Track Your Order</h2>
          </div>
          <OrderTracker />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
