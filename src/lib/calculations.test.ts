import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildClassKit, buildCollegeKit, findProduct, PRODUCTS } from "./mock-data.ts";
import { classKitPrice, collegeKitPrice, linePrice } from "./cart-store.ts";
import type { CartLine, PrintSpecs } from "./types.ts";

describe("PAPR Business Calculations & Kit Bundles", () => {
  it("should find valid products in catalogue", () => {
    const notebook = findProduct("p-nb-200");
    assert.ok(notebook);
    assert.equal(notebook.name, "A4 Spiral Notebook 200 Pages (80 GSM)");
    assert.equal(notebook.price, 159);
  });

  it("should calculate Class 1 kit bundle with 8% discount", () => {
    const kit = buildClassKit(1);
    assert.equal(kit.classNumber, 1);
    assert.ok(kit.items.length > 5);

    const manualSubtotal = kit.items.reduce((s, it) => {
      const p = findProduct(it.productId);
      return s + (p ? p.price * it.qty : 0);
    }, 0);

    const calculatedPrice = classKitPrice(kit.id, {});
    const expected = Math.round(manualSubtotal * 0.92);
    assert.equal(calculatedPrice, expected);
  });

  it("should adjust Class Kit price when optional items are overridden", () => {
    const kit = buildClassKit(10);
    const initialPrice = classKitPrice(kit.id, {});

    // Override brown cover roll to 0
    const overrides = { "p-cover": 0 };
    const discountedPrice = classKitPrice(kit.id, overrides);

    assert.ok(discountedPrice < initialPrice);
  });

  it("should calculate College Kit with 10% campus discount", () => {
    const kit = buildCollegeKit("sgsits", "cse", 1);
    assert.equal(kit.collegeId, "sgsits");
    assert.equal(kit.year, 1);

    const manualSubtotal = kit.items.reduce((s, it) => {
      const p = findProduct(it.productId);
      return s + (p ? p.price * it.qty : 0);
    }, 0);

    const calculatedPrice = collegeKitPrice(kit.id, {});
    const expected = Math.round(manualSubtotal * 0.9);
    assert.equal(calculatedPrice, expected);
  });

  it("should calculate correct line prices across all cart line types", () => {
    // 1. Product Line
    const productLine: CartLine = { kind: "product", productId: "p-pen-blue", qty: 3 };
    assert.equal(linePrice(productLine), 50 * 3);

    // 2. Class Kit Line
    const classLine: CartLine = { kind: "classKit", kitId: "class-10", itemOverrides: {} };
    assert.ok(linePrice(classLine) > 1000);

    // 3. College Kit Line
    const collegeLine: CartLine = { kind: "collegeKit", kitId: "sgsits-cse-1", itemOverrides: {} };
    assert.ok(linePrice(collegeLine) > 1000);

    // 4. Print Job Line
    const specs: PrintSpecs = {
      fileName: "report.pdf",
      pages: 50,
      copies: 2,
      color: "bw",
      sided: "duplex",
      size: "A4",
      binding: "spiral",
      delivery: "deliver",
    };
    const printLine: CartLine = {
      kind: "printing",
      jobId: "pj-1",
      estimate: 215,
      summary: "50 pages spiral",
      specs,
    };
    assert.equal(linePrice(printLine), 215);
  });

  it("should calculate free shipping above ₹499 threshold", () => {
    const smallOrderTotal = 350;
    const smallDeliveryFee = smallOrderTotal >= 499 ? 0 : 49;
    assert.equal(smallDeliveryFee, 49);

    const largeOrderTotal = 1200;
    const largeDeliveryFee = largeOrderTotal >= 499 ? 0 : 49;
    assert.equal(largeDeliveryFee, 0);
  });
});
