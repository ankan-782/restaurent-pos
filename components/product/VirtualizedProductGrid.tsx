"use client";

import type { Product } from "@/types/product";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";

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

	const [rowHeight, setRowHeight] = useState(480);

	// Measure the actual height of the first product card rendered in the grid
	useEffect(() => {
		if (containerRef.current) {
			const firstCard = containerRef.current.querySelector(".grid > *");
			if (firstCard) {
				const height = firstCard.getBoundingClientRect().height;
				if (height > 0) {
					// Add grid gap spacing (gap-4 is 16px) to card height
					setRowHeight(height + 16);
				}
			}
		}
	}, [products.length > 0, columns]);

	// Track window scroll and height
	useEffect(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setScrollY(window.scrollY);
					ticking = false;
				});
				ticking = true;
			}
		};

		const handleResize = () => {
			setViewportHeight(window.innerHeight);

			// Determine columns based on tailwind media query breakpoints
			const width = window.innerWidth;
			let cols = 4;
			if (width < 640) {
				cols = 1;
			} else if (width < 1024) {
				cols = 2;
			} else if (width < 1280) {
				cols = 3;
			}
			setColumns(cols);
		};

		// Initial values wrapped in requestAnimationFrame to avoid synchronous state updates in mount effect
		window.requestAnimationFrame(() => {
			setScrollY(window.scrollY);
			handleResize();
		});

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const [containerTop, setContainerTop] = useState(0);

	// Measure container absolute Y offset relative to the document
	// Decoupled from scrollY to completely eliminate synchronous scroll layout thrashing
	useEffect(() => {
		const getAbsoluteOffsetTop = (element: HTMLElement | null): number => {
			let top = 0;
			let curr = element;
			while (curr) {
				top += curr.offsetTop;
				curr = curr.offsetParent as HTMLElement | null;
			}
			return top;
		};

		if (containerRef.current) {
			setContainerTop(getAbsoluteOffsetTop(containerRef.current));
		}
	}, [products.length > 0, columns]);

	// Compute total rows
	const totalRows = useMemo(() => {
		return Math.ceil(products.length / columns);
	}, [products.length, columns]);

	// Calculate row rendering range with overscan (buffer) rows
	const { startRow, endRow } = useMemo(() => {
		const OVERSCAN_ROWS = 3; // Render 3 buffer rows above/below viewport to prevent blank spots
		const relativeScroll = Math.max(0, scrollY - containerTop);
		const start = Math.max(
			0,
			Math.floor(relativeScroll / rowHeight) - OVERSCAN_ROWS,
		);
		const end = Math.min(
			totalRows,
			Math.ceil((relativeScroll + viewportHeight) / rowHeight) +
				OVERSCAN_ROWS,
		);
		return { startRow: start, endRow: end };
	}, [scrollY, containerTop, totalRows, viewportHeight, rowHeight]);

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
					<svg
						className="w-8 h-8 text-mute"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
				</div>
				<h3 className="text-display-sm font-semibold text-ink mb-2">
					No products found
				</h3>
				<p className="text-body text-body-md max-w-[24rem] text-center">
					{emptyMessage}
				</p>
			</div>
		);
	}

	// Create subgrids of columns to preserve proper responsive styling
	// overflowAnchor: "none" stops browser scroll-anchoring adjustments from causing scrollbar jumps
	const gridStyle: React.CSSProperties = {
		paddingTop: `${paddingTop}px`,
		paddingBottom: `${paddingBottom}px`,
		overflowAnchor: "none",
	};

	return (
		<div ref={containerRef} style={gridStyle}>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{visibleProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
