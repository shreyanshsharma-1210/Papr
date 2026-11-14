export type ProductCategory =
  | "school"
  | "college"
  | "notebooks"
  | "writing"
  | "office"
  | "art-craft";

export interface Category {
  id: ProductCategory | string;
  name: string;
  description: string;
  label?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: ProductCategory | string;
  description?: string;
  mrp: number;
  price: number;
  image?: string;
  inStock: boolean;
  stockQuantity?: number;
  sameDay?: boolean;
  tag?: string;
}

export interface KitItem {
  productId: string;
  qty: number;
  required: boolean;
  note?: string;
}

export interface ClassKit {
  id: string;
  classNumber: number; // 1..12
  stream?: "Science" | "Commerce" | "Arts";
  title: string;
  badge: string;
  bundlePrice: number;
  items: KitItem[];
}

export interface CollegeBranch {
  id: string;
  name: string;
  group: string;
}

export interface College {
  id: string;
  name: string;
  short: string;
  city?: string;
  branches: CollegeBranch[];
}

export interface CollegeKit {
  id: string;
  collegeId: string;
  branchId: string;
  year: 1 | 2 | 3 | 4;
  title: string;
  bundlePrice: number;
  expectedDelivery: string;
  items: KitItem[];
}

export interface PrintSpecs {
  fileName: string;
  fileUrl?: string;
  fileSizeBytes?: number;
  pages: number;
  copies: number;
  color: "bw" | "color";
  sided: "single" | "duplex";
  size: "A4" | "A3";
  binding: "none" | "staple" | "spiral" | "hardbound" | "file";
  delivery: "deliver" | "pickup";
  paperQuality?: "standard-75gsm" | "executive-100gsm";
}

export type CartLine =
  | { kind: "product"; productId: string; qty: number }
  | { kind: "classKit"; kitId: string; itemOverrides: Record<string, number> }
  | { kind: "collegeKit"; kitId: string; itemOverrides: Record<string, number> }
  | { kind: "printing"; jobId: string; estimate: number; summary: string; specs: PrintSpecs };

export interface ShippingAddress {
  name: string;
  phone: string;
  line: string;
  pincode: string;
  city: string;
  state: string;
  landmark?: string;
  type: "Home" | "Hostel/PG" | "College" | "Office";
}

export type OrderStatus =
  | "New"
  | "Processing"
  | "Printed"
  | "Dispatched"
  | "Delivered"
  | "Cancelled";
export type PaymentMethod = "cod" | "upi" | "razorpay" | "card";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  title: string;
  kind: "product" | "classKit" | "collegeKit" | "printing";
  productId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specsSummary?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  total: number;
  subtotal: number;
  discount: number;
  savings?: number;
  deliveryFee: number;
  tax: number;
  taxAmount?: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  slot: string;
  deliverySlot?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "customer" | "admin";
  schoolOrCollege?: string;
  classOrBranch?: string;
  savedAddresses?: ShippingAddress[];
}

export interface BulkQuoteRequest {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  requirements: string;
  estimatedUnits: number;
  status: "new" | "reviewed" | "contacted" | "closed";
  createdAt: string;
}
