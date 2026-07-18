"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { formatCurrency } from "@/lib/utils";
import {
	applyCoupon,
	removeCoupon,
	removeItem,
	selectAppliedCoupon,
	selectIsEmpty,
	selectItems,
	selectOrderSummary,
	updateQuantity,
} from "@/store/cartSlice";
import { COUPONS } from "@/types/cart";
import { Shield, ShoppingCart, Sparkles, Tag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

const COUPON_CODES = Object.keys(COUPONS) as Array<keyof typeof COUPONS>;

export function CartPage() {
	const [mounted, setMounted] = useState(false);
	const dispatch = useAppDispatch();
	const isEmpty = useAppSelector(selectIsEmpty);
	const items = useAppSelector(selectItems);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	const orderSummary = useAppSelector(selectOrderSummary);
	const appliedCoupon = useAppSelector(selectAppliedCoupon);
	const [couponInput, setCouponInput] = useState("");
	const [couponError, setCouponError] = useState("");
	const [showCheckout, setShowCheckout] = useState(false);
	const [couponSuccess, setCouponSuccess] = useState("");

	const handleApplyCoupon = () => {
		const code = couponInput.trim().toUpperCase();

		if (!code) {
			setCouponError("Please enter a coupon code");
			return;
		}

		if (!COUPON_CODES.includes(code as keyof typeof COUPONS)) {
			setCouponError("Invalid coupon code");
			return;
		}

		if (appliedCoupon === code) {
			setCouponError("This coupon is already applied");
			return;
		}

		if (appliedCoupon) {
			setCouponError(
				"Only one coupon can be applied at a time. Remove the current coupon first.",
			);
			return;
		}

		if (code === "WELCOME" && orderSummary.subtotal < 20) {
			setCouponError("WELCOME coupon requires a minimum order of $20");
			return;
		}

		dispatch(applyCoupon(code as keyof typeof COUPONS));
		setCouponInput("");
		setCouponError("");
		setCouponSuccess(`Coupon ${code} applied!`);
		setTimeout(() => setCouponSuccess(""), 3000);
	};

	const handleRemoveCoupon = () => {
		dispatch(removeCoupon());
	};

	const handleCheckout = () => {
		setShowCheckout(true);
	};

	if (!mounted) {
		return (
			<div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-pulse">
				<div className="w-24 h-24 rounded-full bg-canvas-soft flex items-center justify-center mb-6">
					<ShoppingCart className="w-12 h-12 text-mute" />
				</div>
				<h2 className="text-display-sm font-semibold text-ink mb-2">
					Loading your cart...
				</h2>
			</div>
		);
	}

	const { subtotal, vat, discount, grandTotal } = orderSummary;

	return (
		<div className="w-full">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-display-lg font-semibold text-ink tracking-tight mb-2">
							Shopping Cart
						</h1>
						<p className="text-body text-body-md">
							Review your order and proceed to checkout
						</p>
					</div>
					{!isEmpty && (
						<div className="hidden md:flex items-center gap-4 text-sm text-body">
							<span className="flex items-center gap-1">
								<Tag className="h-4 w-4" />
								{items.reduce(
									(sum, item) => sum + item.quantity,
									0,
								)}{" "}
								items
							</span>
							<span className="flex items-center gap-1 text-success">
								<Sparkles className="h-4 w-4" />
								{discount > 0
									? `You save ${formatCurrency(discount)}`
									: "Add a coupon to save"}
							</span>
						</div>
					)}
				</div>
			</div>

			{isEmpty ? (
				<div className="min-h-[50vh] flex items-center justify-center px-sm">
					<div className="w-full max-w-112 bg-canvas border border-hairline rounded-xl p-8 flex flex-col items-center text-center shadow-level-3">
						<div className="w-20 h-20 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-6 animate-fade-in">
							<ShoppingCart className="w-10 h-10 text-mute" />
						</div>
						<h2 className="text-display-sm font-semibold text-ink mb-3 tracking-tight">
							Your cart is empty
						</h2>
						<p className="text-body-sm text-mute mb-8 max-w-80 leading-relaxed">
							Your shopping cart is currently empty. Explore our
							products and add items to get started with your
							order.
						</p>
						<Button asChild className="w-full" size="lg">
							<Link href="/">Continue Shopping</Link>
						</Button>
					</div>
				</div>
			) : (
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						{items.map((item) => (
							<CartItem key={item.product.id} item={item} />
						))}

						{/* Coupon Section */}
						<div className="bg-canvas rounded-xl border border-hairline p-6">
							<div className="flex items-center gap-3 mb-4">
								<Tag className="h-5 w-5 text-primary" />
								<h3 className="text-body-lg font-semibold text-ink">
									Promo Code
								</h3>
							</div>

							{couponSuccess && (
								<div className="bg-success-soft border border-success rounded-lg p-3 text-success text-body-sm mb-4 flex items-center gap-2">
									<Sparkles className="h-4 w-4 shrink-0" />
									{couponSuccess}
								</div>
							)}

							<div className="flex gap-3">
								<Input
									type="text"
									value={couponInput}
									onChange={(e) =>
										setCouponInput(
											e.target.value.toUpperCase(),
										)
									}
									placeholder="Enter code (SAVE10, SAVE20, WELCOME)"
									className="flex-1 text-center"
									aria-label="Coupon code"
								/>
								<Button
									onClick={handleApplyCoupon}
									disabled={!!appliedCoupon}
									className="whitespace-nowrap"
								>
									Apply
								</Button>
							</div>

							{couponError && (
								<p className="text-error text-body-sm mt-3 flex items-center gap-1">
									<X className="h-4 w-4" />
									{couponError}
								</p>
							)}

							{appliedCoupon && (
								<div className="mt-4 p-4 bg-canvas-soft rounded-lg border border-hairline">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<Badge
												variant="secondary"
												className="text-sm"
											>
												{appliedCoupon}
											</Badge>
											<div>
												<p className="text-body-sm font-medium text-ink">
													Coupon Applied
												</p>
												<p className="text-caption text-body">
													{
														COUPONS[
															appliedCoupon as keyof typeof COUPONS
														].description
													}
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleRemoveCoupon}
											className="text-error hover:bg-error-soft"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="lg:col-span-1">
						{/* Order Summary Card */}
						<div className="sticky top-24 bg-canvas rounded-xl border border-hairline p-6 space-y-5">
							<div className="flex items-center gap-3 mb-4">
								<Shield className="h-5 w-5 text-primary" />
								<h3 className="text-body-lg font-semibold text-ink">
									Order Summary
								</h3>
							</div>

							<div className="space-y-3 border-t border-hairline pt-4">
								<div className="flex justify-between text-body-md">
									<span className="text-body">Subtotal</span>
									<span className="font-medium text-ink">
										{formatCurrency(subtotal)}
									</span>
								</div>

								{discount > 0 && (
									<div className="flex justify-between text-error text-body-md">
										<span>Discount ({appliedCoupon})</span>
										<span className="font-medium">
											−{formatCurrency(discount)}
										</span>
									</div>
								)}

								<div className="flex justify-between text-body-md">
									<span className="text-body">VAT (15%)</span>
									<span className="font-medium text-ink">
										{formatCurrency(vat)}
									</span>
								</div>

								<div className="border-t border-hairline pt-4 flex justify-between">
									<span className="text-display-sm font-semibold text-ink">
										Grand Total
									</span>
									<span className="text-display-sm font-semibold text-ink">
										{formatCurrency(grandTotal)}
									</span>
								</div>
							</div>

							<Button
								className="w-full"
								size="lg"
								onClick={handleCheckout}
								disabled={isEmpty}
							>
								Proceed to Checkout
							</Button>

							<p className="text-caption text-body text-center">
								Secure checkout via dummyjson API (mock)
							</p>
						</div>
					</div>
				</div>
			)}

			<CheckoutModal
				isOpen={showCheckout}
				onClose={() => setShowCheckout(false)}
				items={items}
				orderSummary={orderSummary}
				appliedCoupon={appliedCoupon}
			/>
		</div>
	);
}

function CartItem({
	item,
}: {
	item: {
		product: {
			id: number;
			title: string;
			price: number;
			stock: number;
			thumbnail?: string;
			category: string;
		};
		quantity: number;
	};
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
						/>
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
