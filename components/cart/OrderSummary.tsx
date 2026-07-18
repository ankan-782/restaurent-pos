"use client";

import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Shield } from "lucide-react";

interface OrderSummaryProps {
	subtotal: number;
	discount: number;
	vat: number;
	grandTotal: number;
	appliedCoupon: string | null;
	isEmpty: boolean;
	handleCheckout: () => void;
}

export function OrderSummary({
	subtotal,
	discount,
	vat,
	grandTotal,
	appliedCoupon,
	isEmpty,
	handleCheckout,
}: OrderSummaryProps) {
	return (
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
	);
}
