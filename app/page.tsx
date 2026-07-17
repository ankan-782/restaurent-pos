"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSearch } from "@/components/product/ProductSearch";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useProducts";
import { useProductSearch } from "@/hooks/useProducts";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Header } from "@/components/layout/Header";

interface Category {
  slug: string;
  name: string;
  url: string;
}

function CategoriesFilter() {
  const { data: categoriesData } = useCategories();
  const categories: Category[] = categoriesData || [];

  return (
    <ProductSearch categories={categories} />
  );
}

function CategoriesFilterSkeleton() {
  return (
    <div className="animate-pulse flex flex-col sm:flex-row gap-3 w-full">
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="w-full sm:w-64 h-10" />
    </div>
  );
}

function ProductGridSkeleton() {
  const skeletons = Array.from({ length: 8 }, (_, i) => (
    <div key={i} className="card-marketing flex flex-col">
      <Skeleton className="aspect-square w-full mb-4 rounded-md" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex items-center justify-between mt-auto">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  ));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {skeletons}
    </div>
  );
}

function ProductListContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const { data: productsData, isLoading: productsLoading, isError } = useProducts({ limit: 20 });
  const { data: searchData, isLoading: searchLoading } = useProductSearch(searchQuery, { limit: 20 });
  const { data: categoryData, isLoading: categoryLoading } = useProductsByCategory(category, { limit: 20 });

  const isLoading = productsLoading || searchLoading || categoryLoading;
  const products = category
    ? categoryData?.products ?? []
    : searchQuery
    ? searchData?.products ?? []
    : productsData?.products ?? [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-error-soft flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-display-sm font-semibold text-ink mb-2">Failed to load products</h3>
        <p className="text-body text-body-md max-w-[24rem] text-center">
          Something went wrong while fetching products. Please try again later.
        </p>
      </div>
    );
  }

  const hasSearched = searchQuery || category;
  const emptyMessage = hasSearched
    ? `No products found for "${searchQuery || category}"`
    : "No products available";

  return <ProductGrid products={products} isLoading={isLoading} isEmpty={products.length === 0} emptyMessage={emptyMessage} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-sm lg:px-lg py-8">
        <div className="mb-8">
          <h1 className="text-display-lg font-semibold text-ink tracking-tight mb-2">New Order</h1>
          <p className="text-body text-body-md">Select products to add to the order</p>
        </div>

        <Suspense fallback={<CategoriesFilterSkeleton />}>
          <CategoriesFilter />
        </Suspense>

        <div className="mt-6">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductListContent />
          </Suspense>
        </div>
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