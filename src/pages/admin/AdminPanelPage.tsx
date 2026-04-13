import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Flame,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Loader2,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
  MessageSquare,
  CheckCircle2,
  Circle,
  Mail
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type MenuItem = Tables<"menu_items">;
type Order = Tables<"orders">;
type OrderItem = Tables<"order_items">;
type ContactMessage = Tables<"contact_messages">;

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

const AdminPanelPage = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"menu" | "orders" | "messages">("orders");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "BBQ",
    image_url: "",
    popular: false,
    available: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, navigate]);

  const fetchMenu = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("name");
    if (data) setMenuItems(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

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
      Promise.all([fetchMenu(), fetchOrders(), fetchMessages()]).then(() =>
        setLoadingData(false),
      );
    }
  }, [user, isAdmin]);

  const handleUpdateMessageStatus = async (messageId: string, status: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", messageId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Message marked as ${status}` });
    fetchMessages();
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "BBQ",
      image_url: "",
      popular: false,
      available: true,
    });
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
      const { error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", editingItem.id);
      if (error) {
        toast({
          title: "Error updating",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Item updated" });
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) {
        toast({
          title: "Error adding",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Item added" });
    }

    resetForm();
    fetchMenu();
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const filePath = `menu/${Date.now()}-${baseName}.${ext}`;

    setUploadingImage(true);

    const { error: uploadError } = await supabase.storage
      .from("food_pics")
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      setUploadingImage(false);
      toast({
        title: "Image upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    const { data } = supabase.storage.from("food_pics").getPublicUrl(filePath);
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploadingImage(false);
    toast({ title: "Image uploaded" });
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      toast({
        title: "Error deleting",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Item deleted" });
    fetchMenu();
  };

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
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-card/95 backdrop-blur border-r border-border p-6 flex-col z-40 hidden md:flex">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-40 h-auto object-contain" />
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
          <button
            onClick={() => setTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === "messages" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
              )}
            </div> Messages
          </button>
        </nav>

        <div className="space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-28 h-auto object-contain" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("orders")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === "orders" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab("menu")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === "menu" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            Menu
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium ${tab === "messages" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            Messages
            {messages.filter(m => m.status === 'unread').length > 0 && (
              <span className="absolute 0 top-0 right-0 w-2 h-2 bg-destructive rounded-full translate-x-1/2 -translate-y-1/2"></span>
            )}
          </button>
        </div>
      </div>

      <div className="md:ml-64 p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-card/80 border border-border rounded-2xl p-4 shadow-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Orders</p>
            <p className="text-3xl mt-2 font-display font-bold text-gradient-fire">
              {orders.length}
            </p>
          </div>
          <div className="bg-card/80 border border-border rounded-2xl p-4 shadow-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Menu Items</p>
            <p className="text-3xl mt-2 font-display font-bold text-gradient-fire">
              {menuItems.length}
            </p>
          </div>
          <div className="bg-card/80 border border-border rounded-2xl p-4 shadow-card hidden lg:block">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Unread Messages</p>
            <p className="text-3xl mt-2 font-display font-bold text-primary">
              {messages.filter(m => m.status === 'unread').length}
            </p>
          </div>
        </div>

        {tab === "orders" && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              Order Management
            </h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                No orders yet
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className="bg-card/90 rounded-2xl border border-border overflow-hidden shadow-card"
                  >
                    <button
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id,
                        )
                      }
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div>
                        <p className="font-semibold text-sm">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-bold">
                          Rs {order.total_amount}
                        </span>
                        <span
                          className={`text-xs font-medium capitalize px-2.5 py-1 rounded-full ${
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
                          className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        className="border-t border-border p-5 space-y-4"
                      >
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.item_name} x {item.quantity}
                              </span>
                              <span className="text-muted-foreground">
                                Rs {item.unit_price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.phone && (
                          <p className="text-sm text-muted-foreground">
                            Phone: {order.phone}
                          </p>
                        )}
                        {order.delivery_address && (
                          <p className="text-sm text-muted-foreground">
                            Address: {order.delivery_address}
                          </p>
                        )}
                        {order.notes && (
                          <p className="text-sm text-muted-foreground">
                            Notes: {order.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {statuses.map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, status)
                              }
                              disabled={order.status === status}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                                order.status === status
                                  ? "bg-primary text-primary-foreground"
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
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "menu" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">
                Menu Management
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-glow"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border mb-6 shadow-card"
              >
                <h3 className="font-display font-bold mb-4">
                  {editingItem ? "Edit Item" : "New Item"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    placeholder="Price (Rs) *"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  >
                    {["BBQ", "Paratha", "Rolls", "Sides", "Drinks"].map(
                      (category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ),
                    )}
                  </select>
                  <div className="space-y-2">
                    <input
                      placeholder="Image URL (optional)"
                      value={form.image_url}
                      onChange={(e) =>
                        setForm({ ...form, image_url: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2 bg-secondary rounded-lg border border-border text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
                        {uploadingImage
                          ? "Uploading..."
                          : "Upload from food_pics"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e.target.files?.[0] || null)
                          }
                          disabled={uploadingImage}
                        />
                      </label>
                      {uploadingImage && (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      )}
                    </div>
                    {form.image_url && (
                      <img
                        src={form.image_url}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover border border-border"
                      />
                    )}
                  </div>
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm md:col-span-2"
                    rows={2}
                  />
                  <div className="flex items-center gap-6 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.popular}
                        onChange={(e) =>
                          setForm({ ...form, popular: e.target.checked })
                        }
                        className="rounded"
                      />{" "}
                      Popular
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.available}
                        onChange={(e) =>
                          setForm({ ...form, available: e.target.checked })
                        }
                        className="rounded"
                      />{" "}
                      Available
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveItem}
                    className="px-6 py-2.5 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold hover:opacity-90"
                  >
                    {editingItem ? "Update" : "Add Item"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-secondary rounded-xl text-secondary-foreground text-sm font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid gap-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm truncate">
                        {item.name}
                      </h4>
                      {item.popular && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      {!item.available && (
                        <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.category} - Rs {item.price}
                    </p>
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
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              Contact Messages
            </h2>
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                No messages yet
              </p>
            ) : (
              <div className="space-y-4 max-w-7xl">
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`bg-card/80 backdrop-blur border rounded-2xl p-5 shadow-card transition-all ${msg.status === 'unread' ? 'border-primary' : 'border-border'}`}
                  >
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{msg.name}</h4>
                          {msg.status === 'unread' && <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/30">New</span>}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span>{msg.email}</span>
                          {msg.phone && <span>• {msg.phone}</span>}
                          <span>• {new Date(msg.created_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=${encodeURIComponent('Reply to your inquiry at Meerut Famous Kabab Paratha')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" /> Reply
                        </a>
                        {msg.status === 'unread' ? (
                          <button
                            onClick={() => handleUpdateMessageStatus(msg.id, "read")}
                            className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Mark as Read
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateMessageStatus(msg.id, "unread")}
                            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <Circle className="w-4 h-4" /> Mark Unread
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (confirm("Delete this message?")) {
                              await supabase.from("contact_messages").delete().eq("id", msg.id);
                              fetchMessages();
                            }
                          }}
                          className="bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary/40 p-4 rounded-xl text-foreground/90 whitespace-pre-wrap border border-border/50 text-sm">
                      {msg.message}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
