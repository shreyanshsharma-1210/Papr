# PAPR — Design System Update & Creative Commerce Rebranding

**Brand Identity:** PAPR  
**Pronunciation:** *Paper*  
**Descriptor:** Stationery · Essentials · Print  
**Tagline:** Make room for ideas.  
**Creative Direction:** Offbeat Creative Commerce — Playful, bold, design-conscious, contemporary independent stationery store.  
**Date:** November 14, 2026

---

## 1. Creative Direction Overview

PAPR replaces traditional corporate retail and beige luxury stationery templates with an **Offbeat Creative Commerce** visual personality:
- **Bold yet approachable:** Clean white and cream paper textures anchored by heavy plum typography and electric acid lime accents.
- **Design-conscious & authentic:** Every product photography asset depicts the authentic physical stationery item.
- **Zero generic cliches:** Complete deprecation of the cold blue corporate palette, generic software templates, and unrelated stock imagery.

---

## 2. Color System Specifications

| Token | Name | Hex Code | Visual Application & Hierarchy |
| :--- | :--- | :--- | :--- |
| `--color-deep-plum` | **Deep Plum** | `#302033` | Brand monogram, primary headings, top announcement ticker, footer, dark buttons |
| `--color-paper-white` | **Paper White** | `#F7F5EF` | Global background canvas, listing surfaces, card base |
| `--color-acid-lime` | **Acid Lime** | `#D7F05A` | Primary CTAs, active filters, selected categories, cart buttons, interactive highlights |
| `--color-persimmon` | **Persimmon** | `#F16A45` | Discount pills, sale alerts, live ticker accent dot, bundle savings |
| `--color-soft-lilac` | **Soft Lilac** | `#C9B9E8` | Category card backings, creative highlights, kit banners |
| `--color-butter-yellow` | **Butter Yellow** | `#F3E6A2` | Curated kit badges, secondary highlights, educational notes |
| `--color-warm-border` | **Warm Border** | `#EDE9E1` | Subtle divider borders, card strokes, structured grids |

### Accessibility & Contrast Compliance (WCAG 2.1)
- **Deep Plum on Acid Lime:** Contrast ratio **11.8 : 1** (Passes **AAA** for normal text and bold headings).
- **Deep Plum on Paper White:** Contrast ratio **14.1 : 1** (Passes **AAA**).
- **Deep Plum on Butter Yellow:** Contrast ratio **12.3 : 1** (Passes **AAA**).
- **Deep Plum on Soft Lilac:** Contrast ratio **7.6 : 1** (Passes **AAA**).

---

## 3. Brand Assets & Logo Architecture

The brand mark is defined in `src/components/Logo.tsx`:
- **Monogram Icon:** Solid Deep Plum (`#302033`) rounded tile featuring a bold Acid Lime (`#D7F05A`) letter **P** and a signature Persimmon (`#F16A45`) dot.
- **Wordmark:** Bold sans-serif typography (`font-black tracking-tight text-[#302033]`), accompanied by the brand descriptor `STATIONERY · ESSENTIALS · PRINT`.
- **Favicon & Browser Chrome:** Configured in `src/routes/__root.tsx` with high-contrast SVG representation.

---

## 4. Typography & Layout Standards

- **Headings & Accents:** High-impact bold sans-serif (`font-black tracking-tight`), paired with monospace uppercase metadata counters (`font-mono text-[10px] font-bold`).
- **Surface Elevation:** Flat, tactile design language inspired by physical printed stationery. Shadows are restrained (`shadow-xs` and `shadow-sm`) with 1px tactile borders (`border-[#EDE9E1]`).
- **Interactive Buttons:**
  - **Primary Action:** `bg-[#D7F05A] text-[#302033] hover:bg-[#c8e348] border border-[#302033]/20 font-black shadow-sm`
  - **Secondary Action:** `bg-[#302033] text-[#D7F05A] hover:bg-[#1f1421] font-black`
  - **Ghost / Outline:** `border border-[#EDE9E1] bg-white text-[#302033] hover:border-[#302033]`

---

## 5. Storefront & Route Modernization

1. **Header & Global Navigation (`src/components/Header.tsx`):**
   - Deep Plum announcement bar (`#302033`) featuring same-day delivery updates and free shipping notices above ₹499.
   - Clean Paper White header (`#F7F5EF`) with Acid Lime active route pills and Persimmon cart badge counter.
2. **Hero & Homepage (`src/routes/index.tsx`):**
   - Offbeat Creative Commerce hero banner with Acid Lime call-to-action badges.
   - Categorized card grid with Soft Lilac and Butter Yellow highlights.
   - School and College Academic Kit flat-lays with 8% and 10% bundle rebates.
   - Print Studio quick calculator and live pricing preview.
3. **Product Catalogue (`src/routes/shop.tsx`):**
   - Instant search with category pills (`Acid Lime` active state).
   - Uniform `aspect-square` product containers with authentic photographs.
   - Same-day dispatch tags and MRP comparison discount badges.
4. **Academic Class Kits (`src/routes/class-kits.index.tsx` & `class-kits.$classId.tsx`):**
   - Class 1 through 12 grade selector with interactive syllabus checklists.
   - Real-time kit total recalculation when unchecking optional items.
5. **Campus & College Kits (`src/routes/college-kits.index.tsx` & `college-kits.$kitId.tsx`):**
   - 4-step wizard: College &rarr; Degree &rarr; Department &rarr; Semester.
   - Authentic technical gear photography (Casio FX-991CW ClassWiz, Omega Mini Drafter).
6. **Print Studio Interactive Configurator (`src/routes/printing.tsx`):**
   - Real-time binding options (Loose reams, spiral coil, hardbound thesis, saddle-stitch).
   - Dynamic price calculation based on page counts, color choices, and duplex options.
7. **B2B Office & Institution Requisitions (`src/routes/office.tsx`):**
   - Enterprise RFQ submission modal for schools, tuition centers, and corporate desks.
8. **Cart & Secure Checkout (`src/routes/cart.tsx` & `src/routes/checkout.tsx`):**
   - 3-step checkout: Address validation &rarr; Same-day delivery slots &rarr; Razorpay & COD payment.
   - Full GST tax invoice calculation and breakdown.
9. **Order Archive & Tax Invoices (`src/routes/orders.tsx`):**
   - Order history with live fulfilment status badges and downloadable GST-compliant modal invoices.
10. **Operations Console (`src/routes/admin.tsx`):**
    - Live admin dashboard for order fulfilment, print queue tracking, and catalogue CRUD.

---

## 6. Verification & Quality Standards

- **Unit Test Suite:** 6/6 tests passing (`src/lib/calculations.test.ts`).
- **Production Build:** `npm run build` succeeds cleanly in 16.05s client + 3.21s SSR with 0 errors.
- **Offline Reliability:** All photographic media served directly from `/public/images/`.

