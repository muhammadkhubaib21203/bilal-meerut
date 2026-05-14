import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";
import heroBg from "@/assets/hero-bbq.jpg";
import { useShopSettings } from "@/hooks/use-shop-settings";
import { useAuth } from "@/context/AuthContext";

const HeroSection = () => {
  const { settings } = useShopSettings();
  const { isAdmin } = useAuth();

  return (
    <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Sizzling BBQ" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-28 sm:pt-28 sm:pb-24 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6"
          >
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">4.2 Rating · 18 Reviews</span>
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 leading-tight">
            {isAdmin ? (
              <p><span className="text-gradient-fire">Admin</span> Portal</p>
            ) : (
              <>
                <span className="text-foreground">Bilal Meerut</span>
                <br />
                <span className="text-gradient-fire">Kabab</span>{" "}
                <span className="text-foreground">House</span>
              </>
            )}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl text-center mb-6 sm:mb-8">
            {settings.tagline}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 sm:mb-10">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              {settings.locationShort}
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              {settings.heroHoursLabel}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#menu"
        aria-label="Scroll to menu"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute z-30 bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5 bg-background/20 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </motion.a>
    </section>
  );
};

export default HeroSection;
