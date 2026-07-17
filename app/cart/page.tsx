"use client";

import { CartPage } from "@/components/cart/CartPage";
import { Header } from "@/components/layout/Header";

export default function CartPageRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-8">
        <CartPage />
      </main>

      <footer className="border-t border-hairline mt-12">
        <div className="max-w-7xl mx-auto px-sm lg:px-lg py-8">
          <p className="text-body text-body-sm text-center">
            Restaurant POS - New Order Module Assessment
          </p>
        </div>
      </footer>
    </div>
  );
}