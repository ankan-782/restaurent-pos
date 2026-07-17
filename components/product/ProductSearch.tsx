"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { X, Filter, Search, Tag, RotateCcw } from "lucide-react";

interface Category {
  slug: string;
  name: string;
  url: string;
}

interface ProductSearchProps {
  categories: Category[];
}

export function ProductSearch({ categories }: ProductSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL params are the single source of truth for committed values
  const committedSearch = searchParams.get("q") || "";
  const committedCategory = searchParams.get("category") || "";

  // Sync state from URL during render (derived state adjustment to avoid useEffect loop)
  const [prevCommittedSearch, setPrevCommittedSearch] = useState(committedSearch);
  const [pendingSearch, setPendingSearch] = useState(committedSearch);

  if (committedSearch !== prevCommittedSearch) {
    setPrevCommittedSearch(committedSearch);
    setPendingSearch(committedSearch);
  }

  const [prevCommittedCategory, setPrevCommittedCategory] = useState(committedCategory);
  const [pendingCategory, setPendingCategory] = useState(committedCategory);

  if (committedCategory !== prevCommittedCategory) {
    setPrevCommittedCategory(committedCategory);
    setPendingCategory(committedCategory);
  }

  // Debounced URL updates for search input typing
  useEffect(() => {
    if (pendingSearch === committedSearch) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (pendingSearch) params.set("q", pendingSearch);
      if (committedCategory) params.set("category", committedCategory);
      
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(handler);
  }, [pendingSearch, committedSearch, committedCategory, pathname, router]);

  const handleSearchChange = (value: string) => {
    setPendingSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    setPendingCategory(value);
    
    const params = new URLSearchParams();
    if (pendingSearch) params.set("q", pendingSearch);
    if (value) params.set("category", value);
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  const handleSearchClear = () => {
    setPendingSearch("");
    const params = new URLSearchParams();
    if (committedCategory) params.set("category", committedCategory);
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  const clearFilters = () => {
    setPendingSearch("");
    setPendingCategory("");
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = pendingSearch || pendingCategory;

  return (
    <div className="bg-canvas rounded-lg border border-hairline p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mute" aria-hidden="true" />
            <Input
              id="search-input"
              type="search"
              placeholder="Search products by title, category..."
              value={pendingSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-12 h-11 text-body-sm w-full"
              aria-label="Search products"
            />
            {pendingSearch && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-mute hover:text-ink transition-colors p-1 rounded-sm hover:bg-canvas-soft cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-64">
          <label htmlFor="category-filter" className="sr-only">
            Filter by category
          </label>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mute" aria-hidden="true" />
            <Select value={pendingCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter" className="flex items-center justify-between pl-11 pr-4 h-11 cursor-pointer">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-hairline animate-fade-in">
          <span className="text-body-sm text-mute mr-1">Active Filters:</span>
          {pendingSearch && (
            <span className="inline-flex items-center gap-1.5 bg-canvas-soft border border-hairline rounded-full px-3 py-1 text-sm">
              <Tag className="h-3.5 w-3.5 text-mute" />
              <span className="font-medium text-body max-w-[150px] truncate">{pendingSearch}</span>
              <button
                onClick={handleSearchClear}
                className="p-0.5 rounded-full hover:bg-canvas hover:text-error transition-colors cursor-pointer"
                aria-label="Remove search filter"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          {pendingCategory && (
            <span className="inline-flex items-center gap-1.5 bg-canvas-soft border border-hairline rounded-full px-3 py-1 text-sm">
              <Filter className="h-3.5 w-3.5 text-mute" />
              <span className="font-medium text-body">
                {categories.find(c => c.slug === pendingCategory)?.name || pendingCategory}
              </span>
              <button
                onClick={() => handleCategoryChange("")}
                className="p-0.5 rounded-full hover:bg-canvas hover:text-error transition-colors cursor-pointer"
                aria-label="Remove category filter"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto whitespace-nowrap gap-1.5 cursor-pointer text-body-sm hover:text-error h-8"
            aria-label="Clear all filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear All</span>
          </Button>
        </div>
      )}
    </div>
  );
}