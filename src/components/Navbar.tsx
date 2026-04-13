import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Phone, User, LogOut, Shield, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { itemCount, setIsOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Menu", href: "#menu" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <a href="#home" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-display text-lg md:text-xl font-bold text-gradient-fire">
            Bilal Kabab
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Link to="/my-orders" className="p-2 hover:bg-secondary rounded-lg transition-colors hidden md:block" title="My Orders">
              <Package className="w-5 h-5 text-foreground" />
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="p-2 hover:bg-secondary rounded-lg transition-colors hidden md:block" title="Admin Panel">
              <Shield className="w-5 h-5 text-primary" />
            </Link>
          )}
          <button onClick={() => setIsOpen(true)} className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-fire rounded-full text-xs font-bold flex items-center justify-center text-primary-foreground"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
          {user ? (
            <button onClick={signOut} className="p-2 hover:bg-secondary rounded-lg transition-colors hidden md:block" title="Sign Out">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          ) : (
            <Link to="/auth" className="hidden md:block px-4 py-2 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold hover:opacity-90">
              Sign In
            </Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                  {l.label}
                </a>
              ))}
              {user && (
                <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2 flex items-center gap-2">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary py-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              {user ? (
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-destructive py-2 flex items-center gap-2 text-left">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary py-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Sign In
                </Link>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                <Phone className="w-3 h-3" /> +92 330 5577668
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
