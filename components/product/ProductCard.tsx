"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addItem, selectItems } from "@/store/cartSlice";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product | null;
  isLoading?: boolean;
}

export function ProductCard({ product, isLoading }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectItems);
  const isInCart = product ? cartItems.some((item) => item.product.id === product.id) : false;
  const cartQuantity = product ? cartItems.find((item) => item.product.id === product.id)?.quantity || 0 : 0;
  const isOutOfStock = product ? product.stock === 0 : false;

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
    e.stopPropagation();
    if (!isOutOfStock) {
      dispatch(addItem({ product, quantity: 1 }));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock && cartQuantity < product.stock) {
      dispatch(addItem({ product, quantity: 1 }));
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addItem({ product, quantity: -1 }));
  };

  const originalPrice = product.discountPercentage > 0
    ? Math.round((product.price / (1 - product.discountPercentage / 100)) * 100) / 100
    : null;

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-level-4">
      <div className="relative aspect-square overflow-hidden bg-canvas-soft">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 599px) 100vw, (max-width: 959px) 50vw, (max-width: 1199px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-mute">
            No Image
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-body-md px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
        {product.discountPercentage > 0 && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2 text-caption px-2 py-1"
          >
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col p-md">
        <p className="text-caption text-mute mb-1 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-body-md font-medium line-clamp-2 mb-2 text-ink">
          {product.title}
        </h3>
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
        <div className="flex items-center gap-2 text-body-sm text-mute mb-4">
          <span className="flex items-center gap-1">
            ★ {product.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            Stock: {product.stock}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-md pt-0 flex items-center gap-2">
        {isInCart ? (
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDecrement}
              disabled={isOutOfStock}
              className="h-8 w-8 p-0"
              aria-label="Decrease quantity"
            >
              −
            </Button>
            <span className="text-body-md font-medium w-8 text-center">{cartQuantity}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleIncrement}
              disabled={isOutOfStock || cartQuantity >= product.stock}
              className="h-8 w-8 p-0"
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
        ) : (
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : `Add ${product.title} to cart`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}