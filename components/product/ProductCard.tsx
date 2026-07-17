"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addItem, updateQuantity, selectItems } from "@/store/cartSlice";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product | null;
  isLoading?: boolean;
}

export function ProductCard({ product, isLoading }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectItems);
  const isInCart = product ? cartItems.some((item) => item.product.id === product.id) : false;
  const cartQuantity = product ? cartItems.find((item) => item.product.id === product.id)?.quantity || 0 : 0;
  const isOutOfStock = product ? product.stock === 0 : false;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (isLoading || !product) {
    return (
      <Card className="flex flex-col h-full">
        <Skeleton className="aspect-square w-full mb-4" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </Card>
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      dispatch(addItem({ product, quantity: 1 }));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && cartQuantity < product.stock) {
      dispatch(addItem({ product, quantity: 1 }));
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQuantity > 1) {
      dispatch(updateQuantity({ productId: product.id, quantity: cartQuantity - 1 }));
    } else if (cartQuantity === 1) {
      // Remove item if quantity goes down to 0
      dispatch(updateQuantity({ productId: product.id, quantity: 0 }));
    }
  };

  const originalPrice = product.discountPercentage > 0
    ? Math.round((product.price / (1 - product.discountPercentage / 100)) * 100) / 100
    : null;

  const discountPercent = product.discountPercentage > 0 ? Math.round(product.discountPercentage) : 0;

  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-level-4 hover:-translate-y-0.5 group overflow-hidden">
      <Link href={`/products/${product.id}`} className="flex flex-col flex-1 group">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-canvas-soft w-full">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 599px) 100vw, (max-width: 959px) 50vw, (max-width: 1199px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-mute">
              No Image
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="bg-error text-on-primary text-body-sm font-medium px-4 py-2 rounded-md">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-error text-on-primary text-caption font-medium px-2 py-1 rounded-sm z-10">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Category Tag */}
          <p className="text-caption text-mute mb-1 uppercase tracking-wide">
            {product.category}
          </p>

          {/* Product Title */}
          <h3 className="text-body-md font-medium line-clamp-2 mb-3 text-ink group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-display-sm font-semibold text-ink">
              {formatCurrency(product.price)}
            </span>
            {originalPrice && (
              <span className="text-body-sm text-mute line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center gap-3 text-body-sm text-mute mb-4 mt-auto">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-warning fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {product.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
            </span>
          </div>
        </CardContent>
      </Link>

      {/* Footer - Quantity Controls or Add to Cart */}
      <CardFooter className="p-4 pt-0">
        {!mounted ? (
          <Button
            className="w-full"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        ) : isInCart ? (
          <div className="flex items-center justify-between border border-hairline rounded-md w-full bg-canvas overflow-hidden">
            <button
              onClick={handleDecrement}
              disabled={isOutOfStock}
              className="h-10 w-10 flex items-center justify-center text-ink hover:bg-canvas-soft transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="text-body-md font-semibold text-ink text-center flex-1">{cartQuantity}</span>
            <button
              onClick={handleIncrement}
              disabled={isOutOfStock || cartQuantity >= product.stock}
              className="h-10 w-10 flex items-center justify-center text-ink hover:bg-canvas-soft transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Increase quantity"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        ) : isOutOfStock ? (
          <Button
            className="w-full"
            disabled
            variant="secondary"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Out of Stock
            </span>
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}