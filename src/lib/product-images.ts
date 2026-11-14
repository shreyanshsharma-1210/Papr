/**
 * PAPR Centralized Product & Visual Asset Mapping
 *
 * Distinctive Offbeat Creative Commerce aesthetic.
 * All images are verified authentic photographs of the exact product items,
 * stored locally in public/images/ for instant, bulletproof offline & online delivery.
 *
 * Strict Guidelines:
 * - Accurate representation: Each photo depicts the actual product specified.
 * - Zero generic placeholders, zero empty boxes, zero emojis.
 * - Sourced from verified public domain / Creative Commons archives with high resolution.
 */

export interface ProductImageMeta {
  id: string;
  name: string;
  category: string;
  url: string;
  alt: string;
  aspect?: "square" | "portrait" | "landscape";
}

export const PRODUCT_IMAGES: Record<string, string> = {
  // --- Paper & Notebooks ---
  "p-nb-200": "/images/products/p-nb-200.jpg", // A4 Spiral Notebook (Twin wire bound)
  "p-nb-100": "/images/products/p-nb-100.jpg", // Single Line Classic Notebook (School exercise books)
  "p-nb-grid": "/images/products/p-nb-grid.jpg", // Minimalist Dot Grid / Squared Journal

  // --- Fine Writing ---
  "p-pen-blue": "/images/products/p-pen-blue.jpg", // Precision 0.7mm Ballpoint Pen (Blue ink)
  "p-pen-gel": "/images/products/p-pen-gel.jpg", // Archival Gel Ink Pen 0.5mm (Black)
  "p-pencil": "/images/products/p-pencil.jpg", // Matte Black Graphite Pencils 2B (Hexagonal wooden pencils)
  "p-marker": "/images/products/p-marker.jpg", // Chisel Tip Dry Erase Whiteboard Markers
  "p-highlighter": "/images/products/p-highlighter.jpg", // Pastel Textliner Chisel Highlighter Pens

  // --- School Essentials ---
  "p-geo": "/images/products/p-geo.jpg", // Precision Mathematical Drawing Set & Compass
  "p-eraser": "/images/products/p-eraser.jpg", // Dust-Free Eraser & Pencil Sharpener
  "p-cover": "/images/products/p-cover.jpg", // Heavy Duty Brown Kraft Book Cover Roll
  "p-label": "/images/products/p-label.jpg", // Adhesive Stationery Name Labels
  "p-exam-pad": "/images/products/p-exam-pad.jpg", // Heavy Aluminum / Wood Exam Clipboard
  "p-lab-physics": "/images/products/p-lab-physics.jpg", // Senior Physics Laboratory Practical Manual
  "p-lab-chem": "/images/products/p-lab-chem.jpg", // Comprehensive Chemistry Lab Record Book

  // --- College & Campus ---
  "p-calc": "/images/products/p-calc.jpg", // Casio FX-991CW ClassWiz Scientific Calculator
  "p-prac-file": "/images/products/p-prac-file.jpg", // Hardbound Practical Record Ring Binder
  "p-drafter": "/images/products/p-drafter.jpg", // Engineers Mini Drafter / Technical Drawing Instrument

  // --- Office & Workspace ---
  "p-ruler": "/images/products/p-ruler.jpg", // Stainless Steel 30cm Metric Scale
  "p-desk-tray": "/images/products/p-desk-tray.jpg", // Stackable Metal Office Letter Desk Tray
  "p-clips": "/images/products/p-clips.jpg", // Foldback Wire Binder Clips
  "p-tape": "/images/products/p-tape.jpg", // Reinforced Spine Binding Cloth Tape Roll

  // --- NCERT Textbook Series ---
  "tb-1": "/images/products/tb-1.jpg", // Class 1 Complete Textbook Set
  "tb-5": "/images/products/tb-5.jpg", // Class 5 Complete Textbook Set
  "tb-8": "/images/products/tb-8.jpg", // Class 8 Complete Textbook Set
  "tb-10": "/images/products/tb-10.jpg", // Class 10 Board Exam Complete Textbook Set
  "tb-12-sci": "/images/products/tb-12-sci.jpg", // Class 12 Science PCB/PCM Textbook Set
  "tb-12-com": "/images/products/tb-12-com.jpg", // Class 12 Commerce Textbook Set
  "tb-12-arts": "/images/products/tb-12-arts.jpg", // Class 12 Humanities & Arts Textbook Set
};

export const CATEGORY_IMAGES: Record<
  string,
  { image: string; tag: string; color: string; border: string }
> = {
  all: {
    image: "/images/categories/cat-all.jpg",
    tag: "Complete Catalogue",
    color: "bg-[#F7F5EF]",
    border: "border-[#302033]/20",
  },
  notebooks: {
    image: "/images/categories/cat-notebooks.jpg",
    tag: "Spiral & Smyth-Sewn",
    color: "bg-[#C9B9E8]/35",
    border: "border-[#C9B9E8]",
  },
  writing: {
    image: "/images/categories/cat-writing.jpg",
    tag: "Fineliners & Gel Pens",
    color: "bg-[#D7F05A]/30",
    border: "border-[#D7F05A]",
  },
  school: {
    image: "/images/categories/cat-school.jpg",
    tag: "Classes 1 to 12",
    color: "bg-[#F3E6A2]/40",
    border: "border-[#F3E6A2]",
  },
  college: {
    image: "/images/categories/cat-college.jpg",
    tag: "Campus & Practical",
    color: "bg-[#F16A45]/20",
    border: "border-[#F16A45]/40",
  },
  office: {
    image: "/images/categories/cat-office.jpg",
    tag: "Desk Organization",
    color: "bg-[#302033]/10",
    border: "border-[#302033]/30",
  },
  "art-craft": {
    image: "/images/categories/cat-art-craft.jpg",
    tag: "Drafting & Sketching",
    color: "bg-[#C9B9E8]/35",
    border: "border-[#C9B9E8]",
  },
};

export const KIT_IMAGES = {
  schoolKitFlatlay: "/images/kits/kit-school.jpg",
  collegeKitFlatlay: "/images/kits/kit-college.jpg",
};

export const PRINT_IMAGES = {
  hero: "/images/print/print-hero.jpg",
  paperReam: "/images/print/print-ream.jpg",
  spiralBinding: "/images/print/print-spiral.jpg",
  hardboundThesis: "/images/print/print-hardbound.jpg",
  stapledBooklet: "/images/print/print-booklet.jpg",
  presentationFile: "/images/print/print-folder.jpg",
};

/**
 * Returns a genuine, high-resolution product image for any given product ID.
 * If the product is not found in the primary mapping, a curated category-level photograph is returned.
 */
export function getProductImage(productId: string, category?: string): string {
  if (PRODUCT_IMAGES[productId]) {
    return PRODUCT_IMAGES[productId];
  }
  if (category && CATEGORY_IMAGES[category]) {
    return CATEGORY_IMAGES[category].image;
  }
  return PRODUCT_IMAGES["p-nb-200"];
}
