-- ========================================================
-- PAPR: Production Database Schema & Seed Data
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    avatar_url TEXT DEFAULT '',
    school_or_college TEXT DEFAULT '',
    class_or_branch TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    line1 TEXT NOT NULL,
    landmark TEXT DEFAULT '',
    pincode TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Indore',
    state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    type TEXT NOT NULL DEFAULT 'Home' CHECK (type IN ('Home', 'Hostel/PG', 'College', 'Office')),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    display_order INT NOT NULL DEFAULT 0
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT DEFAULT 'PAPR Studio',
    category_id TEXT NOT NULL REFERENCES public.categories(id),
    description TEXT DEFAULT '',
    mrp NUMERIC(10, 2) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT DEFAULT '',
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INT NOT NULL DEFAULT 50,
    same_day_eligible BOOLEAN NOT NULL DEFAULT TRUE,
    tag TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SCHOOL CLASS KITS
CREATE TABLE IF NOT EXISTS public.class_kits (
    id TEXT PRIMARY KEY,
    class_number INT NOT NULL CHECK (class_number BETWEEN 1 AND 12),
    stream TEXT CHECK (stream IN ('Science', 'Commerce', 'Arts')),
    title TEXT NOT NULL,
    badge TEXT NOT NULL DEFAULT 'Verified Syllabus Bundle',
    bundle_discount_pct NUMERIC(5, 2) NOT NULL DEFAULT 8.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.class_kit_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kit_id TEXT NOT NULL REFERENCES public.class_kits(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    syllabus_note TEXT DEFAULT ''
);

-- 6. COLLEGES & CAMPUS KITS
CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Indore'
);

CREATE TABLE IF NOT EXISTS public.college_branches (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stream_group TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.college_kits (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id TEXT NOT NULL REFERENCES public.college_branches(id) ON DELETE CASCADE,
    academic_year INT NOT NULL CHECK (academic_year BETWEEN 1 AND 4),
    title TEXT NOT NULL,
    expected_delivery TEXT NOT NULL DEFAULT 'Dispatched within 24 hours',
    bundle_discount_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.college_kit_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kit_id TEXT NOT NULL REFERENCES public.college_kits(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    syllabus_note TEXT DEFAULT ''
);

-- 7. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Processing', 'Printed', 'Dispatched', 'Delivered', 'Cancelled')),
    payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'upi', 'razorpay', 'card')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    razorpay_order_id TEXT DEFAULT '',
    razorpay_payment_id TEXT DEFAULT '',
    delivery_slot TEXT NOT NULL DEFAULT 'sameday',
    shipping_address JSONB NOT NULL,
    customer_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('product', 'classKit', 'collegeKit', 'printing')),
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. PRINT STUDIO JOBS
CREATE TABLE IF NOT EXISTS public.print_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_url TEXT DEFAULT '',
    file_size_bytes BIGINT DEFAULT 0,
    total_pages INT NOT NULL DEFAULT 1,
    copies INT NOT NULL DEFAULT 1,
    color_mode TEXT NOT NULL DEFAULT 'bw' CHECK (color_mode IN ('bw', 'color')),
    sides TEXT NOT NULL DEFAULT 'single' CHECK (sides IN ('single', 'duplex')),
    paper_size TEXT NOT NULL DEFAULT 'A4' CHECK (paper_size IN ('A4', 'A3')),
    binding_type TEXT NOT NULL DEFAULT 'none' CHECK (binding_type IN ('none', 'staple', 'spiral', 'hardbound', 'file')),
    delivery_type TEXT NOT NULL DEFAULT 'deliver' CHECK (delivery_type IN ('deliver', 'pickup')),
    estimated_cost NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'ready', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BULK QUOTE REQUESTS
CREATE TABLE IF NOT EXISTS public.bulk_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    requirements TEXT NOT NULL,
    estimated_units INT DEFAULT 50,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_quotes ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog items
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public class_kits are viewable by everyone" ON public.class_kits FOR SELECT USING (true);
CREATE POLICY "Public class_kit_items are viewable by everyone" ON public.class_kit_items FOR SELECT USING (true);
CREATE POLICY "Public colleges are viewable by everyone" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public college_branches are viewable by everyone" ON public.college_branches FOR SELECT USING (true);
CREATE POLICY "Public college_kits are viewable by everyone" ON public.college_kits FOR SELECT USING (true);
CREATE POLICY "Public college_kit_items are viewable by everyone" ON public.college_kit_items FOR SELECT USING (true);

-- User profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses
CREATE POLICY "Users can manage their own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Orders: Users can read their own orders; anyone can insert (for guest checkout)
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR auth.uid() IS NULL))
);
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Print jobs
CREATE POLICY "Users can view their own print jobs" ON public.print_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert print jobs" ON public.print_jobs FOR INSERT WITH CHECK (true);

-- Bulk quotes
CREATE POLICY "Anyone can submit bulk quotes" ON public.bulk_quotes FOR INSERT WITH CHECK (true);

-- Admin full access policies
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins have full access to orders" ON public.orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins have full access to print jobs" ON public.print_jobs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

