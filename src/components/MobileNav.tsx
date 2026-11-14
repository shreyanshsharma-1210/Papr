import { Link } from "@tanstack/react-router";
import { Home, Compass, BookOpen, Printer, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Compass },
  { to: "/class-kits", label: "Kits", icon: BookOpen },
  { to: "/printing", label: "Print", icon: Printer },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
] as const;

export function MobileNav() {
  const count = useCart((s) => s.count());

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EDE9E1] bg-[#F7F5EF]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1 text-center">
              <Link
                to={it.to}
                preload="intent"
                className="flex flex-col items-center justify-center gap-1 py-1 text-[10px] uppercase tracking-wider font-bold text-[#6F6273] transition-colors hover:text-[#302033]"
                activeProps={{
                  className:
                    "flex flex-col items-center justify-center gap-1 py-1 text-[10px] uppercase tracking-wider font-black text-[#302033]",
                }}
                activeOptions={{ exact: it.to === "/" }}
              >
                <span className="relative">
                  <Icon className="h-4 w-4" />
                  {it.to === "/cart" && count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#F16A45] px-1 text-[9px] font-black text-white ring-2 ring-[#F7F5EF]">
                      {count}
                    </span>
                  )}
                </span>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
