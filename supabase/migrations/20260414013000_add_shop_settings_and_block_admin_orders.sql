-- Add centralized shop settings editable by admins
CREATE TABLE IF NOT EXISTS public.shop_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL DEFAULT 'Meerut Famous Kabab Paratha',
  tagline TEXT NOT NULL DEFAULT 'Authentic Meerut-style charcoal grilled kababs & freshly made parathas in Gulshan-e-Maymar, Karachi',
  location_short TEXT NOT NULL DEFAULT 'Sector X, Gulshan-e-Maymar',
  location_full TEXT NOT NULL DEFAULT 'Main Nawaz Sharif Park, X 4th St, Sector X Gulshan-e-Maymar, Karachi, 75340, Pakistan',
  phone TEXT NOT NULL DEFAULT '+92 330 5577668',
  open_hours_label TEXT NOT NULL DEFAULT 'Open Daily',
  open_hours_value TEXT NOT NULL DEFAULT '12:00 PM to 3:00 AM',
  hero_hours_label TEXT NOT NULL DEFAULT 'Open - Closes 3 AM',
  pickup_branch_name TEXT NOT NULL DEFAULT 'Gulshan-e-Maymar Branch',
  pickup_branch_address TEXT NOT NULL DEFAULT 'Sector X, Gulshan-e-Maymar, Karachi',
  map_embed_url TEXT NOT NULL DEFAULT 'https://maps.google.com/maps?q=25.0216392,67.1274399+(Meerut+Famous+Kabab+Paratha)&z=17&output=embed',
  map_open_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/search/?api=1&query=Meerut+Famous+Kabab+Paratha+Main+Nawaz+Sharif+Park+Karachi',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view shop settings" ON public.shop_settings;
CREATE POLICY "Anyone can view shop settings"
ON public.shop_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert shop settings" ON public.shop_settings;
CREATE POLICY "Admins can insert shop settings"
ON public.shop_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update shop settings" ON public.shop_settings;
CREATE POLICY "Admins can update shop settings"
ON public.shop_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.sync_shop_settings_hero_hours()
RETURNS TRIGGER AS $$
DECLARE
  closing_part TEXT;
BEGIN
  IF NEW.open_hours_value IS NULL OR btrim(NEW.open_hours_value) = '' THEN
    NEW.hero_hours_label := 'Open';
    RETURN NEW;
  END IF;

  closing_part := regexp_replace(NEW.open_hours_value, '^.*?(?:to|-)\s*', '', 'i');
  IF closing_part = NEW.open_hours_value THEN
    NEW.hero_hours_label := 'Open - ' || btrim(NEW.open_hours_value);
    RETURN NEW;
  END IF;

  closing_part := regexp_replace(closing_part, ':00(?=\s*(AM|PM)\b)', '', 'i');
  closing_part := regexp_replace(closing_part, '\s+', ' ', 'g');

  NEW.hero_hours_label := 'Open - Closes ' || btrim(closing_part);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_shop_settings_hero_hours ON public.shop_settings;
CREATE TRIGGER sync_shop_settings_hero_hours
BEFORE INSERT OR UPDATE ON public.shop_settings
FOR EACH ROW
EXECUTE FUNCTION public.sync_shop_settings_hero_hours();

DROP TRIGGER IF EXISTS update_shop_settings_updated_at ON public.shop_settings;
CREATE TRIGGER update_shop_settings_updated_at
BEFORE UPDATE ON public.shop_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.shop_settings (
  shop_name,
  tagline,
  location_short,
  location_full,
  phone,
  open_hours_label,
  open_hours_value,
  hero_hours_label,
  pickup_branch_name,
  pickup_branch_address,
  map_embed_url,
  map_open_url
)
SELECT
  'Meerut Famous Kabab Paratha',
  'Authentic Meerut-style charcoal grilled kababs & freshly made parathas in Gulshan-e-Maymar, Karachi',
  'Sector X, Gulshan-e-Maymar',
  'Main Nawaz Sharif Park, X 4th St, Sector X Gulshan-e-Maymar, Karachi, 75340, Pakistan',
  '+92 330 5577668',
  'Open Daily',
  '12:00 PM to 3:00 AM',
  'Open - Closes 3 AM',
  'Gulshan-e-Maymar Branch',
  'Sector X, Gulshan-e-Maymar, Karachi',
  'https://maps.google.com/maps?q=25.0216392,67.1274399+(Meerut+Famous+Kabab+Paratha)&z=17&output=embed',
  'https://www.google.com/maps/search/?api=1&query=Meerut+Famous+Kabab+Paratha+Main+Nawaz+Sharif+Park+Karachi'
WHERE NOT EXISTS (
  SELECT 1 FROM public.shop_settings
);

-- Enforce: admin accounts cannot create customer orders
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Non-admin users can create their own orders" ON public.orders;
CREATE POLICY "Non-admin users can create their own orders"
ON public.orders
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND NOT public.has_role(auth.uid(), 'admin')
);
