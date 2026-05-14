import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

// Fallback images
import seekhKababImg from "@/assets/seekh-kabab.jpg";
import tikkaImg from "@/assets/tikka.jpg";
import parathaImg from "@/assets/paratha.jpg";
import rollImg from "@/assets/roll.jpg";
import friesImg from "@/assets/fries.jpg";

type MenuItem = Tables<"menu_items">;

const fallbackImages: Record<string, string> = {
  BBQ: seekhKababImg,
  Paratha: parathaImg,
  Rolls: rollImg,
  Sides: friesImg,
  Drinks: friesImg,
};

const MenuSection = () => {
  const [active, setActive] = useState("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
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
  const { addItem } = useCart();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchMenu = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("category")
      .order("name");
    if (data) setMenuItems(data);
    setLoading(false);
  };

  const handleAddToCart = (item: MenuItem) => {
    if (isAdmin) {
      toast({ title: "Admin accounts cannot place orders" });
      return;
    }

    addItem({ id: item.id, name: item.name, price: item.price, image: getImage(item) });
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
  };

  const openAddModal = () => {
    resetForm();
    setShowEditor(true);
  };

  const openEditModal = (item: MenuItem) => {
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
    setShowEditor(true);
  };

  const handleSaveProduct = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }

    setSavingProduct(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number.parseFloat(form.price),
      category: form.category,
      image_url: form.image_url.trim() || null,
      popular: form.popular,
      available: form.available,
    };

    if (Number.isNaN(payload.price)) {
      toast({ title: "Enter a valid price", variant: "destructive" });
      setSavingProduct(false);
      return;
    }

    const result = editingItem
      ? await supabase.from("menu_items").update(payload).eq("id", editingItem.id)
      : await supabase.from("menu_items").insert(payload);

    if (result.error) {
      toast({ title: "Failed to save product", description: result.error.message, variant: "destructive" });
      setSavingProduct(false);
      return;
    }

    toast({ title: editingItem ? "Product updated" : "Product added" });
    setShowEditor(false);
    resetForm();
    await fetchMenu();
    setSavingProduct(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Get unique categories from DB items
  const dbCategories = ["All", ...Array.from(new Set(menuItems.map((i) => i.category)))];
  const categories = dbCategories;

  const filtered = active === "All" ? menuItems : menuItems.filter((i) => i.category === active);

  const getImage = (item: MenuItem) => item.image_url || fallbackImages[item.category] || seekhKababImg;

  return (
    <section id="menu" className="py-20 bg-gradient-smoke">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-gradient-fire">Menu</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Freshly prepared with the finest ingredients, grilled to perfection on traditional charcoal
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? "bg-gradient-fire text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div className="flex justify-end mb-10">
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-glow"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Flame className="w-8 h-8 text-primary animate-pulse mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No items in this category yet</p>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all shadow-card hover:shadow-glow flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImage(item)}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.popular && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-gradient-fire rounded-full text-xs font-semibold text-primary-foreground">
                        <Flame className="w-3 h-3" /> Popular
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
                      <span className="text-primary font-bold text-lg">Rs {item.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="mt-auto">
                      {isAdmin ? (
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-full py-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <Pencil className="w-4 h-4" /> Edit Product
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full py-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {isAdmin && showEditor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-2xl bg-card rounded-2xl border border-border p-6 shadow-card"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-2xl font-bold">{editingItem ? "Edit Product" : "Add Product"}</h3>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="p-2 hover:bg-secondary rounded-lg"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

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
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  >
                    {["Burgers", "Broast", "Sandwiches", "BBQ", "Rolls", "Dessert", "Karahi", "Handi", "Gyro", "Extras"].map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Image URL (optional)"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm md:col-span-2"
                    rows={2}
                  />
                  <div className="flex items-center gap-6 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.popular}
                        onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                        className="rounded"
                      /> Popular
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.available}
                        onChange={(e) => setForm({ ...form, available: e.target.checked })}
                        className="rounded"
                      /> Available
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleSaveProduct}
                    disabled={savingProduct}
                    className="px-6 py-2.5 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                  >
                    {savingProduct ? "Saving..." : editingItem ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-6 py-2.5 bg-secondary rounded-xl text-secondary-foreground text-sm font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MenuSection;
