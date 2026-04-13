import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-smoke">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Find <span className="text-gradient-fire">Us</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-muted-foreground text-sm">Main Nawaz Sharif Park, X 4th St, Sector X Gulshan-e-Maymar, Karachi, 75340, Pakistan</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border">
              <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a href="tel:+923305577668" className="text-primary hover:underline text-sm">+92 330 5577668</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border">
              <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Hours</h3>
                <p className="text-muted-foreground text-sm">Open Daily · Closes 3:00 AM</p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=24CG+MX+Gulshan-e-Maymar,+Karachi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-fire rounded-xl text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-glow"
            >
              <ExternalLink className="w-4 h-4" /> Open in Google Maps
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-border h-80 md:h-auto"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.0!2d67.075!3d24.975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDU4JzMwLjAiTiA2N8KwMDQnMzAuMCJF!5e0!3m2!1sen!2spk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
