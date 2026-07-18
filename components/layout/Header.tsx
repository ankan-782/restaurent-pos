"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useRedux";
import { selectItemCount } from "@/store/cartSlice";
import { selectWishlistItems } from "@/store/wishlistSlice";
import { useTheme } from "@/providers/ThemeProvider";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ShortcutsModal } from "@/components/ui/ShortcutsModal";
import { ShoppingCart, Heart, Sun, Moon, Keyboard } from "lucide-react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const itemCount = useAppSelector(selectItemCount);
  const wishlistItems = useAppSelector(selectWishlistItems);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Configure application-wide keyboard shortcuts
  useKeyboardShortcuts({
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[type="search"]') || document.querySelector('input[placeholder*="Search"]');
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
        searchInput.select();
      }
    },
    onToggleShortcutsHelp: () => {
      setShowShortcuts((prev) => !prev);
    },
    onCloseModals: () => {
      setShowShortcuts(false);
    },
  });

  return (
    <>
      <header className="nav-bar border-b border-hairline sticky top-0 z-50 bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80 transition-colors">
        <div className="max-w-7xl mx-auto px-sm lg:px-lg h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-display-sm font-semibold text-ink transition-colors">POS</span>
          </Link>
          
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link 
              href="/" 
              className="px-3 py-2 rounded-full text-sm font-medium text-body hover:text-ink hover:bg-canvas-soft-2 transition-all cursor-pointer"
            >
              Products
            </Link>
            
            {/* Wishlist Link */}
            <Link 
              href="/wishlist" 
              className="relative px-3 py-2 rounded-full text-sm font-medium text-body hover:text-ink hover:bg-canvas-soft-2 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
              {mounted && wishlistItems.length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center animate-scale-in">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link 
              href="/cart" 
              className="relative pl-3 pr-6.5 py-2 rounded-full text-sm font-medium text-body hover:text-ink hover:bg-canvas-soft-2 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 right-1 w-5 h-5 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center justify-center transition-colors">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-hairline mx-1" />

            {/* Keyboard Shortcuts Dialog Trigger */}
            <button
              onClick={() => setShowShortcuts(true)}
              className="p-2 rounded-full text-body hover:text-ink hover:bg-canvas-soft-2 transition-all cursor-pointer"
              title="Keyboard Shortcuts (?)"
              aria-label="Show keyboard shortcuts help dialog"
            >
              <Keyboard className="h-4 w-4" />
            </button>

            {/* Dark Theme Toggle Switch */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-body hover:text-ink hover:bg-canvas-soft-2 transition-all cursor-pointer"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                aria-label="Toggle dark mode theme"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
}