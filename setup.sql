-- Tabloların (eğer yoksa) oluşturulması
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  cost_price numeric NOT NULL,
  sale_price numeric NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  cost_price numeric NOT NULL,
  total_amount numeric NOT NULL,
  profit numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1. ANON (Giriş yapmamış) kullanıcılar için tablolara tam yetki veriyoruz.
-- 401 Unauthorized hatasının sebebi genellikle anon rolüne yetki atanmamış olmasıdır.
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sales TO anon, authenticated, service_role;

-- 2. RLS (Row Level Security - Satır Bazlı Güvenlik) Kurallarını açıp HERKESE açık yapıyoruz.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Eğer daha önceden eklendiyse hata vermemesi için önce siliyoruz, sonra yeniden oluşturuyoruz.
DROP POLICY IF EXISTS "products_anon_policy" ON public.products;
DROP POLICY IF EXISTS "sales_anon_policy" ON public.sales;

CREATE POLICY "products_anon_policy" ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "sales_anon_policy" ON public.sales FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. Resimler için Storage (Depolama) alanı ayarları (Eğer kurulu değilse)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Objects" ON storage.objects;
CREATE POLICY "Public Access Objects" 
ON storage.objects FOR ALL 
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');
