import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Flame, ArrowLeft, Package, Clock, CheckCircle, XCircle, CalendarDays } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import heroBg from "@/assets/hero-bbq.jpg";

type Order = Tables<"orders">;
type OrderItem = Tables<"order_items">;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: "text-gold" },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: "text-primary" },
  preparing: { icon: <Flame className="w-4 h-4" />, color: "text-ember" },
  ready: { icon: <Package className="w-4 h-4" />, color: "text-green-400" },
  delivered: { icon: <CheckCircle className="w-4 h-4" />, color: "text-green-500" },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-destructive" },
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
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-smoke flex items-center justify-center">
        <Flame className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const activeOrders = orders.filter((order) => ["pending", "confirmed", "preparing", "ready"].includes(order.status)).length;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Sizzling BBQ" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">
          My <span className="text-gradient-fire">Orders</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/85 backdrop-blur rounded-2xl p-4 border border-border shadow-card">
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-display font-bold text-gradient-fire">{orders.length}</p>
          </div>
          <div className="bg-card/85 backdrop-blur rounded-2xl p-4 border border-border shadow-card">
            <p className="text-xs text-muted-foreground">Active Orders</p>
            <p className="text-2xl font-display font-bold text-gradient-fire">{activeOrders}</p>
          </div>
          <div className="bg-card/85 backdrop-blur rounded-2xl p-4 border border-border shadow-card">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-display font-bold text-gradient-fire">Rs {totalSpent}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-card/80 backdrop-blur rounded-2xl border border-border shadow-card">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No orders yet. Browse the menu and place your first order.</p>
            <Link to="/" className="inline-block mt-4 px-6 py-2 bg-gradient-fire rounded-xl text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              View Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.pending;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card/90 backdrop-blur rounded-2xl p-6 border border-border shadow-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <CalendarDays className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-sm font-medium capitalize px-3 py-1 rounded-full bg-secondary ${sc.color}`}>
                      {sc.icon} {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.item_name} × {item.quantity}</span>
                        <span className="text-muted-foreground">Rs {Number(item.unit_price) * Number(item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">Rs {order.total_amount}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
