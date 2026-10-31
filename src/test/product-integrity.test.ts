import { describe, expect, it } from "vitest";
import { getProduct, products } from "@/lib/products";
import { categories } from "@/lib/categories";
import omniS2Media from "@/lib/clean-product-full-media.json";

describe("Product data isolation", () => {
  it("retains the Omni S2's own complete reference gallery", () => {
    const product = getProduct("eufy-robot-vacuum-omni-s2");
    expect(product?.gallery).toEqual(omniS2Media.gallery);
    expect(product?.scenes).toEqual(omniS2Media.features);
    expect(product?.image).toBe(omniS2Media.gallery[0]);
  });
  it.each(products.filter(p => p.category === "smart-locks" && p.slug !== "eufy-familock-s3-max"))("does not assign FamiLock Max scenes or specifications to $name", product => {
    const category = categories.find(c => c.slug === "smart-locks");
    expect(product.scenes).not.toContain(category?.hero);
    expect(product.specs).not.toContainEqual(["Display", "4-Inch Display"]);
    expect(product.coupon).toBeUndefined();
  });
  it.each(products.filter(p => !["eufy-familock-s3-max", "eufy-robot-vacuum-omni-s2"].includes(p.slug)))("keeps $name's gallery and descriptions tied to its catalogue entry", product => {
    expect(product.gallery).toEqual([product.image]);
    expect(product.details).toEqual([product.description]);
    expect(product.specs).toContainEqual(["Product", product.name]);
  });
});