import type { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
	items: Product[];
}

const initialState: WishlistState = {
	items: [],
};

const wishlistSlice = createSlice({
	name: "wishlist",
	initialState,
	reducers: {
		toggleWishlist: (state, action: PayloadAction<Product>) => {
			const product = action.payload;
			const index = state.items.findIndex(
				(item) => item.id === product.id,
			);
			if (index >= 0) {
				state.items.splice(index, 1);
			} else {
				state.items.push(product);
			}
		},
		clearWishlist: (state) => {
			state.items = [];
		},
	},
	selectors: {
		selectWishlistItems: (state) => state.items,
		selectIsWishlisted: (state, id: number) =>
			state.items.some((item) => item.id === id),
	},
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export const { selectWishlistItems, selectIsWishlisted } =
	wishlistSlice.selectors;
export default wishlistSlice.reducer;
