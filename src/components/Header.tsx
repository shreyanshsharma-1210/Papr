import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, User, ChevronDown, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Logo } from "@/components/Logo";
import { useState } from "react";

export function Header() {
  const count = useCart((s) => s.count());
  const [kitsOpen, setKitsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#EDE9E1] bg-[#F7F5EF]/95 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#302033] py-2 px-4 text-center">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-[11px] font-medium text-[#F7F5EF]">
          <span className="inline-flex items-center gap-1 rounded bg-[#D7F05A] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#302033]">
            <Sparkles className="h-2.5 w-2.5" /> Launch Offer
          </span>
          <span className="font-sans font-bold">Make room for ideas.</span>
          <span className="text-[#F7F5EF]/40 hidden sm:inline">&mdash;</span>
          <span className="text-[#F7F5EF]/90 hidden sm:inline">
            Free shipping across India on orders over ₹499
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo variant="full" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/shop"
              preload="intent"
              className="text-xs font-bold uppercase tracking-wider text-[#302033]/80 hover:text-[#302033] transition-colors py-1"
              activeProps={{
                className:
                  "text-xs font-black uppercase tracking-wider text-[#302033] border-b-2 border-[#D7F05A] pb-0.5",
              }}
            >
              Shop
            </Link>

            {/* Kits Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setKitsOpen(true)}
              onMouseLeave={() => setKitsOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#302033]/80 hover:text-[#302033] transition-colors py-2"
                onClick={() => setKitsOpen(!kitsOpen)}
              >
                Curated Kits <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>

              {kitsOpen && (
                <div className="absolute top-full left-0 w-72 rounded-xl border border-[#EDE9E1] bg-white p-2.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  <Link
                    to="/class-kits"
                    preload="intent"
                    onClick={() => setKitsOpen(false)}
                    className="block rounded-lg p-3 hover:bg-[#F3E6A2]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#D7F05A]" />
                      <div className="font-sans font-bold text-sm text-[#302033]">
                        School Class Kits
                      </div>
                    </div>
                    <div className="text-[11px] text-[#6F6273] mt-1 pl-4">
                      Classes 1 to 12 · Board syllabus textbooks & notebooks
                    </div>
                  </Link>

                  <Link
                    to="/college-kits"
                    preload="intent"
                    onClick={() => setKitsOpen(false)}
                    className="block rounded-lg p-3 hover:bg-[#C9B9E8]/30 transition-colors group mt-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#F16A45]" />
                      <div className="font-sans font-bold text-sm text-[#302033]">
                        Campus &amp; University Kits
                      </div>
                    </div>
                    <div className="text-[11px] text-[#6F6273] mt-1 pl-4">
                      Engineering, BBA, B.Com · Drafters &amp; scientific calculators
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/printing"
              preload="intent"
              className="text-xs font-bold uppercase tracking-wider text-[#302033]/80 hover:text-[#302033] transition-colors py-1"
              activeProps={{
                className:
                  "text-xs font-black uppercase tracking-wider text-[#302033] border-b-2 border-[#D7F05A] pb-0.5",
              }}
            >
              Print Studio
            </Link>

            <Link
              to="/office"
              preload="intent"
              className="text-xs font-bold uppercase tracking-wider text-[#302033]/80 hover:text-[#302033] transition-colors py-1"
              activeProps={{
                className:
                  "text-xs font-black uppercase tracking-wider text-[#302033] border-b-2 border-[#D7F05A] pb-0.5",
              }}
            >
              Office Supplies
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            preload="intent"
            aria-label="Search catalogue"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-[#302033] hover:bg-[#EDE9E1] transition-colors"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            to="/profile"
            preload="intent"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#302033] hover:bg-[#EDE9E1] transition-colors"
          >
            <User className="h-4 w-4" />
          </Link>

          <Link
            to="/cart"
            preload="intent"
            className="relative flex items-center gap-2 rounded-xl bg-[#D7F05A] px-3.5 py-2 text-xs font-black text-[#302033] hover:bg-[#c8e348] transition-colors shadow-xs border border-[#302033]/20"
          >
            <ShoppingBag className="h-4 w-4 text-[#302033]" />
            <span className="font-sans font-black">Cart</span>
            {count > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F16A45] px-1 text-[10px] font-black text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
