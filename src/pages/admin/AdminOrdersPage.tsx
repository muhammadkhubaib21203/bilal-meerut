import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Flame, ChevronDown } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Order = Tables<"orders">;
type OrderItem = Tables<"order_items">;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

const AdminOrdersPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      const withItems = await Promise.all(
        data.map(async (order) => {
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id);
          return { ...order, order_items: items || [] };
        }),
      );
      setOrders(withItems);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchOrders().then(() => setLoadingData(false));
    }
  }, [user, isAdmin]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: `Order marked as ${status}` });
    fetchOrders();
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Flame className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-smoke">
      <Navbar />
      <div className="pt-24 md:pt-32 pb-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="font-display text-3xl md:text-5xl font-bold bg-clip-text text-gradient-fire pb-2">
              Order Management
            </h1>
            <div className="bg-card/80 border border-border rounded-2xl px-6 py-3 shadow-card text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Orders</p>
              <p className="text-2xl mt-1 font-display font-bold text-gradient-fire">
                {orders.length}
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 bg-card rounded-2xl border border-border">
              No orders yet
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isUndelivered = !["delivered", "cancelled"].includes(order.status);
                return (
                <motion.div
                  key={order.id}
                  layout
                  className={`bg-card/90 rounded-2xl border overflow-hidden transition-all ${
                    isUndelivered
                      ? "border-primary shadow-[0_0_15px_rgba(255,100,50,0.2)] ring-1 ring-primary/30"
                      : "border-border shadow-card"
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id,
                      )
                    }
                    className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 text-left gap-4"
                  >
                    <div className="w-full flex justify-between sm:block">
                      <div>
                        <p className="font-semibold text-lg md:text-xl">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-primary font-bold sm:hidden items-center self-center text-lg">
                        Rs {order.total_amount}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                      <span className="text-primary font-bold hidden sm:inline-block border-r border-border pr-4">
                        Rs {order.total_amount}
                      </span>
                      <span
                        className={`text-xs font-medium capitalize px-3 py-1 rounded-full ${
                          order.status === "pending"
                            ? "bg-gold/20 text-gold"
                            : order.status === "delivered"
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "cancelled"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-primary/20 text-primary"
                        }`}
                      >
                        {order.status}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      className="border-t border-border p-5 space-y-4 md:text-lg"
                    >
                      <div className="space-y-3 p-4 bg-secondary/30 rounded-xl">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between"
                          >
                            <span className="font-medium">
                              {item.item_name} <span className="text-muted-foreground">x {item.quantity}</span>
                            </span>
                            <span className="text-foreground">
                              Rs {item.unit_price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.phone && (
                          <div className="p-4 rounded-xl border border-border bg-card">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Phone</p>
                            <p>{order.phone}</p>
                          </div>
                        )}
                        {order.delivery_address && (
                          <div className="p-4 rounded-xl border border-border bg-card">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Address</p>
                            <p>{order.delivery_address}</p>
                          </div>
                        )}
                        {order.notes && (
                          <div className="p-4 rounded-xl border border-border bg-card md:col-span-2">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Notes</p>
                            <p>{order.notes}</p>
                          </div>
                        )}
                        <div className="p-4 rounded-xl border border-border bg-card md:col-span-2 flex justify-between items-center sm:hidden">
                          <span className="font-bold">Total</span>
                          <span className="font-bold text-primary">Rs {order.total_amount}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border mt-4">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, status)
                            }
                            disabled={order.status === status}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors flex-1 sm:flex-none ${
                              order.status === status
                                ? "bg-primary text-primary-foreground shadow-glow"
                                : "bg-secondary text-secondary-foreground hover:bg-muted"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminOrdersPage;