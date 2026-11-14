import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Plus,
  Minus,
  ShoppingBag,
  GraduationCap,
} from "lucide-react";
import { buildCollegeKit, COLLEGES, findProduct, PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/college-kits/$kitId")({
  component: CollegeKitDetail,
});

function CollegeKitDetail() {
  const { kitId } = Route.useParams();
  const navigate = useNavigate();
  const addCollegeKit = useCart((s) => s.addCollegeKit);

  const parts = kitId.split("-");
  const [collegeId, branchId, yearStr] = parts;
  const yearNum = Number(yearStr);
  const year = (yearNum >= 1 && yearNum <= 4 ? yearNum : 1) as 1 | 2 | 3 | 4;
  const college = COLLEGES.find((c) => c.id === collegeId);
  const branch = college?.branches.find((b) => b.id === branchId);
  const isValid = !!(college && branch && yearNum >= 1 && yearNum <= 4);

  const safeCollegeId = college ? collegeId : "sgsits";
  const safeBranchId = branch ? branchId : "cse";
  const kit = useMemo(
    () => buildCollegeKit(safeCollegeId, safeBranchId, year),
    [safeCollegeId, safeBranchId, year],
  );
  const [qtyById, setQtyById] = useState<Record<string, number>>(() =>
    Object.fromEntries(kit.items.map((i) => [i.productId, i.qty])),
  );
  const [showAdder, setShowAdder] = useState(false);

  const itemsTotal = useMemo(
    () =>
      kit.items.reduce((s, it) => {
        const qty = qtyById[it.productId] ?? 0;
        const p = findProduct(it.productId);
        return s + (p ? p.price * qty : 0);
      }, 0),
    [kit, qtyById],
  );
  const bundleTotal = Math.round(itemsTotal * 0.9);
  const savings = itemsTotal - bundleTotal;

  if (!isValid || !college || !branch) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-sans font-black text-3xl text-[#302033]">
          Kit Specification Not Found
        </h1>
        <p className="mt-2 text-xs text-[#6F6273]">
          The requested campus kit configuration is not registered.
        </p>
        <Link
          to="/college-kits"
          className="mt-6 inline-block text-xs font-bold uppercase tracking-wider text-[#302033] underline"
        >
          Restart Campus Wizard
        </Link>
      </div>
    );
  }

  function handleBuy() {
    addCollegeKit(kit.id, qtyById);
    toast.success(`${kit.title} added to cart`);
    navigate({ to: "/cart" });
  }

  const grouped = {
    "Prescribed Textbooks": kit.items.filter((i) => i.productId.startsWith("tb-")),
    "Lab Manuals & Practical Records": kit.items.filter(
      (i) => i.productId.startsWith("p-lab") || i.productId === "p-prac-file",
    ),
    "Lecture Notebooks & Folders": kit.items.filter((i) => i.productId.startsWith("p-nb")),
    "Drafting & Instruments": kit.items.filter((i) =>
      ["p-pen-blue", "p-pencil", "p-highlighter", "p-marker", "p-calc", "p-drafter"].includes(
        i.productId,
      ),
    ),
  };

  const extraOptions = PRODUCTS.filter(
    (p) =>
      !kit.items.some((it) => it.productId === p.id) &&
      (p.category === "college" || p.category === "office"),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-8 bg-[#F7F5EF]">
      <Link
        to="/college-kits"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#302033] hover:underline transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Campus Selector
      </Link>

      {/* Kit Header Banner */}
      <div className="rounded-md border-2 border-[#302033] bg-white p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9E1] px-3 py-1 text-xs font-bold text-[#302033] border border-[#302033]/15">
          <ShieldCheck className="h-4 w-4 text-[#F16A45]" /> Verified Campus Syllabus Bundle
        </div>
        <h1 className="mt-3 font-sans font-black text-3xl sm:text-5xl text-[#302033]">
          {kit.title}
        </h1>

        <div className="mt-4 grid gap-3 sm:grid-cols-3 pt-3 border-t border-[#EDE9E1]">
          <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
              Campus
            </span>
            <div className="font-sans text-sm font-bold text-[#302033] mt-0.5">{college.short}</div>
          </div>
          <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
              Department
            </span>
            <div className="font-sans text-sm font-bold text-[#302033] mt-0.5">{branch.name}</div>
          </div>
          <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
              Academic Year
            </span>
            <div className="font-sans text-sm font-bold text-[#302033] mt-0.5">Year {year}</div>
          </div>
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
                      onQty={(q) => setQtyById((s) => ({ ...s, [it.productId]: Math.max(0, q) }))}
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
              Campus Bundle Total
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
                10% Campus discount applied (Save ₹{savings})
              </div>
            )}

            <button
              onClick={handleBuy}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#D7F05A] px-4 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] shadow-xs border border-[#302033]/20 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" /> Add Complete Kit to Cart
            </button>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#6F6273] border-t border-[#EDE9E1] pt-4 font-medium">
              <GraduationCap className="h-4 w-4 text-[#302033] shrink-0" />
              <span>Includes syllabus practical sheets &amp; hardbound records</span>
            </div>
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
