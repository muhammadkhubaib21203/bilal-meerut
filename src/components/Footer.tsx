import { Flame } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 bg-charcoal border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-primary" />
          <span className="font-display text-lg font-bold text-gradient-fire">Bilal Meerut Famous Kabab Paratha</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Gulshan-e-Maymar, Karachi · Open till 3 AM
        </p>
        <p className="text-muted-foreground/50 text-xs mt-4">
          © {new Date().getFullYear()} Bilal Kabab. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
