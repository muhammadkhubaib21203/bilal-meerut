import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useShopSettings } from "@/hooks/use-shop-settings";

const ContactSection = () => {
  const { toast } = useToast();
  const { settings } = useShopSettings();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("contact_messages")
      .insert({ ...form });

    if (error) {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message Sent! 🚀", description: "Thanks for reaching out. We will get back to you soon." });
      setForm({ name: "", email: "", phone: "", message: "" });
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-smoke">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-gradient-fire">Us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question or want to place a large order? Reach out to us.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Left Column: Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-5 bg-card rounded-2xl border border-border">
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-muted-foreground text-sm font-medium mb-1">{settings.shopName}</p>
                <p className="text-muted-foreground text-sm">{settings.locationFull}</p>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-card rounded-2xl border border-border h-fit">
                  <Phone className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-muted-foreground hover:text-primary transition-colors text-sm block mb-1">
                    {settings.phone}
                  </a>
                </div>
                <div className="p-5 bg-card rounded-2xl border border-border h-fit">
                  <Clock className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Hours</h3>
                  <p className="text-muted-foreground text-sm">{settings.openHoursLabel}<br/>{settings.openHoursValue}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border h-64 relative group">
              <iframe
                src={settings.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              />
              <div className="absolute inset-0 bg-background/20 pointer-events-none group-hover:bg-transparent transition-colors" />
              <a
                href={settings.mapOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur rounded-lg text-foreground font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-card text-sm pointer-events-auto border border-border"
              >
                <ExternalLink className="w-4 h-4" /> Open Maps
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-6 shadow-card h-full"
          >
            <h3 className="font-display text-2xl font-bold mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                  placeholder="+92 3XX XXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-fire rounded-xl text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && <Send className="w-5 h-5" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
