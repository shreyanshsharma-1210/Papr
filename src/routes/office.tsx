import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Plus, Check, Send, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/lib/cart-store";
import { submitBulkQuote } from "@/lib/db-service";
import { toast } from "sonner";

export const Route = createFileRoute("/office")({
  component: OfficeSuppliesPage,
});

function OfficeSuppliesPage() {
  const officeProducts = PRODUCTS.filter(
    (p) => p.category === "office" || p.category === "notebooks",
  );
  const addProduct = useCart((s) => s.addProduct);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Bulk quote form state
  const [quoteForm, setQuoteForm] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    requirements: "",
    estimatedUnits: 100,
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  async function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !quoteForm.organizationName ||
      !quoteForm.contactPerson ||
      !quoteForm.email ||
      !quoteForm.phone
    ) {
      toast.error("Please fill in all required contact details");
      return;
    }
    setSubmittingQuote(true);
    try {
      await submitBulkQuote(quoteForm);
      toast.success(
        "Bulk procurement enquiry received. Our commercial desk will contact you with a formal quote.",
      );
      setQuoteForm({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        requirements: "",
        estimatedUnits: 100,
      });
    } catch {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmittingQuote(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 space-y-16 bg-[#F7F5EF]">
      {/* Header */}
      <div className="border-b border-[#EDE9E1] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EDE9E1] px-3 py-1 text-xs font-bold text-[#302033] border border-[#302033]/15">
          <Building2 className="h-3.5 w-3.5 text-[#F16A45]" /> Workspace &amp; Enterprise Desk
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-5xl text-[#302033] mt-2">
          Office &amp; Workspace Essentials
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6F6273] max-w-xl leading-relaxed">
          Functional tools designed for studios, corporate desks, architecture firms, and academic
          departments. Available individually or through volume procurement.
        </p>
      </div>

      {/* Office Products Grid with Real Product Images */}
      <section>
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE9E1]">
          <h2 className="font-sans font-black text-2xl text-[#302033]">
            Desk Essentials &amp; Archive Supplies
          </h2>
          <span className="text-xs font-bold text-[#6F6273] font-mono">
            {officeProducts.length} Items
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {officeProducts.map((p) => {
            const isAdded = addedId === p.id;
            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-md border border-[#EDE9E1] bg-white p-4 transition-all hover:border-[#302033] hover:shadow-md"
              >
                <div>
                  <ProductImage
                    src={p.image || `/images/products/${p.id}.jpg`}
                    alt={p.name}
                    aspect="square"
                    badge={p.tag}
                    badgeVariant="lime"
                  />

                  <div className="mt-3.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
                    <span>{p.brand}</span>
                    {p.sameDay && (
                      <span className="rounded bg-[#F16A45]/15 px-1.5 py-0.5 text-[#F16A45] font-black">
                        Same-Day
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 font-sans font-bold text-base text-[#302033] group-hover:text-[#F16A45] transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#6F6273] line-clamp-2">
                    {p.description ||
                      "Durable workspace essential built for daily productivity and clean organization."}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#EDE9E1] flex items-center justify-between">
                  <span className="font-sans font-black text-xl text-[#302033]">₹{p.price}</span>

                  <button
                    onClick={() => {
                      addProduct(p.id, 1);
                      setAddedId(p.id);
                      toast.success(`${p.name} added to cart`);
                      setTimeout(() => setAddedId(null), 1200);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#D7F05A] px-3.5 py-2 text-xs font-black text-[#302033] hover:bg-[#cae64c] transition-colors active:scale-95 shadow-xs border border-[#302033]/20 cursor-pointer"
                  >
                    {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>{isAdded ? "Added" : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* B2B Institutional & Corporate Volume Requisition Form */}
      <section className="rounded-md border-2 border-[#302033] bg-white p-6 sm:p-10 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 rounded bg-[#C9B9E8]/30 px-3 py-1 text-xs font-bold text-[#302033]">
              <Sparkles className="h-3.5 w-3.5 text-[#F16A45]" /> Commercial Procurement
            </div>
            <h2 className="font-sans font-black text-3xl text-[#302033]">
              Institutional &amp; Department Bulk Invoicing
            </h2>
            <p className="text-xs sm:text-sm text-[#6F6273] leading-relaxed">
              We supply educational institutions, coaching academies, architectural studios, and
              corporate offices with custom scheduled deliveries, GST tax invoicing, and wholesale
              tiered pricing.
            </p>

            <div className="space-y-2.5 pt-2 text-xs font-bold text-[#302033]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#208B58]" />
                <span>Formal GST Tax Invoices provided with each dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#F16A45]" />
                <span>Palletized secure packaging with tracked transport</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleQuoteSubmit}
              className="space-y-4 rounded border border-[#EDE9E1] bg-[#F7F5EF] p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    Organization / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.organizationName}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, organizationName: e.target.value })
                    }
                    placeholder="e.g. Apex Architecture Studio"
                    className="w-full rounded border border-[#EDE9E1] bg-white px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.contactPerson}
                    onChange={(e) => setQuoteForm({ ...quoteForm, contactPerson: e.target.value })}
                    placeholder="Full Name"
                    className="w-full rounded border border-[#EDE9E1] bg-white px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    placeholder="procurement@organization.com"
                    className="w-full rounded border border-[#EDE9E1] bg-white px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full rounded border border-[#EDE9E1] bg-white px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                  Estimated Quantity of Units
                </label>
                <input
                  type="number"
                  min={10}
                  value={quoteForm.estimatedUnits}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, estimatedUnits: Number(e.target.value) })
                  }
                  className="w-full rounded border border-[#EDE9E1] bg-white px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                  Supply Requirements &amp; Notes
                </label>
                <textarea
                  rows={3}
                  value={quoteForm.requirements}
                  onChange={(e) => setQuoteForm({ ...quoteForm, requirements: e.target.value })}
                  placeholder="Detail stationery SKUs, custom branded notebook embossing, ream requirements, or delivery schedule..."
                  className="w-full rounded border border-[#EDE9E1] bg-white px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingQuote}
                className="inline-flex items-center gap-2 rounded bg-[#302033] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#D7F05A] hover:bg-[#302033]/90 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submittingQuote ? "Transmitting..." : "Submit Formal RFQ"}</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
