import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, GraduationCap, ArrowRight, Check, Building2 } from "lucide-react";
import { COLLEGES } from "@/lib/mock-data";
import { KIT_IMAGES } from "@/lib/product-images";
import { submitBulkQuote } from "@/lib/db-service";
import { toast } from "sonner";

export const Route = createFileRoute("/college-kits/")({
  component: CollegeWizard,
});

type Step = 1 | 2 | 3 | 4;

function CollegeWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [year, setYear] = useState<1 | 2 | 3 | 4 | null>(null);
  const [query, setQuery] = useState("");

  // Custom kit request modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    collegeName: "",
    branchName: "",
    studentName: "",
    phone: "",
    email: "",
    booklistNotes: "",
  });
  const [submittingCustom, setSubmittingCustom] = useState(false);

  const college = COLLEGES.find((c) => c.id === collegeId);
  const branch = college?.branches.find((b) => b.id === branchId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COLLEGES;
    return COLLEGES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.short.toLowerCase().includes(q),
    );
  }, [query]);

  function handleFinish() {
    if (!collegeId || !branchId || !year) return;
    navigate({
      to: "/college-kits/$kitId",
      params: { kitId: `${collegeId}-${branchId}-${year}` },
    });
  }

  async function handleCustomKitSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customForm.collegeName || !customForm.studentName || !customForm.phone) {
      toast.error("Please fill in the required fields");
      return;
    }
    setSubmittingCustom(true);
    try {
      await submitBulkQuote({
        organizationName: customForm.collegeName,
        contactPerson: customForm.studentName,
        phone: customForm.phone,
        email: customForm.email || `${customForm.phone}@student.papr.in`,
        requirements: `Branch: ${customForm.branchName}. Syllabus/Booklist details: ${customForm.booklistNotes}`,
        estimatedUnits: 1,
      });
      toast.success(
        "Custom kit request submitted. Our academic team will WhatsApp you within 4 hours.",
      );
      setShowCustomModal(false);
      setCustomForm({
        collegeName: "",
        branchName: "",
        studentName: "",
        phone: "",
        email: "",
        booklistNotes: "",
      });
    } catch {
      toast.error("Submission failed, please try again.");
    } finally {
      setSubmittingCustom(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8 bg-[#F7F5EF]">
      {/* Header with Visual Banner */}
      <div className="relative overflow-hidden rounded-md border-2 border-[#302033] bg-white p-6 sm:p-10 shadow-sm">
        <div className="grid gap-6 md:grid-cols-12 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9E1] px-3 py-1 text-xs font-bold text-[#302033] border border-[#302033]/15">
              <GraduationCap className="h-3.5 w-3.5 text-[#F16A45]" /> University &amp; Higher
              Education
            </div>
            <h1 className="font-sans font-black text-3xl sm:text-5xl text-[#302033] tracking-tight">
              Find Your Campus Kit
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#6F6273] leading-relaxed max-w-lg">
              Four quick steps to your semester essentials. Verified practical manuals, hardbound
              record files, Casio scientific calculators, and engineering drafters tailored for your
              campus.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-bold text-[#302033]">
              <span className="rounded bg-[#D7F05A] px-2 py-0.5 text-[#302033] font-black border border-[#302033]/20">
                10% Bundle Discount
              </span>
              <span>&middot;</span>
              <span>Custom syllabus builder</span>
            </div>
          </div>
          <div className="md:col-span-4 aspect-[4/3] overflow-hidden rounded-xl border border-[#EDE9E1] shadow-xs">
            <img
              src={KIT_IMAGES.collegeKitFlatlay}
              alt="Campus Kit Stationery"
              width={400}
              height={300}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center justify-between border-b border-[#EDE9E1] pb-4">
        {[
          { num: 1, label: "Select College" },
          { num: 2, label: "Branch / Stream" },
          { num: 3, label: "Academic Year" },
          { num: 4, label: "Review Kit" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => {
              if (s.num === 1) setStep(1);
              if (s.num === 2 && collegeId) setStep(2);
              if (s.num === 3 && collegeId && branchId) setStep(3);
              if (s.num === 4 && collegeId && branchId && year) setStep(4);
            }}
            className={`flex items-center gap-2 text-xs font-black transition-colors ${
              step === s.num ? "text-[#302033]" : step > s.num ? "text-[#208B58]" : "text-[#6F6273]"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] font-black ${
                step === s.num
                  ? "bg-[#302033] text-[#D7F05A]"
                  : step > s.num
                    ? "bg-[#D7F05A] text-[#302033]"
                    : "bg-[#EDE9E1] text-[#6F6273]"
              }`}
            >
              {step > s.num ? <Check className="h-3 w-3 stroke-[3]" /> : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step 1: Select College */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6F6273]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by college name, abbreviation (SGSITS, DAVV, IET)..."
              className="w-full rounded-md border border-[#EDE9E1] bg-white pl-10 pr-4 py-3 text-xs font-medium text-[#302033] placeholder:text-[#6F6273] focus:outline-none focus:border-[#302033] focus:ring-2 focus:ring-[#D7F05A]"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCollegeId(c.id);
                  setBranchId(null);
                  setYear(null);
                  setStep(2);
                }}
                className={`flex items-start gap-3 rounded-md border p-4 text-left transition-all cursor-pointer ${
                  collegeId === c.id
                    ? "border-2 border-[#302033] bg-[#F7F5EF] shadow-sm"
                    : "border-[#EDE9E1] bg-white hover:border-[#302033]"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EDE9E1] text-[#302033]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans font-black text-sm text-[#302033]">{c.name}</div>
                  <div className="text-[11px] font-bold text-[#6F6273] mt-0.5">
                    {c.city} &middot; {c.branches.length} Academic Departments
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* College Not Listed Box */}
          <div className="rounded-md border-2 border-dashed border-[#EDE9E1] bg-white p-6 text-center space-y-2 mt-6">
            <h4 className="font-sans font-black text-base text-[#302033]">
              Don't see your college?
            </h4>
            <p className="text-xs text-[#6F6273] max-w-md mx-auto">
              We create custom semester kits for any university syllabus. Send us your department
              booklist and we'll prepare your kit within 4 hours.
            </p>
            <button
              onClick={() => setShowCustomModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[#302033] px-4 py-2 text-xs font-black text-[#D7F05A] hover:bg-[#302033]/90 transition-colors cursor-pointer"
            >
              Request Custom Campus Kit &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Branch */}
      {step === 2 && college && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE9E1]">
            <h3 className="font-sans font-black text-base text-[#302033]">
              {college.name} &mdash; Select Department
            </h3>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-[#F16A45] hover:underline cursor-pointer"
            >
              Change College
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {college.branches.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setBranchId(b.id);
                  setYear(null);
                  setStep(3);
                }}
                className={`rounded-md border p-4 text-left transition-all cursor-pointer ${
                  branchId === b.id
                    ? "border-2 border-[#302033] bg-[#F7F5EF] shadow-sm"
                    : "border-[#EDE9E1] bg-white hover:border-[#302033]"
                }`}
              >
                <div className="font-sans font-black text-sm text-[#302033]">{b.name}</div>
                <div className="text-[11px] font-bold text-[#6F6273] mt-1">
                  4-Year Engineering / Degree Program
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Select Academic Year */}
      {step === 3 && college && branch && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE9E1]">
            <div>
              <h3 className="font-sans font-black text-base text-[#302033]">{branch.name}</h3>
              <p className="text-xs text-[#6F6273]">{college.name}</p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs font-bold text-[#F16A45] hover:underline cursor-pointer"
            >
              Change Branch
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {([1, 2, 3, 4] as const).map((y) => (
              <button
                key={y}
                onClick={() => {
                  setYear(y);
                  setStep(4);
                }}
                className={`rounded-md border p-5 text-center transition-all cursor-pointer ${
                  year === y
                    ? "border-2 border-[#302033] bg-[#F7F5EF] shadow-sm"
                    : "border-[#EDE9E1] bg-white hover:border-[#302033]"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6F6273]">
                  Year
                </div>
                <div className="font-sans font-black text-4xl text-[#302033] my-1">{y}</div>
                <div className="text-[11px] font-bold text-[#6F6273]">
                  {y === 1 ? "Fresher Kits" : `Semester ${y * 2 - 1} & ${y * 2}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Review Selection & Finish */}
      {step === 4 && college && branch && year && (
        <div className="rounded-md border-2 border-[#302033] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <span className="inline-block rounded bg-[#D7F05A] px-2.5 py-0.5 text-xs font-black text-[#302033] border border-[#302033]/20">
              Ready to Customize
            </span>
            <h3 className="mt-3 font-sans font-black text-2xl sm:text-3xl text-[#302033]">
              {college.name} &mdash; {branch.name} (Year {year})
            </h3>
            <p className="mt-1 text-xs text-[#6F6273]">
              Includes standard engineering lab manuals, drawing instruments, practical files, and
              Casio calculator options.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#EDE9E1]">
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 rounded-md bg-[#D7F05A] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] transition-all shadow-sm border border-[#302033]/20 cursor-pointer"
            >
              Configure &amp; View Syllabus Checklist <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setStep(1)}
              className="rounded-md border border-[#EDE9E1] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#302033] hover:border-[#302033] transition-colors cursor-pointer"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Custom Kit Request Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302033]/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-md border-2 border-[#302033] bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="font-sans font-black text-xl text-[#302033]">
              Request Custom Campus Kit
            </h3>
            <p className="text-xs text-[#6F6273] mt-1">
              Tell us your college and department requirements. We will bundle the exact booklist
              and WhatsApp you a direct checkout link with a 10% student discount.
            </p>

            <form onSubmit={handleCustomKitSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#302033]">
                  College / University Name *
                </label>
                <input
                  required
                  type="text"
                  value={customForm.collegeName}
                  onChange={(e) => setCustomForm({ ...customForm, collegeName: e.target.value })}
                  placeholder="e.g. Manipal Institute of Technology"
                  className="mt-1 w-full rounded border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-2 text-xs font-medium text-[#302033] focus:border-[#302033] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#302033]">
                  Branch &amp; Year
                </label>
                <input
                  type="text"
                  value={customForm.branchName}
                  onChange={(e) => setCustomForm({ ...customForm, branchName: e.target.value })}
                  placeholder="e.g. Mechanical Engineering, 2nd Year"
                  className="mt-1 w-full rounded border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-2 text-xs font-medium text-[#302033] focus:border-[#302033] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#302033]">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={customForm.studentName}
                    onChange={(e) => setCustomForm({ ...customForm, studentName: e.target.value })}
                    placeholder="Student name"
                    className="mt-1 w-full rounded border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-2 text-xs font-medium text-[#302033] focus:border-[#302033] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#302033]">
                    WhatsApp Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={customForm.phone}
                    onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="mt-1 w-full rounded border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-2 text-xs font-medium text-[#302033] focus:border-[#302033] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#302033]">
                  Booklist / Specific Supplies Notes
                </label>
                <textarea
                  rows={3}
                  value={customForm.booklistNotes}
                  onChange={(e) => setCustomForm({ ...customForm, booklistNotes: e.target.value })}
                  placeholder="Paste textbook titles, author names, specific calculator or file requirements..."
                  className="mt-1 w-full rounded border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-2 text-xs font-medium text-[#302033] focus:border-[#302033] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EDE9E1]">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="rounded px-4 py-2 text-xs font-bold text-[#6F6273] hover:text-[#302033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCustom}
                  className="rounded bg-[#D7F05A] px-5 py-2 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#cae64c] transition-colors border border-[#302033]/20 cursor-pointer"
                >
                  {submittingCustom ? "Submitting..." : "Submit Custom Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
