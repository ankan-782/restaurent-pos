"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { selectWishlistItems, clearWishlist } from "@/store/wishlistSlice";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const wishlistItems = useAppSelector(selectWishlistItems);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-display-lg font-semibold text-ink tracking-tight mb-2">My Wishlist</h1>
            <p className="text-body text-body-md">Bookmark your favorite items to add them to orders later</p>
          </div>
          {mounted && wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="btn-secondary self-start sm:self-center h-10 px-4 text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Clear Wishlist
            </button>
          )}
        </div>

        {!mounted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCard key={i} product={null} isLoading />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-canvas-soft flex items-center justify-center mb-4 border border-hairline">
              <Heart className="h-8 w-8 text-mute" />
            </div>
            <h3 className="text-display-sm font-semibold text-ink mb-2">Your wishlist is empty</h3>
            <p className="text-body text-body-md max-w-[24rem] mb-6">
              Tap the heart icon on any product to save it to your wishlist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md font-medium bg-primary text-on-primary hover:bg-ink/90 h-11 px-6 text-button-md transition-colors cursor-pointer"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
