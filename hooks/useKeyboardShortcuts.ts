"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ShortcutHandlers {
  onFocusSearch?: () => void;
  onToggleShortcutsHelp?: () => void;
  onCloseModals?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts if the user is typing in an input or textarea
      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true");

      if (isTyping && e.key !== "Escape") {
        return;
      }

      const key = e.key.toLowerCase();

      switch (e.key) {
        case "Escape":
          if (handlers.onCloseModals) {
            handlers.onCloseModals();
          }
          break;
        case "/":
          // Prevent standard browser / behavior if input search is focused
          e.preventDefault();
          if (handlers.onFocusSearch) {
            handlers.onFocusSearch();
          }
          break;
        default:
          break;
      }

      // Handle character shortcuts
      if (key === "s") {
        e.preventDefault();
        if (handlers.onFocusSearch) {
          handlers.onFocusSearch();
        }
      } else if (key === "c") {
        router.push("/cart");
      } else if (key === "h") {
        router.push("/");
      } else if (key === "w") {
        router.push("/wishlist");
      } else if (e.key === "?" || e.key === "Shift" && key === "?") {
        e.preventDefault();
        if (handlers.onToggleShortcutsHelp) {
          handlers.onToggleShortcutsHelp();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlers, router]);
}
