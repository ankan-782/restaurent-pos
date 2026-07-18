"use client";

import { useAppDispatch } from "@/hooks/useRedux";
import { formatCurrency } from "@/lib/utils";
import { removeItem, updateQuantity } from "@/store/cartSlice";
import Image from "next/image";
import Link from "next/link";

interface CartItemType {
	product: {
		id: number;
		title: string;
		price: number;
		stock: number;
		thumbnail?: string;
		category: string;
	};
	quantity: number;
}

interface CartItemsProps {
	items: CartItemType[];
}

export function CartItems({ items }: CartItemsProps) {
	return (
		<div className="space-y-4">
			{items.map((item) => (
				<CartItem key={item.product.id} item={item} />
			))}
		</div>
	);
}

function CartItem({
	item,
}: {
	item: CartItemType;
}) {
	const dispatch = useAppDispatch();
	const { product, quantity } = item;

	const handleIncrement = () => {
		if (quantity < product.stock) {
			dispatch(
				updateQuantity({
					productId: product.id,
					quantity: quantity + 1,
				}),
			);
		}
	};

	const handleDecrement = () => {
		if (quantity <= 1) {
			dispatch(removeItem(product.id));
		} else {
			dispatch(
				updateQuantity({
					productId: product.id,
					quantity: quantity - 1,
				}),
			);
		}
	};

	const lineTotal = product.price * quantity;

	return (
		<div className="bg-canvas rounded-xl border border-hairline p-4">
			<div className="flex gap-4">
				{/* Product Image - Clickable Link */}
				<Link
					href={`/products/${product.id}`}
					className="relative w-20 h-20 shrink-0 border border-hairline rounded-lg overflow-hidden block hover:opacity-90 transition-opacity bg-canvas-soft"
				>
					{product.thumbnail ? (
						<Image
							src={product.thumbnail}
							alt={product.title}
							fill
							className="object-cover"
							sizes="80px"
						>
						</Image>
					) : (
						<div className="w-full h-full flex items-center justify-center text-body text-xs">
							No Image
						</div>
					)}
				</Link>

				{/* Product Info */}
				<div className="flex-1 min-w-0">
					<div className="flex justify-between items-start gap-4 mb-1">
						<Link
							href={`/products/${product.id}`}
							className="block"
						>
							<h4 className="text-body-md font-medium text-ink line-clamp-1">
								{product.title}
							</h4>
						</Link>
						<span className="block text-body-md font-semibold text-ink whitespace-nowrap shrink-0">
							{formatCurrency(lineTotal)}
						</span>
					</div>
					<p className="text-caption text-body mb-2">
						{product.category}
					</p>
					<div className="flex items-center gap-3 text-body-sm">
						<span className="font-medium text-ink">
							{formatCurrency(product.price)} each
						</span>
					</div>
					{product.stock <= 5 && product.stock > 0 && (
						<p className="text-body-sm text-warning mt-1 flex items-center gap-1">
							<span className="h-1.5 w-1.5 rounded-full bg-warning" />
							Only {product.stock} left in stock
						</p>
					)}
				</div>
			</div>

			{/* Quantity Controls - Below Product Info */}
			<div className="w-full mt-4 pt-4 border-t border-hairline">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex items-center border border-hairline rounded-lg bg-canvas overflow-hidden">
							<button
								onClick={handleDecrement}
								disabled={quantity <= 1}
								aria-label="Decrease quantity"
								className="h-9 w-9 flex items-center justify-center bg-canvas border-r border-hairline text-ink hover:bg-canvas-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<svg
									className="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M20 12H4"
									/>
								</svg>
							</button>
							<span className="w-10 text-center text-body-md font-medium text-ink">
								{quantity}
							</span>
							<button
								onClick={handleIncrement}
								disabled={quantity >= product.stock}
								aria-label="Increase quantity"
								className="h-9 w-9 flex items-center justify-center bg-canvas border-l border-hairline text-ink hover:bg-canvas-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<svg
									className="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</button>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-body-sm text-body">
							Line Total:{" "}
							<span className="font-semibold text-ink">
								{formatCurrency(lineTotal)}
							</span>
						</span>
						<button
							onClick={() => dispatch(removeItem(product.id))}
							className="text-error hover:bg-error-soft hover:text-error-deep p-2 rounded-md transition-colors"
							aria-label={`Remove ${product.title}`}
						>
							<svg
								className="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
