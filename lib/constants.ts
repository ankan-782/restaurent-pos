export const API_BASE_URL = "https://dummyjson.com";

export const API_ENDPOINTS = {
	products: "/products",
	productsSearch: "/products/search",
	categories: "/products/categories",
	category: "/products/category",
	product: "/products",
	cartAdd: "/carts/add",
} as const;

export const CART_CONFIG = {
	VAT_RATE: 0.15,
	STORAGE_KEY: "restaurant-pos-cart",
} as const;

export const SEARCH_CONFIG = {
	DEBOUNCE_MS: 300,
	MIN_QUERY_LENGTH: 1,
} as const;

export const PAGINATION = {
	DEFAULT_LIMIT: 20,
} as const;
