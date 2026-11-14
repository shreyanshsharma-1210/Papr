import { Link } from "@tanstack/react-router";

interface LogoProps {
  variant?: "full" | "wordmark" | "compact";
  className?: string;
  inverted?: boolean;
}

export function Logo({ variant = "full", className = "", inverted = false }: LogoProps) {
  if (variant === "compact") {
    return (
      <Link
        to="/"
        className={`inline-flex items-center gap-2 group ${className}`}
        aria-label="PAPR Home"
      >
        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-md font-sans font-black text-lg transition-transform group-hover:scale-105 ${
            inverted
              ? "bg-[#D7F05A] text-[#302033] shadow-sm"
              : "bg-[#302033] text-[#D7F05A] shadow-sm group-hover:bg-[#302033]/90"
          }`}
        >
          P
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#F16A45] ring-2 ring-[#F7F5EF]" />
        </span>
      </Link>
    );
  }

  if (variant === "wordmark") {
    return (
      <Link
        to="/"
        className={`inline-flex items-center gap-1.5 group ${className}`}
        aria-label="PAPR Home"
      >
        <span
          className={`font-sans font-black text-2xl tracking-tight transition-opacity ${
            inverted ? "text-[#F7F5EF]" : "text-[#302033] group-hover:opacity-90"
          }`}
        >
          PAPR
        </span>
        <span className="h-2 w-2 rounded-full bg-[#F16A45]" />
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 group ${className}`}
      aria-label="PAPR Home"
    >
      <span
        className={`relative flex h-8 w-8 items-center justify-center rounded-md font-sans font-black text-base transition-transform group-hover:scale-105 ${
          inverted ? "bg-[#D7F05A] text-[#302033]" : "bg-[#302033] text-[#D7F05A]"
        }`}
      >
        P
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#F16A45] ring-2 ring-[#F7F5EF]" />
      </span>
      <div className="flex flex-col">
        <span
          className={`font-sans font-black text-xl leading-none tracking-tight transition-colors ${
            inverted ? "text-[#F7F5EF]" : "text-[#302033]"
          }`}
        >
          PAPR
        </span>
        <span
          className={`font-sans text-[9px] font-bold uppercase tracking-[0.2em] transition-colors mt-0.5 ${
            inverted ? "text-[#C9B9E8]" : "text-[#6F6273]"
          }`}
        >
          Stationery · Essentials · Print
        </span>
      </div>
    </Link>
  );
}
