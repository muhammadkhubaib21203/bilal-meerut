import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Flame, Plus, Pencil, Trash2, Loader2, ImagePlus } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type MenuItem = Tables<"menu_items">;

const AdminMenuPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    image_url: string;
    popular: boolean;
    available: boolean;
  }>({
    name: "",
    description: "",
    price: "",
    category: "BBQ",
    image_url: "",
    popular: false,
    available: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
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

  useEffect(() => {
    if (user && isAdmin) {
      fetchMenu().then(() => setLoadingData(false));
    }
  }, [user, isAdmin]);

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
    toast({ title: "Image uploaded to food_pics bucket successfully" });
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
      <div className="pt-24 md:pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl md:text-5xl font-bold bg-clip-text text-gradient-fire pb-2">
              Menu Management
            </h1>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-2.5 bg-gradient-fire rounded-xl text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-glow"
            >
              <Plus className="w-5 h-5" /> Add Menu Item
            </button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/90 backdrop-blur rounded-2xl p-6 md:p-8 border border-border mb-8 shadow-card"
            >
              <h3 className="font-display text-xl font-bold mb-6">
                {editingItem ? "Edit Product" : "New Menu Product"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input
                    placeholder="Product Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    placeholder="Price (Rs) *"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  >
                    {["BBQ", "Paratha", "Rolls", "Sides", "Drinks"].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/30 border border-border rounded-xl">
                    <label className="text-sm font-semibold text-muted-foreground mb-3 block">Product Image</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {form.image_url ? (
                        <div className="relative group">
                          <img
                            src={form.image_url}
                            alt="Preview"
                            className="w-24 h-24 rounded-lg object-cover border border-border shadow-sm"
                          />
                          <button 
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setForm({ ...form, image_url: "" })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-secondary border border-dashed border-border flex items-center justify-center text-muted-foreground">
                          <ImagePlus className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2 w-full">
                        <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-sm font-medium cursor-pointer transition-colors text-center">
                          {uploadingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                            </>
                          ) : (
                            <>Upload to 'food_pics' bucket</>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                            disabled={uploadingImage}
                          />
                        </label>
                        <div className="flex items-center gap-2 w-full">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs text-muted-foreground">OR</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <input
                          placeholder="Paste direct Image URL (optional)"
                          value={form.image_url}
                          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                          className="w-full px-3 py-2 bg-secondary rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <textarea
                    placeholder="Product Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 md:col-span-2 p-4 bg-secondary/20 rounded-xl border border-border">
                  <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.popular}
                      onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary/50 cursor-pointer form-checkbox bg-secondary"
                    />
                    <span className="font-medium text-foreground">Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary/50 cursor-pointer form-checkbox bg-secondary"
                    />
                    <span className="font-medium text-foreground">Currently Available</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8 flex-wrap">
                <button
                  onClick={handleSaveItem}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-glow flex-1 md:flex-none text-center"
                >
                  {editingItem ? "Update Item" : "Save New Item"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-muted transition-colors flex-1 md:flex-none text-center"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-card/80 border border-border rounded-2xl overflow-hidden shadow-card hover:border-primary/30 transition-colors flex flex-col group"
              >
                {item.image_url ? (
                  <div className="w-full h-48 bg-muted relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted/50 flex items-center justify-center border-b border-border">
                    <ImagePlus className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-display font-bold text-lg leading-tight">{item.name}</h4>
                    <span className="text-primary font-bold whitespace-nowrap bg-primary/10 px-2 py-0.5 rounded-lg text-sm">
                      Rs {item.price}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-md">
                      {item.category}
                    </span>
                    {item.popular && (
                      <span className="text-xs bg-amber-500/10 text-amber-500 font-medium px-2.5 py-1 rounded-md">
                        Popular
                      </span>
                    )}
                    {!item.available && (
                      <span className="text-xs bg-destructive/10 text-destructive font-medium px-2.5 py-1 rounded-md">
                        Out of stock
                      </span>
                    )}
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                    <button
                      onClick={() => {
                        setForm({
                          name: item.name,
                          description: item.description || "",
                          price: item.price.toString(),
                          category: item.category,
                          image_url: item.image_url || "",
                          popular: item.popular || false,
                          available: item.available ?? true,
                        });
                        setEditingItem(item);
                        setShowForm(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex-1 flex justify-center items-center gap-2 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-medium transition-colors"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Are you sure you want to delete this menu item?")) {
                          await handleDeleteItem(item.id);
                        }
                      }}
                      className="flex items-center justify-center p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {menuItems.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-3xl bg-card/30">
                <p className="text-muted-foreground text-lg">No menu items found. Get started by adding a product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminMenuPage;