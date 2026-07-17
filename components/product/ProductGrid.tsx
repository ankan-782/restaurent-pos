"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No products available",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCard key={i} product={null as unknown as Product} isLoading />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-canvas-soft flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-mute" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-display-sm font-semibold text-ink mb-2">No products found</h3>
        <p className="text-body text-body-md max-w-[24rem] text-center">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}