"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { X, Filter, Search } from "lucide-react";

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

  // Local state ONLY for pending (uncommitted) input
  const [pendingSearch, setPendingSearch] = useState(committedSearch);
  const [pendingCategory, setPendingCategory] = useState(committedCategory);

  // Track if we've hydrated from URL to avoid sync on initial render
  const hydratedRef = useRef(false);
  // Debounce timer for search text only
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local pending state when URL changes (e.g., back/forward, external link)
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    // Cancel any pending search debounce when URL changes externally
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    setPendingSearch(committedSearch);
    setPendingCategory(committedCategory);
  }, [committedSearch, committedCategory]);

  // Update URL - immediate for category, debounced for search
  const updateUrl = useCallback(
    (options: { immediate?: boolean } = {}) => {
      const { immediate = false } = options;

      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }

      const doUpdate = () => {
        const params = new URLSearchParams();
        if (pendingSearch) params.set("q", pendingSearch);
        if (pendingCategory) params.set("category", pendingCategory);
        const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        router.push(newUrl, { scroll: false });
      };

      if (immediate) {
        doUpdate();
      } else {
        // Only debounce search text changes
        searchDebounceRef.current = setTimeout(doUpdate, 300);
      }
    },
    [pendingSearch, pendingCategory, pathname, router]
  );

  // Trigger URL update when pending values change
  useEffect(() => {
    // Category changes are immediate; search is debounced
    updateUrl({ immediate: false });
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, [updateUrl]);

  const handleSearchChange = (value: string) => {
    setPendingSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    setPendingCategory(value);
    // Category changes are IMMEDIATE - trigger URL update right away
    updateUrl({ immediate: true });
  };

  const handleSearchClear = () => {
    setPendingSearch("");
    // Clear debounce and update immediately
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    updateUrl({ immediate: true });
  };

  const clearFilters = () => {
    setPendingSearch("");
    setPendingCategory("");
    // Clear debounce and update immediately
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = pendingSearch || pendingCategory;

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search products..."
          value={pendingSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
          aria-label="Search products"
        />
        {pendingSearch && (
          <button
            type="button"
            onClick={handleSearchClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-ink transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="relative w-full sm:w-64">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" aria-hidden="true" />
        <Select value={pendingCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="pl-10">
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

      {hasActiveFilters && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={clearFilters}
          className="whitespace-nowrap"
          aria-label="Clear all filters"
        >
          <X className="mr-1 h-3 w-3" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}