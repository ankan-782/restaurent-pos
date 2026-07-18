import type { CartState } from "@/types/cart";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { PersistConfig } from "redux-persist";
import {
	createTransform,
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

// Transform to blacklist lastRemovedItem from persistence so it doesn't trigger the toast on reload
const cartPersistTransform = createTransform<CartState, CartState>(
	(inboundState) => {
		return {
			...inboundState,
			lastRemovedItem: null,
		};
	},
	(outboundState) => outboundState,
	{ whitelist: ["cart"] },
);

const rootReducer = combineReducers({
	cart: cartReducer,
	wishlist: wishlistReducer,
});

type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerState> = {
	key: "restaurant-pos",
	storage,
	whitelist: ["cart", "wishlist"],
	transforms: [cartPersistTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
