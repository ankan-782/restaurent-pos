"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { clearCart, selectItems, selectOrderSummary } from "@/store/cartSlice";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { X, CheckCircle, Loader2, Shield, Truck } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: Array<{ product: { id: number; title: string; price: number; stock: number; thumbnail?: string; category: string }; quantity: number }>;
  orderSummary?: { subtotal: number; vat: number; discount: number; grandTotal: number };
  appliedCoupon?: string | null;
}

export function CheckoutModal({ isOpen, onClose, items: propItems, orderSummary: propOrderSummary, appliedCoupon }: CheckoutModalProps) {
  const dispatch = useAppDispatch();
  const storeItems = useAppSelector(selectItems);
  const storeOrderSummary = useAppSelector(selectOrderSummary);

  const items = propItems ?? storeItems;
  const { subtotal, vat, discount, grandTotal } = propOrderSummary ?? storeOrderSummary;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.addToCart(1, items.map(item => ({
        id: item.product.id,
        quantity: item.quantity
      })));

      console.log("Order placed:", response);
      setSuccess(true);
      dispatch(clearCart());
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              onClick={onClose} 
              className="p-2 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[65vh]">
          {success && (
            <div className="flex flex-col items-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-display-sm font-semibold text-ink mb-2">Order Placed Successfully!</h3>
              <p className="text-body text-body-md">Your order has been confirmed and is being processed.</p>
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
                  <div key={item.product.id} className="flex items-center gap-3 p-3 border-b border-hairline last:border-0">
                    <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg bg-canvas relative">
                      {item.product.thumbnail ? (
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-mute text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-ink truncate">{item.product.title}</p>
                      <p className="text-caption text-body">{formatCurrency(item.product.price)} × {item.quantity}</p>
                    </div>
                    <p className="text-body-sm font-medium text-ink w-20 text-right whitespace-nowrap">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-3 bg-canvas rounded-lg border border-hairline p-4">
                <h3 className="text-body-md font-semibold text-ink">Order Summary</h3>
                
                <div className="flex justify-between text-body-md">
                  <span className="text-body">Subtotal</span>
                  <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-error text-body-md">
                    <span>Discount ({appliedCoupon})</span>
                    <span className="font-medium">−{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-body-md">
                  <span className="text-body">VAT (15%)</span>
                  <span className="font-medium text-ink">{formatCurrency(vat)}</span>
                </div>
                
                <div className="border-t border-hairline pt-3 flex justify-between">
                  <span className="text-display-sm font-semibold text-ink">Grand Total</span>
                  <span className="text-display-sm font-semibold text-ink">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-error-soft border border-error rounded-lg p-3 text-error text-body-sm animate-fade-in flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1 h-11"
                  onClick={onClose}
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