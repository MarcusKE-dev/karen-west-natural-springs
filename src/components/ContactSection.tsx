import { useState } from "react";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: dbMsg, error: dbError } = await supabase.from("messages").insert({
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        message: form.message,
      }).select("id").single();

      if (dbError) throw dbError;

      // Fire-and-forget: notify business owner by email
      supabase.functions.invoke("notify-contact", { body: { messageId: dbMsg.id } }).catch(() => {});

      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Error sending message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-aqua-light">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-3 block">Get in Touch</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Contact Us</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground mb-6">Reach Us Directly</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">+254 726 732 212</p>
                  <p className="text-sm text-muted-foreground">+254 717 630 186</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Ngong & Surrounding Areas</p>
                  <p className="text-sm text-muted-foreground">P.O. Box 24563-00502, Nairobi</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Serving Ngong & surrounding areas</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="tel:+254705062319" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-water-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a href="https://wa.me/254705062319" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            <div className="mt-8 rounded-xl overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2ske!4v1775456966456!5m2!1sen!2ske!6m8!1m7!1siNBcGKX0Uu26lcpCXZdMDA!2m2!1d-1.340593671310081!2d36.6833492138066!3f95.41001!4f0!5f0.7820865974627469"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Karen West Natural Spring Location"
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-md border border-border p-8">
            <h3 className="text-xl font-display font-bold text-foreground mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground" />
              <input required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground" />
              <input placeholder="Email (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground" />
              <textarea required placeholder="Your Message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none" />
              <button type="submit" disabled={submitting} className="w-full py-4 rounded-lg bg-water-gradient text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;