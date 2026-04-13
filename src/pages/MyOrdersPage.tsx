import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Flame, ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Flame className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>
        <h1 className="font-display text-3xl font-bold mb-8">
          My <span className="text-gradient-fire">Orders</span>
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No orders yet. Browse the menu and place your first order!</p>
            <Link to="/" className="inline-block mt-4 px-6 py-2 bg-gradient-fire rounded-xl text-primary-foreground font-semibold text-sm">
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
                  className="bg-card rounded-2xl p-6 border border-border shadow-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-sm font-medium capitalize ${sc.color}`}>
                      {sc.icon} {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.item_name} × {item.quantity}</span>
                        <span className="text-muted-foreground">Rs {item.unit_price * item.quantity}</span>
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
