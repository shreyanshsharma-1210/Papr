import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Repeat, ArrowRight, Clock, FileText, CheckCircle2, Truck } from "lucide-react";
import { fetchOrders } from "@/lib/db-service";
import { useCart } from "@/lib/cart-store";
import { LogoLoader } from "@/components/LogoLoader";
import type { Order } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const addProduct = useCart((s) => s.addProduct);
  const addClassKit = useCart((s) => s.addClassKit);
  const addCollegeKit = useCart((s) => s.addCollegeKit);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetchOrders().then((data) => {
      if (mounted) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  function handleReorder(order: Order) {
    if (!order.items || order.items.length === 0) {
      toast.error("No items found to reorder");
      return;
    }

    let addedCount = 0;
    for (const item of order.items) {
      if (item.kind === "product" && item.productId) {
        addProduct(item.productId, item.quantity || 1);
        addedCount++;
      } else if (item.kind === "classKit") {
        addClassKit(item.productId || "class-1");
        addedCount++;
      } else if (item.kind === "collegeKit") {
        addCollegeKit(item.productId || "sgsits-cse-1");
        addedCount++;
      }
    }

    toast.success(`Reordered ${addedCount} items. Added to your active cart.`);
    navigate({ to: "/cart" });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <LogoLoader size="lg" variant="card" label="Retrieving your orders & tax invoices..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#EDE9E1] bg-white text-[#302033] shadow-sm">
          <Package className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-sans font-black text-3xl sm:text-4xl text-[#302033]">
          No Orders Placed Yet
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6E5D6F] max-w-sm mx-auto leading-relaxed">
          When you purchase academic kits, stationery, or submit print jobs, you will be able to
          track live delivery and invoices here.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-xl bg-[#D7F05A] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 shadow-sm transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#EDE9E1] pb-6">
        <span className="font-sans text-[11px] uppercase tracking-wider font-black text-[#F16A45]">
          Customer Archive
        </span>
        <h1 className="font-sans font-black text-4xl sm:text-5xl text-[#302033] mt-1">
          Your Orders
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6E5D6F]">
          Review past purchases, download GST-compliant tax invoices, or reorder your regular
          stationery.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((o) => {
          const statusColors: Record<string, string> = {
            New: "border-[#EDE9E1] bg-[#F7F5EF] text-[#302033]",
            Processing: "border-[#F3E6A2] bg-[#F3E6A2]/40 text-[#302033]",
            Printed: "border-[#C9B9E8] bg-[#C9B9E8]/35 text-[#302033]",
            Dispatched: "border-[#D7F05A] bg-[#D7F05A]/35 text-[#302033]",
            Delivered: "border-[#1E8E5A]/40 bg-[#1E8E5A]/15 text-[#1E8E5A]",
            Cancelled: "border-[#F16A45]/40 bg-[#F16A45]/15 text-[#F16A45]",
          };

          return (
            <div
              key={o.id}
              className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm transition-all hover:border-[#302033]"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EDE9E1]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D6F]">
                    Order Reference
                  </span>
                  <div className="font-sans font-black text-2xl text-[#302033]">#{o.id}</div>
                  <div className="text-[11px] text-[#6E5D6F] mt-0.5 font-medium">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-wider font-extrabold ${
                      statusColors[o.status] || "border-[#EDE9E1] bg-[#F7F5EF] text-[#302033]"
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="rounded-full bg-[#F7F5EF] border border-[#EDE9E1] px-3 py-1 text-[10px] uppercase font-mono font-bold text-[#6E5D6F]">
                    {o.paymentMethod.toUpperCase()} · {o.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="mt-4 space-y-2">
                {o.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1">
                    <span className="text-[#302033] font-medium">
                      <span className="font-mono font-bold text-[#F16A45] mr-2">
                        {it.quantity}×
                      </span>
                      {it.title}
                    </span>
                    <span className="font-mono font-bold text-[#302033]">₹{it.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Address & Meta */}
              <div className="mt-4 pt-4 border-t border-[#EDE9E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6E5D6F]">
                <div>
                  Delivered to{" "}
                  <span className="font-bold text-[#302033]">{o.shippingAddress.name}</span>,{" "}
                  {o.shippingAddress.line}, {o.shippingAddress.city} ({o.shippingAddress.pincode})
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-sans font-black text-xl text-[#302033] mr-2">
                    Total: ₹{o.total}
                  </span>

                  <button
                    onClick={() => setSelectedInvoice(o)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-1.5 text-xs font-bold text-[#302033] hover:border-[#302033] transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5" /> Invoice
                  </button>

                  <button
                    onClick={() => handleReorder(o)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#D7F05A] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 transition-colors shadow-xs"
                  >
                    <Repeat className="h-3.5 w-3.5" /> Reorder
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#EDE9E1] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#EDE9E1] pb-4">
              <div>
                <span className="font-sans font-black text-2xl text-[#302033]">PAPR Studios</span>
                <p className="text-[10px] text-[#6E5D6F] uppercase tracking-wider font-extrabold mt-0.5">
                  Tax Invoice / Bill of Supply
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono font-bold text-[#302033]">#{selectedInvoice.id}</span>
                <p className="text-[10px] text-[#6E5D6F]">
                  {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 text-xs space-y-1 text-[#6E5D6F]">
              <div>
                <strong className="text-[#302033]">Billed To:</strong>{" "}
                {selectedInvoice.shippingAddress.name}
              </div>
              <div>
                {selectedInvoice.shippingAddress.line}, {selectedInvoice.shippingAddress.city} -{" "}
                {selectedInvoice.shippingAddress.pincode}
              </div>
              <div>Phone: {selectedInvoice.shippingAddress.phone}</div>
            </div>

            <div className="mt-4 divide-y divide-[#EDE9E1] border-t border-b border-[#EDE9E1] text-xs">
              <div className="py-2 flex justify-between font-bold text-[#302033]">
                <span>Description</span>
                <span>Amount</span>
              </div>
              {selectedInvoice.items?.map((it, i) => (
                <div key={i} className="py-2 flex justify-between text-[#6E5D6F]">
                  <span>
                    {it.quantity}× {it.title}
                  </span>
                  <span className="font-mono font-bold text-[#302033]">₹{it.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-right font-medium">
              <div className="text-[#6E5D6F]">Subtotal: ₹{selectedInvoice.subtotal}</div>
              {selectedInvoice.discount > 0 && (
                <div className="text-[#1E8E5A] font-bold">
                  Discount: -₹{selectedInvoice.discount}
                </div>
              )}
              <div className="text-[#6E5D6F]">Shipping: ₹{selectedInvoice.deliveryFee}</div>
              <div className="text-[#6E5D6F]">GST (5% Included): ₹{selectedInvoice.tax}</div>
              <div className="pt-2 border-t border-[#EDE9E1] font-sans text-xl font-black text-[#302033]">
                Grand Total: ₹{selectedInvoice.total}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl bg-[#302033] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#D7F05A] hover:bg-[#1f1421] shadow-sm transition-all"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
