ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS gallery text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS scenes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS details text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS bundles jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_page boolean NOT NULL DEFAULT false;
GRANT SELECT ON public.products TO anon;