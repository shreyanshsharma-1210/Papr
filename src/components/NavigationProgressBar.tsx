import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function NavigationProgressBar() {
  const isLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading,
  });

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);
      setProgress(25);

      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) return prev;
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 150);
    } else {
      setProgress(100);
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [isLoading]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Sleek Gradient Top Line */}
      <div
        className="h-1 bg-gradient-to-r from-[#D7F05A] via-[#F3E6A2] to-[#F16A45] shadow-[0_0_12px_#D7F05A] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Floating Animated PAPR Monogram Micro-Pill when route is streaming */}
      {visible && progress < 100 && (
        <div className="absolute right-4 top-3 flex items-center gap-2 rounded-full border border-[#EDE9E1] bg-white/90 px-3 py-1 shadow-md backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <span className="relative flex h-4 w-4 items-center justify-center rounded bg-[#302033] font-sans text-[10px] font-black text-[#D7F05A]">
            P
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#F16A45] animate-ping" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#302033]">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
}
