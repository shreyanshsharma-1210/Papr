import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { PRODUCTS, COLLEGES, buildClassKit, buildCollegeKit } from "./mock-data";
import { PRODUCT_IMAGES } from "./product-images";
import type {
  Product,
  Order,
  PrintSpecs,
  Profile,
  BulkQuoteRequest,
  OrderStatus,
  PaymentStatus,
} from "./types";

// Local storage fallback storage keys
const STORAGE_KEYS = {
  PRODUCTS: "papr-db-products",
  ORDERS: "papr-db-orders",
  PRINT_JOBS: "papr-db-print-jobs",
  BULK_QUOTES: "papr-db-bulk-quotes",
  PROFILES: "papr-db-profiles",
  CURRENT_USER: "papr-auth-session",
};

// Check if Supabase is connected with real credentials
function isSupabaseConfigured(): boolean {
  try {
    const url =
      import.meta.env.VITE_SUPABASE_URL ||
      (typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined);
    const key =
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      (typeof process !== "undefined" ? process.env?.SUPABASE_PUBLISHABLE_KEY : undefined);
    return !!(
      url &&
      key &&
      !url.includes("your-project-id") &&
      !key.includes("your-supabase-anon-key")
    );
  } catch {
    return false;
  }
}

// Helper to get local data with defaults
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or disabled in private browsing
  }
}

// Initialize local store if empty
export function initLocalStore() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setLocal(STORAGE_KEYS.PRODUCTS, PRODUCTS);
  }
}

// ==========================================
// PRODUCTS SERVICE
// ==========================================

export async function fetchProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        return data as unknown as Product[];
      }
    } catch (e) {
      console.warn("Supabase query failed, falling back to local store:", e);
    }
  }

  const local = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (local.length === 0) {
    setLocal(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    return PRODUCTS;
  }
  return local.map((p) => ({
    ...p,
    image:
      p.image ||
      PRODUCT_IMAGES[p.id] ||
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
  }));
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id);
}

export async function saveProduct(product: Product): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("products").upsert(product);
    } catch {
      // Supabase unavailable; fall back to local storage
    }
  }
  const products = await fetchProducts();
  const existing = products.findIndex((p) => p.id === product.id);
  if (existing >= 0) {
    products[existing] = product;
  } else {
    products.unshift(product);
  }
  setLocal(STORAGE_KEYS.PRODUCTS, products);
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("products").delete().eq("id", id);
    } catch {
      // Supabase unavailable; fall back to local storage
    }
  }
  const products = await fetchProducts();
  const filtered = products.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PRODUCTS, filtered);
}

// ==========================================
// ORDERS SERVICE
// ==========================================

export async function fetchOrders(userId?: string): Promise<Order[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as unknown as Order[];
      }
    } catch (e) {
      console.warn("Supabase order query failed:", e);
    }
  }

  const allOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
  if (userId) {
    return allOrders.filter((o) => o.userId === userId || !o.userId);
  }
  return allOrders;
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const orderId = `PAPR-${Math.floor(100000 + Math.random() * 900000)}`;
  const order: Order = {
    ...orderData,
    id: orderId,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("orders").insert({
        id: order.id,
        user_id: order.userId || null,
        total_amount: order.total,
        subtotal: order.subtotal,
        discount_amount: order.discount,
        delivery_fee: order.deliveryFee,
        tax_amount: order.tax,
        status: order.status,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        delivery_slot: order.slot,
        shipping_address: order.shippingAddress as unknown as Json,
      });

      if (order.items.length > 0) {
        const items = order.items.map((it) => ({
          order_id: order.id,
          kind: it.kind,
          product_id: it.productId || null,
          title: it.title,
          quantity: it.quantity,
          unit_price: it.unitPrice,
          total_price: it.totalPrice,
          metadata: { specsSummary: it.specsSummary },
        }));
        await supabase.from("order_items").insert(items);
      }
    } catch (e) {
      console.warn("Failed to insert order to Supabase:", e);
    }
  }

  const localOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
  localOrders.unshift(order);
  setLocal(STORAGE_KEYS.ORDERS, localOrders);

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus,
): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const updates: { status: string; updated_at: string; payment_status?: string } = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (paymentStatus) updates.payment_status = paymentStatus;
      await supabase.from("orders").update(updates).eq("id", orderId);
    } catch {
      // Supabase update failed; update local storage
    }
  }

  const localOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
  const idx = localOrders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    localOrders[idx].status = status;
    if (paymentStatus) localOrders[idx].paymentStatus = paymentStatus;
    localOrders[idx].updatedAt = new Date().toISOString();
    setLocal(STORAGE_KEYS.ORDERS, localOrders);
  }
}

// ==========================================
// PRINT JOBS SERVICE
// ==========================================

export interface PrintJobRecord {
  id: string;
  orderId?: string;
  specs: PrintSpecs;
  createdAt: string;
  status: "queued" | "printing" | "ready" | "completed";
}

export async function fetchPrintJobs(): Promise<PrintJobRecord[]> {
  return getLocal<PrintJobRecord[]>(STORAGE_KEYS.PRINT_JOBS, []);
}

export async function savePrintJob(
  specsOrObj: PrintSpecs | { orderId?: string; specs: PrintSpecs; amount?: number },
  orderId?: string,
): Promise<PrintJobRecord> {
  const specs = "specs" in specsOrObj ? specsOrObj.specs : specsOrObj;
  const oid = "orderId" in specsOrObj ? specsOrObj.orderId : orderId;
  const job: PrintJobRecord = {
    id: `PJ-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: oid,
    specs,
    createdAt: new Date().toISOString(),
    status: "queued",
  };

  const jobs = await fetchPrintJobs();
  jobs.unshift(job);
  setLocal(STORAGE_KEYS.PRINT_JOBS, jobs);
  return job;
}

export async function updatePrintJobStatus(
  jobId: string,
  status: PrintJobRecord["status"],
): Promise<void> {
  const jobs = await fetchPrintJobs();
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx >= 0) {
    jobs[idx].status = status;
    setLocal(STORAGE_KEYS.PRINT_JOBS, jobs);
  }
}

// ==========================================
// BULK QUOTES SERVICE
// ==========================================

export async function submitBulkQuote(
  data: Omit<BulkQuoteRequest, "id" | "status" | "createdAt">,
): Promise<BulkQuoteRequest> {
  const quote: BulkQuoteRequest = {
    ...data,
    id: `BQ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("bulk_quotes").insert({
        id: quote.id,
        organization_name: quote.organizationName,
        contact_person: quote.contactPerson,
        email: quote.email,
        phone: quote.phone,
        requirements: quote.requirements,
        estimated_units: quote.estimatedUnits,
      });
    } catch {
      // Supabase insert failed; store locally
    }
  }

  const quotes = getLocal<BulkQuoteRequest[]>(STORAGE_KEYS.BULK_QUOTES, []);
  quotes.unshift(quote);
  setLocal(STORAGE_KEYS.BULK_QUOTES, quotes);

  return quote;
}

export async function fetchBulkQuotes(): Promise<BulkQuoteRequest[]> {
  return getLocal<BulkQuoteRequest[]>(STORAGE_KEYS.BULK_QUOTES, []);
}

// ==========================================
// AUTHENTICATION & USER SESSIONS
// ==========================================

export interface UserSession {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "customer" | "admin";
  };
  token?: string;
}

export async function getCurrentSession(): Promise<UserSession | null> {
  if (isSupabaseConfigured()) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          user: {
            id: session.user.id,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || "PAPR Member",
            role: session.user.user_metadata?.role || "customer",
          },
          token: session.access_token,
        };
      }
    } catch {
      // Supabase session lookup failed; fallback to local storage
    }
  }

  return getLocal<UserSession | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export async function signInUser(email: string, password: string): Promise<UserSession> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const session: UserSession = {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          role: data.user.user_metadata?.role || (email.includes("admin") ? "admin" : "customer"),
        },
        token: data.session?.access_token,
      };
      setLocal(STORAGE_KEYS.CURRENT_USER, session);
      return session;
    }
  }

  // Local fallback session
  const role: "customer" | "admin" = email.toLowerCase().includes("admin") ? "admin" : "customer";
  const session: UserSession = {
    user: {
      id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
      email,
      fullName: email.split("@")[0].replace(/[._]/g, " "),
      role,
    },
  };
  setLocal(STORAGE_KEYS.CURRENT_USER, session);
  return session;
}

export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
): Promise<UserSession> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: "customer" } },
    });
    if (error) throw error;
    if (data.user) {
      const session: UserSession = {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
          role: "customer",
        },
        token: data.session?.access_token,
      };
      setLocal(STORAGE_KEYS.CURRENT_USER, session);
      return session;
    }
  }

  const session: UserSession = {
    user: {
      id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
      email,
      fullName,
      role: "customer",
    },
  };
  setLocal(STORAGE_KEYS.CURRENT_USER, session);
  return session;
}

export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Supabase sign-out failed; clear local session anyway
    }
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}
