"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useRedux";
import { selectItemCount } from "@/store/cartSlice";
import { ShoppingCart } from "lucide-react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useAppSelector(selectItemCount);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="nav-bar border-b border-hairline sticky top-0 z-50 bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80">
      <div className="max-w-7xl mx-auto px-sm lg:px-lg h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-display-sm font-semibold text-ink">POS</span>
        </div>
        
        <nav className="flex items-center gap-1">
          <Link href="/" className="nav-link px-3 py-2 rounded-full text-body-sm font-medium transition-colors hover:bg-canvas-soft">Products</Link>
          <Link href="/cart" className="nav-link relative px-3 py-2 rounded-full text-body-sm font-medium transition-colors hover:bg-canvas-soft">
            <ShoppingCart className="mr-1.5 h-4 w-4 inline" />
            Cart
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}