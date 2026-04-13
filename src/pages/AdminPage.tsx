import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Flame, ArrowLeft, Plus, Pencil, Trash2, Package, Eye, ChevronDown,
  LayoutDashboard, UtensilsCrossed, ShoppingBag, LogOut
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type MenuItem = Tables<"menu_items">;
type Order = Tables<"orders">;
type OrderItem = Tables<"order_items">;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

const AdminPage = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"menu" | "orders">("orders");

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "BBQ", image_url: "", popular: false, available: true });

  // Orders state
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, navigate]);

  const fetchMenu = async () => {
    const { data } = await supabase.from("menu_items").select("*").order("category").order("name");
    if (data) setMenuItems(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) {
      const withItems = await Promise.all(
        data.map(async (order) => {
          const { data: items } = await supabase.from("order_items").select("*").eq("order_id", order.id);
          return { ...order, order_items: items || [] };
        })
      );
      setOrders(withItems);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      Promise.all([fetchMenu(), fetchOrders()]).then(() => setLoadingData(false));
    }
  }, [user, isAdmin]);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category: "BBQ", image_url: "", popular: false, available: true });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSaveItem = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Name and price required", variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      category: form.category,
      image_url: form.image_url || null,
      popular: form.popular,
      available: form.available,
    };

    if (editingItem) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", editingItem.id);
      if (error) { toast({ title: "Error updating", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Item updated ✅" });
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) { toast({ title: "Error adding", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Item added 🔥" });
    }
    resetForm();
    fetchMenu();
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) { toast({ title: "Error deleting", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Item deleted" });
    fetchMenu();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
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

  const statuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6 flex flex-col z-40 hidden md:flex">
        <div className="flex items-center gap-2 mb-8">
          <Flame className="w-6 h-6 text-primary" />
          <span className="font-display text-lg font-bold text-gradient-fire">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === "orders" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders
          </button>
          <button
            onClick={() => setTab("menu")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === "menu" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <UtensilsCrossed className="w-4 h-4" /> Menu Items
          </button>
        </nav>

        <div className="space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-gradient-fire">Admin</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab("orders")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === "orders" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Orders</button>
          <button onClick={() => setTab("menu")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === "menu" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Menu</button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 p-4 md:p-8">
        {tab === "orders" && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              <span className="text-gradient-fire">Orders</span> ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div key={order.id} layout className="bg-card rounded-2xl border border-border overflow-hidden">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-sm">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-bold">Rs {order.total_amount}</span>
                        <span className={`text-xs font-medium capitalize px-2.5 py-1 rounded-full ${
                          order.status === "pending" ? "bg-gold/20 text-gold" :
                          order.status === "delivered" ? "bg-green-500/20 text-green-400" :
                          order.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                          "bg-primary/20 text-primary"
                        }`}>{order.status}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {expandedOrder === order.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t border-border p-5 space-y-4">
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.item_name} × {item.quantity}</span>
                              <span className="text-muted-foreground">Rs {item.unit_price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        {order.phone && <p className="text-sm text-muted-foreground">📞 {order.phone}</p>}
                        {order.delivery_address && <p className="text-sm text-muted-foreground">📍 {order.delivery_address}</p>}
                        {order.notes && <p className="text-sm text-muted-foreground">📝 {order.notes}</p>}
                        <div className="flex flex-wrap gap-2">
                          {statuses.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleUpdateOrderStatus(order.id, s)}
                              disabled={order.status === s}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                                order.status === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "menu" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">
                <span className="text-gradient-fire">Menu</span> Items ({menuItems.length})
              </h2>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="px-4 py-2 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-glow"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            {showForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 border border-border mb-6 shadow-card">
                <h3 className="font-display font-bold mb-4">{editingItem ? "Edit Item" : "New Item"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                  <input placeholder="Price (Rs) *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary text-sm">
                    {["BBQ", "Paratha", "Rolls", "Sides", "Drinks"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                  <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm md:col-span-2" rows={2} />
                  <div className="flex items-center gap-6 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="rounded" /> Popular
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="rounded" /> Available
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveItem} className="px-6 py-2.5 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold hover:opacity-90">
                    {editingItem ? "Update" : "Add Item"}
                  </button>
                  <button onClick={resetForm} className="px-6 py-2.5 bg-secondary rounded-xl text-secondary-foreground text-sm font-semibold hover:bg-muted">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid gap-3">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
                  {item.image_url && <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      {item.popular && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Popular</span>}
                      {!item.available && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Unavailable</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.category} · Rs {item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setForm({
                          name: item.name,
                          description: item.description || "",
                          price: String(item.price),
                          category: item.category,
                          image_url: item.image_url || "",
                          popular: item.popular,
                          available: item.available,
                        });
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
