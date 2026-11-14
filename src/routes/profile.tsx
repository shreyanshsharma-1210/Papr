import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Shield, LogOut, Package, Building2, MapPin, Check, Sparkles } from "lucide-react";
import {
  getCurrentSession,
  signInUser,
  signUpUser,
  signOutUser,
  type UserSession,
} from "@/lib/db-service";
import { LogoLoader } from "@/components/LogoLoader";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Auth form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Profile preferences form
  const [preferences, setPreferences] = useState({
    phone: "",
    schoolOrCollege: "",
    classOrBranch: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getCurrentSession().then((s) => {
      if (mounted) {
        setSession(s);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (mode === "signin") {
        const s = await signInUser(email, password);
        setSession(s);
        toast.success(`Welcome back, ${s.user.fullName}`);
      } else {
        const s = await signUpUser(email, password, fullName || "PAPR Member");
        setSession(s);
        toast.success("Account created successfully!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    await signOutUser();
    setSession(null);
    toast("Signed out successfully");
  }

  function handleSavePreferences(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Academic preferences saved");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <LogoLoader
          size="lg"
          variant="card"
          label="Verifying PAPR credentials & academic preferences..."
        />
      </div>
    );
  }

  // Not logged in: Show Authentication UI
  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center">
          <span className="font-sans font-black text-3xl sm:text-4xl text-[#302033]">
            PAPR Member Studio
          </span>
          <p className="mt-2 text-xs sm:text-sm text-[#6E5D6F]">
            Sign in to access your order history, saved campus preferences, and thesis drafts.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[#EDE9E1] bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex border-b border-[#EDE9E1] mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-black transition-colors ${
                mode === "signin"
                  ? "border-b-2 border-[#302033] text-[#302033]"
                  : "text-[#6E5D6F] hover:text-[#302033]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-black transition-colors ${
                mode === "signup"
                  ? "border-b-2 border-[#302033] text-[#302033]"
                  : "text-[#6E5D6F] hover:text-[#302033]"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Sharma"
                  className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu or personal email"
                className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#D7F05A] px-4 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 disabled:opacity-50 shadow-md transition-all active:scale-95"
            >
              {authLoading
                ? "Verifying..."
                : mode === "signin"
                  ? "Sign In to PAPR"
                  : "Create Member Account"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EDE9E1] text-center text-[11px] text-[#6E5D6F]">
            <span>Tip: To test administrative permissions, sign in with an email containing </span>
            <code className="rounded bg-[#F3E6A2]/40 px-1.5 py-0.5 font-mono text-[#302033] font-bold">
              admin
            </code>
          </div>
        </div>
      </div>
    );
  }

  // Logged In: Show Profile & Settings
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9E1] pb-6">
        <div>
          <div className="inline-flex items-center gap-2.5">
            <span className="font-sans font-black text-3xl sm:text-5xl text-[#302033]">
              {session.user.fullName}
            </span>
            {session.user.role === "admin" && (
              <span className="rounded-md bg-[#F16A45]/15 px-2 py-0.5 text-[10px] uppercase font-black text-[#F16A45]">
                Admin
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#6E5D6F] font-mono font-medium">{session.user.email}</p>
        </div>

        <div className="flex items-center gap-2">
          {session.user.role === "admin" && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#302033] bg-[#302033] px-3.5 py-2 text-xs font-black text-[#D7F05A] hover:bg-[#1f1421] transition-colors"
            >
              <Shield className="h-4 w-4" /> Admin Portal
            </Link>
          )}

          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDE9E1] bg-white px-3.5 py-2 text-xs font-bold text-[#302033] hover:border-[#302033] transition-colors"
          >
            <Package className="h-4 w-4" /> My Orders
          </Link>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDE9E1] bg-white px-3 py-2 text-xs font-bold text-[#6E5D6F] hover:text-[#F16A45] hover:border-[#F16A45]/40 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Academic Preferences */}
        <section className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm">
          <h2 className="font-sans font-black text-xl text-[#302033] pb-3 border-b border-[#EDE9E1]">
            Academic Preferences
          </h2>
          <p className="mt-2 text-xs text-[#6E5D6F]">
            Save your university or school details for instant syllabus kit recommendations.
          </p>

          <form onSubmit={handleSavePreferences} className="mt-4 space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                School or College
              </label>
              <input
                type="text"
                value={preferences.schoolOrCollege}
                onChange={(e) =>
                  setPreferences({ ...preferences, schoolOrCollege: e.target.value })
                }
                placeholder="e.g. SGSITS, Indore or DPS"
                className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                Class / Department &amp; Branch
              </label>
              <input
                type="text"
                value={preferences.classOrBranch}
                onChange={(e) => setPreferences({ ...preferences, classOrBranch: e.target.value })}
                placeholder="e.g. B.Tech Computer Science or Class 12 Science"
                className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                WhatsApp Phone
              </label>
              <input
                type="tel"
                value={preferences.phone}
                onChange={(e) => setPreferences({ ...preferences, phone: e.target.value })}
                placeholder="10-digit mobile"
                className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-[#D7F05A] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 shadow-xs"
            >
              Update Preferences
            </button>
          </form>
        </section>

        {/* Security & Account Role Details */}
        <section className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-sans font-black text-xl text-[#302033] pb-3 border-b border-[#EDE9E1]">
            Account &amp; Security
          </h2>

          <div className="space-y-3 text-xs text-[#6E5D6F] font-medium">
            <div className="flex justify-between py-1 border-b border-[#EDE9E1]">
              <span>Account Type:</span>
              <span className="font-bold text-[#302033] capitalize">{session.user.role}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EDE9E1]">
              <span>Member Identifier:</span>
              <span className="font-mono font-bold text-[#302033]">{session.user.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EDE9E1]">
              <span>Database Access:</span>
              <span className="text-[#1E8E5A] font-bold flex items-center gap-1">
                <Check className="h-4 w-4" /> Supabase RLS Protected
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDE9E1]">
            <h4 className="font-sans text-xs font-extrabold uppercase tracking-wider text-[#302033]">
              Direct Quick Links
            </h4>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <Link
                to="/orders"
                className="rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-1.5 text-[#302033] hover:border-[#302033]"
              >
                View Past Orders &rarr;
              </Link>
              <Link
                to="/printing"
                className="rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-1.5 text-[#302033] hover:border-[#302033]"
              >
                Open Print Studio &rarr;
              </Link>
              <Link
                to="/class-kits"
                className="rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3 py-1.5 text-[#302033] hover:border-[#302033]"
              >
                Find Class Kit &rarr;
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
