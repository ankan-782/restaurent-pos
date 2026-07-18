import { CART_CONFIG } from "@/lib/constants";
import type {
	CartItem,
	CartState,
	CouponCode,
	OrderSummary,
} from "@/types/cart";
import { COUPONS } from "@/types/cart";
import type { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
	items: [],
	appliedCoupon: null,
	discountAmount: 0,
	lastRemovedItem: null,
};

function calculateDiscount(
	subtotal: number,
	couponCode: CouponCode | null,
): number {
	if (!couponCode) return 0;
	const coupon = COUPONS[couponCode];
	if (!coupon) return 0;

	if (coupon.type === "percentage") {
		return Math.round(((subtotal * coupon.discount) / 100) * 100) / 100;
	}
	return coupon.discount;
}

function calculateOrderSummary(
	items: CartItem[],
	couponCode: CouponCode | null,
): OrderSummary {
	const subtotal = items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	);
	const discount = calculateDiscount(subtotal, couponCode);
	const vat = (subtotal - discount) * CART_CONFIG.VAT_RATE;
	const grandTotal = subtotal - discount + vat;
	return {
		subtotal: Math.round(subtotal * 100) / 100,
		vat: Math.round(vat * 100) / 100,
		discount: Math.round(discount * 100) / 100,
		grandTotal: Math.round(grandTotal * 100) / 100,
	};
}

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addItem: (
			state,
			action: PayloadAction<{ product: Product; quantity?: number }>,
		) => {
			const { product, quantity = 1 } = action.payload;
			const existingItem = state.items.find(
				(item) => item.product.id === product.id,
			);
			if (existingItem) {
				const newQuantity = existingItem.quantity + quantity;
				if (newQuantity <= 0) {
					state.lastRemovedItem = existingItem;
					state.items = state.items.filter(
						(item) => item.product.id !== product.id,
					);
				} else {
					existingItem.quantity = newQuantity;
				}
			} else if (quantity > 0) {
				state.items.push({ product, quantity });
			}
		},
		removeItem: (state, action: PayloadAction<number>) => {
			const existing = state.items.find(
				(item) => item.product.id === action.payload,
			);
			if (existing) {
				state.lastRemovedItem = existing;
			}
			state.items = state.items.filter(
				(item) => item.product.id !== action.payload,
			);
		},
		updateQuantity: (
			state,
			action: PayloadAction<{ productId: number; quantity: number }>,
		) => {
			const { productId, quantity } = action.payload;
			const item = state.items.find((i) => i.product.id === productId);
			if (item) {
				if (quantity <= 0) {
					state.lastRemovedItem = item;
					state.items = state.items.filter(
						(i) => i.product.id !== productId,
					);
				} else {
					item.quantity = quantity;
				}
			}
		},
		clearCart: (state) => {
			state.items = [];
			state.appliedCoupon = null;
			state.discountAmount = 0;
			state.lastRemovedItem = null;
		},
		applyCoupon: (state, action: PayloadAction<CouponCode>) => {
			state.appliedCoupon = action.payload;
		},
		removeCoupon: (state) => {
			state.appliedCoupon = null;
			state.discountAmount = 0;
		},
		setCartFromStorage: (state, action: PayloadAction<CartState>) => {
			state.items = action.payload.items;
			state.appliedCoupon = action.payload.appliedCoupon;
			state.discountAmount = action.payload.discountAmount;
			state.lastRemovedItem = action.payload.lastRemovedItem || null;
		},
		undoRemove: (state) => {
			if (state.lastRemovedItem) {
				const existing = state.items.find(
					(i) => i.product.id === state.lastRemovedItem!.product.id,
				);
				if (!existing) {
					state.items.push(state.lastRemovedItem);
				}
				state.lastRemovedItem = null;
			}
		},
		clearLastRemovedItem: (state) => {
			state.lastRemovedItem = null;
		},
	},
	selectors: {
		selectItems: (state) => state.items,
		selectItemCount: (state) =>
			state.items.reduce((sum, item) => sum + item.quantity, 0),
		selectSubtotal: (state) =>
			state.items.reduce(
				(sum, item) => sum + item.product.price * item.quantity,
				0,
			),
		selectAppliedCoupon: (state) => state.appliedCoupon,
		selectDiscountAmount: (state) => state.discountAmount,
		selectOrderSummary: (state) =>
			calculateOrderSummary(state.items, state.appliedCoupon),
		selectIsEmpty: (state) => state.items.length === 0,
		selectLastRemovedItem: (state) => state.lastRemovedItem,
	},
});

export const {
	addItem,
	removeItem,
	updateQuantity,
	clearCart,
	applyCoupon,
	removeCoupon,
	setCartFromStorage,
	undoRemove,
	clearLastRemovedItem,
} = cartSlice.actions;

export const {
	selectItems,
	selectItemCount,
	selectSubtotal,
	selectAppliedCoupon,
	selectDiscountAmount,
	selectOrderSummary,
	selectIsEmpty,
	selectLastRemovedItem,
} = cartSlice.selectors;

export default cartSlice.reducer;
