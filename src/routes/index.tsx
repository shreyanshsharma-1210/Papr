import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, Printer, Sparkles, Check, Plus } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { CATEGORY_IMAGES, KIT_IMAGES, PRINT_IMAGES } from "@/lib/product-images";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { useState } from "react";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const bestsellers = PRODUCTS.filter((p) => p.tag || p.inStock).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#F7F5EF]">
      {/* 1. DISTINCTIVE CREATIVE COMMERCE HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#EDE9E1] bg-[#F7F5EF] pt-10 pb-16 sm:pt-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#302033]/15 bg-[#EDE9E1] px-3.5 py-1 text-xs font-bold text-[#302033]">
                <span className="h-2 w-2 rounded-full bg-[#F16A45] animate-pulse" />
                <span className="uppercase tracking-wider">Stationery · Essentials · Print</span>
              </div>

              <h1 className="font-sans font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.03] tracking-tight text-[#302033]">
                Make room <br />
                <span className="bg-[#D7F05A] text-[#302033] px-2 py-0.5 inline-block -rotate-1 rounded-sm mt-1">
                  for ideas.
                </span>
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#6F6273] leading-relaxed max-w-xl">
                PAPR creates energetic, design-conscious tools for students, architects, and
                thinkers. From verified school &amp; campus kits to Japanese writing instruments and
                an on-demand print studio.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/shop"
                  preload="intent"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D7F05A] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] transition-all shadow-sm border border-[#302033]/20 active:scale-95"
                >
                  Shop Essentials <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/class-kits"
                  preload="intent"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#302033] bg-[#F7F5EF] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#302033] hover:bg-[#302033] hover:text-[#F7F5EF] transition-all active:scale-95"
                >
                  School Kits (1–12)
                </Link>
                <Link
                  to="/printing"
                  preload="intent"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#EDE9E1] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#302033] hover:border-[#302033] transition-all"
                >
                  Print Studio
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-bold text-[#6F6273]">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D7F05A] text-[#302033] font-black text-[11px]">
                    ✓
                  </span>
                  <span>100% Genuine Brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F16A45] text-white font-black text-[11px]">
                    ✓
                  </span>
                  <span>Board Verified Syllabi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9B9E8] text-[#302033] font-black text-[11px]">
                    ✓
                  </span>
                  <span>Same-Day Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Product Composition Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border-2 border-[#302033] bg-white p-4 shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#EDE9E1]">
                  <img
                    src="/images/products/p-nb-200.jpg"
                    alt="PAPR Contemporary Stationery Showcase"
                    width={600}
                    height={450}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                  {/* Floating Tag */}
                  <div className="absolute top-3 left-3 rounded bg-[#302033] px-3 py-1 text-xs font-bold text-[#F7F5EF] shadow-md flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#D7F05A]" />
                    <span>Curated Academic Edit</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F16A45]">
                      Syllabus Bundles
                    </span>
                    <h3 className="font-sans font-black text-sm text-[#302033] mt-0.5">
                      8% to 10% Off
                    </h3>
                    <p className="text-[11px] text-[#6F6273] mt-0.5">
                      Complete textbook &amp; notebook sets
                    </p>
                  </div>
                  <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#302033]">
                      Print Studio
                    </span>
                    <h3 className="font-sans font-black text-sm text-[#302033] mt-0.5">
                      From ₹2 / Page
                    </h3>
                    <p className="text-[11px] text-[#6F6273] mt-0.5">
                      Direct PDF thesis &amp; reports
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY WITH REAL CATEGORY PHOTOGRAPHY */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#EDE9E1] pb-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-wider font-black text-[#F16A45]">
              Curated Shelves
            </span>
            <h2 className="font-sans font-black text-3xl text-[#302033] mt-1">
              Shop by Discipline
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#302033] hover:underline flex items-center gap-1"
          >
            Explore Full Catalogue &rarr;
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const catMeta = CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES.notebooks;
            return (
              <Link
                key={cat.id}
                to="/shop"
                search={{ category: cat.id }}
                className={`group flex flex-col justify-between overflow-hidden rounded-md border ${catMeta.border} bg-white p-3 transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="relative aspect-square overflow-hidden rounded bg-[#EDE9E1]">
                  <img
                    src={catMeta.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="rounded bg-[#302033]/90 px-1.5 py-0.5 text-[9px] font-bold text-[#F7F5EF] uppercase tracking-wider">
                      {catMeta.tag}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-sans font-bold text-sm text-[#302033] group-hover:text-[#F16A45] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="mt-1 text-[11px] font-bold text-[#6F6273] group-hover:text-[#302033] inline-flex items-center gap-1">
                    Shop Shelf &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3 & 4. ACADEMIC KITS SPLIT (SCHOOL & COLLEGE) WITH FLAT-LAY PHOTOGRAPHY */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* School Kits Card */}
          <div className="flex flex-col justify-between rounded-md border-2 border-[#F3E6A2] bg-white p-6 sm:p-8 shadow-sm">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded bg-[#EDE9E1]">
                <img
                  src={KIT_IMAGES.schoolKitFlatlay}
                  alt="School Class Kits Flat-lay Photography"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 rounded bg-[#F16A45] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Classes 1 to 12
                </div>
                <div className="absolute bottom-3 right-3 rounded bg-[#302033] px-2.5 py-1 text-[10px] font-bold text-[#F7F5EF]">
                  8% Bundle Discount
                </div>
              </div>

              <h3 className="mt-5 font-sans font-black text-2xl sm:text-3xl text-[#302033]">
                School Class Kits
              </h3>
              <p className="mt-2.5 font-sans text-xs sm:text-sm text-[#6F6273] leading-relaxed">
                Everything for the new academic year. Complete syllabus sets for Classes 1 through
                12, including NCERT textbooks, ruled notebooks, geometry sets, and name labels.
                Verified against current school syllabi.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#302033]">
                <span className="rounded border border-[#EDE9E1] bg-[#F7F5EF] px-2.5 py-1">
                  NCERT Textbooks
                </span>
                <span className="rounded border border-[#EDE9E1] bg-[#F7F5EF] px-2.5 py-1">
                  Exercise Notebooks
                </span>
                <span className="rounded border border-[#EDE9E1] bg-[#F7F5EF] px-2.5 py-1">
                  Cover &amp; Labels
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#EDE9E1] flex items-center justify-between">
              <span className="text-xs font-bold text-[#208B58]">1-Tap Complete Bundle</span>
              <Link
                to="/class-kits"
                className="inline-flex items-center gap-2 rounded-md bg-[#D7F05A] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] transition-colors shadow-sm border border-[#302033]/20"
              >
                Select Class &rarr;
              </Link>
            </div>
          </div>

          {/* College Kits Card */}
          <div className="flex flex-col justify-between rounded-md border-2 border-[#C9B9E8] bg-white p-6 sm:p-8 shadow-sm">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded bg-[#EDE9E1]">
                <img
                  src={KIT_IMAGES.collegeKitFlatlay}
                  alt="College & Campus Kits Flat-lay Photography"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 rounded bg-[#302033] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#D7F05A] shadow-sm flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> University &amp; Campus
                </div>
                <div className="absolute bottom-3 right-3 rounded bg-[#302033] px-2.5 py-1 text-[10px] font-bold text-[#F7F5EF]">
                  10% Bundle Discount
                </div>
              </div>

              <h3 className="mt-5 font-sans font-black text-2xl sm:text-3xl text-[#302033]">
                Campus &amp; University Kits
              </h3>
              <p className="mt-2.5 font-sans text-xs sm:text-sm text-[#6F6273] leading-relaxed">
                Four quick steps to your semester essentials. Tailored for Engineering, Management,
                Commerce and Science faculties. Includes hardbound practical files, drafters, and
                approved scientific calculators.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#302033]">
                <span className="rounded border border-[#EDE9E1] bg-[#F7F5EF] px-2.5 py-1">
                  Casio Scientific FX-991CW
                </span>
                <span className="rounded border border-[#EDE9E1] bg-[#F7F5EF] px-2.5 py-1">
                  Engineering Drafter
                </span>
                <span className="rounded border border-[#EDE9E1] bg-[#F7F5EF] px-2.5 py-1">
                  Hardbound Lab Files
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#EDE9E1] flex items-center justify-between">
              <span className="text-xs font-bold text-[#208B58]">
                Tailored by College &amp; Branch
              </span>
              <Link
                to="/college-kits"
                className="inline-flex items-center gap-2 rounded-md bg-[#302033] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F7F5EF] hover:bg-[#302033]/90 transition-colors shadow-sm"
              >
                Launch Kit Wizard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BESTSELLERS / FEATURED PRODUCTS WITH REAL PRODUCT PHOTOGRAPHY */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#EDE9E1] pb-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-wider font-black text-[#F16A45]">
              Selected Essentials
            </span>
            <h2 className="font-sans font-black text-3xl text-[#302033] mt-1">
              Thoughtful Everyday Tools
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#302033] hover:underline flex items-center gap-1"
          >
            View Full Catalogue &rarr;
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. PRINT STUDIO SECTION WITH REAL PRINT SERVICE PHOTOGRAPHY */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-md border-2 border-[#302033]/20 bg-white p-6 sm:p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded bg-[#C9B9E8]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#302033]">
                <Printer className="h-4 w-4" /> High-Precision Print Studio
              </div>

              <h2 className="font-sans font-black text-3xl sm:text-4xl text-[#302033] leading-tight">
                Your documents, printed &amp; bound cleanly.
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#6F6273] leading-relaxed max-w-xl">
                Direct PDF document printing, twin-wire spiral bindery, executive thesis bound
                books, and project reports. Upload your files, choose single or double sided, paper
                weight (75 GSM / 100 GSM), and review live pricing before ordering.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3">
                  <span className="font-sans font-black text-xl text-[#302033]">₹2 / page</span>
                  <p className="text-[11px] font-bold text-[#6F6273]">Crisp B&amp;W printing</p>
                </div>
                <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3">
                  <span className="font-sans font-black text-xl text-[#302033]">₹7 / page</span>
                  <p className="text-[11px] font-bold text-[#6F6273]">Vibrant color print</p>
                </div>
                <div className="rounded border border-[#EDE9E1] bg-[#F7F5EF] p-3 col-span-2 sm:col-span-1">
                  <span className="font-sans font-black text-xl text-[#F16A45]">Up to 50%</span>
                  <p className="text-[11px] font-bold text-[#6F6273]">Academic volume savings</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/printing"
                  className="inline-flex items-center gap-2 rounded-md bg-[#D7F05A] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] transition-colors shadow-sm border border-[#302033]/20"
                >
                  Upload &amp; Configure Print Job &rarr;
                </Link>
              </div>
            </div>

            {/* Right Visual Cards Showcase */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded border border-[#EDE9E1] bg-[#F7F5EF] p-2.5 shadow-xs">
                <div className="aspect-[4/3] overflow-hidden rounded">
                  <img
                    src={PRINT_IMAGES.spiralBinding}
                    alt="Spiral Bound Report"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="mt-2 font-sans font-bold text-xs text-[#302033]">
                  Spiral Wire Binding
                </h4>
                <p className="text-[10px] text-[#6F6273]">From ₹45 · 360° lay-flat</p>
              </div>

              <div className="overflow-hidden rounded border border-[#EDE9E1] bg-[#F7F5EF] p-2.5 shadow-xs">
                <div className="aspect-[4/3] overflow-hidden rounded">
                  <img
                    src={PRINT_IMAGES.hardboundThesis}
                    alt="Hardbound Thesis Cover"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="mt-2 font-sans font-bold text-xs text-[#302033]">
                  Hardbound Thesis
                </h4>
                <p className="text-[10px] text-[#6F6273]">From ₹195 · Golden debossed</p>
              </div>

              <div className="overflow-hidden rounded border border-[#EDE9E1] bg-[#F7F5EF] p-2.5 shadow-xs">
                <div className="aspect-[4/3] overflow-hidden rounded">
                  <img
                    src={PRINT_IMAGES.paperReam}
                    alt="A4 Copier Paper Stock"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="mt-2 font-sans font-bold text-xs text-[#302033]">
                  75 &amp; 100 GSM Stock
                </h4>
                <p className="text-[10px] text-[#6F6273]">Jam-free crisp opacity</p>
              </div>

              <div className="overflow-hidden rounded border border-[#EDE9E1] bg-[#F7F5EF] p-2.5 shadow-xs">
                <div className="aspect-[4/3] overflow-hidden rounded">
                  <img
                    src={PRINT_IMAGES.stapledBooklet}
                    alt="Saddle Stitched Document"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="mt-2 font-sans font-bold text-xs text-[#302033]">
                  Stapled Presentation
                </h4>
                <p className="text-[10px] text-[#6F6273]">From ₹10 · Corner staple</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BRAND ATTRIBUTES */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-b border-[#EDE9E1] py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-[#EDE9E1] bg-white p-5 space-y-2">
              <span className="inline-block rounded bg-[#D7F05A] px-2 py-0.5 text-xs font-black text-[#302033]">
                01
              </span>
              <h4 className="font-sans font-bold text-base text-[#302033]">Archival Grade</h4>
              <p className="text-xs text-[#6F6273] leading-relaxed">
                Acid-free paper stocks and fade-resistant pigment inks that stand the test of time.
              </p>
            </div>

            <div className="rounded border border-[#EDE9E1] bg-white p-5 space-y-2">
              <span className="inline-block rounded bg-[#F16A45] px-2 py-0.5 text-xs font-black text-white">
                02
              </span>
              <h4 className="font-sans font-bold text-base text-[#302033]">Syllabus Aligned</h4>
              <p className="text-xs text-[#6F6273] leading-relaxed">
                Kits curated according to official board and university curriculum requirements.
              </p>
            </div>

            <div className="rounded border border-[#EDE9E1] bg-white p-5 space-y-2">
              <span className="inline-block rounded bg-[#F3E6A2] px-2 py-0.5 text-xs font-black text-[#302033]">
                03
              </span>
              <h4 className="font-sans font-bold text-base text-[#302033]">Transparent Pricing</h4>
              <p className="text-xs text-[#6F6273] leading-relaxed">
                Automatic bundle discounts with clear savings against individual MRPs.
              </p>
            </div>

            <div className="rounded border border-[#EDE9E1] bg-white p-5 space-y-2">
              <span className="inline-block rounded bg-[#C9B9E8] px-2 py-0.5 text-xs font-black text-[#302033]">
                04
              </span>
              <h4 className="font-sans font-bold text-base text-[#302033]">India-Wide Delivery</h4>
              <p className="text-xs text-[#6F6273] leading-relaxed">
                Dispatched in reinforced protective packaging with live tracking on every order.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const addProduct = useCart((s) => s.addProduct);
  const [added, setAdded] = useState(false);
  const discount = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;

  return (
    <div className="group flex flex-col justify-between rounded-md border border-[#EDE9E1] bg-white p-4 transition-all hover:border-[#302033] hover:shadow-md">
      <div>
        {/* Genuine Product Image */}
        <ProductImage
          src={p.image || `/images/products/${p.id}.jpg`}
          alt={p.name}
          aspect="square"
          badge={p.tag}
          badgeVariant={p.tag === "Bestseller" ? "persimmon" : "lime"}
        />

        <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
          <span>{p.brand}</span>
          {p.sameDay && <span className="text-[#F16A45] font-extrabold">Same-Day</span>}
        </div>

        <h3 className="mt-1 font-sans font-bold text-base text-[#302033] group-hover:text-[#F16A45] transition-colors line-clamp-1">
          {p.name}
        </h3>
        <p className="mt-1 text-xs text-[#6F6273] line-clamp-2">
          {p.description ||
            "Everyday stationery essential designed for clean writing and endurance."}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#EDE9E1] flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-sans font-black text-lg text-[#302033]">₹{p.price}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-[#6F6273] line-through font-medium">₹{p.mrp}</span>
              <span className="rounded bg-[#F16A45]/15 px-1 py-0.5 text-[10px] font-black text-[#F16A45]">
                -{discount}%
              </span>
            </>
          )}
        </div>

        <button
          onClick={() => {
            addProduct(p.id, 1);
            setAdded(true);
            toast.success(`${p.name} added to cart`);
            setTimeout(() => setAdded(false), 1200);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#D7F05A] px-3.5 py-1.5 text-xs font-black text-[#302033] hover:bg-[#cae64c] transition-colors active:scale-95 shadow-xs border border-[#302033]/20"
        >
          {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{added ? "Added" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
