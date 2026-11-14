import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Printer,
  Sparkles,
  Settings,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  TrendingUp,
  FileText,
  ExternalLink,
  Shield,
} from "lucide-react";
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus,
  fetchPrintJobs,
  updatePrintJobStatus,
  fetchBulkQuotes,
  getCurrentSession,
  type PrintJobRecord,
} from "@/lib/db-service";
import { LogoLoader } from "@/components/LogoLoader";
import type { Product, Order, OrderStatus, BulkQuoteRequest } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
});

type AdminTab = "overview" | "orders" | "products" | "prints" | "quotes";

function AdminDashboardPage() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJobRecord[]>([]);
  const [quotes, setQuotes] = useState<BulkQuoteRequest[]>([]);

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    brand: "PAPR Studio",
    category: "notebooks",
    image: "/images/products/p-nb-200.jpg",
    mrp: 199,
    price: 159,
    inStock: true,
    stockQuantity: 50,
    sameDay: true,
    tag: "",
  });

  async function loadAllData() {
    setLoading(true);
    try {
      const [p, o, pj, bq] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchPrintJobs(),
        fetchBulkQuotes(),
      ]);
      setProducts(p);
      setOrders(o);
      setPrintJobs(pj);
      setQuotes(bq);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  // Overview metrics
  const totalRevenue = orders.reduce(
    (s, o) => s + (o.paymentStatus === "paid" ? o.total : o.total),
    0,
  );
  const pendingOrders = orders.filter(
    (o) => o.status === "New" || o.status === "Processing",
  ).length;
  const activePrints = printJobs.filter(
    (p) => p.status === "queued" || p.status === "printing",
  ).length;

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    await updateOrderStatus(orderId, newStatus);
    toast.success(`Order #${orderId} marked as ${newStatus}`);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  }

  async function handlePrintStatusChange(jobId: string, newStatus: PrintJobRecord["status"]) {
    await updatePrintJobStatus(jobId, newStatus);
    toast.success(`Print Job #${jobId} status updated to ${newStatus}`);
    setPrintJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)));
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) {
      toast.error("Please fill in required product details");
      return;
    }

    const prodId = editingProduct.id || `p-custom-${Date.now().toString(36)}`;
    const fullProduct: Product = {
      id: prodId,
      name: editingProduct.name,
      brand: editingProduct.brand || "PAPR Studio",
      category: editingProduct.category || "notebooks",
      image: editingProduct.image || "/images/products/p-nb-200.jpg",
      description: editingProduct.description || "",
      mrp: editingProduct.mrp || editingProduct.price,
      price: editingProduct.price,
      inStock: editingProduct.inStock ?? true,
      stockQuantity: editingProduct.stockQuantity ?? 50,
      sameDay: editingProduct.sameDay ?? true,
      tag: editingProduct.tag || undefined,
    };

    await saveProduct(fullProduct);
    toast.success(`Product ${fullProduct.name} saved to catalogue`);
    setShowProductModal(false);
    loadAllData();
  }

  async function handleDeleteProduct(id: string) {
    if (confirm("Are you sure you want to remove this product from the live catalogue?")) {
      await deleteProduct(id);
      toast.success("Product removed");
      loadAllData();
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <LogoLoader size="xl" variant="card" label="Synchronizing PAPR Fulfilment Console..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9E1] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D7F05A]/25 border border-[#302033]/20 px-3 py-1 text-xs font-black text-[#302033]">
            <Shield className="h-4 w-4" /> PAPR Operations Console
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#302033] mt-2">
            Operations &amp; Fulfilment Desk
          </h1>
          <p className="mt-1 text-xs text-[#6E5D6F]">
            Live order tracking, print queue management, catalogue CRUD, and institutional bulk
            requisitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            className="rounded-xl border border-[#EDE9E1] bg-white px-3.5 py-2 text-xs font-bold text-[#302033] hover:border-[#302033] transition-colors"
          >
            Storefront &rarr;
          </Link>
          <button
            onClick={loadAllData}
            className="rounded-xl bg-[#D7F05A] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 shadow-sm transition-all"
          >
            Sync Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#EDE9E1] pb-3">
        {(
          [
            ["overview", "Overview", LayoutDashboard],
            ["orders", `Orders (${orders.length})`, ShoppingBag],
            ["products", `Catalogue (${products.length})`, Package],
            ["prints", `Print Queue (${printJobs.length})`, Printer],
            ["quotes", `B2B RFQs (${quotes.length})`, Sparkles],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id as AdminTab)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              tab === id
                ? "bg-[#302033] text-[#D7F05A] shadow-xs"
                : "border border-[#EDE9E1] bg-white text-[#6E5D6F] hover:text-[#302033] hover:border-[#302033]"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Cumulative Revenue"
              value={`₹${totalRevenue.toLocaleString("en-IN")}`}
              sub="Real-time order calculations"
            />
            <MetricCard
              label="Pending Orders"
              value={pendingOrders}
              sub="Requires dispatch packing"
            />
            <MetricCard
              label="Active Print Jobs"
              value={activePrints}
              sub="Direct print &amp; binding queue"
            />
            <MetricCard
              label="Live Catalogue SKUs"
              value={products.length}
              sub="Stationery &amp; academic textbooks"
            />
          </div>

          {/* Recent Orders Overview */}
          <div className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E1]">
              <h2 className="font-sans font-black text-xl text-[#302033]">
                Recent Customer Orders
              </h2>
              <button
                onClick={() => setTab("orders")}
                className="text-xs font-black text-[#F16A45] hover:underline"
              >
                View All Orders &rarr;
              </button>
            </div>

            <div className="divide-y divide-[#EDE9E1]">
              {orders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[#F16A45]">#{o.id}</span>
                    <span className="mx-2 text-[#6E5D6F]">&middot;</span>
                    <span className="font-bold text-[#302033]">{o.shippingAddress.name}</span>
                    <span className="mx-2 text-[#6E5D6F]">&middot;</span>
                    <span className="text-[#6E5D6F]">{o.items.length} items</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#302033]">₹{o.total}</span>
                    <span className="rounded-full bg-[#F7F5EF] border border-[#EDE9E1] px-2.5 py-0.5 text-[10px] uppercase font-bold text-[#302033]">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {tab === "orders" && (
        <div className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E1]">
            <h2 className="font-sans font-black text-xl text-[#302033]">
              Fulfilment CRM &amp; Orders Desk
            </h2>
            <span className="text-xs text-[#6E5D6F] font-mono font-bold">
              {orders.length} Total Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EDE9E1] text-[10px] uppercase tracking-wider text-[#6E5D6F]">
                <tr>
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer &amp; Phone</th>
                  <th className="pb-3 font-bold">Destination</th>
                  <th className="pb-3 font-bold">Items Count</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Payment</th>
                  <th className="pb-3 font-bold">Fulfilment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE9E1]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F7F5EF] transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#F16A45]">#{o.id}</td>
                    <td className="py-3.5 font-bold text-[#302033]">
                      <div>{o.shippingAddress.name}</div>
                      <div className="text-[11px] text-[#6E5D6F] font-normal">
                        {o.shippingAddress.phone}
                      </div>
                    </td>
                    <td className="py-3.5 text-[#6E5D6F]">
                      {o.shippingAddress.city} ({o.shippingAddress.pincode})
                    </td>
                    <td className="py-3.5 font-mono">{o.items.length} items</td>
                    <td className="py-3.5 font-sans font-black text-sm text-[#302033]">
                      ₹{o.total}
                    </td>
                    <td className="py-3.5">
                      <span className="rounded bg-[#F7F5EF] border border-[#EDE9E1] px-2 py-0.5 text-[10px] uppercase font-bold text-[#302033]">
                        {o.paymentMethod} &middot; {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className="rounded-lg border border-[#EDE9E1] bg-white px-2 py-1 text-xs font-bold text-[#302033] focus:outline-none focus:border-[#302033]"
                      >
                        <option value="New">New</option>
                        <option value="Processing">Processing</option>
                        <option value="Printed">Printed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT WITH IMAGES */}
      {tab === "products" && (
        <div className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E1]">
            <h2 className="font-sans font-black text-xl text-[#302033]">
              Product Catalogue Inventory
            </h2>
            <button
              onClick={() => {
                setEditingProduct({
                  id: `p-item-${Date.now().toString(36)}`,
                  name: "",
                  brand: "PAPR Studio",
                  category: "notebooks",
                  image: "/images/products/p-nb-200.jpg",
                  mrp: 199,
                  price: 159,
                  inStock: true,
                  stockQuantity: 50,
                  sameDay: true,
                  tag: "",
                });
                setShowProductModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#D7F05A] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EDE9E1] text-[10px] uppercase tracking-wider text-[#6E5D6F]">
                <tr>
                  <th className="pb-3 font-bold">Image</th>
                  <th className="pb-3 font-bold">Code</th>
                  <th className="pb-3 font-bold">Title</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Price</th>
                  <th className="pb-3 font-bold">Stock</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE9E1]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F7F5EF] transition-colors">
                    <td className="py-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#EDE9E1] bg-[#F7F5EF]">
                        <img
                          src={p.image || "/images/products/p-nb-200.jpg"}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[#6E5D6F] font-semibold">{p.id}</td>
                    <td className="py-3 font-bold text-[#302033] max-w-xs truncate">{p.name}</td>
                    <td className="py-3 uppercase text-[10px] font-bold text-[#6E5D6F]">
                      {p.category}
                    </td>
                    <td className="py-3 font-sans font-black text-sm text-[#302033]">₹{p.price}</td>
                    <td className="py-3 font-mono font-medium">{p.stockQuantity ?? 50} units</td>
                    <td className="py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                          p.inStock
                            ? "bg-[#1E8E5A]/15 text-[#1E8E5A]"
                            : "bg-[#F16A45]/15 text-[#F16A45]"
                        }`}
                      >
                        {p.inStock ? "Active" : "Out"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="rounded-lg p-1.5 text-[#6E5D6F] hover:text-[#F16A45] hover:bg-[#F16A45]/10 transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRINT STUDIO JOBS */}
      {tab === "prints" && (
        <div className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-sans font-black text-xl text-[#302033] pb-3 border-b border-[#EDE9E1]">
            Print Studio Document Queue
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EDE9E1] text-[10px] uppercase tracking-wider text-[#6E5D6F]">
                <tr>
                  <th className="pb-3 font-bold">Job ID</th>
                  <th className="pb-3 font-bold">File Document</th>
                  <th className="pb-3 font-bold">Specifications</th>
                  <th className="pb-3 font-bold">Est. Cost</th>
                  <th className="pb-3 font-bold">Submitted</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE9E1]">
                {printJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-[#F7F5EF] transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#F16A45]">#{j.id}</td>
                    <td className="py-3.5">
                      <div className="font-bold text-[#302033] flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-[#302033]" />
                        <span>{j.specs.fileName}</span>
                      </div>
                      {j.specs.fileUrl && (
                        <a
                          href={j.specs.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-[#F16A45] hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          Download Document <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 text-[#6E5D6F] text-[11px] font-medium">
                      {j.specs.pages} pages &times; {j.specs.copies} copies &middot;{" "}
                      {j.specs.color.toUpperCase()} &middot; {j.specs.sided} &middot;{" "}
                      {j.specs.binding} binding
                    </td>
                    <td className="py-3.5 font-sans font-black text-sm text-[#302033]">
                      ₹{j.specs.pages * j.specs.copies * 2}
                    </td>
                    <td className="py-3.5 text-[#6E5D6F]">
                      {new Date(j.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <select
                        value={j.status}
                        onChange={(e) =>
                          handlePrintStatusChange(j.id, e.target.value as PrintJobRecord["status"])
                        }
                        className="rounded-lg border border-[#EDE9E1] bg-white px-2 py-1 text-xs font-bold text-[#302033] focus:outline-none"
                      >
                        <option value="queued">Queued</option>
                        <option value="printing">Printing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {printJobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6E5D6F]">
                      No print studio jobs currently queued.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: B2B QUOTES */}
      {tab === "quotes" && (
        <div className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-sans font-black text-xl text-[#302033] pb-3 border-b border-[#EDE9E1]">
            Institutional &amp; Enterprise RFQs
          </h2>

          <div className="space-y-4">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] p-5 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-sans font-bold text-base text-[#302033]">
                      {q.organizationName}
                    </h3>
                    <p className="text-xs text-[#6E5D6F]">
                      Contact: {q.contactPerson} &middot; {q.phone} &middot; {q.email}
                    </p>
                  </div>
                  <span className="rounded-md bg-[#D7F05A] border border-[#302033]/20 px-2 py-0.5 text-xs font-black text-[#302033]">
                    {q.estimatedUnits} Units
                  </span>
                </div>
                <p className="text-xs text-[#302033] leading-relaxed border-t border-[#EDE9E1] pt-2">
                  {q.requirements}
                </p>
              </div>
            ))}
            {quotes.length === 0 && (
              <div className="py-12 text-center text-xs text-[#6E5D6F]">
                No institutional quote requests currently pending.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#EDE9E1] bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="font-sans font-black text-2xl text-[#302033]">
              Configure Catalogue Product
            </h3>
            <p className="mt-1 text-xs text-[#6E5D6F]">
              Add or update a stationery item in the PAPR store.
            </p>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#302033] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Japanese 0.5mm Fineliner Set"
                  className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#302033] mb-1">Product Image Path</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="/images/products/p-nb-200.jpg"
                  className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#302033] mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, brand: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#302033] mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-bold text-[#302033] focus:outline-none focus:border-[#302033]"
                  >
                    <option value="notebooks">Paper &amp; Notebooks</option>
                    <option value="writing">Fine Writing</option>
                    <option value="school">School Essentials</option>
                    <option value="college">College &amp; University</option>
                    <option value="office">Office &amp; Workspace</option>
                    <option value="art-craft">Art &amp; Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#302033] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-bold font-mono text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#302033] mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-bold font-mono text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#302033] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder="Material specs, GSM paper, binding type..."
                  className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EDE9E1]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-[#6E5D6F] hover:text-[#302033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#D7F05A] px-5 py-2.5 uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 font-black shadow-xs transition-all"
                >
                  Save to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="rounded-2xl border border-[#EDE9E1] bg-white p-5 shadow-xs">
      <span className="text-[10px] uppercase tracking-wider text-[#6E5D6F] font-extrabold">
        {label}
      </span>
      <div className="font-sans font-black text-3xl text-[#302033] mt-2">{value}</div>
      <p className="mt-1 text-[11px] text-[#6E5D6F] font-medium">{sub}</p>
    </div>
  );
}
