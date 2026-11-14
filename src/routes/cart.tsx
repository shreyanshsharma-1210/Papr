import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { ShoppingBag, Trash2, Truck, MessageCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart, lineLabel, linePrice } from "@/lib/cart-store";
import { findProduct, buildClassKit, buildCollegeKit } from "@/lib/mock-data";
import { KIT_IMAGES, PRINT_IMAGES } from "@/lib/product-images";
import type { CartLine } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const lines = useCart((s) => s.lines);
  const removeLine = useCart((s) => s.removeLine);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const total = useCart((s) => s.total());
  const subtotal = useCart((s) => s.subtotal());
  const savings = useCart((s) => s.savings());
  const navigate = useNavigate();

  const groups = useMemo(() => {
    const g: Record<string, { idx: number; line: CartLine }[]> = {
      "School Class Kits": [],
      "Campus University Kits": [],
      "Everyday Essentials": [],
      "Print Studio Jobs": [],
    };
    lines.forEach((line, idx) => {
      if (line.kind === "classKit") g["School Class Kits"].push({ idx, line });
      else if (line.kind === "collegeKit") g["Campus University Kits"].push({ idx, line });
      else if (line.kind === "printing") g["Print Studio Jobs"].push({ idx, line });
      else g["Everyday Essentials"].push({ idx, line });
    });
    return g;
  }, [lines]);

  const deliveryFee = total >= 499 || total === 0 ? 0 : 49;
  const grandTotal = total + deliveryFee;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center bg-[#F7F5EF]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-md border-2 border-[#302033] bg-white text-[#302033] shadow-sm">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-sans font-black text-3xl sm:text-4xl text-[#302033]">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6F6273] max-w-sm mx-auto leading-relaxed">
          Explore our verified school &amp; campus bundles, archival notebooks, or upload a document
          to the print studio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            preload="intent"
            className="rounded-xl bg-[#D7F05A] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] shadow-xs border border-[#302033]/20"
          >
            Explore Catalogue
          </Link>
          <Link
            to="/class-kits"
            preload="intent"
            className="rounded-xl border border-[#EDE9E1] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#302033] hover:border-[#302033]"
          >
            School Kits
          </Link>
          <Link
            to="/printing"
            preload="intent"
            className="rounded-xl border border-[#EDE9E1] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#302033] hover:border-[#302033]"
          >
            Print Studio
          </Link>
        </div>
      </div>
    );
  }

  const waMsg = encodeURIComponent(
    `Order Requisition via PAPR Studios:\n${lines.map((l) => `• ${lineLabel(l)} — ₹${linePrice(l)}`).join("\n")}\n\nTotal: ₹${grandTotal}`,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 space-y-8 bg-[#F7F5EF]">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-[#EDE9E1] pb-6">
        <div>
          <span className="font-sans text-[11px] uppercase tracking-wider font-black text-[#F16A45]">
            Review Bag
          </span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-[#302033] mt-1">
            Your Cart
          </h1>
        </div>
        <button
          onClick={() => {
            clear();
            toast("Cart cleared");
          }}
          className="text-xs font-bold uppercase tracking-wider text-[#6F6273] hover:text-[#E53935] transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        {/* Line Items Groups */}
        <div className="space-y-6">
          {Object.entries(groups).map(([title, entries]) =>
            entries.length === 0 ? null : (
              <section
                key={title}
                className="rounded-md border border-[#EDE9E1] bg-white p-5 shadow-xs"
              >
                <h2 className="font-sans font-black text-lg text-[#302033] pb-3 border-b border-[#EDE9E1]">
                  {title}
                </h2>
                <div className="divide-y divide-[#EDE9E1]">
                  {entries.map(({ idx, line }) => (
                    <CartItemRow
                      key={idx}
                      line={line}
                      onRemove={() => {
                        removeLine(idx);
                        toast("Item removed from cart");
                      }}
                      onQty={(q) => setQty(idx, q)}
                    />
                  ))}
                </div>
              </section>
            ),
          )}

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:underline transition-colors pt-2"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="md:sticky md:top-24 md:self-start space-y-4">
          <div className="rounded-md border-2 border-[#302033] bg-white p-6 shadow-sm">
            <h3 className="font-sans font-black text-lg text-[#302033] pb-4 border-b border-[#EDE9E1]">
              Order Summary
            </h3>

            <div className="mt-4 space-y-2.5 text-xs font-medium">
              <div className="flex justify-between text-[#6F6273]">
                <span>Subtotal (MRP)</span>
                <span className="font-mono text-[#302033] font-bold">₹{subtotal}</span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-[#208B58] font-bold">
                  <span>Bundle &amp; Volume Rebates</span>
                  <span className="font-mono font-black">-₹{savings}</span>
                </div>
              )}

              <div className="flex justify-between text-[#6F6273]">
                <span>Tracked Shipping</span>
                <span className="font-mono text-[#302033] font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-[#208B58] font-black">Free</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {deliveryFee > 0 && (
                <p className="text-[10px] text-[#6F6273]">
                  Add ₹{499 - total} more for complimentary delivery.
                </p>
              )}

              <div className="pt-3 border-t border-[#EDE9E1] flex items-baseline justify-between text-base">
                <span className="font-sans font-black text-[#302033]">Total Payable</span>
                <span className="font-sans font-black text-2xl text-[#302033]">₹{grandTotal}</span>
              </div>
              <p className="text-[10px] text-[#6F6273]">Inclusive of all applicable GST taxes.</p>
            </div>

            <Link
              to="/checkout"
              preload="intent"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D7F05A] px-4 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] shadow-sm border border-[#302033]/20 transition-all active:scale-95"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`https://wa.me/919876543210?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#EDE9E1] bg-[#F7F5EF] px-4 py-2.5 text-xs font-bold text-[#302033] hover:border-[#208B58] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#208B58]" /> Share Order via WhatsApp
            </a>
          </div>

          <div className="rounded border border-[#EDE9E1] bg-[#EDE9E1] p-4 text-[11px] text-[#6F6273] leading-relaxed flex items-center gap-2 font-medium">
            <Truck className="h-4 w-4 text-[#302033] shrink-0" />
            <span>Orders placed before 4:00 PM are dispatched on the same business day.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CartItemRow({
  line,
  onRemove,
  onQty,
}: {
  line: CartLine;
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  const price = linePrice(line);
  const label = lineLabel(line);

  let details = "";
  let imageUrl = "/images/products/p-nb-200.jpg";

  if (line.kind === "product") {
    const p = findProduct(line.productId);
    details = p ? `${p.brand || "PAPR"} · MRP ₹${p.mrp}` : "";
    if (p?.image) imageUrl = p.image;
    else imageUrl = `/images/products/${line.productId}.jpg`;
  } else if (line.kind === "classKit") {
    const parts = line.kitId.split("-");
    const cls = Number(parts[1]);
    const stream = parts[2];
    const s = stream
      ? ((stream[0].toUpperCase() + stream.slice(1)) as "Science" | "Commerce" | "Arts")
      : undefined;
    const kit = buildClassKit(cls, s);
    details = `${kit.items.length} verified items included with 8% bundle discount`;
    imageUrl = KIT_IMAGES.schoolKitFlatlay;
  } else if (line.kind === "collegeKit") {
    const [c, b, y] = line.kitId.split("-");
    const kit = buildCollegeKit(c, b, Number(y) as 1 | 2 | 3 | 4);
    details = `${kit.items.length} items included · 10% campus discount`;
    imageUrl = KIT_IMAGES.collegeKitFlatlay;
  } else if (line.kind === "printing") {
    details = line.summary;
    imageUrl = PRINT_IMAGES.spiralBinding;
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Thumbnail */}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-[#EDE9E1] bg-white shadow-xs">
        <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-sans font-bold text-sm text-[#302033] truncate">{label}</h4>
        <p className="mt-0.5 text-xs text-[#6F6273] truncate">{details}</p>
        <div className="mt-1 font-sans font-black text-sm text-[#302033] sm:hidden">₹{price}</div>
      </div>

      <div className="flex items-center gap-4">
        {line.kind === "product" ? (
          <div className="flex items-center gap-1 rounded border border-[#EDE9E1] bg-white px-2 py-1 shadow-xs">
            <button
              onClick={() => onQty(line.qty - 1)}
              className="h-5 w-5 flex items-center justify-center text-[#6F6273] hover:text-[#302033] cursor-pointer"
            >
              −
            </button>
            <span className="w-5 text-center text-xs font-mono font-bold text-[#302033]">
              {line.qty}
            </span>
            <button
              onClick={() => onQty(line.qty + 1)}
              className="h-5 w-5 flex items-center justify-center text-[#6F6273] hover:text-[#302033] cursor-pointer"
            >
              +
            </button>
          </div>
        ) : null}

        <div className="hidden sm:block font-sans font-black text-base text-[#302033] w-20 text-right">
          ₹{price}
        </div>

        <button
          onClick={onRemove}
          aria-label="Remove item"
          className="rounded p-2 text-[#6F6273] hover:text-[#E53935] hover:bg-[#E53935]/10 transition-colors cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
