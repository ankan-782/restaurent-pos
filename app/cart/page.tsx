"use client";

import { CartPage } from "@/components/cart/CartPage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CartPageRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-8">
        <CartPage />
      </main>

      <Footer />
    </div>
  );
}