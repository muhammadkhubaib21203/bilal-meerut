import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Flame, Package, Clock, CheckCircle, XCircle, CalendarDays, ChefHat, MapPin, ExternalLink, Receipt, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Order = Tables<"orders">;
type OrderItem = Tables<"order_items">;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: "text-gold bg-gold/10", label: "Reviewing" },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: "text-primary bg-primary/10", label: "Confirmed" },
  preparing: { icon: <Flame className="w-4 h-4" />, color: "text-ember bg-ember/10", label: "Preparing" },
  ready: { icon: <Package className="w-4 h-4" />, color: "text-green-500 bg-green-500/10", label: "Ready / Dispatching" },
  delivered: { icon: <CheckCircle className="w-4 h-4" />, color: "text-muted-foreground bg-secondary", label: "Completed" },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-destructive bg-destructive/10", label: "Cancelled" },
};

const ORDER_STEPS = ["pending", "confirmed", "preparing", "ready", "delivered"];

const OrderTimeline = ({ currentStatus }: { currentStatus: string }) => {
  if (currentStatus === "cancelled") return null;
  
  const currentIndex = ORDER_STEPS.indexOf(currentStatus);
  if (currentIndex === -1) return null;

  return (
    <div className="relative flex justify-between items-center mt-6 mb-2">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / 4) * 100}%` }}
          className="h-full bg-primary"
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      {ORDER_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        
        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                isActive ? "bg-card border-primary text-primary shadow-[0_0_10px_rgba(255,106,0,0.5)]" : 
                isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                "bg-secondary border-muted-foreground/30 text-muted-foreground/50"
              }`}
            >
              {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
            </div>
            {isActive && (
              <span className="absolute -bottom-6 text-[10px] font-bold text-primary uppercase tracking-wider whitespace-nowrap">
                {statusConfig[step]?.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) {
        const withItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: items } = await supabase
              .from("order_items")
              .select("*")
              .eq("order_id", order.id);
            return { ...order, order_items: items || [] };
          })
        );
        setOrders(withItems);
      }
      setLoading(false);
    };
    
    fetchOrders();
    
    // Set up real-time subscription for live status updates
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` }, (payload) => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-smoke flex items-center justify-center">
        <Flame className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const activeOrders = orders.filter((order) => ["pending", "confirmed", "preparing", "ready"].includes(order.status));
  const pastOrders = orders.filter((order) => ["delivered", "cancelled"].includes(order.status));

  return (
    <div className="min-h-screen bg-gradient-smoke flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 md:pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-8 md:mb-12">
            <h1 className="font-display text-3xl md:text-5xl font-bold bg-clip-text text-gradient-fire pb-2">
              My Orders
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Track your active deliveries or review past orders.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-card flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <ChefHat className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm px-4">
                Looks like you haven't tasted our delicious charcoal BBQ yet. Discover our menu right now!
              </p>
              <Link to="/" className="px-8 py-3 bg-gradient-fire rounded-xl text-primary-foreground font-bold hover:shadow-glow transition-all active:scale-95">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {activeOrders.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground mb-4 pl-2 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" /> Active Orders
                  </h2>
                  <div className="space-y-6">
                    {activeOrders.map((order) => {
                      const sc = statusConfig[order.status] || statusConfig.pending;
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card rounded-3xl p-6 md:p-8 border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-fire" />
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm font-medium flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4 text-primary" /> {new Date(order.created_at).toLocaleString()}
                              </p>
                            </div>
                            <span className={`inline-flex items-center w-fit gap-2 font-bold px-4 py-1.5 rounded-xl ${sc.color}`}>
                              {sc.icon} {sc.label}
                            </span>
                          </div>

                          <div className="mb-10">
                            <OrderTimeline currentStatus={order.status} />
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <Receipt className="w-4 h-4" /> Order Details
                              </h3>
                              <div className="space-y-0.5">
                                {order.order_items.map((item) => (
                                  <div key={item.id} className="flex justify-between py-2 text-sm">
                                    <span className="font-medium">
                                      <span className="text-muted-foreground mr-2">{item.quantity}x</span> 
                                      {item.item_name}
                                    </span>
                                    <span className="text-foreground">Rs {Number(item.unit_price) * Number(item.quantity)}</span>
                                  </div>
                                ))}
                                <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold text-base">
                                  <span>Total</span>
                                  <span className="text-primary text-xl">Rs {order.total_amount}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-secondary/40 rounded-2xl p-5 border border-border">
                              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" /> Delivery Info
                              </h3>
                              <div className="space-y-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground text-xs uppercase mb-1">Address</p>
                                  <p className="font-medium">{order.delivery_address || "Pickup / Counter"}</p>
                                </div>
                                {order.notes && (
                                  <div>
                                    <p className="text-muted-foreground text-xs uppercase mb-1">Notes</p>
                                    <p className="font-medium italic">"{order.notes}"</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {pastOrders.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground mb-4 pl-2">
                    Past Orders
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {pastOrders.map((order) => {
                      const sc = statusConfig[order.status] || statusConfig.delivered;
                      return (
                        <div key={order.id} className="bg-card hover:bg-card/80 transition-colors border border-border rounded-2xl p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                                #{order.id.slice(0, 8)}
                              </p>
                              <p className="font-bold text-sm">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${sc.color}`}>
                              {sc.label}
                            </span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-4 line-clamp-1">
                            {order.order_items.map(i => `${i.quantity}x ${i.item_name}`).join(", ")}
                          </div>
                          
                          <div className="flex justify-between items-center border-t border-border pt-4">
                            <span className="font-bold">Rs {order.total_amount}</span>
                            <Link to="/" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                              Reorder <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
