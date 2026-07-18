"use client";

import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(
  callback: () => void,
  enabled: boolean = true
) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback updated in ref synchronously during render to avoid stale closure race conditions
  callbackRef.current = callback;

  // Set up and clean up observer when node or enabled state changes
  useEffect(() => {
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          callbackRef.current();
        }
      },
      {
        root: null, // viewport
        rootMargin: "300px", // pre-fetch 300px before the element enters the screen
        threshold: 0.01, // trigger immediately when entering threshold
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, enabled]);

  return setNode;
}
