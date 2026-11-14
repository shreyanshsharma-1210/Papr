import { Link } from "@tanstack/react-router";

interface LogoProps {
  variant?: "full" | "wordmark" | "compact";
  className?: string;
  inverted?: boolean;
}

export function Logo({ variant = "full", className = "", inverted = false }: LogoProps) {
  if (variant === "compact") {
    return (
      <Link to="/" className={`inline-flex items-center group ${className}`} aria-label="PAPR Home">
        <img
          src="/images/papr-mark.png"
          alt="PAPR"
          className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
        />
      </Link>
    );
  }

  if (variant === "wordmark") {
    return (
      <Link to="/" className={`inline-flex items-center group ${className}`} aria-label="PAPR Home">
        <img
          src={inverted ? "/images/papr-logo-white.png" : "/images/papr-logo-trimmed.png"}
          alt="PAPR — Stationery · Essentials · Print"
          className="h-9 w-auto max-w-[150px] object-contain transition-opacity group-hover:opacity-90"
        />
      </Link>
    );
  }

  return (
    <Link to="/" className={`inline-flex items-center group ${className}`} aria-label="PAPR Home">
      <img
        src={inverted ? "/images/papr-logo-white.png" : "/images/papr-logo-trimmed.png"}
        alt="PAPR — Stationery · Essentials · Print"
        className="h-9 sm:h-10 w-auto max-w-[180px] sm:max-w-[210px] object-contain transition-transform group-hover:scale-[1.02]"
      />
    </Link>
  );
}
