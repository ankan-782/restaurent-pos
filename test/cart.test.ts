import { describe, expect, it } from "vitest";
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  undoRemove,
} from "@/store/cartSlice";
import type { CartState } from "@/types/cart";
import type { Product } from "@/types/product";

const mockProduct: Product = {
  id: 1,
  title: "Mock Item",
  price: 10.0,
  stock: 5,
  discountPercentage: 0,
  rating: 4.5,
  category: "groceries",
  description: "A mock item",
  sku: "MOCK-1",
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
};

const getInitialState = (): CartState => ({
  items: [],
  appliedCoupon: null,
  discountAmount: 0,
  lastRemovedItem: null,
});

describe("Cart Redux Slice", () => {
  it("should return the initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(getInitialState());
  });

  it("should add a new product to the cart", () => {
    const state = cartReducer(getInitialState(), addItem({ product: mockProduct }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it("should increment quantity of an existing product in the cart", () => {
    let state = cartReducer(getInitialState(), addItem({ product: mockProduct }));
    state = cartReducer(state, addItem({ product: mockProduct }));
    expect(state.items[0].quantity).toBe(2);
  });

  it("should remove product from the cart and capture lastRemovedItem", () => {
    let state = cartReducer(getInitialState(), addItem({ product: mockProduct }));
    state = cartReducer(state, removeItem(1));
    expect(state.items).toHaveLength(0);
    expect(state.lastRemovedItem).not.toBeNull();
    expect(state.lastRemovedItem?.product.id).toBe(1);
    expect(state.lastRemovedItem?.quantity).toBe(1);
  });

  it("should update quantity of product in the cart", () => {
    let state = cartReducer(getInitialState(), addItem({ product: mockProduct }));
    state = cartReducer(state, updateQuantity({ productId: 1, quantity: 3 }));
    expect(state.items[0].quantity).toBe(3);
  });

  it("should capture lastRemovedItem when updating quantity to 0", () => {
    let state = cartReducer(getInitialState(), addItem({ product: mockProduct }));
    state = cartReducer(state, updateQuantity({ productId: 1, quantity: 0 }));
    expect(state.items).toHaveLength(0);
    expect(state.lastRemovedItem).not.toBeNull();
    expect(state.lastRemovedItem?.product.id).toBe(1);
  });

  it("should undo removal of product", () => {
    let state = cartReducer(getInitialState(), addItem({ product: mockProduct }));
    state = cartReducer(state, removeItem(1));
    state = cartReducer(state, undoRemove());
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(1);
    expect(state.items[0].quantity).toBe(1);
    expect(state.lastRemovedItem).toBeNull();
  });

  it("should clear cart and reset values", () => {
    let state = cartReducer(getInitialState(), addItem({ product: mockProduct }));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
    expect(state.appliedCoupon).toBeNull();
    expect(state.discountAmount).toBe(0);
  });
});
