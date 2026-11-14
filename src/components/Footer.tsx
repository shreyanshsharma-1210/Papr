import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ShieldCheck, Truck, RefreshCcw, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#302033]/20 bg-[#302033] text-[#F7F5EF] mt-24">
      {/* Service Highlights Bar */}
      <div className="border-b border-white/10 bg-[#251828]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#D7F05A]/15 text-[#D7F05A]">
                <Truck className="h-5 w-5 text-[#D7F05A]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-[#F7F5EF]">Tracked Delivery</h4>
                <p className="text-[11px] text-[#F7F5EF]/60">Dispatched across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F16A45]/20 text-[#F16A45]">
                <ShieldCheck className="h-5 w-5 text-[#F16A45]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-[#F7F5EF]">Curated Syllabus</h4>
                <p className="text-[11px] text-[#F7F5EF]/60">Verified board textbooks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F3E6A2]/20 text-[#F3E6A2]">
                <RefreshCcw className="h-5 w-5 text-[#F3E6A2]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-[#F7F5EF]">Genuine Supplies</h4>
                <p className="text-[11px] text-[#F7F5EF]/60">100% authentic stationery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#C9B9E8]/20 text-[#C9B9E8]">
                <FileText className="h-5 w-5 text-[#C9B9E8]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-[#F7F5EF]">GST Invoicing</h4>
                <p className="text-[11px] text-[#F7F5EF]/60">B2B & student tax receipts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="full" inverted={true} />
            <p className="font-sans font-black text-2xl text-[#F7F5EF] tracking-tight mt-3">
              “Make room for ideas.”
            </p>
            <p className="font-sans text-xs text-[#F7F5EF]/70 leading-relaxed max-w-sm">
              PAPR is an independent stationery and print destination supplying curated academic
              kits, fine writing instruments, archival notebooks, and high-precision on-demand
              document printing.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#F7F5EF]/60 font-mono">
              <span className="rounded bg-white/10 px-2 py-0.5">GST Compliant</span>
              <span>•</span>
              <span className="rounded bg-white/10 px-2 py-0.5">Fast-Track Delivery</span>
              <span>•</span>
              <span className="rounded bg-white/10 px-2 py-0.5">Campus Trusted</span>
            </div>
          </div>

          {/* Column: Collections */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-wider font-black text-[#F7F5EF]">
              Collections
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#F7F5EF]/70 font-sans">
              <li>
                <Link to="/shop" className="hover:text-[#D7F05A] transition-colors">
                  Everyday Essentials
                </Link>
              </li>
              <li>
                <Link to="/class-kits" className="hover:text-[#D7F05A] transition-colors">
                  School Class Kits (1–12)
                </Link>
              </li>
              <li>
                <Link to="/college-kits" className="hover:text-[#D7F05A] transition-colors">
                  College & Campus Kits
                </Link>
              </li>
              <li>
                <Link to="/printing" className="hover:text-[#D7F05A] transition-colors">
                  Print Studio & Bindery
                </Link>
              </li>
              <li>
                <Link to="/office" className="hover:text-[#D7F05A] transition-colors">
                  Office & Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Studio Services */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-wider font-black text-[#F7F5EF]">
              Studio & Fulfilment
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#F7F5EF]/70 font-sans">
              <li>
                <Link to="/printing" className="hover:text-[#D7F05A] transition-colors">
                  Direct PDF Upload
                </Link>
              </li>
              <li>
                <Link to="/printing" className="hover:text-[#D7F05A] transition-colors">
                  Hardbound Thesis Binding
                </Link>
              </li>
              <li>
                <Link to="/printing" className="hover:text-[#D7F05A] transition-colors">
                  Spiral & Wire Bound Reports
                </Link>
              </li>
              <li>
                <Link to="/office" className="hover:text-[#D7F05A] transition-colors">
                  Corporate Bulk Procurement
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#D7F05A] transition-colors">
                  Track Existing Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Account & Support */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-wider font-black text-[#F7F5EF]">
              Customer Desk
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#F7F5EF]/70 font-sans">
              <li>
                <Link to="/profile" className="hover:text-[#D7F05A] transition-colors">
                  Profile & Preferences
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#D7F05A] transition-colors">
                  Order History & Invoices
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#D7F05A] transition-colors">
                  Operations Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#D7F05A] hover:underline"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="text-[11px] text-[#F7F5EF]/50 pt-2">
                Mon &ndash; Sat, 9:00 AM &ndash; 7:30 PM IST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F5EF]/50">
          <div>&copy; {new Date().getFullYear()} PAPR Studios. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="text-[#F7F5EF]/40">
              Deep Plum · Acid Lime · Persimmon · Soft Lilac
            </span>
            <span>&middot;</span>
            <Link to="/admin" className="hover:text-[#D7F05A]">
              Admin Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
