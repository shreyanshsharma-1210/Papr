import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  aspect?: "square" | "portrait" | "landscape" | "video" | "tall";
  className?: string;
  badge?: string;
  badgeVariant?:
    | "lime"
    | "persimmon"
    | "yellow"
    | "lilac"
    | "plum"
    | "cobalt"
    | "coral"
    | "mint"
    | "navy";
  objectFit?: "cover" | "contain";
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  aspect = "square",
  className = "",
  badge,
  badgeVariant = "lime",
  objectFit = "cover",
  priority = false,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    video: "aspect-[16/9]",
    tall: "aspect-[2/3]",
  }[aspect];

  const badgeColorClass: Record<string, string> = {
    lime: "bg-[#D7F05A] text-[#302033] font-black border border-[#302033]/20",
    persimmon: "bg-[#F16A45] text-white font-black",
    yellow: "bg-[#F3E6A2] text-[#302033] font-black border border-[#302033]/15",
    lilac: "bg-[#C9B9E8] text-[#302033] font-black",
    plum: "bg-[#302033] text-[#F7F5EF] font-black",
    cobalt: "bg-[#D7F05A] text-[#302033] font-black border border-[#302033]/20",
    coral: "bg-[#F16A45] text-white font-black",
    mint: "bg-[#C9B9E8] text-[#302033] font-black",
    navy: "bg-[#302033] text-[#F7F5EF] font-black",
  };

  const selectedBadgeClass = badgeColorClass[badgeVariant] || badgeColorClass.lime;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#F7F5EF] border border-[#EDE9E1] ${aspectClass} ${className}`}
    >
      {/* Branded Loading Skeleton Shimmer with Micro Watermark */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-[#EDE9E1] via-[#F7F5EF] to-[#EDE9E1] animate-pulse">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#302033]/10 font-sans text-xs font-black text-[#302033]/30">
            P
          </span>
        </div>
      )}

      {/* Main Image with Async Decoding & Zero CLS Dimensions */}
      <img
        src={error ? "/images/products/p-nb-200.jpg" : src}
        alt={alt}
        width={450}
        height={450}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`h-full w-full ${
          objectFit === "contain" ? "object-contain p-2.5" : "object-cover"
        } transition-all duration-500 group-hover:scale-105 ${
          loaded ? "opacity-100 filter-none" : "opacity-0 blur-xs"
        }`}
      />

      {/* Optional Badge */}
      {badge && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs ${selectedBadgeClass}`}
          >
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
