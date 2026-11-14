import type { Product, ClassKit, College, CollegeKit, Category } from "./types";
import { PRODUCT_IMAGES } from "./product-images";

export const CATEGORIES: Category[] = [
  {
    id: "all",
    name: "All Essentials",
    description: "Everyday tools for work, study and creative practice",
  },
  {
    id: "notebooks",
    name: "Paper & Notebooks",
    description: "Archival grid pads, Smyth-sewn journals & spiral binders",
  },
  {
    id: "writing",
    name: "Fine Writing",
    description: "Precision fineliners, Japanese gel pens & drafting pencils",
  },
  {
    id: "school",
    name: "School Essentials",
    description: "Curated textbooks, notebooks, geometry sets & school supplies",
  },
  {
    id: "college",
    name: "College & University",
    description: "Lab manuals, practical hardbound files, scientific instruments",
  },
  {
    id: "office",
    name: "Office & Workspace",
    description: "Desk trays, solid brass clips, archiving files & markers",
  },
  {
    id: "art-craft",
    name: "Art & Design",
    description: "Bristol boards, sketch pads, technical drafting pens",
  },
];

const RAW_PRODUCTS: Product[] = [
  {
    id: "p-nb-200",
    name: "A4 Spiral Notebook 200 Pages (80 GSM)",
    brand: "Classmate Pulse",
    category: "notebooks",
    description:
      "Smooth bright white paper with micro-perforated sheets and snag-free twin wire binding.",
    mrp: 190,
    price: 159,
    inStock: true,
    stockQuantity: 120,
    sameDay: true,
    tag: "Bestseller",
  },
  {
    id: "p-nb-100",
    name: "Single Line Classic Notebook 120 Pages",
    brand: "Navneet Youva",
    category: "notebooks",
    description: "Premium chlorine-free paper, staple-bound with reinforced spine tape.",
    mrp: 85,
    price: 65,
    inStock: true,
    stockQuantity: 200,
    sameDay: true,
  },
  {
    id: "p-nb-grid",
    name: "Minimalist Dot Grid Journal (100 GSM)",
    brand: "PAPR Edition",
    category: "notebooks",
    description:
      "Lay-flat binding, off-white bamboo paper, designed for daily project notes and bullet journaling.",
    mrp: 350,
    price: 280,
    inStock: true,
    stockQuantity: 80,
    sameDay: true,
    tag: "Staff Pick",
  },
  {
    id: "p-pen-blue",
    name: "Precision 0.7mm Ball Pen (Pack of 5)",
    brand: "Reynolds Jetter",
    category: "writing",
    description: "Ultra-smooth low viscosity ink for fatigue-free extended examination writing.",
    mrp: 60,
    price: 50,
    inStock: true,
    stockQuantity: 300,
    sameDay: true,
    tag: "Essential",
  },
  {
    id: "p-pen-gel",
    name: "Japanese 0.5mm Archival Gel Pen (Black)",
    brand: "Uni-ball Signo",
    category: "writing",
    description: "Waterproof, fade-resistant pigment ink with stainless steel tip.",
    mrp: 90,
    price: 75,
    inStock: true,
    stockQuantity: 150,
    sameDay: true,
  },
  {
    id: "p-pencil",
    name: "Matte Black Graphite Pencils 2B (Pack of 10)",
    brand: "Apsara Platinum",
    category: "writing",
    description: "Dark, smooth lead ideal for drafting, sketching, and standardized exam sheets.",
    mrp: 70,
    price: 60,
    inStock: true,
    stockQuantity: 250,
    sameDay: true,
  },
  {
    id: "p-geo",
    name: "Precision Mathematical Drawing Set",
    brand: "Camlin Premier",
    category: "school",
    description:
      "Self-centering die-cast compass and divider, transparent acrylic bevelled rulers.",
    mrp: 280,
    price: 220,
    inStock: true,
    stockQuantity: 90,
    sameDay: true,
  },
  {
    id: "p-ruler",
    name: "Stainless Steel 30cm Metric Scale",
    brand: "PAPR Studio",
    category: "office",
    description: "Laser-etched markings with anti-slip cork backing and conversion tables.",
    mrp: 95,
    price: 75,
    inStock: true,
    stockQuantity: 110,
    sameDay: true,
  },
  {
    id: "p-eraser",
    name: "Dust-Free Archival Eraser & Sharpener",
    brand: "Faber-Castell",
    category: "school",
    description: "Phthalate-free eraser leaves minimal residue; dual magnesium sharpener.",
    mrp: 50,
    price: 35,
    inStock: true,
    stockQuantity: 300,
    sameDay: true,
  },
  {
    id: "p-cover",
    name: "Heavy Duty Brown Book Cover Roll (10m)",
    brand: "PAPR Craft",
    category: "school",
    description: "120 GSM recycled Kraft paper roll with printed label guides.",
    mrp: 80,
    price: 60,
    inStock: true,
    stockQuantity: 180,
    sameDay: true,
  },
  {
    id: "p-label",
    name: "Adhesive Name Labels (Pack of 60)",
    brand: "PAPR Studio",
    category: "school",
    description:
      "Matte uncoated paper stickers, accepts both fountain and gel pen ink without smudging.",
    mrp: 60,
    price: 45,
    inStock: true,
    stockQuantity: 200,
    sameDay: true,
  },
  {
    id: "p-calc",
    name: "Scientific Calculator FX-991CW ClassWiz",
    brand: "Casio",
    category: "college",
    description:
      "540+ functions, natural textbook display, approved for university engineering board exams.",
    mrp: 1695,
    price: 1349,
    inStock: true,
    stockQuantity: 45,
    sameDay: true,
    tag: "Academic Essential",
  },
  {
    id: "p-lab-physics",
    name: "Senior Physics Laboratory Practical Manual",
    brand: "Navneet Scholar",
    category: "school",
    description:
      "CBSE syllabus experiments with observation tables, graph sheets and viva voce guide.",
    mrp: 240,
    price: 195,
    inStock: true,
    stockQuantity: 75,
  },
  {
    id: "p-lab-chem",
    name: "Comprehensive Chemistry Lab Record Book",
    brand: "Navneet Scholar",
    category: "school",
    description: "Acid-free ruled sheets with salt analysis tables and safety protocol sheets.",
    mrp: 240,
    price: 195,
    inStock: true,
    stockQuantity: 75,
  },
  {
    id: "p-prac-file",
    name: "Hardbound Deluxe Practical Record File",
    brand: "Solo Executive",
    category: "college",
    description: "Heavy board cover with stainless spring clips, index sheet and ribbon marker.",
    mrp: 180,
    price: 145,
    inStock: true,
    stockQuantity: 160,
    sameDay: true,
  },
  {
    id: "p-drafter",
    name: "Engineers Mini Drafter with Canvas Bag",
    brand: "Omega Pro",
    category: "college",
    description: "Heavy metal clamp with unbreakable scale arms and 360-degree protractor head.",
    mrp: 950,
    price: 790,
    inStock: true,
    stockQuantity: 35,
    tag: "Engineering",
  },
  {
    id: "p-marker",
    name: "Chisel Tip Dry Erase Whiteboard Markers (Pack of 4)",
    brand: "Camlin White",
    category: "office",
    description: "Low odor, alcohol-based non-toxic ink with vivid bold colors and easy wipe off.",
    mrp: 140,
    price: 110,
    inStock: true,
    stockQuantity: 95,
    sameDay: true,
  },
  {
    id: "p-highlighter",
    name: "Pastel Textliner Soft Set (6 Subtle Tones)",
    brand: "Faber-Castell",
    category: "writing",
    description:
      "Water-based pastel inks that do not bleed through notebook pages or textbook paper.",
    mrp: 295,
    price: 240,
    inStock: true,
    stockQuantity: 120,
    sameDay: true,
    tag: "Staff Pick",
  },
  {
    id: "p-exam-pad",
    name: "Heavy Aluminum Exam Clipboard with Ruler Lip",
    brand: "Solo Pro",
    category: "school",
    description:
      "Rigid anodized aluminum sheet with ergonomic spring clip and protective corner guards.",
    mrp: 220,
    price: 175,
    inStock: true,
    stockQuantity: 85,
    sameDay: true,
  },
  {
    id: "p-desk-tray",
    name: "Stackable Powder-Coated Metal Desk Tray",
    brand: "PAPR Workspace",
    category: "office",
    description: "Solid metal desk organizer for A4 paperwork, project files and notebooks.",
    mrp: 450,
    price: 360,
    inStock: true,
    stockQuantity: 40,
    sameDay: true,
    tag: "New Arrival",
  },
  {
    id: "p-clips",
    name: "Brass Wire Binder Clips Set (Box of 24)",
    brand: "PAPR Studio",
    category: "office",
    description: "Architectural minimalist wire clips in matte black and natural brass finishes.",
    mrp: 180,
    price: 140,
    inStock: true,
    stockQuantity: 90,
    sameDay: true,
  },
  {
    id: "p-tape",
    name: "Reinforced Linen Spine Binding Tape (2-inch)",
    brand: "PAPR Bindery",
    category: "office",
    description: "Heavy cotton linen adhesive tape for binding dissertations, ledgers and reports.",
    mrp: 160,
    price: 125,
    inStock: true,
    stockQuantity: 60,
    sameDay: true,
  },
  // Textbooks
  {
    id: "tb-1",
    name: "Class 1 Complete NCERT Textbook Set",
    brand: "NCERT",
    category: "school",
    mrp: 650,
    price: 580,
    inStock: true,
    stockQuantity: 50,
  },
  {
    id: "tb-5",
    name: "Class 5 Complete NCERT Textbook Set",
    brand: "NCERT",
    category: "school",
    mrp: 950,
    price: 860,
    inStock: true,
    stockQuantity: 50,
  },
  {
    id: "tb-8",
    name: "Class 8 Complete NCERT Textbook Set",
    brand: "NCERT",
    category: "school",
    mrp: 1350,
    price: 1190,
    inStock: true,
    stockQuantity: 40,
  },
  {
    id: "tb-10",
    name: "Class 10 Board Exam Complete Textbook Set",
    brand: "NCERT",
    category: "school",
    mrp: 1650,
    price: 1480,
    inStock: true,
    stockQuantity: 60,
    tag: "Board Exam",
  },
  {
    id: "tb-12-sci",
    name: "Class 12 Science PCB/PCM Textbook Set",
    brand: "NCERT",
    category: "school",
    mrp: 2400,
    price: 2150,
    inStock: true,
    stockQuantity: 45,
    tag: "Class 12",
  },
  {
    id: "tb-12-com",
    name: "Class 12 Commerce Textbook Set",
    brand: "NCERT",
    category: "school",
    mrp: 2100,
    price: 1890,
    inStock: true,
    stockQuantity: 40,
    tag: "Class 12",
  },
  {
    id: "tb-12-arts",
    name: "Class 12 Humanities & Arts Textbook Set",
    brand: "NCERT",
    category: "school",
    mrp: 1950,
    price: 1750,
    inStock: true,
    stockQuantity: 30,
    tag: "Class 12",
  },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  image:
    PRODUCT_IMAGES[p.id] ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
}));

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

const baseSchoolItems = [
  { productId: "p-nb-200", qty: 4, required: false },
  { productId: "p-nb-100", qty: 6, required: true },
  { productId: "p-pen-blue", qty: 2, required: true },
  { productId: "p-pencil", qty: 1, required: true },
  { productId: "p-eraser", qty: 1, required: true },
  { productId: "p-ruler", qty: 1, required: true },
  { productId: "p-cover", qty: 1, required: false },
  { productId: "p-label", qty: 1, required: false },
];

function pickTextbook(cls: number, stream?: "Science" | "Commerce" | "Arts") {
  if (cls === 12) {
    if (stream === "Commerce") return "tb-12-com";
    if (stream === "Arts") return "tb-12-arts";
    return "tb-12-sci";
  }
  if (cls >= 9) return "tb-10";
  if (cls >= 6) return "tb-8";
  if (cls >= 3) return "tb-5";
  return "tb-1";
}

export function buildClassKit(cls: number, stream?: "Science" | "Commerce" | "Arts"): ClassKit {
  const items = [
    {
      productId: pickTextbook(cls, stream),
      qty: 1,
      required: true,
      note: "Prescribed board syllabus text",
    },
    ...baseSchoolItems,
  ];
  if (cls >= 6)
    items.push({ productId: "p-geo", qty: 1, required: true, note: "Mathematical geometry box" });
  if (cls >= 9)
    items.push({
      productId: "p-exam-pad",
      qty: 1,
      required: false,
      note: "Standard examination board",
    });
  if (cls === 12 && stream === "Science") {
    items.push({
      productId: "p-calc",
      qty: 1,
      required: true,
      note: "Engineering scientific calculator",
    });
    items.push({
      productId: "p-lab-physics",
      qty: 1,
      required: true,
      note: "Senior physics laboratory manual",
    });
    items.push({
      productId: "p-lab-chem",
      qty: 1,
      required: true,
      note: "Senior chemistry laboratory record",
    });
  }

  const total = items.reduce((s, i) => {
    const p = findProduct(i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  const bundlePrice = Math.round(total * 0.92);

  const streamSuffix = stream ? ` (${stream})` : "";
  return {
    id: `class-${cls}${stream ? "-" + stream.toLowerCase() : ""}`,
    classNumber: cls,
    stream,
    title: `Class ${cls}${streamSuffix} Curated Kit`,
    badge: "Verified Board Syllabus Bundle — PAPR Academic",
    bundlePrice,
    items,
  };
}

export const COLLEGES: College[] = [
  {
    id: "prestige",
    name: "Prestige Institute of Management & Research",
    short: "Prestige",
    branches: [
      { id: "bba", name: "BBA (Bachelor of Business Administration)", group: "Management" },
      { id: "bcom", name: "B.Com (Honours)", group: "Commerce" },
      { id: "mba", name: "MBA (Finance & Marketing)", group: "Management" },
    ],
  },
  {
    id: "sgsits",
    name: "Shri Govindram Seksaria Institute of Technology and Science",
    short: "SGSITS",
    branches: [
      { id: "cse", name: "Computer Science & Engineering", group: "Engineering" },
      { id: "it", name: "Information Technology", group: "Engineering" },
      { id: "mech", name: "Mechanical Engineering", group: "Engineering" },
      { id: "civil", name: "Civil Engineering", group: "Engineering" },
    ],
  },
  {
    id: "medicaps",
    name: "Medi-Caps University",
    short: "Medi-Caps",
    branches: [
      { id: "cse", name: "Computer Science & Engineering", group: "Engineering" },
      { id: "ec", name: "Electronics & Communication", group: "Engineering" },
      { id: "pharma", name: "Bachelor of Pharmacy (B.Pharm)", group: "Pharmacy" },
    ],
  },
  {
    id: "davv",
    name: "Devi Ahilya Vishwavidyalaya",
    short: "DAVV",
    branches: [
      { id: "bsc", name: "B.Sc Computer Science", group: "Science" },
      { id: "bcom", name: "B.Com Professional", group: "Commerce" },
      { id: "ba", name: "B.A Economics & Humanities", group: "Arts" },
    ],
  },
  {
    id: "iet-davv",
    name: "Institute of Engineering & Technology (IET DAVV)",
    short: "IET DAVV",
    branches: [
      { id: "cse", name: "Computer Engineering", group: "Engineering" },
      { id: "it", name: "Information Technology", group: "Engineering" },
    ],
  },
];

export function buildCollegeKit(
  collegeId: string,
  branchId: string,
  year: 1 | 2 | 3 | 4,
): CollegeKit {
  const college = COLLEGES.find((c) => c.id === collegeId);
  const branch = college?.branches.find((b) => b.id === branchId);
  const isEng = branch?.group === "Engineering";
  const isCommerce = branch?.group === "Commerce" || branch?.group === "Management";

  const items = [
    { productId: "p-nb-200", qty: 6, required: true, note: "Lecture notes & assignments" },
    { productId: "p-pen-blue", qty: 3, required: true },
    { productId: "p-highlighter", qty: 1, required: false },
    { productId: "p-prac-file", qty: 2, required: true, note: "Hardbound submission file" },
  ];

  if (isEng) {
    items.push({ productId: "p-calc", qty: 1, required: true, note: "University board approved" });
    items.push({
      productId: "p-lab-physics",
      qty: 1,
      required: year === 1,
      note: "1st year laboratory manual",
    });
    items.push({
      productId: "p-drafter",
      qty: 1,
      required: year === 1,
      note: "Engineering graphics kit",
    });
  }
  if (isCommerce) {
    items.push({ productId: "p-calc", qty: 1, required: true });
    items.push({ productId: "p-marker", qty: 1, required: false });
  }

  const total = items.reduce((s, i) => {
    const p = findProduct(i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  const bundlePrice = Math.round(total * 0.9);

  return {
    id: `${collegeId}-${branchId}-${year}`,
    collegeId,
    branchId,
    year,
    title: `${college?.short ?? "Campus"} — ${branch?.name.split("(")[0].trim() ?? "Branch"} — Year ${year} Kit`,
    bundlePrice,
    expectedDelivery: "Dispatched within 24 hours · Tracked delivery",
    items,
  };
}
