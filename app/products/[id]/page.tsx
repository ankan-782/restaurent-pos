"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProduct } from "@/hooks/useProducts";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addItem, updateQuantity, selectItems } from "@/store/cartSlice";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Truck, 
  CheckCircle,
  Package
} from "lucide-react";

export default function ProductDetailsPage() {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectItems);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const productId = parseInt(params.id as string, 10);
  const { data: product, isLoading, isError } = useProduct(productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isInCart = product ? cartItems.some((item) => item.product.id === product.id) : false;
  const cartQuantity = product ? cartItems.find((item) => item.product.id === product.id)?.quantity || 0 : 0;
  const isOutOfStock = product ? product.stock === 0 : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-8">
          <div className="mb-6">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-error-soft flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-display-sm font-semibold text-ink mb-2">Product not found</h2>
          <p className="text-body text-body-md mb-6 max-w-[24rem]">
            We couldn&apos;t retrieve the details for this product. It may have been removed or doesn&apos;t exist.
          </p>
          <Link href="/" className="btn-primary">
            Back to Products
          </Link>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      dispatch(addItem({ product, quantity: 1 }));
    }
  };

  const handleIncrement = () => {
    if (!isOutOfStock && cartQuantity < product.stock) {
      dispatch(addItem({ product, quantity: 1 }));
    }
  };

  const handleDecrement = () => {
    if (cartQuantity > 1) {
      dispatch(updateQuantity({ productId: product.id, quantity: cartQuantity - 1 }));
    } else if (cartQuantity === 1) {
      dispatch(updateQuantity({ productId: product.id, quantity: 0 }));
    }
  };

  const originalPrice = product.discountPercentage > 0
    ? Math.round((product.price / (1 - product.discountPercentage / 100)) * 100) / 100
    : null;

  const discountPercent = product.discountPercentage > 0 ? Math.round(product.discountPercentage) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-8">
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="btn-secondary inline-flex items-center gap-2 h-10 px-4 text-sm cursor-pointer mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-canvas rounded-xl border border-hairline shadow-level-2">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[activeImageIndex]}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-mute">
                  No Image
                </div>
              )}
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-error text-white text-caption font-semibold px-2 py-1 rounded-sm">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnails list */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-2 -m-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg border bg-canvas flex-shrink-0 cursor-pointer transition-all ${
                      index === activeImageIndex
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-hairline hover:border-hairline-strong"
                    }`}
                  >
                    <div className="absolute inset-0 rounded-[inherit] overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        fill
                        className="object-cover p-1"
                        sizes="80px"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details info */}
          <div className="flex flex-col">
            {/* Category tag */}
            <span className="text-caption-mono text-mute uppercase tracking-wider mb-2 block">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-display-sm font-bold text-ink tracking-tight mb-2">
              {product.title}
            </h1>

            {/* Brand / SKU info */}
            {product.brand && (
              <p className="text-body-sm text-mute mb-4">
                Brand: <span className="text-body font-medium">{product.brand}</span>
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1 mb-6 text-body-sm text-mute">
              <div className="flex items-center text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-hairline-strong"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-ink ml-1">{product.rating.toFixed(1)}</span>
              <span>({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-display-lg font-bold text-ink">
                {formatCurrency(product.price)}
              </span>
              {originalPrice && (
                <span className="text-body-lg text-mute line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-hairline pt-6 mb-6">
              <h3 className="text-body-sm-strong text-ink uppercase tracking-wide mb-2">Description</h3>
              <p className="text-body text-body-md leading-relaxed">{product.description}</p>
            </div>

            {/* Stock status & features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-body-sm">
                <Package className="h-4 w-4 text-mute" />
                <span>
                  Availability:{" "}
                  <span className={`font-semibold ${
                    product.stock > 0
                      ? product.stock <= 5
                        ? "text-warning"
                        : "text-success"
                      : "text-error"
                  }`}>
                    {product.stock > 0
                      ? product.stock <= 5
                        ? `Low Stock: Only ${product.stock} left`
                        : "In Stock"
                      : "Out of Stock"}
                  </span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-body-sm">
                <ShieldCheck className="h-4 w-4 text-mute" />
                <span>Warranty: <span className="font-medium text-ink">{product.warrantyInformation}</span></span>
              </div>

              <div className="flex items-center gap-2 text-body-sm">
                <Truck className="h-4 w-4 text-mute" />
                <span>Shipping: <span className="font-medium text-ink">{product.shippingInformation}</span></span>
              </div>
            </div>

            {/* Actions / Cart controls */}
            <div className="border-t border-hairline pt-6 mt-auto">
              {!mounted ? (
                <Button className="w-full h-12 gap-2" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart — {formatCurrency(product.price)}
                </Button>
              ) : isInCart ? (
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="flex items-center justify-between border border-hairline rounded-md bg-canvas overflow-hidden w-full sm:w-40">
                    <button
                      onClick={handleDecrement}
                      disabled={isOutOfStock}
                      className="h-11 w-11 flex items-center justify-center text-ink hover:bg-canvas-soft transition-colors disabled:opacity-50 cursor-pointer"
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
                      className="h-11 w-11 flex items-center justify-center text-ink hover:bg-canvas-soft transition-colors disabled:opacity-50 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <Link href="/cart" className="btn-primary flex-1 text-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    View in Cart ({cartQuantity})
                  </Link>
                </div>
              ) : isOutOfStock ? (
                <Button className="w-full h-12" disabled variant="secondary">
                  Out of Stock
                </Button>
              ) : (
                <Button className="w-full h-12 gap-2" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart — {formatCurrency(product.price)}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews segment */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 border-t border-hairline pt-8">
            <h2 className="text-display-sm font-bold text-ink tracking-tight mb-6">Customer Reviews</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {product.reviews.map((review, index) => (
                <div key={index} className="bg-canvas border border-hairline rounded-xl p-6 shadow-level-1">
                  <div className="flex items-center gap-1 text-warning mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating ? "fill-current" : "text-hairline-strong"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-body-md text-ink italic mb-4">&ldquo;{review.comment}&rdquo;</p>
                  <div className="border-t border-hairline pt-3 mt-auto flex justify-between items-center text-caption text-mute">
                    <span className="font-medium text-body">{review.reviewerName}</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
