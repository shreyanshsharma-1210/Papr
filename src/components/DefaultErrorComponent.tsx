import { useRouter } from "@tanstack/react-router";

export function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F16A45]/15 border border-[#F16A45]/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#F16A45]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#302033]">Something went wrong</h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6F6273]">
          An unexpected error occurred while loading this view.
        </p>
        {import.meta.env.DEV && error.message && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-white border border-[#EDE9E1] p-3 text-left font-mono text-xs text-[#F16A45]">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-[#D7F05A] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 transition-all shadow-xs"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-[#EDE9E1] bg-white px-4 py-2.5 text-xs font-bold text-[#302033] hover:border-[#302033] transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
