"use client";

import { useAppSelector } from "@/hooks/useRedux";
import { selectOrderSummary, selectAppliedCoupon } from "@/store/cartSlice";
import { formatCurrency } from "@/lib/utils";
import { COUPONS } from "@/types/cart";

export function OrderSummary() {
  const { subtotal, vat, discount, grandTotal } = useAppSelector(selectOrderSummary);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);

  return (
    <div className="bg-canvas rounded-md border border-hairline p-4">
      <h3 className="text-body-md font-semibold text-ink mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-body-md">
          <span className="text-body">Subtotal</span>
          <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-body-md">
            <span className="text-body flex items-center gap-2">
              Discount ({COUPONS[appliedCoupon].description})
              <span className="bg-warning-soft text-warning-deep text-caption px-1.5 py-0.5 rounded-full">
                Applied
              </span>
            </span>
            <span className="font-medium text-error">−{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-body-md">
          <span className="text-body">VAT (15%)</span>
          <span className="font-medium text-ink">{formatCurrency(vat)}</span>
        </div>

        <div className="border-t border-hairline pt-3">
          <div className="flex justify-between text-display-sm font-semibold text-ink">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}