"use client";

import { useAppDispatch } from "@/hooks/useRedux";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: {
    product: {
      id: number;
      title: string;
      price: number;
      stock: number;
      thumbnail?: string;
      category: string;
    };
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { product, quantity } = item;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      dispatch({ type: "cart/updateQuantity", payload: { productId: product.id, quantity: quantity + 1 } });
    }
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      dispatch({ type: "cart/removeItem", payload: product.id });
    } else {
      dispatch({ type: "cart/updateQuantity", payload: { productId: product.id, quantity: quantity - 1 } });
    }
  };

  const lineTotal = product.price * quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-canvas rounded-md border border-hairline">
      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-sm bg-canvas-soft">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mute text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-body-md font-medium text-ink truncate">{product.title}</h4>
        <p className="text-body-sm text-body mt-1">{product.category}</p>
        <p className="text-body-sm font-medium text-ink mt-1">
          {formatCurrency(product.price)} each
        </p>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-body-sm text-warning mt-1">Only {product.stock} left in stock</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center border border-hairline rounded-sm">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="h-8 w-8 p-0"
          >
            −
          </Button>
          <span className="px-3 text-body-md font-medium text-ink w-10 text-center">
            {quantity}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleIncrement}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
            className="h-8 w-8 p-0"
          >
            +
          </Button>
        </div>

        <div className="w-24 text-right text-body-md font-medium text-ink">
          {formatCurrency(lineTotal)}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "cart/removeItem", payload: product.id })}
          aria-label={`Remove ${product.title}`}
          className="text-error hover:text-error-deep"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}