import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Plus, Minus, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { buildClassKit, findProduct, PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/class-kits/$classId")({
  component: ClassKitDetailPage,
});

function ClassKitDetailPage() {
  const { classId } = Route.useParams();
  const navigate = useNavigate();
  const addClassKit = useCart((s) => s.addClassKit);

  // Parse class id
  const parts = classId.split("-");
  const clsNum = Number.parseInt(parts[0], 10);
  const streamRaw = parts[1];
  const stream =
    streamRaw === "science"
      ? "Science"
      : streamRaw === "commerce"
        ? "Commerce"
        : streamRaw === "arts"
          ? "Arts"
          : undefined;

  const kit = buildClassKit(clsNum, stream);

  // Editable item quantities
  const [qtyById, setQtyById] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const it of kit.items) {
      init[it.productId] = it.qty;
    }
    return init;
  });

  const [showAdder, setShowAdder] = useState(false);

  function setQty(productId: string, q: number) {
    setQtyById((s) => ({ ...s, [productId]: Math.max(0, q) }));
  }

  // Calculate prices
  const itemsTotal = Object.entries(qtyById).reduce((sum, [pid, q]) => {
    const p = findProduct(pid);
    return sum + (p ? p.price * q : 0);
  }, 0);

  const bundleTotal = Math.round(itemsTotal * 0.92);
  const savings = itemsTotal - bundleTotal;

  function handleBuy() {
    const selectedItems = Object.entries(qtyById)
      .filter(([, q]) => q > 0)
      .map(([productId, qty]) => {
        const orig = kit.items.find((i) => i.productId === productId);
        return {
          productId,
          qty,
          required: orig?.required ?? false,
          note: orig?.note,
        };
      });

    addClassKit(kit.id, qtyById);
    toast.success(`${kit.title} added to your cart with 8% bundle saving!`);
    navigate({ to: "/cart" });
  }

  // Group kit items by role
  const grouped = {
    "Prescribed Textbooks": kit.items.filter((it) => it.productId.startsWith("tb-")),
    "Notebooks & Paper": kit.items.filter((it) => it.productId.startsWith("p-nb-")),
    "Writing & Geometry Tools": kit.items.filter(
      (it) => !it.productId.startsWith("tb-") && !it.productId.startsWith("p-nb-"),
    ),
  };

  const extraOptions = PRODUCTS.filter(
    (p) =>
      !kit.items.some((it) => it.productId === p.id) &&
      (p.category === "school" || p.category === "notebooks"),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-8 bg-[#F7F5EF]">
      <Link
        to="/class-kits"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#302033] hover:underline transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All Class Kits
      </Link>

      {/* Kit Banner */}
      <div className="rounded-md border-2 border-[#302033] bg-white p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9E1] px-3 py-1 text-xs font-bold text-[#302033] border border-[#302033]/15">
          <ShieldCheck className="h-4 w-4 text-[#F16A45]" /> {kit.badge}
        </div>
        <h1 className="mt-3 font-sans font-black text-3xl sm:text-5xl text-[#302033]">
          {kit.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#6F6273]">
          <span className="inline-flex items-center gap-1.5 text-[#302033]">
            <Truck className="h-4 w-4 text-[#302033]" /> Tracked India Delivery
          </span>
          <span>&middot;</span>
          <span>{kit.items.length} Curated Components</span>
          <span>&middot;</span>
          <span className="rounded bg-[#D7F05A] px-2 py-0.5 text-[#302033] font-black border border-[#302033]/20">
            8% Bundle Saving Applied
          </span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        {/* Kit Items List */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([section, items]) =>
            items.length === 0 ? null : (
              <section
                key={section}
                className="rounded-md border border-[#EDE9E1] bg-white p-5 shadow-xs"
              >
                <h2 className="font-sans font-black text-lg text-[#302033] pb-3 border-b border-[#EDE9E1]">
                  {section}
                </h2>
                <div className="divide-y divide-[#EDE9E1]">
                  {items.map((it) => (
                    <ItemRow
                      key={it.productId}
                      productId={it.productId}
                      qty={qtyById[it.productId] ?? 0}
                      required={it.required}
                      note={it.note}
                      onQty={(q) => setQty(it.productId, q)}
                    />
                  ))}
                </div>
              </section>
            ),
          )}

          {/* Add extra items drawer */}
          <div className="rounded-md border border-[#EDE9E1] bg-white p-5 shadow-xs">
            <button
              onClick={() => setShowAdder((s) => !s)}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#302033] hover:underline transition-colors"
            >
              <Plus className="h-4 w-4" />{" "}
              {showAdder ? "Close Optional Additions" : "Add Optional Supplies to Kit"}
            </button>
            {showAdder && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 pt-3 border-t border-[#EDE9E1]">
                {extraOptions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setQtyById((s) => ({ ...s, [p.id]: (s[p.id] ?? 0) + 1 }));
                      toast.success(`${p.name} added to kit`);
                    }}
                    className="flex items-center gap-3 rounded-md border border-[#EDE9E1] bg-[#F7F5EF] p-3 text-left text-xs hover:border-[#302033] transition-colors group cursor-pointer"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-white border border-[#EDE9E1]">
                      <img
                        src={p.image || `/images/products/${p.id}.jpg`}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold text-[#302033] group-hover:text-[#F16A45]">
                        {p.name}
                      </div>
                      <div className="text-[11px] font-black text-[#302033]">₹{p.price}</div>
                    </div>
                    <Plus className="h-4 w-4 text-[#302033] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className="md:sticky md:top-24 md:self-start space-y-4">
          <div className="rounded-md border-2 border-[#302033] bg-white p-6 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6F6273]">
              Curated Bundle Total
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-sans font-black text-4xl text-[#302033]">₹{bundleTotal}</span>
              {savings > 0 && (
                <span className="text-sm text-[#6F6273] line-through font-medium">
                  ₹{itemsTotal}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="mt-1 text-xs text-[#208B58] font-black">
                You save ₹{savings} with this academic bundle
              </div>
            )}

            <button
              onClick={handleBuy}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#D7F05A] px-4 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] shadow-xs border border-[#302033]/20 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" /> Add Complete Kit to Cart
            </button>

            <p className="mt-4 text-[11px] text-[#6F6273] leading-relaxed border-t border-[#EDE9E1] pt-4">
              Required board syllabus textbooks are locked by curriculum specifications. Additional
              items and quantities can be tailored above.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ItemRow({
  productId,
  qty,
  required,
  note,
  onQty,
}: {
  productId: string;
  qty: number;
  required: boolean;
  note?: string;
  onQty: (q: number) => void;
}) {
  const p = findProduct(productId);
  if (!p) return null;

  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      {/* Product Image Thumbnail */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-white border border-[#EDE9E1]">
        <img
          src={p.image || `/images/products/${p.id}.jpg`}
          alt={p.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-sans text-xs font-bold text-[#302033]">{p.name}</span>
          {required && (
            <span
              title={note || "Required syllabus item"}
              className="inline-flex items-center gap-0.5 rounded bg-[#EDE9E1] px-1.5 py-0.5 text-[9px] font-bold text-[#302033]"
            >
              <Lock className="h-2.5 w-2.5" /> Required
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] text-[#6F6273] font-medium">
          {p.brand} &middot; <span className="font-bold text-[#302033]">₹{p.price}</span>
          {note ? ` · ${note}` : ""}
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded border border-[#EDE9E1] bg-white px-2 py-1 shadow-xs">
        <button
          disabled={required && qty <= 1}
          onClick={() => onQty(qty - 1)}
          className="flex h-5 w-5 items-center justify-center text-[#6F6273] hover:text-[#302033] disabled:opacity-30 cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 text-center text-xs font-bold font-mono text-[#302033]">{qty}</span>
        <button
          onClick={() => onQty(qty + 1)}
          className="flex h-5 w-5 items-center justify-center text-[#6F6273] hover:text-[#302033] cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
