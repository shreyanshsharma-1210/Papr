import { useEffect, useState } from "react";

interface LogoLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  variant?: "inline" | "card" | "fullscreen" | "overlay";
  className?: string;
}

const DEFAULT_MESSAGES = [
  "Make room for ideas...",
  "Sharpening graphite pencils...",
  "Binding 80 GSM smooth sheets...",
  "Calibrating drafting compasses...",
  "Preparing your stationery order...",
];

export function LogoLoader({
  size = "md",
  label,
  variant = "inline",
  className = "",
}: LogoLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (label) return;
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [label]);

  const sizeStyles = {
    sm: {
      box: "h-9 w-9 text-base rounded-md",
      dot: "h-2 w-2 -top-0.5 -right-0.5",
      orbit: "h-12 w-12",
      text: "text-xs",
    },
    md: {
      box: "h-14 w-14 text-2xl rounded-xl",
      dot: "h-3 w-3 -top-1 -right-1",
      orbit: "h-18 w-18",
      text: "text-sm",
    },
    lg: {
      box: "h-20 w-20 text-4xl rounded-2xl",
      dot: "h-4 w-4 -top-1.5 -right-1.5",
      orbit: "h-26 w-26",
      text: "text-base",
    },
    xl: {
      box: "h-28 w-28 text-5xl rounded-3xl",
      dot: "h-5 w-5 -top-2 -right-2",
      orbit: "h-36 w-36",
      text: "text-lg",
    },
  }[size];

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Animated Logo Container with Concentric Orbit Rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer Orbit Glow Ring (Acid Lime & Soft Lilac) */}
        <div
          className={`absolute rounded-full border-2 border-dashed border-[#D7F05A] opacity-75 animate-spin ${sizeStyles.orbit}`}
          style={{ animationDuration: "5s" }}
        />

        {/* Counter-rotating Accent Ring (Persimmon) */}
        <div
          className={`absolute rounded-full border-2 border-t-[#F16A45] border-r-transparent border-b-transparent border-l-[#F16A45]/30 animate-spin ${sizeStyles.orbit}`}
          style={{ animationDuration: "2.2s", animationDirection: "reverse" }}
        />

        {/* Central PAPR Monogram Tile */}
        <div
          className={`relative z-10 flex items-center justify-center bg-[#302033] font-sans font-black text-[#D7F05A] shadow-xl border border-[#D7F05A]/30 transition-all ${sizeStyles.box}`}
        >
          {/* Logo P with subtle scale pulse */}
          <span className="inline-block animate-pulse">P</span>

          {/* Bouncing Signature Persimmon Accent Dot */}
          <span
            className={`absolute rounded-full bg-[#F16A45] shadow-sm ring-2 ring-[#F7F5EF] animate-ping ${sizeStyles.dot}`}
            style={{ animationDuration: "1.4s" }}
          />
          <span
            className={`absolute rounded-full bg-[#F16A45] ring-2 ring-[#F7F5EF] ${sizeStyles.dot}`}
          />
        </div>
      </div>

      {/* Brand Typography & Status Message */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 font-sans font-black tracking-tight text-[#302033]">
          <span className="text-sm uppercase tracking-widest font-black">PAPR</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#F16A45]" />
          <span className="text-[10px] uppercase font-bold text-[#6F6273] tracking-wider">
            STUDIOS
          </span>
        </div>
        <p
          className={`font-sans font-bold text-[#6F6273] transition-all duration-300 ${sizeStyles.text}`}
        >
          {label || DEFAULT_MESSAGES[msgIndex]}
        </p>

        {/* Triple Animated Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#D7F05A] animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#302033] animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#F16A45] animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F5EF]/95 backdrop-blur-md transition-opacity">
        {content}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#F7F5EF]/85 backdrop-blur-xs rounded-xl">
        {content}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center rounded-2xl border border-[#EDE9E1] bg-white p-8 shadow-xs">
        {content}
      </div>
    );
  }

  return content;
}
