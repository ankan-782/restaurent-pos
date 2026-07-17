import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  appliedCoupon: CouponCode | null;
  discountAmount: number;
}

export type CouponCode = "SAVE10" | "SAVE20" | "WELCOME";

export interface CouponConfig {
  code: CouponCode;
  type: "percentage" | "fixed";
  discount: number;
  description: string;
  minOrder?: number;
}

export const COUPONS: Record<CouponCode, CouponConfig> = {
  SAVE10: {
    code: "SAVE10",
    type: "percentage",
    discount: 10,
    description: "10% off your order",
  },
  SAVE20: {
    code: "SAVE20",
    type: "percentage",
    discount: 20,
    description: "20% off your order",
  },
  WELCOME: {
    code: "WELCOME",
    type: "fixed",
    discount: 5,
    description: "$5 off your first order",
    minOrder: 20,
  },
};

export interface OrderSummary {
  subtotal: number;
  vat: number;
  discount: number;
  grandTotal: number;
}

export interface CheckoutPayload {
  userId: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}