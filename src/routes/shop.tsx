import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Plus, Check, Tag, ArrowUpDown } from "lucide-react";
import { fetchProducts } from "@/lib/db-service";
import { CATEGORIES } from "@/lib/mock-data";
import { ProductImage } from "@/components/ProductImage";
import { LogoLoader } from "@/components/LogoLoader";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");

  useEffect(() => {
    let mounted = true;
    fetchProducts().then((data) => {
      if (mounted) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (sameDayOnly && !p.sameDay) return false;
      if (
        q &&
        !(
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        )
      ) {
        return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        res = [...res].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        res = [...res].sort((a, b) => b.price - a.price);
        break;
      case "name":
        res = [...res].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        res = [...res].sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0));
        break;
    }

    return res;
  }, [products, query, category, maxPrice, sameDayOnly, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-8 bg-[#F7F5EF]">
      {/* Header */}
      <div className="border-b border-[#EDE9E1] pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9E1] px-3 py-1 text-xs font-bold text-[#302033] border border-[#302033]/15">
          <Tag className="h-3 w-3 text-[#F16A45]" /> PAPR Catalogue
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-5xl text-[#302033] mt-2">
          Everyday Essentials
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6F6273] max-w-xl leading-relaxed">
          Curated paper, notebooks, Japanese drafting tools, and verified academic supplies. 100%
          genuine brand quality with same-day dispatch available across major cities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6F6273]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notebooks, Casio, pens, rulers, textbooks..."
            className="w-full rounded-xl border border-[#EDE9E1] bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-[#302033] placeholder:text-[#6F6273]/60 focus:outline-none focus:border-[#302033] shadow-2xs"
          />
        </div>

        {/* Sort & Same Day Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSameDayOnly(!sameDayOnly)}
            className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              sameDayOnly
                ? "border-[#F16A45] bg-[#F16A45]/15 text-[#F16A45]"
                : "border-[#EDE9E1] bg-white text-[#6F6273] hover:text-[#302033]"
            }`}
          >
            ⚡ Express Same-Day Only
          </button>

          <div className="flex items-center gap-1.5 rounded-xl border border-[#EDE9E1] bg-white px-3 py-1.5 text-xs text-[#6F6273]">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort products by"
              className="bg-transparent font-bold text-[#302033] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Price Slider */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EDE9E1]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
              category === cat.id
                ? "bg-[#D7F05A] text-[#302033] shadow-xs border border-[#302033]/20"
                : "border border-[#EDE9E1] bg-white text-[#6F6273] hover:text-[#302033] hover:border-[#302033]/40"
            }`}
          >
            {cat.label}
          </button>
        ))}

        <div className="flex items-center gap-2.5 text-xs font-bold text-[#6F6273] ml-auto bg-white border border-[#EDE9E1] px-3.5 py-1.5 rounded-xl shadow-2xs">
          <Filter className="h-3.5 w-3.5 text-[#F16A45]" />
          <span>Under ₹{maxPrice}</span>
          <input
            type="range"
            min={50}
            max={2500}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="accent-[#302033] w-28 cursor-pointer"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <LogoLoader size="lg" variant="card" label="Retrieving curated everyday essentials..." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, idx) => (
            <ProductItem key={product.id} product={product} priority={idx < 6} />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-[#EDE9E1] bg-white p-16 text-center">
              <h3 className="font-sans font-black text-2xl text-[#302033]">
                No matching items found
              </h3>
              <p className="mt-2 text-xs text-[#6F6273] max-w-sm mx-auto">
                Try widening your price range or clearing search &amp; category filters.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setMaxPrice(2500);
                  setSameDayOnly(false);
                }}
                className="mt-6 rounded-xl bg-[#D7F05A] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] transition-colors border border-[#302033]/20 shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductItem({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const addProduct = useCart((s) => s.addProduct);
  const [added, setAdded] = useState(false);
  const discount = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-[#EDE9E1] bg-white p-4 transition-all hover:border-[#302033] hover:shadow-md">
      <div>
        {/* Genuine Product Image Component with Async & Priority Loading */}
        <ProductImage
          src={p.image || `/images/products/${p.id}.jpg`}
          alt={p.name}
          aspect="square"
          priority={priority}
          badge={p.tag}
          badgeVariant={p.tag === "Bestseller" ? "persimmon" : "lime"}
        />

        <div className="mt-3.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
          <span>{p.brand}</span>
          <div className="flex items-center gap-1.5">
            {p.sameDay && (
              <span className="rounded bg-[#F16A45]/15 px-1.5 py-0.5 text-[#F16A45] font-black">
                Same-Day
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-1 font-sans font-bold text-base text-[#302033] group-hover:text-[#F16A45] transition-colors line-clamp-1">
          {p.name}
        </h3>
        <p className="mt-1 text-xs text-[#6F6273] line-clamp-2">
          {p.description ||
            "Everyday stationery essential designed for clean writing and endurance."}
        </p>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#EDE9E1] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-black text-xl text-[#302033]">₹{p.price}</span>
            {p.mrp > p.price && (
              <span className="text-xs text-[#6F6273] line-through font-mono">₹{p.mrp}</span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-[10px] font-bold text-[#F16A45]">Save {discount}% off MRP</span>
          )}
        </div>

        <button
          onClick={() => {
            addProduct(p.id, 1);
            setAdded(true);
            toast.success(`Added ${p.name} to cart`);
            setTimeout(() => setAdded(false), 1500);
          }}
          disabled={!p.inStock}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
            added
              ? "bg-[#302033] text-[#D7F05A]"
              : p.inStock
                ? "bg-[#D7F05A] text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 shadow-xs active:scale-95"
                : "bg-[#EDE9E1] text-[#6F6273] cursor-not-allowed"
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" /> Added
            </>
          ) : p.inStock ? (
            <>
              <Plus className="h-3.5 w-3.5" /> Add
            </>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  );
}
