import type { Product } from "@/lib/products";

export function usesCleanProductLayout(product: Pick<Product, "category">) {
  return product.category === "robot-vacuums" || product.category === "baby-monitors";
}