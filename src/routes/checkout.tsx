import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, Wallet, Check, AlertCircle, CreditCard, ShieldCheck } from "lucide-react";
import { useCart, lineLabel, linePrice } from "@/lib/cart-store";
import { createOrder, savePrintJob } from "@/lib/db-service";
import { loadRazorpayScript, getRazorpayKey, isRazorpayConfigured } from "@/lib/razorpay";
import { LogoLoader } from "@/components/LogoLoader";
import type { ShippingAddress, PaymentMethod, OrderItem } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

// Common serviceable Indian PIN codes sample list
const KNOWN_EXPRESS_PINS = [
  "452001",
  "452010",
  "452002",
  "452003",
  "452009",
  "110001",
  "400001",
  "560001",
];

function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const total = useCart((s) => s.total());
  const subtotal = useCart((s) => s.subtotal());
  const savings = useCart((s) => s.savings());
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    phone: "",
    line: "",
    pincode: "452001",
    city: "Indore",
    state: "Madhya Pradesh",
    landmark: "",
    type: "Home",
  });

  const [slot, setSlot] = useState<"sameday" | "express" | "standard">("sameday");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const deliveryFee = total >= 499 || total === 0 ? 0 : 49;
  const taxAmount = Math.round(total * 0.05); // 5% GST included in standard pricing
  const grandTotal = total + deliveryFee;

  const isExpressEligible = KNOWN_EXPRESS_PINS.includes(address.pincode.trim());

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-sans font-black text-3xl text-[#302033]">Your Cart is Empty</h1>
        <p className="mt-2 text-xs text-[#6E5D6F]">
          Add products, academic kits or print jobs before checking out.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-xl bg-[#D7F05A] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 shadow-sm transition-all"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  async function handleOrderPlacement(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.line.trim() ||
      !address.pincode.trim()
    ) {
      setErrorMsg("Please complete all required delivery address fields.");
      toast.error("Please complete the required shipping fields");
      return;
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setErrorMsg("Please enter a valid 6-digit Indian PIN code.");
      toast.error("Invalid 6-digit PIN code");
      return;
    }

    if (!/^\d{10}$/.test(address.phone.trim().replace(/\D/g, "").slice(-10))) {
      setErrorMsg("Please enter a valid 10-digit mobile number for dispatch updates.");
      toast.error("Invalid 10-digit phone number");
      return;
    }

    setPlacing(true);

    try {
      // Prepare Order Items
      const orderItems: OrderItem[] = lines.map((l, idx) => ({
        id: `oi-${idx}-${Date.now()}`,
        title: lineLabel(l),
        kind: l.kind,
        productId: l.kind === "product" ? l.productId : undefined,
        quantity: l.kind === "product" ? l.qty : 1,
        unitPrice: linePrice(l),
        totalPrice: linePrice(l),
        specsSummary: l.kind === "printing" ? l.summary : undefined,
      }));

      // If Razorpay is selected
      if (paymentMethod === "razorpay") {
        const razorpayLoaded = await loadRazorpayScript();
        const configured = isRazorpayConfigured();

        if (razorpayLoaded && configured) {
          const options = {
            key: getRazorpayKey(),
            amount: grandTotal * 100, // in paise
            currency: "INR",
            name: "PAPR Studios",
            description: "Stationery, Essentials & Print Fulfilment",
            image: "/images/products/p-nb-200.jpg",
            prefill: {
              name: address.name,
              contact: address.phone,
            },
            notes: {
              deliveryCity: address.city,
              pincode: address.pincode,
            },
            theme: {
              color: "#302033",
            },
            handler: async (response: {
              razorpay_payment_id: string;
              razorpay_order_id?: string;
            }) => {
              const order = await createOrder({
                customerName: address.name,
                customerPhone: address.phone,
                shippingAddress: address,
                status: "New",
                slot,
                deliverySlot: slot,
                paymentMethod: "razorpay",
                paymentStatus: "paid",
                paymentId: response.razorpay_payment_id,
                items: orderItems,
                subtotal,
                discount: savings,
                savings,
                deliveryFee,
                tax: taxAmount,
                taxAmount,
                total: grandTotal,
              });

              // Save print jobs
              for (const l of lines) {
                if (l.kind === "printing" && l.specs) {
                  await savePrintJob({
                    orderId: order.id,
                    specs: l.specs,
                    amount: l.estimate,
                  });
                }
              }

              clear();
              toast.success(`Order ${order.orderNumber || order.id} placed successfully!`);
              navigate({ to: "/orders" });
            },
            modal: {
              ondismiss: () => {
                setPlacing(false);
                toast("Payment was cancelled. You can retry or choose COD.");
              },
            },
          };

          if (typeof window !== "undefined" && window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
            return;
          }
        }
      }

      // COD or Mock/Demo fallback
      const order = await createOrder({
        customerName: address.name,
        customerPhone: address.phone,
        shippingAddress: address,
        status: "New",
        slot,
        deliverySlot: slot,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        items: orderItems,
        subtotal,
        discount: savings,
        savings,
        deliveryFee,
        tax: taxAmount,
        taxAmount,
        total: grandTotal,
      });

      // Save print jobs
      for (const l of lines) {
        if (l.kind === "printing" && l.specs) {
          await savePrintJob({
            orderId: order.id,
            specs: l.specs,
            amount: l.estimate,
          });
        }
      }

      clear();
      toast.success(`Order ${order.orderNumber || order.id} created! Check your order history.`);
      navigate({ to: "/orders" });
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMsg(e.message || "An error occurred while creating your order.");
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      {placing && (
        <LogoLoader
          size="xl"
          variant="fullscreen"
          label={
            paymentMethod === "razorpay"
              ? "Connecting to Razorpay Secure Gateway..."
              : "Securing order with PAPR dispatch studio..."
          }
        />
      )}
      <form
        onSubmit={handleOrderPlacement}
        className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 space-y-8"
      >
        {/* Header */}
        <div className="border-b border-[#EDE9E1] pb-6">
          <span className="font-sans text-[11px] uppercase tracking-wider font-black text-[#F16A45]">
            Secure Fulfilment
          </span>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-[#302033] mt-1">
            Checkout
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Section 1: Address */}
            <section className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#EDE9E1]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#302033] text-xs font-black text-[#D7F05A]">
                  1
                </span>
                <h2 className="font-sans font-black text-lg text-[#302033]">Delivery Address</h2>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    placeholder="Recipient Name"
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    Phone (for Delivery SMS/WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    Street Address / Flat / Hostel *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.line}
                    onChange={(e) => setAddress({ ...address, line: e.target.value })}
                    placeholder="House/Room No, Building name, Street, Landmark"
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    placeholder="6-digit PIN"
                    className="w-full rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-mono font-bold text-[#302033] focus:outline-none focus:border-[#302033]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#302033] uppercase tracking-wider mb-1">
                    City &amp; State
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-1/2 rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                    />
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-1/2 rounded-xl border border-[#EDE9E1] bg-[#F7F5EF] px-3.5 py-2.5 text-xs font-medium text-[#302033] focus:outline-none focus:border-[#302033]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#EDE9E1]">
                <div className="flex items-center gap-2">
                  {(["Home", "Hostel/PG", "College", "Office"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddress({ ...address, type: t })}
                      className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                        address.type === t
                          ? "bg-[#302033] text-[#D7F05A] shadow-xs"
                          : "border border-[#EDE9E1] bg-[#F7F5EF] text-[#6E5D6F] hover:text-[#302033]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {isExpressEligible && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#1E8E5A] font-bold">
                    <Check className="h-3.5 w-3.5" /> Same-day eligible PIN
                  </span>
                )}
              </div>
            </section>

            {/* Section 2: Delivery Speed */}
            <section className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#EDE9E1]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#302033] text-xs font-black text-[#D7F05A]">
                  2
                </span>
                <h2 className="font-sans font-black text-lg text-[#302033]">Delivery Window</h2>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <OptionCard
                  active={slot === "sameday"}
                  onClick={() => setSlot("sameday")}
                  title="Standard Same-Day"
                  sub="Orders placed before 4 PM delivered today by 8 PM"
                />
                <OptionCard
                  active={slot === "express"}
                  onClick={() => setSlot("express")}
                  title="Early Morning Express"
                  sub="Priority morning delivery window (7:00 – 9:00 AM)"
                />
                <OptionCard
                  active={slot === "standard"}
                  onClick={() => setSlot("standard")}
                  title="Scheduled Dispatch"
                  sub="Dispatched securely on the next business day"
                />
              </div>
            </section>

            {/* Section 3: Payment Method */}
            <section className="rounded-2xl border border-[#EDE9E1] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#EDE9E1]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#302033] text-xs font-black text-[#D7F05A]">
                  3
                </span>
                <h2 className="font-sans font-black text-lg text-[#302033]">Payment Method</h2>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OptionCard
                  active={paymentMethod === "razorpay"}
                  onClick={() => setPaymentMethod("razorpay")}
                  title="Razorpay Secure"
                  sub="UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards &amp; NetBanking"
                  badge="Recommended"
                />
                <OptionCard
                  active={paymentMethod === "cod"}
                  onClick={() => setPaymentMethod("cod")}
                  title="Cash on Delivery"
                  sub="Pay in cash or direct UPI to courier on arrival"
                />
              </div>
            </section>

            {errorMsg && (
              <div className="rounded-xl border border-[#F16A45]/30 bg-[#F16A45]/10 p-3.5 text-xs text-[#F16A45] flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <aside className="md:sticky md:top-24 md:self-start space-y-4">
            <div className="rounded-2xl border-2 border-[#302033] bg-white p-6 shadow-md">
              <h3 className="font-sans font-black text-lg text-[#302033] pb-3 border-b border-[#EDE9E1]">
                Order Breakdown
              </h3>

              <div className="mt-3 divide-y divide-[#EDE9E1] max-h-48 overflow-y-auto text-xs">
                {lines.map((l, i) => (
                  <div key={i} className="py-2.5 flex justify-between gap-2">
                    <span className="truncate text-[#6E5D6F] font-medium">{lineLabel(l)}</span>
                    <span className="font-mono text-[#302033] font-bold shrink-0">
                      ₹{linePrice(l)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#EDE9E1] space-y-2 text-xs font-medium">
                <div className="flex justify-between text-[#6E5D6F]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#302033] font-bold">₹{subtotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#1E8E5A] font-bold">
                    <span>Rebates &amp; Bundle Savings</span>
                    <span className="font-mono">-₹{savings}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E5D6F]">
                  <span>Shipping</span>
                  <span className="font-mono text-[#302033] font-bold">
                    {deliveryFee === 0 ? (
                      <span className="text-[#1E8E5A] font-extrabold">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E5D6F]">
                  <span>Included GST (5%)</span>
                  <span className="font-mono text-[#302033] font-bold">₹{taxAmount}</span>
                </div>

                <div className="pt-3 border-t border-[#EDE9E1] flex items-baseline justify-between text-base">
                  <span className="font-sans font-bold text-[#302033]">Final Payable</span>
                  <span className="font-sans font-black text-2xl text-[#302033]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D7F05A] px-4 py-3.5 text-xs font-black uppercase tracking-wider text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 disabled:opacity-60 shadow-md transition-all active:scale-95"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {placing
                    ? "Processing Order..."
                    : paymentMethod === "razorpay"
                      ? `Pay ₹${grandTotal} via Razorpay`
                      : `Confirm Order (Cash on Delivery)`}
                </span>
              </button>

              <p className="mt-3 text-[10px] text-[#6E5D6F] text-center font-medium">
                Protected by 256-bit SSL encryption. GST tax invoice provided with every parcel.
              </p>
            </div>
          </aside>
        </div>
      </form>
    </>
  );
}

function OptionCard({
  active,
  onClick,
  title,
  sub,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border p-4 text-left transition-all ${
        active
          ? "border-2 border-[#302033] bg-[#D7F05A]/15 shadow-sm"
          : "border-[#EDE9E1] bg-white hover:border-[#302033]/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-black text-[#302033]">{title}</span>
        {badge && (
          <span className="rounded-md bg-[#F16A45]/15 px-1.5 py-0.5 text-[9px] font-black text-[#F16A45]">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-1 text-[11px] text-[#6E5D6F] leading-relaxed font-medium">{sub}</p>
    </button>
  );
}
