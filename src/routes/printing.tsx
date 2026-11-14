import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Printer,
  Upload,
  ArrowRight,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { supabase } from "@/integrations/supabase/client";
import { PRINT_IMAGES } from "@/lib/product-images";
import { LogoLoader } from "@/components/LogoLoader";
import type { PrintSpecs } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/printing")({
  component: PrintStudioPage,
});

function PrintStudioPage() {
  const addPrinting = useCart((s) => s.addPrinting);
  const navigate = useNavigate();

  // Print specifications state
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [pages, setPages] = useState<number>(20);
  const [copies, setCopies] = useState<number>(1);
  const [color, setColor] = useState<"bw" | "color">("bw");
  const [sided, setSided] = useState<"single" | "duplex">("duplex");
  const [size, setSize] = useState<"A4" | "A3">("A4");
  const [paperQuality, setPaperQuality] = useState<"standard-75gsm" | "executive-100gsm">(
    "standard-75gsm",
  );
  const [binding, setBinding] = useState<"none" | "staple" | "spiral" | "hardbound" | "file">(
    "spiral",
  );
  const [delivery, setDelivery] = useState<"deliver" | "pickup">("deliver");

  // Price calculation
  const basePerPage = color === "color" ? (size === "A3" ? 14 : 7) : size === "A3" ? 4 : 2;
  const paperUpgrade = paperQuality === "executive-100gsm" ? 1.5 : 0;
  const sideMultiplier = sided === "duplex" ? 0.85 : 1.0;
  const bindingCost = {
    none: 0,
    staple: 10,
    spiral: 45,
    file: 30,
    hardbound: 195,
  }[binding];

  const pagePrintSubtotal = pages * copies * (basePerPage + paperUpgrade) * sideMultiplier;
  const rawSubtotal = Math.round(pagePrintSubtotal + bindingCost * copies);

  // Volume & pickup discounts
  let discount = 0;
  if (delivery === "pickup") discount += rawSubtotal * 0.1;
  if (rawSubtotal >= 500) discount += rawSubtotal * 0.15;
  if (rawSubtotal >= 1500) discount += rawSubtotal * 0.1;
  const appliedDiscount = Math.round(Math.min(rawSubtotal * 0.5, discount));
  const finalTotal = Math.max(25, rawSubtotal - appliedDiscount);
  const discountPct = rawSubtotal > 0 ? Math.round((appliedDiscount / rawSubtotal) * 100) : 0;

  // Handle actual file selection & upload
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setUploadError(null);

    // Validate size (max 25MB)
    const maxBytes = 25 * 1024 * 1024;
    if (selected.size > maxBytes) {
      setUploadError("File size exceeds 25 MB limit. Please compress your document.");
      return;
    }

    // Validate extensions
    const allowed = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = selected.name.substring(selected.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      setUploadError("Only PDF, Word documents (.doc, .docx) and high-res images are supported.");
      return;
    }

    setFile(selected);
    setUploading(true);

    try {
      // Attempt upload to Supabase Storage if configured
      const fileExt = selected.name.split(".").pop();
      const storageKey = `print-uploads/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("print-files")
        .upload(storageKey, selected, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("print-files")
          .getPublicUrl(data.path);
        setFileUrl(publicUrlData.publicUrl);
        toast.success(`Document ${selected.name} uploaded to storage`);
      } else {
        const localUrl = URL.createObjectURL(selected);
        setFileUrl(localUrl);
        toast.success(`Document ${selected.name} attached`);
      }
    } catch {
      const localUrl = URL.createObjectURL(selected);
      setFileUrl(localUrl);
      toast.success(`Document ${selected.name} attached`);
    } finally {
      setUploading(false);
    }
  }

  function handleAddToCart() {
    if (!file) {
      toast.error("Please upload your document file before adding to cart");
      return;
    }

    const summary = `${file.name} (${pages}pp × ${copies}) · ${color === "bw" ? "B&W" : "Color"} · ${sided === "duplex" ? "2-Sided" : "1-Sided"} · ${binding} binding`;

    const specs: PrintSpecs = {
      fileName: file.name,
      fileUrl: fileUrl,
      fileSizeBytes: file.size,
      pages,
      copies,
      color,
      sided,
      size,
      binding,
      delivery,
      paperQuality,
    };

    addPrinting(finalTotal, summary, specs);
    toast.success("Print job added to your cart");
    navigate({ to: "/cart" });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 space-y-8 bg-[#F7F5EF]">
      {/* Header */}
      <div className="border-b border-[#EDE9E1] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EDE9E1] px-3 py-1 text-xs font-bold text-[#302033] border border-[#302033]/15">
          <Printer className="h-4 w-4 text-[#F16A45]" /> High-Precision Print Studio
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-5xl text-[#302033] mt-2">
          Document Printing &amp; Bindery
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6F6273] max-w-xl leading-relaxed">
          Upload PDF documents, project reports, and academic theses. Configured to exact paper
          stocks, duplex binding, and delivered securely in moisture-proof packaging.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        {/* Main Configuration Panels */}
        <div className="space-y-6">
          {/* 1. File Upload */}
          <section className="rounded-md border border-[#EDE9E1] bg-white p-6 shadow-xs">
            <h2 className="font-sans font-black text-xl text-[#302033]">1. Upload Document File</h2>
            <p className="mt-1 text-xs text-[#6F6273]">
              PDF, Word documents, or thesis files up to 25 MB
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#302033]/30 bg-[#F7F5EF] p-8 text-center hover:border-[#302033] transition-all">
              {uploading ? (
                <div className="py-2">
                  <LogoLoader size="sm" label="Analyzing PDF structure & configuring spool..." />
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE9E1] text-[#302033]">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="mt-3 font-sans text-xs font-bold text-[#302033]">
                    {file ? (
                      <span className="flex items-center gap-1.5 text-[#208B58] font-black">
                        <CheckCircle2 className="h-4 w-4" /> {file.name} (
                        {(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    ) : (
                      "Click to select document or drop PDF file here"
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-[#6F6273]">
                    Verified encryption &middot; Files automatically purged 30 days after order
                    delivery
                  </p>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>

            {uploadError && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#E53935] font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </section>

          {/* 2. Print Specifications */}
          <section className="rounded-md border border-[#EDE9E1] bg-white p-6 shadow-xs">
            <h2 className="font-sans font-black text-xl text-[#302033]">
              2. Specifications &amp; Stock
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Document Pages (Single Copy)"
                value={pages}
                onChange={setPages}
                min={1}
              />
              <NumberField label="Number of Copies" value={copies} onChange={setCopies} min={1} />

              <Choice
                label="Ink Mode"
                value={color}
                onChange={setColor}
                options={[
                  ["bw", "Black & White (₹2)"],
                  ["color", "Full Color (₹7)"],
                ]}
              />

              <Choice
                label="Printing Sides"
                value={sided}
                onChange={setSided}
                options={[
                  ["duplex", "Duplex / 2-Sided (-15%)"],
                  ["single", "Single-Sided"],
                ]}
              />

              <Choice
                label="Paper Format"
                value={size}
                onChange={setSize}
                options={[
                  ["A4", "Standard A4"],
                  ["A3", "Architectural A3"],
                ]}
              />

              <Choice
                label="Paper Stock"
                value={paperQuality}
                onChange={setPaperQuality}
                options={[
                  ["standard-75gsm", "75 GSM JK Copier"],
                  ["executive-100gsm", "100 GSM Bond (+₹1.5)"],
                ]}
              />
            </div>
          </section>

          {/* 3. Bindery & Finishing with Real Product Photography */}
          <section className="rounded-md border border-[#EDE9E1] bg-white p-6 shadow-xs">
            <h2 className="font-sans font-black text-xl text-[#302033]">
              3. Finishing &amp; Bindery
            </h2>
            <p className="mt-1 text-xs text-[#6F6273]">
              Select precision finishing crafted by our in-house bindery
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <VisualBinderyCard
                active={binding === "spiral"}
                onClick={() => setBinding("spiral")}
                image={PRINT_IMAGES.spiralBinding}
                title="Twin-Loop Spiral"
                cost="+₹45"
                sub="Twin wire steel binding with transparent protective PVC sheets"
              />
              <VisualBinderyCard
                active={binding === "hardbound"}
                onClick={() => setBinding("hardbound")}
                image={PRINT_IMAGES.hardboundThesis}
                title="Gold Foil Hardbound"
                cost="+₹195"
                sub="Black leatherette thesis book with embossed golden title lettering"
              />
              <VisualBinderyCard
                active={binding === "staple"}
                onClick={() => setBinding("staple")}
                image={PRINT_IMAGES.stapledBooklet}
                title="Corner Staple &amp; Tape"
                cost="+₹10"
                sub="Reinforced linen spine tape with dual industrial staples"
              />
              <VisualBinderyCard
                active={binding === "file"}
                onClick={() => setBinding("file")}
                image={PRINT_IMAGES.presentationFile}
                title="Ring Folder File"
                cost="+₹30"
                sub="Punched and organized in executive presentation folder"
              />
              <VisualBinderyCard
                active={binding === "none"}
                onClick={() => setBinding("none")}
                image={PRINT_IMAGES.paperReam}
                title="Loose Sheets"
                cost="Free"
                sub="Unbound in protective moisture-sealed kraft envelope"
              />
            </div>
          </section>

          {/* 4. Fulfilment Method */}
          <section className="rounded-md border border-[#EDE9E1] bg-white p-6 shadow-xs">
            <h2 className="font-sans font-black text-xl text-[#302033]">4. Fulfilment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDelivery("deliver")}
                className={`rounded-md border p-4 text-left transition-all cursor-pointer ${
                  delivery === "deliver"
                    ? "border-2 border-[#302033] bg-[#F7F5EF] shadow-xs"
                    : "border-[#EDE9E1] bg-white hover:border-[#302033]"
                }`}
              >
                <div className="font-sans font-bold text-sm text-[#302033]">Doorstep Delivery</div>
                <div className="text-[11px] text-[#6F6273] mt-0.5">
                  Tracked courier in moisture-proof packaging
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDelivery("pickup")}
                className={`rounded-md border p-4 text-left transition-all cursor-pointer ${
                  delivery === "pickup"
                    ? "border-2 border-[#302033] bg-[#F7F5EF] shadow-xs"
                    : "border-[#EDE9E1] bg-white hover:border-[#302033]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-[#302033]">
                    Studio Counter Pickup
                  </span>
                  <span className="rounded bg-[#D7F05A] px-1.5 py-0.5 text-[10px] font-black text-[#302033] border border-[#302033]/20">
                    -10% Discount
                  </span>
                </div>
                <div className="text-[11px] text-[#6F6273] mt-0.5">
                  Ready for pickup at our local fulfillment desk
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Live Cost Estimation Summary Sidebar */}
        <aside className="md:sticky md:top-24 md:self-start space-y-4">
          <div className="rounded-md border-2 border-[#302033] bg-white p-6 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6F6273]">
              Live Estimated Total
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-sans font-black text-4xl text-[#302033]">₹{finalTotal}</span>
              {appliedDiscount > 0 && (
                <span className="text-sm text-[#6F6273] line-through font-medium">
                  ₹{rawSubtotal}
                </span>
              )}
            </div>

            {/* Discount Progress Indicator */}
            {discountPct > 0 && (
              <div className="mt-3 rounded bg-[#EDE9E1] p-2.5 text-xs text-[#208B58] flex items-center justify-between font-black">
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> Volume Savings
                </span>
                <span className="font-mono">{discountPct}% Off Applied</span>
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-[#EDE9E1] pt-4 text-xs font-semibold text-[#6F6273]">
              <div className="flex justify-between">
                <span>Total Impressions:</span>
                <span className="font-mono text-[#302033] font-bold">{pages * copies} pages</span>
              </div>
              <div className="flex justify-between">
                <span>Binding Finishing:</span>
                <span className="font-bold text-[#302033] capitalize">{binding}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-bold text-[#302033] capitalize">{delivery}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#D7F05A] px-4 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] shadow-xs border border-[#302033]/20 transition-all active:scale-95 cursor-pointer"
            >
              Add Print Job to Cart <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              to="/cart"
              className="mt-3 block text-center text-xs font-bold text-[#302033] hover:underline"
            >
              View Existing Cart &rarr;
            </Link>
          </div>

          <div className="rounded border border-[#EDE9E1] bg-white p-4 text-[11px] text-[#6F6273] leading-relaxed font-medium">
            <FileText className="h-4 w-4 text-[#302033] inline mr-1" />
            All academic documents are printed using laser calibration. Double-sided printing
            applies an automatic 15% paper saving rebate.
          </div>
        </aside>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value || 1)))}
        className="w-full rounded border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-bold font-mono text-[#302033] focus:outline-none focus:border-[#302033]"
      />
    </div>
  );
}

function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div>
      <span className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              value === v
                ? "bg-[#D7F05A] text-[#302033] font-black border border-[#302033]/30 shadow-xs"
                : "border border-[#EDE9E1] bg-white text-[#6F6273] hover:border-[#302033]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function VisualBinderyCard({
  active,
  onClick,
  image,
  title,
  cost,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  image: string;
  title: string;
  cost: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded border text-left transition-all cursor-pointer ${
        active
          ? "border-2 border-[#302033] bg-[#F7F5EF] shadow-sm"
          : "border border-[#EDE9E1] bg-white hover:border-[#302033]"
      }`}
    >
      <div className="aspect-[16/10] overflow-hidden bg-white">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="font-sans font-black text-xs text-[#302033]">{title}</span>
          <span className="rounded bg-[#EDE9E1] px-1.5 py-0.5 text-[10px] font-black text-[#302033]">
            {cost}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-[#6F6273] leading-relaxed line-clamp-2">{sub}</p>
      </div>
    </button>
  );
}
