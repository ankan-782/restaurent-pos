"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

interface VirtualizedProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function VirtualizedProductGrid({
  products,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No products available",
}: VirtualizedProductGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [columns, setColumns] = useState(4);
  const rowHeight = 440; // Estimated height of product card row in pixels

  // Track window scroll and height
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      
      // Determine columns based on tailwind media query breakpoints
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else if (width < 1280) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    // Initial values
    handleScroll();
    handleResize();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [containerTop, setContainerTop] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerTop(rect.top + window.scrollY);
    }
  }, [products, columns, scrollY]);

  // Compute total rows
  const totalRows = useMemo(() => {
    return Math.ceil(products.length / columns);
  }, [products.length, columns]);

  // Calculate row rendering range
  const { startRow, endRow } = useMemo(() => {
    const relativeScroll = Math.max(0, scrollY - containerTop);
    const start = Math.max(0, Math.floor(relativeScroll / rowHeight) - 1);
    const end = Math.min(totalRows, Math.ceil((relativeScroll + viewportHeight) / rowHeight) + 1);
    return { startRow: start, endRow: end };
  }, [scrollY, containerTop, totalRows, viewportHeight]);

  // Extract visible products
  const visibleProducts = useMemo(() => {
    const startIndex = startRow * columns;
    const endIndex = endRow * columns;
    return products.slice(startIndex, endIndex);
  }, [products, startRow, endRow, columns]);

  // Spacers for virtual list height maintenance
  const paddingTop = startRow * rowHeight;
  const paddingBottom = Math.max(0, totalRows - endRow) * rowHeight;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCard key={i} product={null} isLoading />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-canvas-soft flex items-center justify-center mb-4 border border-hairline">
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

  // Create subgrids of columns to preserve proper responsive styling
  const gridStyle = {
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
  };

  return (
    <div ref={containerRef} style={gridStyle} className="transition-all duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
