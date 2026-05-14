import { MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useShopSettings } from "@/hooks/use-shop-settings";

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Footer = () => {
  const { settings } = useShopSettings();

  return (
    <footer className="bg-charcoal border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="w-32 md:w-40 h-auto object-contain object-left" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {settings.tagline}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors group">
                <div className="flex items-center justify-center group-hover:scale-110 transition-transform [&>svg]:w-5 [&>svg]:h-5"><FacebookIcon /></div>
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors group">
                <div className="flex items-center justify-center group-hover:scale-110 transition-transform [&>svg]:w-5 [&>svg]:h-5"><InstagramIcon /></div>
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors group">
                <div className="flex items-center justify-center group-hover:scale-110 transition-transform [&>svg]:w-5 [&>svg]:h-5"><TwitterIcon /></div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-6 text-foreground">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/#home" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/#menu" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link to="/#reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">Customer Reviews</Link></li>
              <li><Link to="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold mb-6 text-foreground">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  {settings.locationFull}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{settings.phone}</a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-display font-semibold mb-6 text-foreground">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm text-muted-foreground border-b border-border/50 pb-2">
                <span>{settings.openHoursLabel}</span>
                <span className="font-medium text-foreground">{settings.openHoursValue}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
