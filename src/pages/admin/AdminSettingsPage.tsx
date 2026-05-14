import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { buildHeroHoursLabel } from "@/hooks/use-shop-settings";
import { Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminSettingsPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loadingData, setLoadingData] = useState(true);
  const [shopSettingsId, setShopSettingsId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    shop_name: "Meerut Famous Kabab Paratha",
    tagline: "Authentic Meerut-style charcoal grilled kababs & freshly made parathas in Gulshan-e-Maymar, Karachi",
    location_short: "Sector X, Gulshan-e-Maymar",
    location_full: "Main Nawaz Sharif Park, X 4th St, Sector X Gulshan-e-Maymar, Karachi, 75340, Pakistan",
    phone: "+92 330 5577668",
    open_hours_label: "Open Daily",
    open_hours_value: "12:00 PM to 3:00 AM",
    pickup_branch_name: "Gulshan-e-Maymar Branch",
    pickup_branch_address: "Sector X, Gulshan-e-Maymar, Karachi",
    map_embed_url: "https://maps.google.com/maps?q=25.0216392,67.1274399+(Meerut+Famous+Kabab+Paratha)&z=17&output=embed",
    map_open_url: "https://www.google.com/maps/search/?api=1&query=Meerut+Famous+Kabab+Paratha+Main+Nawaz+Sharif+Park+Karachi",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, navigate]);

  const fetchShopSettings = async () => {
    const { data } = await supabase
      .from("shop_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!data) return;

    setShopSettingsId(data.id);
    setSettingsForm({
      shop_name: data.shop_name,
      tagline: data.tagline,
      location_short: data.location_short,
      location_full: data.location_full,
      phone: data.phone,
      open_hours_label: data.open_hours_label,
      open_hours_value: data.open_hours_value,
      pickup_branch_name: data.pickup_branch_name,
      pickup_branch_address: data.pickup_branch_address,
      map_embed_url: data.map_embed_url,
      map_open_url: data.map_open_url,
    });
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchShopSettings().then(() => setLoadingData(false));
    }
  }, [user, isAdmin]);

  const handleSaveShopSettings = async () => {
    setSavingSettings(true);

    const payload = {
      ...settingsForm,
      hero_hours_label: buildHeroHoursLabel(settingsForm.open_hours_value),
    };

    const result = shopSettingsId
      ? await supabase.from("shop_settings").update(payload).eq("id", shopSettingsId)
      : await supabase.from("shop_settings").insert(payload).select("id").single();

    if (result.error) {
      toast({ title: "Failed to save settings", description: result.error.message, variant: "destructive" });
      setSavingSettings(false);
      return;
    }

    toast({ title: "Shop settings updated" });
    await fetchShopSettings();
    setSavingSettings(false);
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
          <div className="mb-8 items-start sm:items-center">
            <h1 className="font-display text-3xl md:text-5xl font-bold bg-clip-text text-gradient-fire pb-2">
              Shop Settings
            </h1>
            <p className="text-muted-foreground mt-2">Manage your shop's global appearance, timings, and location details.</p>
          </div>

          <div className="bg-card/90 backdrop-blur rounded-3xl border border-border p-6 md:p-10 shadow-card space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shop Name</label>
                <input
                  value={settingsForm.shop_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, shop_name: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Phone</label>
                <input
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tagline</label>
                <textarea
                  rows={2}
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hero Location (short)</label>
                <input
                  value={settingsForm.location_short}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location_short: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hero Hours (live preview)</label>
                <div className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border border-border text-foreground text-base flex items-center h-[58px]">
                  {buildHeroHoursLabel(settingsForm.open_hours_value)}
                </div>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Full Address</label>
                <textarea
                  rows={2}
                  value={settingsForm.location_full}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location_full: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Open Hours Label</label>
                <input
                  value={settingsForm.open_hours_label}
                  onChange={(e) => setSettingsForm({ ...settingsForm, open_hours_label: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Open Hours interval (24h syntax)</label>
                <input
                  value={settingsForm.open_hours_value}
                  onChange={(e) => setSettingsForm({ ...settingsForm, open_hours_value: e.target.value })}
                  placeholder="e.g. 12:00 PM to 3:00 AM"
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pickup Branch Name</label>
                <input
                  value={settingsForm.pickup_branch_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, pickup_branch_name: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pickup Branch Address</label>
                <input
                  value={settingsForm.pickup_branch_address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, pickup_branch_address: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base"
                />
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Map Embed URL</label>
                <input
                  value={settingsForm.map_embed_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, map_embed_url: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base font-mono text-sm"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Google Maps Open URL</label>
                <input
                  value={settingsForm.map_open_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, map_open_url: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary rounded-2xl border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-base font-mono text-sm"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <button
                onClick={handleSaveShopSettings}
                disabled={savingSettings}
                className="w-full md:w-auto px-10 py-4 bg-gradient-fire rounded-2xl text-primary-foreground text-lg font-bold hover:opacity-90 shadow-glow disabled:opacity-60 transition-all active:scale-95"
              >
                {savingSettings ? "Saving Settings..." : "Save Shop Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminSettingsPage;