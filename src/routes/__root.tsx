import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F5EF] px-4">
      <div className="max-w-md text-center">
        <span className="font-sans text-8xl font-black text-[#F16A45]">404</span>
        <h1 className="mt-4 font-sans text-3xl font-black text-[#302033]">Page Not Found</h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6F6273] leading-relaxed">
          The stationery collection, kit, or print job you are looking for has been archived, moved,
          or does not exist.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            preload="intent"
            className="inline-flex items-center justify-center rounded-xl bg-[#D7F05A] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 shadow-sm transition-all"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PAPR — Stationery · Essentials · Print" },
      {
        name: "description",
        content:
          "Make room for ideas. Thoughtfully curated school and college kits, fine writing instruments, notebook systems, and high-precision print studio.",
      },
      { name: "author", content: "PAPR" },
      { property: "og:title", content: "PAPR — Stationery · Essentials · Print" },
      {
        property: "og:description",
        content:
          "Make room for ideas. Thoughtfully curated school and college kits, everyday essentials, and custom document printing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PAPR — Stationery · Essentials · Print" },
      {
        name: "twitter:description",
        content:
          "Make room for ideas. Curated academic kits, desk essentials, and on-demand print studio.",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap",
      },
      { rel: "preload", as: "image", href: "/images/products/p-nb-200.jpg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5EF] text-[#302033] antialiased selection:bg-[#D7F05A] selection:text-[#302033] pb-16 md:pb-0">
      <NavigationProgressBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <Toaster position="top-center" />
    </div>
  );
}
