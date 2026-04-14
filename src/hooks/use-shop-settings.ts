import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const parseTimeToMinutes = (timeValue: string) => {
  const match = timeValue.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number.parseInt(match[1], 10) % 12;
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const period = match[3].toUpperCase();

  if (period === "PM") hours += 12;

  return hours * 60 + minutes;
};

const formatTimeForLabel = (timeValue: string) =>
  timeValue.replace(/:00(?=\s*(AM|PM)\b)/i, "").replace(/\s+/g, " ").trim();

export const buildHeroHoursLabel = (openHoursValue: string) => {
  const normalized = openHoursValue.trim();
  if (!normalized) return "Open";

  const parts = normalized.split(/\s*(?:to|-)\s*/i);
  if (parts.length < 2) {
    return `Open - ${normalized}`;
  }

  const openingRaw = parts[0].trim();
  const closingRaw = parts[parts.length - 1].trim();
  const openingMinutes = parseTimeToMinutes(openingRaw);
  const closingMinutes = parseTimeToMinutes(closingRaw);

  if (openingMinutes === null || closingMinutes === null) {
    return `Open - Closes ${formatTimeForLabel(closingRaw)}`;
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const isOvernight = closingMinutes <= openingMinutes;
  const isOpenNow = isOvernight
    ? nowMinutes >= openingMinutes || nowMinutes < closingMinutes
    : nowMinutes >= openingMinutes && nowMinutes < closingMinutes;

  if (isOpenNow) {
    return `Open - Closes ${formatTimeForLabel(closingRaw)}`;
  }

  return `Closed - Opens ${formatTimeForLabel(openingRaw)}`;
};

export interface ShopSettingsView {
  shopName: string;
  tagline: string;
  locationShort: string;
  locationFull: string;
  phone: string;
  openHoursLabel: string;
  openHoursValue: string;
  heroHoursLabel: string;
  pickupBranchName: string;
  pickupBranchAddress: string;
  mapEmbedUrl: string;
  mapOpenUrl: string;
}

export const defaultShopSettings: ShopSettingsView = {
  shopName: "Meerut Famous Kabab Paratha",
  tagline:
    "Authentic Meerut-style charcoal grilled kababs & freshly made parathas in Gulshan-e-Maymar, Karachi",
  locationShort: "Sector X, Gulshan-e-Maymar",
  locationFull:
    "Main Nawaz Sharif Park, X 4th St, Sector X Gulshan-e-Maymar, Karachi, 75340, Pakistan",
  phone: "+92 330 5577668",
  openHoursLabel: "Open Daily",
  openHoursValue: "12:00 PM to 3:00 AM",
  heroHoursLabel: buildHeroHoursLabel("12:00 PM to 3:00 AM"),
  pickupBranchName: "Gulshan-e-Maymar Branch",
  pickupBranchAddress: "Sector X, Gulshan-e-Maymar, Karachi",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=25.0216392,67.1274399+(Meerut+Famous+Kabab+Paratha)&z=17&output=embed",
  mapOpenUrl:
    "https://www.google.com/maps/search/?api=1&query=Meerut+Famous+Kabab+Paratha+Main+Nawaz+Sharif+Park+Karachi",
};

export const useShopSettings = () => {
  const [settings, setSettings] = useState<ShopSettingsView>(defaultShopSettings);
  const [clockTick, setClockTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setClockTick((prev) => prev + 1);
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      const { data } = await supabase
        .from("shop_settings")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!isMounted || !data) return;

      setSettings({
        shopName: data.shop_name,
        tagline: data.tagline,
        locationShort: data.location_short,
        locationFull: data.location_full,
        phone: data.phone,
        openHoursLabel: data.open_hours_label,
        openHoursValue: data.open_hours_value,
        heroHoursLabel: buildHeroHoursLabel(data.open_hours_value),
        pickupBranchName: data.pickup_branch_name,
        pickupBranchAddress: data.pickup_branch_address,
        mapEmbedUrl: data.map_embed_url,
        mapOpenUrl: data.map_open_url,
      });
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const syncedSettings = {
    ...settings,
    heroHoursLabel: buildHeroHoursLabel(settings.openHoursValue),
  };

  return { settings: syncedSettings, clockTick };
};
