import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  Phone,
  User,
  LogOut,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const { itemCount, setIsOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [undeliveredOrders, setUndeliveredOrders] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchCounts = async () => {
      const { count: msgCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");
        
      const { data: orders } = await supabase
        .from("orders")
        .select("status");
        
      const orderCount = orders?.filter(o => o.status !== "delivered" && o.status !== "cancelled").length || 0;
      
      setUnreadMessages(msgCount || 0);
      setUndeliveredOrders(orderCount);
    };

    fetchCounts();

    const msgSub = supabase
      .channel("msg_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, fetchCounts)
      .subscribe();

    const ordSub = supabase
      .channel("ord_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchCounts)
      .subscribe();

    return () => {
      supabase.removeChannel(msgSub);
      supabase.removeChannel(ordSub);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      const sections = ["home", "menu", "reviews", "contact"];
      let current = "home";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin]);

  const links = isAdmin
    ? [
        { label: "Products", to: "/admin/menu" },
        { label: "Orders", to: "/admin/orders", count: undeliveredOrders },
        { label: "Messages", to: "/admin/messages", count: unreadMessages },
        { label: "Shop Settings", to: "/admin/settings" },
      ]
    : [
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
        {isAdmin ? (
          <Link to="/admin/menu" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-40 h-40 object-contain"
            />
          </Link>
        ) : (
          <a href="#home" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-40 h-40 object-contain"
            />
          </a>
        )}

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            "to" in l ? (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-gradient-fire text-primary-foreground font-bold shadow-glow"
                      : "text-muted-foreground hover:bg-secondary hover:text-primary"
                  }`
                }
              >
                {l.label}
                {l.count > 0 && (
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                    {l.count}
                  </span>
                )}
              </NavLink>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                  activeSection === l.href.slice(1)
                    ? "bg-gradient-fire text-primary-foreground font-bold shadow-glow"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                {l.label}
              </a>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && !isAdmin && (
            <Link
              to="/my-orders"
              className="p-2 hover:bg-secondary rounded-lg transition-colors hidden md:block"
              title="My Orders"
            >
              <Package className="w-5 h-5 text-foreground" />
            </Link>
          )}
          {!isAdmin && (
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            >
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
          )}
          {user ? (
            <button
              onClick={signOut}
              className="p-2 hover:bg-secondary rounded-lg transition-colors hidden md:block"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          ) : (
            <Link
              to="/auth"
              className="hidden md:block px-4 py-2 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold hover:opacity-90"
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
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
              {links.map((l) =>
                "to" in l ? (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-primary text-primary-foreground font-bold shadow-glow"
                          : "text-muted-foreground hover:bg-secondary hover:text-primary"
                      }`
                    }
                  >
                    {l.label}
                    {l.count > 0 && (
                      <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                        {l.count}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium py-3 px-4 rounded-xl transition-all ${
                      activeSection === l.href.slice(1)
                        ? "bg-gradient-fire text-primary-foreground font-bold shadow-glow"
                        : "text-muted-foreground hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    {l.label}
                  </a>
                ),
              )}
              {user && !isAdmin && (
                <Link
                  to="/my-orders"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary py-2 flex items-center gap-2"
                >
                  <Package className="w-4 h-4" /> My Orders
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-destructive py-2 flex items-center gap-2 text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-primary py-2 flex items-center gap-2"
                >
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
