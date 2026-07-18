"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { COUPONS } from "@/types/cart";
import { Sparkles, Tag, X } from "lucide-react";

interface PromoCodeProps {
	couponInput: string;
	setCouponInput: (value: string) => void;
	couponError: string;
	couponSuccess: string;
	appliedCoupon: string | null;
	handleApplyCoupon: () => void;
	handleRemoveCoupon: () => void;
}

export function PromoCode({
	couponInput,
	setCouponInput,
	couponError,
	couponSuccess,
	appliedCoupon,
	handleApplyCoupon,
	handleRemoveCoupon,
}: PromoCodeProps) {
	return (
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
					onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
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
							<Badge variant="secondary" className="text-sm">
								{appliedCoupon}
							</Badge>
							<div>
								<p className="text-body-sm font-medium text-ink">
									Coupon Applied
								</p>
								<p className="text-caption text-body">
									{COUPONS[appliedCoupon as keyof typeof COUPONS].description}
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
	);
}
