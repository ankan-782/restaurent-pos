export interface ApiErrorResponse {
  message: string;
  status: number;
}

export interface CartAddRequest {
  userId: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface CartAddResponse {
  id: number;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
  }>;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}