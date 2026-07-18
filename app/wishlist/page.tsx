"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { clearWishlist, selectWishlistItems } from "@/store/wishlistSlice";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
	const [mounted, setMounted] = useState(false);
	const wishlistItems = useAppSelector(selectWishlistItems);
	const dispatch = useAppDispatch();

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	const handleClearWishlist = () => {
		dispatch(clearWishlist());
	};

	return (
		<main className="min-h-dvh flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div>
					<h1 className="text-display-lg font-semibold text-ink tracking-tight mb-2">
						My Wishlist
					</h1>
					<p className="text-body text-body-md">
						Bookmark your favorite items to add them to orders later
					</p>
				</div>
				{mounted && wishlistItems.length > 0 && (
					<button
						onClick={handleClearWishlist}
						className="btn-secondary self-start sm:self-center h-10 px-4 text-sm inline-flex items-center gap-2 cursor-pointer"
					>
						<Trash2 className="h-4 w-4" />
						Clear Wishlist
					</button>
				)}
			</div>

			{!mounted ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<ProductCard key={i} product={null} isLoading />
					))}
				</div>
			) : wishlistItems.length === 0 ? (
				<div className="min-h-[50vh] flex items-center justify-center px-sm">
					<div className="w-full max-w-[28rem] bg-canvas border border-hairline rounded-xl p-8 flex flex-col items-center text-center shadow-level-3">
						<div className="w-20 h-20 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-6 animate-fade-in">
							<Heart className="w-10 h-10 text-mute" />
						</div>
						<h2 className="text-display-sm font-semibold text-ink mb-3 tracking-tight">
							Your wishlist is empty
						</h2>
						<p className="text-body-sm text-mute mb-8 max-w-[20rem] leading-relaxed">
							Tap the heart icon on any product to save it to your
							wishlist.
						</p>
						<Button asChild className="w-full" size="lg">
							<Link href="/">Discover Products</Link>
						</Button>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{wishlistItems.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</main>
	);
}
