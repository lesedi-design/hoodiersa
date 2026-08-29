import { describe, expect, it } from "vitest";
import { getPrice, isValidSize, PRODUCTS, SIZE_ORDER } from "../shared/catalog";

describe("HoodieRSA catalog pricing", () => {
  it("uses the requested base prices", () => {
    expect(getPrice("checkered-character", "XS")).toBe(250);
    expect(getPrice("oogie-boogie", "XS")).toBe(320);
    expect(getPrice("corpse-bride", "XS")).toBe(380);
    expect(getPrice("jack-and-sally", "XS")).toBe(450);
  });

  it("adds exactly R14 per size step and spans R70", () => {
    const prices = SIZE_ORDER.map((size) => getPrice("checkered-character", size));
    expect(prices).toEqual([250, 264, 278, 292, 306, 320]);
    expect(prices.at(-1)! - prices[0]).toBe(70);
  });

  it("keeps four original collection entries available", () => {
    expect(PRODUCTS).toHaveLength(4);
    expect(new Set(PRODUCTS.map((product) => product.slug)).size).toBe(4);
  });

  it("accepts one-character and multi-character size codes", () => {
    expect(isValidSize("S")).toBe(true);
    expect(isValidSize("M")).toBe(true);
    expect(isValidSize("XL")).toBe(true);
    expect(isValidSize(" ")).toBe(false);
    expect(isValidSize("Small")).toBe(false);
  });
});
