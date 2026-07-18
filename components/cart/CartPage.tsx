"use client";

import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { formatCurrency } from "@/lib/utils";
import {
	applyCoupon,
	removeCoupon,
	selectAppliedCoupon,
	selectIsEmpty,
	selectItems,
	selectOrderSummary,
} from "@/store/cartSlice";
import { COUPONS } from "@/types/cart";
import { ShoppingCart, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItems } from "./CartItems";
import { CheckoutModal } from "./CheckoutModal";
import { OrderSummary } from "./OrderSummary";
import { PromoCode } from "./PromoCode";

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
				<div className="flex flex-col items-start gap-4 mb-4">
					<div>
						<h1 className="text-display-lg font-semibold text-ink tracking-tight mb-2">
							Shopping Cart
						</h1>
						<p className="text-body text-body-md">
							Review your order and proceed to checkout
						</p>
					</div>
					{!isEmpty && (
						<div className="flex items-center gap-4 text-sm text-body">
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
						<CartItems items={items} />

						<PromoCode
							couponInput={couponInput}
							setCouponInput={setCouponInput}
							couponError={couponError}
							couponSuccess={couponSuccess}
							appliedCoupon={appliedCoupon}
							handleApplyCoupon={handleApplyCoupon}
							handleRemoveCoupon={handleRemoveCoupon}
						/>
					</div>

					<div className="lg:col-span-1">
						<OrderSummary
							subtotal={subtotal}
							discount={discount}
							vat={vat}
							grandTotal={grandTotal}
							appliedCoupon={appliedCoupon}
							isEmpty={isEmpty}
							handleCheckout={handleCheckout}
						/>
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
