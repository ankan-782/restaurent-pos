"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
	clearCart,
	selectItems,
	selectOrderSummary,
	setCartFromStorage,
} from "@/store/cartSlice";
import type { CouponCode } from "@/types/cart";
import { CheckCircle, Loader2, Shield, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CheckoutModalProps {
	isOpen: boolean;
	onClose: () => void;
	items?: Array<{
		product: {
			id: number;
			title: string;
			price: number;
			stock: number;
			thumbnail?: string;
			category: string;
		};
		quantity: number;
	}>;
	orderSummary?: {
		subtotal: number;
		vat: number;
		discount: number;
		grandTotal: number;
	};
	appliedCoupon?: string | null;
}

export function CheckoutModal({
	isOpen,
	onClose,
	items: propItems,
	orderSummary: propOrderSummary,
	appliedCoupon,
}: CheckoutModalProps) {
	const dispatch = useAppDispatch();
	const storeItems = useAppSelector(selectItems);
	const storeOrderSummary = useAppSelector(selectOrderSummary);

	const items = propItems ?? storeItems;
	const { subtotal, vat, discount, grandTotal } =
		propOrderSummary ?? storeOrderSummary;

	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleConfirm = async () => {
		setIsSubmitting(true);
		setError("");

		// Snapshot current cart so we can roll back if the API call fails
		const savedCartState = {
			items: [...storeItems],
			appliedCoupon: (appliedCoupon as CouponCode | null) || null,
			discountAmount: discount || 0,
			lastRemovedItem: null,
		};

		// Optimistic: show success and clear cart immediately, don't wait for the API
		setSuccess(true);
		dispatch(clearCart());

		try {
			await api.addToCart(
				1,
				savedCartState.items.map((item) => ({
					id: item.product.id,
					quantity: item.quantity,
				})),
			);

			toast.success(
				"Your order has been placed successfully.",
				"Order Placed",
			);
			// No auto-close — user closes manually via the success view's button
		} catch (err: unknown) {
			console.error("Optimistic checkout failed, rolling back:", err);

			// Roll back the optimistic UI: back to confirm step, cart restored
			setSuccess(false);
			dispatch(setCartFromStorage(savedCartState));

			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to place order. Please try again.";
			setError(errorMessage);
			toast.error(errorMessage, "Order Failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setSuccess(false);
		setError("");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			<div className="bg-canvas rounded-xl shadow-level-5 w-full max-w-[36rem] max-h-[90vh] overflow-hidden animate-scale-in">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
					<h2 className="text-display-sm font-semibold text-ink">
						{success ? "Order Confirmed" : "Confirm Order"}
					</h2>
					{!success && (
						<button
							onClick={handleClose}
							className="p-2 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
							aria-label="Close"
						>
							<X className="h-5 w-5" />
						</button>
					)}
				</div>

				{/* Content */}
				<div className="px-6 pt-4 pb-8 overflow-y-auto max-h-[65vh]">
					{success && (
						<div className="flex flex-col items-center text-center px-4">
							<div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center">
								<CheckCircle className="h-8 w-8 text-success" />
							</div>
							<h3 className="text-display-sm font-semibold text-ink mb-2">
								Order Placed Successfully!
							</h3>
							<p className="text-body text-body-md mb-6">
								Your order has been confirmed and is being
								processed.
							</p>
							<Button
								asChild
								className="w-full"
								size="default"
								onClick={handleClose}
							>
								<Link href="/">Continue Shopping</Link>
							</Button>
						</div>
					)}

					{!success && (
						<div className="space-y-5">
							{/* Trust Badges */}
							<div className="flex items-center justify-center gap-6 text-caption text-body mb-2">
								<span className="flex items-center gap-1">
									<Shield className="h-3.5 w-3.5" />
									Secure Payment
								</span>
								<span className="flex items-center gap-1">
									<Truck className="h-3.5 w-3.5" />
									Fast Delivery
								</span>
							</div>

							{/* Order Items */}
							<div className="border border-hairline rounded-lg overflow-hidden bg-canvas-soft">
								{items.map((item) => (
									<div
										key={item.product.id}
										className="flex items-center gap-3 p-3 border-b border-hairline last:border-0"
									>
										<Link
											href={`/products/${item.product.id}`}
											className="w-12 h-12 shrink-0 overflow-hidden rounded-lg bg-canvas relative border border-hairline hover:opacity-80 transition-opacity"
										>
											{item.product.thumbnail ? (
												<Image
													src={item.product.thumbnail}
													alt={item.product.title}
													fill
													className="object-cover"
													sizes="48px"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-mute text-xs">
													No Image
												</div>
											)}
										</Link>
										<div className="flex-1 min-w-0">
											<Link
												href={`/products/${item.product.id}`}
												className="group block"
											>
												<p className="text-body-sm font-medium text-ink group-hover:text-primary transition-colors truncate">
													{item.product.title}
												</p>
											</Link>
											<p className="text-caption text-body">
												{formatCurrency(
													item.product.price,
												)}{" "}
												× {item.quantity}
											</p>
										</div>
										<p className="text-body-sm font-medium text-ink w-20 text-right whitespace-nowrap">
											{formatCurrency(
												item.product.price *
													item.quantity,
											)}
										</p>
									</div>
								))}
							</div>

							{/* Order Summary */}
							<div className="space-y-3 bg-canvas rounded-lg border border-hairline p-4">
								<h3 className="text-body-md font-semibold text-ink">
									Order Summary
								</h3>

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

								<div className="border-t border-hairline pt-3 flex justify-between">
									<span className="text-display-sm font-semibold text-ink">
										Grand Total
									</span>
									<span className="text-display-sm font-semibold text-ink">
										{formatCurrency(grandTotal)}
									</span>
								</div>
							</div>

							{error && (
								<div className="bg-error-soft border border-error rounded-lg p-3 text-error text-body-sm animate-fade-in flex items-center gap-2">
									<svg
										className="h-4 w-4 shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
									{error}
								</div>
							)}

							{/* Actions */}
							<div className="flex gap-3 pt-2">
								<Button
									variant="secondary"
									className="flex-1 h-11"
									onClick={handleClose}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button
									className="flex-1 h-11"
									onClick={handleConfirm}
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin mr-2" />
											Placing Order...
										</>
									) : (
										`Place Order — ${formatCurrency(grandTotal)}`
									)}
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
