import { describe, expect, it } from "vitest";
import cartReducer, {
  addItem,
  applyCoupon,
  selectOrderSummary,
} from "@/store/cartSlice";
import type { CartState } from "@/types/cart";
import type { Product } from "@/types/product";

const getMockProduct = (id: number, price: number): Product => ({
  id,
  title: `Mock Item ${id}`,
  price,
  stock: 10,
  discountPercentage: 0,
  rating: 4.5,
  category: "groceries",
  description: "A mock item",
  sku: `MOCK-${id}`,
  weight: 1,
  dimensions: { width: 1, height: 1, depth: 1 },
  warrantyInformation: "1 year",
  shippingInformation: "Ships in 1 week",
  availabilityStatus: "In Stock",
  reviews: [],
  returnPolicy: "No returns",
  minimumOrderQuantity: 1,
  meta: { createdAt: "", updatedAt: "", barcode: "", qrCode: "" },
  images: [],
  thumbnail: "",
  tags: [],
});

const getInitialState = (): CartState => ({
  items: [],
  appliedCoupon: null,
  discountAmount: 0,
  lastRemovedItem: null,
});

describe("Coupon discount calculations", () => {
  it("should calculate correct subtotal and VAT without coupons", () => {
    const state = cartReducer(getInitialState(), addItem({ product: getMockProduct(1, 10.0), quantity: 2 })); // Subtotal: 20
    const summary = selectOrderSummary({ cart: state });
    expect(summary.subtotal).toBe(20.0);
    expect(summary.discount).toBe(0.0);
    expect(summary.vat).toBe(3.0); // 15% VAT on 20
    expect(summary.grandTotal).toBe(23.0); // 20 + 3
  });

  it("should apply SAVE10 coupon (10% percentage discount)", () => {
    let state = cartReducer(getInitialState(), addItem({ product: getMockProduct(1, 100.0) })); // Subtotal: 100
    state = cartReducer(state, applyCoupon("SAVE10"));
    const summary = selectOrderSummary({ cart: state });
    expect(summary.subtotal).toBe(100.0);
    expect(summary.discount).toBe(10.0); // 10% of 100
    expect(summary.vat).toBe(13.5); // 15% VAT on (100 - 10) = 90
    expect(summary.grandTotal).toBe(103.5); // 90 + 13.5
  });

  it("should apply SAVE20 coupon (20% percentage discount)", () => {
    let state = cartReducer(getInitialState(), addItem({ product: getMockProduct(1, 50.0) })); // Subtotal: 50
    state = cartReducer(state, applyCoupon("SAVE20"));
    const summary = selectOrderSummary({ cart: state });
    expect(summary.subtotal).toBe(50.0);
    expect(summary.discount).toBe(10.0); // 20% of 50
    expect(summary.vat).toBe(6.0); // 15% VAT on (50 - 10) = 40
    expect(summary.grandTotal).toBe(46.0); // 40 + 6
  });

  it("should apply WELCOME coupon (fixed $5 discount on min order $20)", () => {
    let state = cartReducer(getInitialState(), addItem({ product: getMockProduct(1, 20.0) })); // Subtotal: 20
    state = cartReducer(state, applyCoupon("WELCOME"));
    const summary = selectOrderSummary({ cart: state });
    expect(summary.subtotal).toBe(20.0);
    expect(summary.discount).toBe(5.0); // Fixed 5 discount
    expect(summary.vat).toBe(2.25); // 15% VAT on (20 - 5) = 15
    expect(summary.grandTotal).toBe(17.25); // 15 + 2.25
  });
});
