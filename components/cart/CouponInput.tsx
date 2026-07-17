"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { applyCoupon, removeCoupon, selectAppliedCoupon } from "@/store/cartSlice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { COUPONS } from "@/types/cart";
import { CheckCircle, XCircle } from "lucide-react";

export function CouponInput() {
  const dispatch = useAppDispatch();
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleApply = () => {
    const normalizedCode = code.trim().toUpperCase();
    
    if (!normalizedCode) {
      setError("Please enter a coupon code");
      return;
    }

    if (!COUPONS[normalizedCode as keyof typeof COUPONS]) {
      setError("Invalid coupon code");
      return;
    }

    if (appliedCoupon === normalizedCode) {
      setError("This coupon is already applied");
      return;
    }

    dispatch(applyCoupon(normalizedCode as "SAVE10" | "SAVE20" | "WELCOME"));
    setCode("");
    setError("");
    setSuccess(`Coupon ${normalizedCode} applied!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    setSuccess("");
  };

  if (appliedCoupon) {
    const coupon = COUPONS[appliedCoupon];
    return (
      <div className="bg-warning-soft border border-warning rounded-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-warning-deep" />
            <div>
              <p className="text-body-sm font-medium text-warning-deep">{appliedCoupon}</p>
              <p className="text-caption text-body">{coupon.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemove} className="text-error">
            <XCircle className="h-4 w-4" />
            <span className="ml-1 text-body-sm">Remove</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas rounded-md border border-hairline p-4">
      <h4 className="text-body-md font-semibold text-ink mb-3">Apply Coupon</h4>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter coupon code (SAVE10, SAVE20, WELCOME)"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
        <Button onClick={handleApply} className="whitespace-nowrap">
          Apply
        </Button>
      </div>
      {error && <p className="text-error text-body-sm mt-2">{error}</p>}
      {success && <p className="text-success text-body-sm mt-2">{success}</p>}
      <p className="text-caption text-body mt-3">
        Available: SAVE10 (10% off), SAVE20 (20% off), WELCOME ($5 off, min $20)
      </p>
    </div>
  );
}