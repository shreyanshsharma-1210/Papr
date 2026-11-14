import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight } from "lucide-react";
import { KIT_IMAGES } from "@/lib/product-images";

export const Route = createFileRoute("/class-kits/")({
  component: ClassKitsDirectory,
});

const STREAMS = ["Science", "Commerce", "Arts"] as const;

function ClassKitsDirectory() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 space-y-12 bg-[#F7F5EF]">
      {/* Directory Header with Kit Hero Banner */}
      <div className="relative overflow-hidden rounded-md border-2 border-[#302033] bg-white p-6 sm:p-10 shadow-sm">
        <div className="grid gap-6 md:grid-cols-12 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9E1] px-3 py-1 text-xs font-bold text-[#302033] border border-[#302033]/15">
              <BookOpen className="h-3.5 w-3.5 text-[#F16A45]" /> PAPR Academic Desk
            </div>
            <h1 className="font-sans font-black text-3xl sm:text-5xl text-[#302033] tracking-tight">
              School Class Kits
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#6F6273] leading-relaxed max-w-lg">
              One verified kit per class. Prescribed board textbooks, premium notebooks, and
              syllabus tools packaged together with an automatic 8% bundle saving.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-bold text-[#302033]">
              <span className="rounded bg-[#D7F05A] px-2 py-0.5 text-[#302033] font-black border border-[#302033]/20">
                8% Automatic Saving
              </span>
              <span>&middot;</span>
              <span>Classes 1 through 12</span>
            </div>
          </div>
          <div className="md:col-span-4 aspect-[4/3] overflow-hidden rounded-xl border border-[#EDE9E1] shadow-xs">
            <img
              src={KIT_IMAGES.schoolKitFlatlay}
              alt="School Class Kit Stationery"
              width={400}
              height={300}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Primary & Middle: Classes 1 to 10 */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E1]">
          <h2 className="font-sans text-xs uppercase tracking-wider font-black text-[#302033]">
            Classes 1 through 10
          </h2>
          <span className="text-[11px] font-bold text-[#6F6273]">General Board Syllabus</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
            <Link
              key={cls}
              to="/class-kits/$classId"
              params={{ classId: String(cls) }}
              preload="intent"
              className="group flex items-center justify-between rounded-xl border border-[#EDE9E1] bg-white p-4 transition-all hover:border-[#302033] hover:shadow-sm"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
                  Class
                </span>
                <div className="font-sans font-black text-3xl text-[#302033] group-hover:text-[#F16A45] transition-colors">
                  {cls}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#6F6273] group-hover:text-[#302033] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Senior Secondary: Classes 11 & 12 by Stream */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E1]">
          <h2 className="font-sans text-xs uppercase tracking-wider font-black text-[#302033]">
            Classes 11 &amp; 12 &mdash; Academic Streams
          </h2>
          <span className="text-[11px] font-bold text-[#6F6273]">
            Specialized Board Syllabus Kits
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {STREAMS.map((stream) => (
            <div key={stream} className="rounded-md border border-[#EDE9E1] bg-white p-5 space-y-3">
              <span className="inline-block rounded bg-[#C9B9E8]/30 px-2.5 py-0.5 text-xs font-bold text-[#302033]">
                {stream} Stream
              </span>
              <p className="text-xs text-[#6F6273]">
                Core subject textbooks, practical observation files, and graph notebooks for{" "}
                {stream}.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#EDE9E1]">
                <Link
                  to="/class-kits/$classId"
                  params={{ classId: `11-${stream.toLowerCase()}` }}
                  preload="intent"
                  className="rounded-xl bg-[#EDE9E1] px-3 py-1.5 text-xs font-black text-[#302033] hover:bg-[#D7F05A] transition-colors"
                >
                  Class 11
                </Link>
                <Link
                  to="/class-kits/$classId"
                  params={{ classId: `12-${stream.toLowerCase()}` }}
                  preload="intent"
                  className="rounded-xl bg-[#302033] px-3 py-1.5 text-xs font-black text-[#F7F5EF] hover:bg-[#302033]/90 transition-colors"
                >
                  Class 12
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
