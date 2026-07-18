"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { selectLastRemovedItem, undoRemove, clearLastRemovedItem } from "@/store/cartSlice";
import { Undo2, X } from "lucide-react";

export function UndoToast() {
  const dispatch = useAppDispatch();
  const lastRemovedItem = useAppSelector(selectLastRemovedItem);
  const [visible, setVisible] = useState(false);

  const handleDismiss = useCallback(() => {
    dispatch(clearLastRemovedItem());
    setVisible(false);
  }, [dispatch]);

  useEffect(() => {
    if (lastRemovedItem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [lastRemovedItem, handleDismiss]);

  const handleUndo = () => {
    dispatch(undoRemove());
    setVisible(false);
  };

  if (!lastRemovedItem || !visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center justify-between gap-4 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-level-4 animate-slide-up border border-hairline-strong max-w-sm w-[90vw] sm:w-auto">
      <div className="flex-1 min-w-0">
        <p className="text-body-sm-strong font-medium truncate">
          Removed {lastRemovedItem.product.title}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleUndo}
          className="flex items-center gap-1.5 bg-on-primary text-primary px-2.5 py-1 text-button-sm rounded-md font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>

        <button
          onClick={handleDismiss}
          className="text-on-primary/70 hover:text-on-primary p-1 rounded-md hover:bg-on-primary/10 transition-colors cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
