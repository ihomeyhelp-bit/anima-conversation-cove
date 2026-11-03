create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role public.app_role not null, unique(user_id,role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid,_role public.app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles or admin read" on public.user_roles for select to authenticated using (user_id=auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create or replace function public.handle_first_admin() returns trigger language plpgsql security definer set search_path=public as $$ begin if not exists(select 1 from public.user_roles where role='admin') then insert into public.user_roles(user_id,role) values (new.id,'admin'); end if; return new; end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.handle_first_admin();
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at=now(); return new; end $$;

create table public.products (id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, category text not null default '', series text not null default '', description text not null default '', price_cents integer not null default 0, image_url text not null default '', stock integer not null default 0, low_stock_threshold integer not null default 5, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
grant select on public.products to anon, authenticated; grant insert, update, delete on public.products to authenticated; grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public reads active products" on public.products for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "admins insert products" on public.products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admins update products" on public.products for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete products" on public.products for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

create table public.orders (id uuid primary key default gen_random_uuid(), number serial unique, customer_name text not null, customer_email text not null, customer_phone text not null default '', shipping_address text not null default '', status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')), payment_status text not null default 'unpaid', total_cents integer not null default 0, notes text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
grant select, insert, update, delete on public.orders to authenticated; grant all on public.orders to service_role;
grant usage on sequence public.orders_number_seq to authenticated;
alter table public.orders enable row level security;
create policy "admins manage orders" on public.orders for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

create table public.order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, product_id uuid references public.products(id) on delete set null, product_name text not null, unit_price_cents integer not null, quantity integer not null check (quantity>0));
grant select, insert, update, delete on public.order_items to authenticated; grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "admins manage order items" on public.order_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.products (slug,name,category,series,description,price_cents,image_url,stock) values
('eufy-poe-nvr-security-system-e40','eufy PoE NVR Security System E40','poe-nvr-system','Featured','Best Value-Per-Channel for Fixed Coverage',89999,'/__l5e/assets-v1/7d7b615f-ba62-49ad-bd36-fa31bae64970/poe-nvr-system.png',50),
('eufycam-s4','eufyCam S4','outdoor-cameras','Featured','The Perfect Harmony of Bullet and PTZ Cameras',0,'/__l5e/assets-v1/4a6feaa8-750a-4208-9fdf-0b98a738baa6/outdoor-cameras.png',50),
('anker-eufy-robot-vacuum-omni-e35','Anker eufy Robot Vacuum Omni E35','robot-vacuums','Featured','Baby-Grade Cleaning. Carefree Crawling.',0,'/__l5e/assets-v1/c9fa14a5-4c06-45a5-b4fa-f47e38de7a8e/robot-vacuums.png',50),
('eufy-wearable-breast-pump-s1-pro','eufy Wearable Breast Pump S1 Pro','breast-pumps','Featured','30% More Output with 300 mmHg Strong Suction',0,'/__l5e/assets-v1/8539625c-6c78-4934-9971-4295eeb9c907/breast-pumps.png',50),
('eufy-smart-lights','eufy Smart Lights','smart-lights','Featured','Light Up Your Home',0,'/__l5e/assets-v1/81b2ea09-7fed-4c13-bbe0-82711250115a/smart-lights.png',50),
('eufy-robot-lawn-mower-e15','eufy Robot Lawn Mower E15','lawn-mowers','Featured','0.2 acres max mapping area, for flat lawns',109999,'/__l5e/assets-v1/061b25c6-6e12-4faf-8b16-788d4421448e/lawn-mowers.png',50),
('eufy-video-doorbell-s4','eufy Video Doorbell S4','video-doorbells','Featured','Immersive AI Tracking',0,'/__l5e/assets-v1/a377ed2a-3a4f-4e03-8992-5f69b35cc489/video-doorbells.png',50),
('eufy-homebase','eufy HomeBase','homebase','Featured','Your Home Security, Connected',0,'/__l5e/assets-v1/975cdada-ea37-46de-9ba4-62fd31840e86/homebase.png',50),
('eufy-indoor-cameras','eufy Indoor Cameras','indoor-cameras','Featured','Keep an Eye on What Matters',0,'/__l5e/assets-v1/0d1382f1-38c0-40fa-86a7-4cc9790eacec/indoor-cameras.png',50),
('eufy-smart-display','eufy Smart Display','smart-display','Featured','Your Home at a Glance',0,'/__l5e/assets-v1/06a754d6-1f0e-46f9-a384-5af7a47c7be5/smart-display.png',50),
('eufy-baby-monitors','eufy Baby Monitors','baby-monitors','Featured','Closer to Your Little One',0,'/__l5e/assets-v1/4edc135d-3085-4a6f-8fa4-7333084b64df/baby-monitors.png',50),
('eufy-familock-s3-max','eufy FamiLock S3 Max','smart-locks','S Series','Palm vein unlocking, 2K HDR camera and 4-inch display.',39999,'/__l5e/assets-v1/a9693628-a99a-4581-8c6f-59969f97cc39/613.png',50),
('eufy-familock-s3','eufy Familock S3','smart-locks','S Series','Your palm is your key. Secure access for the whole family.',27998,'/__l5e/assets-v1/085ebb85-f342-4d94-8532-835688ea7067/496.png',50),
('video-smart-lock-s330','Video Smart Lock S330','smart-locks','S Series','Fingerprint recognition, 2K camera and video doorbell.',34999,'/__l5e/assets-v1/844e3dfd-2169-4cd1-ab36-247b558d83e0/497.png',50),
('eufy-smart-lock-e40','eufy Smart Lock E40','smart-locks','E Series','Facial recognition for effortless keyless entry.',34999,'/__l5e/assets-v1/9194c80d-71d4-4939-80d7-95a4d0d02bc0/smart-locks.png',50),
('video-smart-lock-e330','Video Smart Lock E330','smart-locks','E Series','3-in-1 security. See and unlock from anywhere.',22999,'/__l5e/assets-v1/95fbd0b9-2b9f-4762-b076-4cfd5894ee7d/501.png',50),
('eufy-familock-e34','eufy FamiLock E34','smart-locks','E Series','Fast, forgery-resistant palm vein recognition.',19999,'/__l5e/assets-v1/b85c9a7c-e730-4883-b7d1-20cfa8fdabaa/520.png',50),
('eufy-smart-lock-e32','eufy Smart Lock E32','smart-locks','E Series','Connected access with your smart home ecosystem.',13998,'/__l5e/assets-v1/dbb536a7-eb1b-486c-b072-ff36ed6738ec/746.png',50),
('smart-lock-c220','Smart Lock C220','smart-locks','C Series','Fingerprint unlocking and built-in Wi-Fi.',9997,'/__l5e/assets-v1/94f0006c-15c4-4072-b305-e244aa020137/525.png',50),
('eufy-smart-lock-c33','eufy Smart Lock C33','smart-locks','C Series','Fingerprint recognition integrated into the handle.',10523,'/__l5e/assets-v1/b3259759-088c-4ce3-bd6e-5d3b40c15827/531.png',50),
('eufy-smart-lock-c32','eufy Smart Lock C32','smart-locks','C Series','Keyless entry with handle for interior doors.',6999,'/__l5e/assets-v1/8b7a2755-b35c-441c-b74a-e2fa8187bdab/636.png',50),
('eufy-smart-lock-c30-contemporary','eufy Smart Lock C30 Contemporary','smart-locks','C Series','Built-in Wi-Fi. Control your door from anywhere.',7999,'/__l5e/assets-v1/625bd672-139b-4c66-9f29-b2fa54ba8305/564.png',50),
('eufy-robot-vacuum-omni-s2','eufy Robot Vacuum Omni S2','robot-vacuums','S Series','Deep Cleaning, Healthy Home.',0,'/__l5e/assets-v1/18c3b30c-db30-45a1-b6cb-f6a74073bc2a/clean-product-49.webp',50),
('eufy-wearable-breast-pump-s2-pro','eufy Wearable Breast Pump S2 Pro','breast-pumps','S Series','35% More Output, 30% Less Time',44999,'/__l5e/assets-v1/8539625c-6c78-4934-9971-4295eeb9c907/breast-pumps.png',50),
('eufy-poe-nvr-security-system-e40-8-4k-bullet-cameras','eufy PoE NVR Security System E40 - 8× 4K Bullet Cameras','poe-nvr-system','E Series','Best Value-Per-Channel for Fixed Coverage',89999,'/__l5e/assets-v1/7d7b615f-ba62-49ad-bd36-fa31bae64970/poe-nvr-system.png',50);