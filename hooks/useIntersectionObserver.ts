"use client";

import { useEffect, useRef, useCallback } from "react";

export function useIntersectionObserver(
  callback: () => void,
  enabled: boolean = true
) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && enabled) {
        callback();
      }
    },
    [callback, enabled]
  );

  useEffect(() => {
    const currentElement = observerRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: "100px", // pre-fetch slightly before it enters screen
      threshold: 0.1,
    });

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [handleObserver, enabled]);

  return observerRef;
}
